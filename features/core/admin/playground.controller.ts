"use server";
import { saveChatMessage } from "features/core/chat/chat.service";
import { searchKnowledge } from "features/core/knowledge/knowledge.service";
import { getModelById } from "features/core/model/model.service";

type Message = { role: "user" | "assistant" | "system"; content: string };
type Provider = "openai" | "google";

export const testModel = async (
  modelId: string,
  message: string,
  history: Message[] = [],
  sessionId?: string,
) => {
  try {
    const model = await getModelById(modelId);
    if (!model || !model.apiKeyEnc) {
      return { success: false, message: "Model or API key not found" };
    }

    if (sessionId) {
      await saveChatMessage({
        id: crypto.randomUUID(),
        sessionId,
        role: "user",
        content: message,
        createdAt: new Date(),
      });
    }

    const rawProvider = model.provider.toLowerCase();
    let provider: Provider;

    if (rawProvider === "gpt" || rawProvider === "openai") {
      provider = "openai";
    } else if (rawProvider === "gemini" || rawProvider === "google") {
      provider = "google";
    } else {
      return {
        success: false,
        message: `Unsupported provider: ${model.provider}`,
      };
    }

    const kbIds = (model as any).knowledgeBases?.map((kb: any) => kb.id) || [];
    let context = "";

    if (kbIds.length > 0) {
      const searches = kbIds.map((kbId: string) =>
        searchKnowledge(kbId, message, {
          name: provider,
          apiKey: model.apiKeyEnc!,
        }),
      );
      const results = await Promise.all(searches);
      context = results.filter(Boolean).join("\n\n");
    }

    const basePrompt = model.systemPrompt || "You are a helpful AI assistant.";
    const systemPrompt = context
      ? `${basePrompt}\n\nContext information:\n${context}`
      : basePrompt;

    const reply =
      provider === "openai"
        ? await callOpenAI(model, message, history, systemPrompt)
        : await callGoogle(model, message, history, systemPrompt);

    if (sessionId) {
      await saveChatMessage({
        id: crypto.randomUUID(),
        sessionId,
        role: "assistant",
        content: reply,
        createdAt: new Date(),
      });
    }

    return { success: true, data: reply };
  } catch (error: any) {
    console.error("testModel error:", error);
    return {
      success: false,
      message: error.message || "Failed to get a reply",
    };
  }
};

async function callOpenAI(
  model: any,
  message: string,
  history: Message[],
  systemPrompt: string,
): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${model.apiKeyEnc}`,
    },
    body: JSON.stringify({
      model: model.model,
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: message },
      ],
      temperature: model.temperature ?? 0.7,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "OpenAI API error");

  return data.choices[0].message.content;
}

async function callGoogle(
  model: any,
  message: string,
  history: Message[],
  systemPrompt: string,
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model.model}:generateContent?key=${model.apiKeyEnc}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [
        ...history.map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        })),
        { role: "user", parts: [{ text: message }] },
      ],
      generationConfig: { temperature: model.temperature ?? 0.7 },
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Google API error");

  return data.candidates[0].content.parts[0].text;
}
