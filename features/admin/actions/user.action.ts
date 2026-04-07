import { authClient } from "@auth/lib/auth-client";
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

export const updateUser = async (
  userId: string,
  data: { name?: string; email?: string },
) => {
  try {
    const { error } = await authClient.admin.updateUser({
      userId,
      data: {
        name: data.name,
        email: data.email,
      },
    });

    if (error) {
      console.error("Failed to update user:", error);
      return {
        success: false,
        message: error.message || "Failed to update user",
      };
    }

    return { success: true, message: "User updated successfully" };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { success: false, message: "Failed to update user" };
  }
};
