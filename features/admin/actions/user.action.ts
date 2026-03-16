"use server";

import { getPaginatedUsers } from "features/core/user/services/user.service";

export const getUsers = async (page: number = 1, limit: number = 10) => {
  return await getPaginatedUsers(page, limit);
};
