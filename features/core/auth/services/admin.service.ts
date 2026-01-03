"use server";

import { auth } from "@auth/lib/auth";
import { db } from "@common/lib/db";
import { createWorkspace } from "./workspace.service";

export const createAdminUser = async (
  name: string,
  email: string,
  password: string,
  workspaceName: string
) => {
  try {
    const { user } = await auth.api.createUser({
      body: {
        email,
        password,
        name,
        role: "admin",
      },
    });
    if (!user) {
      return { success: false, message: "Failed to create admin user" };
    }

    const verifyAdmin = await db
      .updateTable("user")
      .where("id", "=", user.id)
      .set({ emailVerified: true })
      .returningAll()
      .executeTakeFirst();

    if (!verifyAdmin) {
      return { success: false, message: "Failed to verify admin user" };
    }

    const { success, message, data } = await createWorkspace(workspaceName);
    if (!success) {
      return { success: false, message };
    }

    const addUserToWorkspace = await db
      .updateTable("user")
      .where("id", "=", user.id)
      .set({ workspaceId: data?.id })
      .executeTakeFirst();

    if (!addUserToWorkspace) {
      return {
        success: false,
        message: "Failed to add admin user to workspace",
      };
    }

    return { success: true, message: "Admin user created successfully" };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create admin user",
      error: (error as Error).message,
    };
  }
};
