"use server";

import { db } from "@common/lib/db";

export const getKnowledgeBases = async () => {
  try {
    const kbs = await db
      .selectFrom("knowledgeBase")
      .selectAll()
      .orderBy("createdAt", "desc")
      .execute();
    return { success: true, data: kbs };
  } catch (error) {
    console.error("Failed to fetch knowledge bases:", error);
    return { success: false, message: "Failed to fetch knowledge bases" };
  }
};

export const createKnowledgeBase = async (data: {
  name: string;
  description?: string;
}) => {
  try {
    const kb = await db
      .insertInto("knowledgeBase")
      .values({
        id: crypto.randomUUID(),
        name: data.name,
        description: data.description || null,
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    return { success: true, message: "Collection created successfully", data: kb };
  } catch (error) {
    console.error("Failed to create knowledge base:", error);
    return { success: false, message: "Failed to create collection" };
  }
};

export const deleteKnowledgeBase = async (id: string) => {
  try {
    await db.deleteFrom("knowledgeBase").where("id", "=", id).execute();
    return { success: true, message: "Collection deleted successfully" };
  } catch (error) {
    console.error("Failed to delete knowledge base:", error);
    return { success: false, message: "Failed to delete collection" };
  }
};

export const updateKnowledgeBase = async (
  id: string,
  data: { name: string; description?: string }
) => {
  try {
    await db
      .updateTable("knowledgeBase")
      .set({
        name: data.name,
        description: data.description || null,
        updatedAt: new Date(),
      })
      .where("id", "=", id)
      .execute();
    return { success: true, message: "Collection updated successfully" };
  } catch (error) {
    console.error("Failed to update knowledge base:", error);
    return { success: false, message: "Failed to update collection" };
  }
};

export const getKnowledgeBaseById = async (id: string) => {
  try {
    const kb = await db
      .selectFrom("knowledgeBase")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
    return { success: true, data: kb };
  } catch (error) {
    console.error("Failed to fetch knowledge base:", error);
    return { success: false, message: "Failed to fetch knowledge base" };
  }
};
