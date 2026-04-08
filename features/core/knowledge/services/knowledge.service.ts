import { db } from "@common/lib/db";
import { sql } from "kysely";

export interface ProviderConfig {
  name: "openai" | "google";
  apiKey: string;
}

const chunkText = (
  text: string,
  size: number = 1000,
  overlap: number = 200,
): string[] => {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = start + size;
    chunks.push(text.slice(start, end));
    start += size - overlap;
  }
  return chunks;
};

const getEmbedding = async (
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
      throw new Error(data.error?.message || `OpenAI API error: ${res.statusText}`);
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
      throw new Error(data.error?.message || `Google API error: ${res.statusText}`);
    }

    if (!data.embedding?.values) {
      console.error("Unexpected Google Response Structure:", data);
      throw new Error("Invalid response structure from Google embeddings API");
    }

    return data.embedding.values;
  }

  throw new Error(`Unsupported AI provider: ${config.name}`);
};

export const ingestDocument = async (
  kbId: string,
  filename: string,
  content: string,
  config: ProviderConfig,
) => {
  const chunks = chunkText(content);

  for (const chunk of chunks) {
    const embedding = await getEmbedding(chunk, config);
    const id = crypto.randomUUID();

    await sql`
      INSERT INTO "knowledgeDocument" (id, "kbId", filename, content, embedding, "createdAt")
      VALUES (
        ${id}, 
        ${kbId}, 
        ${filename}, 
        ${chunk}, 
        ${JSON.stringify(embedding)}::vector, 
        NOW()
      )
    `.execute(db);
  }
};

export const searchKnowledge = async (
  kbId: string,
  query: string,
  config: ProviderConfig,
  limit: number = 5,
) => {
  const embedding = await getEmbedding(query, config);

  const results = await sql<any>`
    SELECT content, 1 - (embedding <=> ${JSON.stringify(embedding)}::vector) as similarity
    FROM "knowledgeDocument"
    WHERE "kbId" = ${kbId}
    ORDER BY similarity DESC
    LIMIT ${limit}
  `.execute(db);

  return results.rows.map((r: any) => r.content).join("\n\n");
};

export const getKnowledgeBases = async () => {
  return await db
    .selectFrom("knowledgeBase")
    .selectAll()
    .select((eb) => [
      eb
        .selectFrom("knowledgeDocument")
        .select(eb.fn.count("id").as("count"))
        .whereRef("knowledgeDocument.kbId", "=", "knowledgeBase.id")
        .as("documentCount"),
    ])
    .orderBy("createdAt", "desc")
    .execute();
};

export const createKnowledgeBase = async (data: {
  name: string;
  description?: string;
  chatbotId: string;
}) => {
  return await db
    .insertInto("knowledgeBase")
    .values({
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description || null,
      chatbotId: data.chatbotId,
      updatedAt: new Date(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const deleteKnowledgeBase = async (id: string) => {
  return await db.deleteFrom("knowledgeBase").where("id", "=", id).execute();
};

export const updateKnowledgeBase = async (
  id: string,
  data: { name: string; description?: string },
) => {
  return await db
    .updateTable("knowledgeBase")
    .set({
      name: data.name,
      description: data.description || null,
      updatedAt: new Date(),
    })
    .where("id", "=", id)
    .execute();
};

export const getKnowledgeBaseById = async (id: string) => {
  return await db
    .selectFrom("knowledgeBase")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
};

export const getKnowledgeDocuments = async (kbId: string) => {
  return await db
    .selectFrom("knowledgeDocument")
    .select(["id", "filename", "createdAt", "kbId"])
    .where("kbId", "=", kbId)
    .orderBy("createdAt", "desc")
    .execute();
};

export const deleteKnowledgeDocumentsByFile = async (
  kbId: string,
  filename: string,
) => {
  return await db
    .deleteFrom("knowledgeDocument")
    .where("kbId", "=", kbId)
    .where("filename", "=", filename)
    .execute();
};

export const getKnowledgeDocumentById = async (id: string) => {
  return await db
    .selectFrom("knowledgeDocument")
    .select(["filename", "kbId"])
    .where("id", "=", id)
    .executeTakeFirst();
};
