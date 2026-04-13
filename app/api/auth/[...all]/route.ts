import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@auth/auth-server.config";

export const { POST, GET } = toNextJsHandler(auth);
