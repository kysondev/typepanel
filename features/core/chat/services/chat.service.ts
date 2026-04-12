import { db } from "@common/lib/db";

export const getMessageCount = async () => {
  try {
    const result = await db
      .selectFrom("chatMessage")
      .select((eb) => eb.fn.count("id").as("count"))
      .executeTakeFirst();
    return Number(result?.count ?? 0);
  } catch (error) {
    console.error("Failed to fetch message count:", error);
    return 0;
  }
};

export const createChatSession = async (chatbotId: string, userId: string) => {
  return await db
    .insertInto("chatSession")
    .values({
      id: crypto.randomUUID(),
      chatbotId,
      userId,
      updatedAt: new Date(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const getChatSessionsByUser = async (userId: string) => {
  return await db
    .selectFrom("chatSession")
    .innerJoin("chatBot", "chatBot.id", "chatSession.chatbotId")
    .select([
      "chatSession.id",
      "chatSession.chatbotId",
      "chatSession.createdAt",
      "chatBot.name as chatbotName",
    ])
    .where("chatSession.userId", "=", userId)
    .orderBy("chatSession.createdAt", "desc")
    .execute();
};

export const getChatMessages = async (sessionId: string) => {
  return await db
    .selectFrom("chatMessage")
    .selectAll()
    .where("sessionId", "=", sessionId)
    .orderBy("createdAt", "asc")
    .execute();
};

export const saveChatMessage = async (
  sessionId: string,
  role: "user" | "assistant" | "system",
  content: string,
) => {
  const message = await db
    .insertInto("chatMessage")
    .values({
      id: crypto.randomUUID(),
      sessionId,
      role,
      content,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  await db
    .updateTable("chatSession")
    .set({ updatedAt: new Date() })
    .where("id", "=", sessionId)
    .execute();

  return message;
};

export const deleteChatSession = async (sessionId: string, userId: string) => {
  return await db
    .deleteFrom("chatSession")
    .where("id", "=", sessionId)
    .where("userId", "=", userId)
    .execute();
};
