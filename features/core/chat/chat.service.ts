import "server-only";

import { db } from "@common/lib/db";
import { NotFoundError } from "@common/lib/errors";
import { ChatMessage, NewChatSession } from "db/models.types";

export const createChatSession = async (data: NewChatSession) => {
  return db
    .insertInto("chatSession")
    .values({
      id: data.id,
      chatbotId: data.chatbotId,
      userId: data.userId,
      updatedAt: data.updatedAt,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const getChatSessionsByUser = async (userId: string) => {
  return db
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

export const removeChatSession = async (id: string, userId: string) => {
  const result = await db
    .deleteFrom("chatSession")
    .where("id", "=", id)
    .where("userId", "=", userId)
    .execute();

  if (!result.length) throw new NotFoundError("Chat session");
};

export const getChatMessages = async (sessionId: string) => {
  return db
    .selectFrom("chatMessage")
    .selectAll()
    .where("sessionId", "=", sessionId)
    .orderBy("createdAt", "asc")
    .execute();
};

export const saveChatMessage = async (data: ChatMessage) => {
  const [message] = await Promise.all([
    db
      .insertInto("chatMessage")
      .values({
        id: data.id,
        sessionId: data.sessionId,
        role: data.role,
        content: data.content,
      })
      .returningAll()
      .executeTakeFirstOrThrow(),
    db
      .updateTable("chatSession")
      .set({ updatedAt: new Date() })
      .where("id", "=", data.sessionId)
      .execute(),
  ]);

  return message;
};

export const getMessageCount = async (): Promise<number> => {
  const result = await db
    .selectFrom("chatMessage")
    .select((eb) => eb.fn.count("id").as("count"))
    .executeTakeFirst();
  return Number(result?.count ?? 0);
};
