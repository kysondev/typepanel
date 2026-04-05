"use server";

import { db } from "@common/lib/db";

export const getModels = async () => {
  try {
    const models = await db
      .selectFrom("chatBot")
      .selectAll()
      .orderBy("createdAt", "desc")
      .execute();
    return { success: true, data: models };
  } catch (error) {
    console.error("Failed to fetch models:", error);
    return { success: false, message: "Failed to fetch models" };
  }
};

export const createModel = async (data: {
  name: string;
  model: string;
  provider: string;
  apiKeyEnc: string;
}) => {
  try {
    await db
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
    return { success: true, message: "Model created successfully" };
  } catch (error) {
    console.error("Failed to create model:", error);
    return { success: false, message: "Failed to create model" };
  }
};

export const deleteModel = async (id: string) => {
  try {
    await db.deleteFrom("chatBot").where("id", "=", id).execute();
    return { success: true, message: "Model deleted successfully" };
  } catch (error) {
    console.error("Failed to delete model:", error);
    return { success: false, message: "Failed to delete model" };
  }
};

export const updateModel = async (
  id: string,
  data: {
    name: string;
    systemPrompt?: string;
    tone?: string;
    temperature?: number;
    contextLength?: number;
  }
) => {
  try {
    await db
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
    return { success: true, message: "Model updated successfully" };
  } catch (error) {
    console.error("Failed to update model:", error);
    return { success: false, message: "Failed to update model" };
  }
};
