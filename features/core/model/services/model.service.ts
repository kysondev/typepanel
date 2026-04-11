"use server";

import { db } from "@common/lib/db";
import { jsonArrayFrom } from "kysely/helpers/postgres";

export const getModelCount = async () => {
  try {
    const result = await db
      .selectFrom("chatBot")
      .select((eb) => eb.fn.count("id").as("count"))
      .executeTakeFirst();
    return Number(result?.count ?? 0);
  } catch (error) {
    console.error("Failed to fetch model count:", error);
    return 0;
  }
};

export const getModels = async () => {
  return await db
    .selectFrom("chatBot")
    .selectAll()
    .select((eb) => [
      jsonArrayFrom(
        eb
          .selectFrom("knowledgeBase")
          .select(["id", "name", "description"])
          .whereRef("knowledgeBase.chatbotId", "=", "chatBot.id"),
      ).as("knowledgeBases"),
    ])
    .orderBy("createdAt", "desc")
    .execute();
};

export const createModel = async (data: {
  name: string;
  model: string;
  provider: string;
  apiKeyEnc: string;
}) => {
  return await db
    .insertInto("chatBot")
    .values({
      id: crypto.randomUUID(),
      name: data.name,
      model: data.model,
      provider: data.provider,
      apiKeyEnc: data.apiKeyEnc,
      updatedAt: new Date(),
    })
    .execute();
};

export const deleteModel = async (id: string) => {
  return await db.deleteFrom("chatBot").where("id", "=", id).execute();
};

export const updateModel = async (
  id: string,
  data: {
    name: string;
    systemPrompt?: string;
    tone?: string;
    temperature?: number;
    contextLength?: number;
  },
) => {
  return await db
    .updateTable("chatBot")
    .set({
      name: data.name,
      systemPrompt: data.systemPrompt ?? "",
      tone: data.tone ?? "professional",
      temperature: data.temperature ?? 0.7,
      contextLength: data.contextLength ?? 4096,
      updatedAt: new Date(),
    })
    .where("id", "=", id)
    .execute();
};

export const getModelById = async (id: string) => {
  return await db
    .selectFrom("chatBot")
    .selectAll()
    .select((eb) => [
      jsonArrayFrom(
        eb
          .selectFrom("knowledgeBase")
          .select(["id", "name", "description"])
          .whereRef("knowledgeBase.chatbotId", "=", "chatBot.id"),
      ).as("knowledgeBases"),
    ])
    .where("id", "=", id)
    .executeTakeFirst();
};
