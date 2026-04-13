"server only";

import { auth } from "@auth/auth-server.config";
import { db } from "@common/lib/db";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { headers } from "next/headers";
import { createWorkspace } from "../workspace/workspace.service";

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
      data: JSON.parse(JSON.stringify(session.user)),
    };
  };
  const headersList = await headers();
  return getCachedUser(headersList);
};

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
        .orderBy("role", "desc")
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

export const createAdminUser = async ({
  name,
  email,
  password,
  workspaceName,
}: {
  name: string;
  email: string;
  password: string;
  workspaceName: string;
}) => {
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

export const checkAdminExists = async (): Promise<boolean> => {
  const admin = await db
    .selectFrom("user")
    .select("id")
    .where("role", "=", "admin")
    .limit(1)
    .executeTakeFirst();

  return !!admin;
};
