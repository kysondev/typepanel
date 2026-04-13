import { ProviderConfig } from "./provider-config.type";

export const getEmbedding = async (
  text: string,
  config: ProviderConfig,
): Promise<number[]> => {
  if (config.name === "openai") {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        input: text,
        model: "text-embedding-3-small",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("OpenAI Embedding Error:", data);
      throw new Error(
        data.error?.message || `OpenAI API error: ${res.statusText}`,
      );
    }

    if (!data.data?.[0]?.embedding) {
      console.error("Unexpected OpenAI Response Structure:", data);
      throw new Error("Invalid response structure from OpenAI embeddings API");
    }

    return data.data[0].embedding;
  }

  if (config.name === "google") {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${config.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: { parts: [{ text }] },
        }),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("Google Embedding Error:", data);
      throw new Error(
        data.error?.message || `Google API error: ${res.statusText}`,
      );
    }

    if (!data.embedding?.values) {
      console.error("Unexpected Google Response Structure:", data);
      throw new Error("Invalid response structure from Google embeddings API");
    }

    return data.embedding.values;
  }

  throw new Error(`Unsupported AI provider: ${config.name}`);
};
