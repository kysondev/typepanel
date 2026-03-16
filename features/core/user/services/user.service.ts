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

export const getPaginatedUsers = async (
  page: number = 1,
  limit: number = 10,
) => {
  try {
    const offset = (page - 1) * limit;

    const [users, totalCount] = await Promise.all([
      db
        .selectFrom("user")
        .select(["id", "name", "email", "role", "createdAt"])
        .orderBy("role", "asc")
        .orderBy("createdAt", "desc")
        .limit(limit)
        .offset(offset)
        .execute(),
      getUserCount(),
    ]);

    return {
      success: true,
      data: {
        users,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      },
    };
  } catch (error) {
    console.error("Failed to fetch paginated users:", error);
    return {
      success: false,
      message: "Failed to fetch users",
    };
  }
};
