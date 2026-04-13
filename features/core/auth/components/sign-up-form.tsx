"use client";

import { Button } from "features/common/components/ui/button";
import { Input } from "features/common/components/ui/input";
import { Loading } from "features/common/components/ui/loading";
import Form from "next/form";
import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { GitHubDark, Google } from "developer-icons";
import { signInWithSocial, signUp } from "@auth/auth.controller";

const SignUpForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSignUp = async (formData: FormData) => {
    startTransition(async () => {
      const result = await signUp(formData);

      if (!result.success) {
        toast.error(result.message || "Failed to create account");
        return;
      }

      toast.success(result.message || "Account created successfully");
      router.push("/");
    });
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    startTransition(async () => {
      const result = await signInWithSocial(provider);

      if (!result.success) {
        toast.error(result.message || "Failed to sign in with social account");
      }
    });
  };

  return (
    <>
      <Form action={handleSignUp} className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-medium text-neutral-600 mb-1.5"
          >
            Name
          </label>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="johndoe"
            autoComplete="name"
            className="text-[#0A0A0A]"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-medium text-neutral-600 mb-1.5"
          >
            Email
          </label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            className="text-[#0A0A0A]"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-xs font-medium text-neutral-600 mb-1.5"
          >
            Password
          </label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="••••••••"
            autoComplete="new-password"
            className="text-[#0A0A0A]"
          />
        </div>
        <div className="flex gap-1 text-xs mt-1 text-neutral-500">
          <span>Already have an account?</span>
          <Link
            href="login"
            className="hover:text-[#0A0A0A] underline-offset-4 hover:underline transition-colors"
          >
            Login
          </Link>
        </div>
        <Button
          type="submit"
          disabled={isPending}
          size="form"
          className="w-full bg-[#0A0A0A] text-white font-medium rounded-lg hover:bg-[#1d1d1d] focus-visible:ring-[#0A0A0A]/15 transition-colors mt-2 shadow-[0_14px_34px_rgba(0,0,0,0.12)] disabled:opacity-80"
        >
          {isPending ? <Loading /> : "Sign up"}
        </Button>
      </Form>

      <div className="mt-8 pt-6 border-t border-neutral-100">
        <p className="text-xs text-center text-neutral-500 mb-4">
          Or continue with
        </p>
        <div className="flex justify-between space-x-3">
          <Button
            type="button"
            variant="outline"
            size="form"
            disabled={isPending}
            onClick={() => handleSocialSignIn("google")}
            className="flex items-center justify-center w-full rounded-lg border-neutral-200 text-[#0A0A0A] text-sm shadow-sm hover:border-neutral-300"
          >
            <Google className="mr-2" size={16} />
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            size="form"
            disabled={isPending}
            onClick={() => handleSocialSignIn("github")}
            className="flex items-center justify-center w-full rounded-lg border-neutral-200 text-[#0A0A0A] text-sm shadow-sm hover:border-neutral-300"
          >
            <GitHubDark className="mr-2" size={16} />
            GitHub
          </Button>
        </div>
      </div>
    </>
  );
};

export default SignUpForm;
