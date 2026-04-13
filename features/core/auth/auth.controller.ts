"use server";

import { authClient } from "@auth/auth-client.config";
import { signInSchema, signUpSchema } from "@auth/auth.schema";
import { AppError } from "@common/lib/errors";
import { createAdminUser } from "../user/user.service";

export const signUp = async (formData: FormData) => {
  try {
    const result = signUpSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!result.success) {
      return { success: false, message: result.error.issues[0].message };
    }

    const { error } = await authClient.signUp.email(result.data);

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: "Account created successfully" };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, message: error.message };
    }
    console.error(error);
    return { success: false, message: "Something went wrong" };
  }
};

export const adminSignUp = async (formData: FormData) => {
  try {
    const result = signUpSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!result.success) {
      return { success: false, message: result.error.issues[0].message };
    }

    const confirmPassword = formData.get("confirmPassword") as string;
    const workspaceName = formData.get("workspaceName") as string;

    if (result.data.password !== confirmPassword) {
      return { success: false, message: "Passwords do not match" };
    }

    await createAdminUser({ ...result.data, workspaceName });

    return { success: true, message: "Admin account created successfully" };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, message: error.message };
    }
    console.error(error);
    return { success: false, message: "Something went wrong" };
  }
};

export const signInWithEmail = async (formData: FormData) => {
  try {
    const result = signInSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!result.success) {
      return { success: false, message: result.error.issues[0].message };
    }

    const { error } = await authClient.signIn.email({
      ...result.data,
      callbackURL: "/",
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, message: error.message };
    }
    console.error(error);
    return { success: false, message: "Something went wrong" };
  }
};

export const signInWithSocial = async (provider: "google" | "github") => {
  try {
    const { error } = await authClient.signIn.social({ provider });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, message: error.message };
    }
    console.error(error);
    return { success: false, message: "Something went wrong" };
  }
};
