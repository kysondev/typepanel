"use server";

import { db } from "@common/lib/db";
import cuid from "cuid";

const toErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return error ? JSON.stringify(error) : "Unknown error";
};

export const createWorkspace = async (name: string) => {
  try {
    const workspace = await db
      .insertInto("workspace")
      .values({
        name,
        id: cuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirst();

    if (!workspace) {
      return { success: false, message: "Failed to create workspace" };
    }
    return {
      success: true,
      data: workspace,
      message: "Workspace created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create workspace",
      error: toErrorMessage(error),
    };
  }
};
