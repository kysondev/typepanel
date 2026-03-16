"use server";

import { getUserCount } from "features/core/user/services/user.service";
import { getModelCount } from "features/core/model/services/model.service";
import { getMessageCount } from "features/core/chat/services/chat.service";

export const getAdminStats = async () => {
  try {
    const [users, models, messages] = await Promise.all([
      getUserCount(),
      getModelCount(),
      getMessageCount(),
    ]);

    return {
      success: true,
      data: {
        users,
        models,
        messages,
      },
    };
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    return {
      success: false,
      message: "Failed to fetch admin stats",
    };
  }
};
