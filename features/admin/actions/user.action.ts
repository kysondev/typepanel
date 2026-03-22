import { authClient } from "@auth/lib/auth-client";
import { db } from "@common/lib/db";
import { getPaginatedUsers } from "features/core/user/services/user.service";

export const getUsers = async (page: number = 1, limit: number = 10) => {
  return await getPaginatedUsers(page, limit);
};

export const promoteUser = async (userId: string) => {
  try {
    const { error } = await authClient.admin.setRole({
      userId,
      role: "admin",
    });

    if (error) {
      console.error("Failed to promote user:", error);
      return { success: false, message: "Failed to promote user" };
    }
    return { success: true, message: "User promoted to admin" };
  } catch (error) {
    console.error("Failed to promote user:", error);
    return { success: false, message: "Failed to promote user" };
  }
};

export const demoteUser = async (userId: string) => {
  try {
    const { error } = await authClient.admin.setRole({
      userId,
      role: "user",
    });

    if (error) {
      console.error("Failed to demote user:", error);
      return { success: false, message: "Failed to demote user" };
    }

    return { success: true, message: "User demoted to regular user" };
  } catch (error) {
    console.error("Failed to demote user:", error);
    return { success: false, message: "Failed to demote user" };
  }
};
