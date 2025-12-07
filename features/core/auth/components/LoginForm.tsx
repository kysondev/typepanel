"use client";
import {
  signInWithEmail,
  signInWithGithub,
  signInWithGoogle,
} from "features/core/auth/actions/auth.action";
import { Button } from "features/common/components/ui/button";
import { Input } from "features/common/components/ui/input";
import { Loading } from "features/common/components/ui/loading";
import Form from "next/form";
import Link from "next/link";
import { useTransition } from "react";
import { GitHubDark, Google } from "developer-icons";

const LoginForm = () => {
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <Form
        action={async (formData) => {
          startTransition(async () => {
            await signInWithEmail(formData);
          });
        }}
        className="space-y-5"
      >
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
            autoComplete="current-password"
            className="text-[#0A0A0A]"
          />
        </div>

        <div className="flex justify-between text-xs mt-1 text-neutral-500">
          <Link
            href="forgot-password"
            className="hover:text-[#0A0A0A] transition-colors"
          >
            Forgot password?
          </Link>
          <Link
            href="signup"
            className="hover:text-[#0A0A0A] transition-colors"
          >
            Create account
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          size="form"
          className="w-full bg-[#0A0A0A] text-white font-medium rounded-lg hover:bg-[#1d1d1d] focus-visible:ring-[#0A0A0A]/15 transition-colors mt-2 shadow-[0_14px_34px_rgba(0,0,0,0.12)] disabled:opacity-80"
        >
          {isPending ? <Loading /> : "Sign in"}
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
            onClick={async () => {
              await signInWithGoogle();
            }}
            className="flex items-center justify-center w-full rounded-lg border-neutral-200 text-[#0A0A0A] text-sm shadow-sm hover:border-neutral-300"
          >
            <Google className="mr-2" size={16} />
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            size="form"
            onClick={async () => {
              await signInWithGithub();
            }}
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
export default LoginForm;
