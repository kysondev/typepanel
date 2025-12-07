import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "features/core/auth/lib/auth";

export const { POST, GET } = toNextJsHandler(auth);
