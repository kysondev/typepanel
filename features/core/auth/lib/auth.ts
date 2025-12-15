import { db } from "@common/lib/db";
import argon2 from "argon2";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  appName: "TypePanel",
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  database: {
    db: db,
  },
  advanced: {
    cookiePrefix: "TypePanel",
  },
  plugins: [admin()],
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (password: string) => {
        return await argon2.hash(password);
      },
      verify: async (info: any) => {
        return await argon2.verify(info.hash, info.password);
      },
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
