"use server";

import { searchKnowledge } from "features/core/knowledge/services/knowledge.service";
import { getModelById } from "features/core/model/services/model.service";

export const testModel = async (
  modelId: string,
  message: string,
  history: { role: "user" | "assistant"; content: string }[] = [],
) => {
  try {
    const model = await getModelById(modelId);
    if (!model || !model.apiKeyEnc) {
      return { success: false, message: "Model or API key not found" };
    }

    const kbIds = (model as any).knowledgeBases?.map((kb: any) => kb.id) || [];
    let context = "";

    const rawProvider = model.provider.toLowerCase();
    let provider: "openai" | "google";

    if (rawProvider === "gpt" || rawProvider === "openai") {
      provider = "openai";
    } else if (rawProvider === "gemini" || rawProvider === "google") {
      provider = "google";
    } else {
      return {
        success: false,
        message: `Unsupported AI provider: ${model.provider}`,
      };
    }

    if (kbIds.length > 0) {
      const searchPromises = kbIds.map((kbId: string) =>
        searchKnowledge(kbId, message, {
          name: provider,
          apiKey: model.apiKeyEnc!,
        }),
      );
      const results = await Promise.all(searchPromises);
      context = results.filter(Boolean).join("\n\n");
    }

    const systemPrompt =
      model.systemPrompt || "You are a helpful AI assistant.";
    const fullSystemPrompt = context
      ? `${systemPrompt}\n\nContext information:\n${context}`
      : systemPrompt;

    if (provider === "openai") {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${model.apiKeyEnc}`,
        },
        body: JSON.stringify({
          model: model.model,
          messages: [
            { role: "system", content: fullSystemPrompt },
            ...history,
            { role: "user", content: message },
          ],
          temperature: model.temperature ?? 0.7,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "OpenAI API error");
      }
      return { success: true, data: data.choices[0].message.content };
    } else {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model.model}:generateContent?key=${model.apiKeyEnc}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: fullSystemPrompt }],
            },
            contents: [
              ...history.map((h) => ({
                role: h.role === "user" ? "user" : "model",
                parts: [{ text: h.content }],
              })),
              {
                role: "user",
                parts: [{ text: message }],
              },
            ],
            generationConfig: {
              temperature: model.temperature ?? 0.7,
            },
          }),
        },
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Google API error");
      }
      return { success: true, data: data.candidates[0].content.parts[0].text };
    }
  } catch (error: any) {
    console.error("Test model error:", error);
    return { success: false, message: error.message || "Failed to test model" };
  }
};
