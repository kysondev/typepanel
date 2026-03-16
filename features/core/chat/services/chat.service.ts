"use server";

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
