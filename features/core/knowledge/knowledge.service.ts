import { db } from "@common/lib/db";
import { sql } from "kysely";
import { ProviderConfig } from "../rag/provider-config.type";
import { getEmbedding } from "../rag/get-embedding";

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
