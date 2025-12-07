import { authClient } from "features/core/auth/lib/auth-client";
import {
  signInSchema,
  signUpSchema,
} from "features/core/auth/lib/validations/auth.schema";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

export const signUp = async (formData: FormData) => {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    if (!name || !email || !password) {
      toast.error("Please fill all the fields");
      return;
    }
    const result = signUpSchema.safeParse({
      name,
      email,
      password,
    });
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
    });
    if (error) {
      toast.error(error.message as string);
      return;
    }
    toast.success("Account created successfully");
  } catch (error) {
    toast.error("Something went wrong");
  }
  redirect("/");
};

export const signInWithEmail = async (formData: FormData) => {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    if (!email || !password) {
      toast.error("Please fill all the fields");
      return;
    }
    const result = signInSchema.safeParse({
      email,
      password,
    });
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
    });
    if (error) {
      toast.error(error.message as string);
      return;
    }
  } catch (error) {
    toast.error("Something went wrong");
  }
};

export const signInWithGoogle = async () => {
  try {
    const { error } = await authClient.signIn.social({
      provider: "google",
    });
    if (error) {
      toast.error(error.message as string);
      return;
    }
  } catch (error) {
    toast.error("Something went wrong");
  }
};

export const signInWithGithub = async () => {
  try {
    const { error } = await authClient.signIn.social({
      provider: "github",
    });
    if (error) {
      toast.error(error.message as string);
      return;
    }
  } catch (error) {
    toast.error("Something went wrong");
  }
};
