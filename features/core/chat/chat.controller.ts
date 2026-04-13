"use server";

import {
  createChatSession,
  getChatMessages,
  getChatSessionsByUser,
  removeChatSession,
} from "./chat.service";

export const createChatSessionHandler = async (
  chatbotId: string,
  userId: string,
) => {
  try {
    const chatSession = await createChatSession({
      chatbotId,
      userId,
      updatedAt: new Date(),
      id: crypto.randomUUID(),
    });
    return { success: true, data: JSON.parse(JSON.stringify(chatSession)) };
  } catch (error) {
    console.error("Failed to create chat session:", error);
    return { success: false, message: "Failed to create chat session" };
  }
};

export const getChatSessionsHandler = async (userId: string) => {
  try {
    const chatSessions = await getChatSessionsByUser(userId);
    return { success: true, data: JSON.parse(JSON.stringify(chatSessions)) };
  } catch (error) {
    console.error("Failed to fetch chat sessions:", error);
    return { success: false, message: "Failed to fetch chat sessions" };
  }
};

export const getChatMessagesHandler = async (sessionId: string) => {
  try {
    const messages = await getChatMessages(sessionId);
    return { success: true, data: JSON.parse(JSON.stringify(messages)) };
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return { success: false, message: "Failed to fetch messages" };
  }
};

export const deleteChatSessionHandler = async (
  sessionId: string,
  userId: string,
) => {
  try {
    await removeChatSession(sessionId, userId);
    return { success: true, message: "Chat deleted" };
  } catch (error) {
    console.error("Failed to delete chat session:", error);
    return { success: false, message: "Failed to delete chat session" };
  }
};
