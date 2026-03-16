"use server";

import { db } from "@common/lib/db";

export const getUserCount = async () => {
  try {
    const result = await db
      .selectFrom("user")
      .select((eb) => eb.fn.count("id").as("count"))
      .executeTakeFirst();
    return Number(result?.count ?? 0);
  } catch (error) {
    console.error("Failed to fetch user count:", error);
    return 0;
  }
};
