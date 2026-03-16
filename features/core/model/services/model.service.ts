"use server";

import { db } from "@common/lib/db";

export const getModelCount = async () => {
  try {
    const result = await db
      .selectFrom("model")
      .select((eb) => eb.fn.count("id").as("count"))
      .executeTakeFirst();
    return Number(result?.count ?? 0);
  } catch (error) {
    console.error("Failed to fetch model count:", error);
    return 0;
  }
};
