"use server";
import { auth } from "features/core/auth/lib/auth";
import { headers } from "next/headers";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { db } from "@common/lib/db";

export const getUser = async () => {
  const getCachedUser = async (headersList: ReadonlyHeaders) => {
    "use cache";
    const session = await auth.api.getSession({
      headers: headersList,
    });
    if (!session) return { success: false, message: "Unauthorized" };
    return {
      success: true,
      message: "User fetched successfully",
      data: session.user,
    };
  };
  const headersList = await headers();
  return getCachedUser(headersList);
};

export const adminExists = async () => {
  try {
    const admin = await db
      .selectFrom("user")
      .select("id")
      .where("role", "=", "admin")
      .limit(1)
      .executeTakeFirst();
    return !!admin;
  } catch (error) {
    return false;
  }
};
