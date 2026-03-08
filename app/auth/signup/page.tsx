import SignUpForm from "@auth/components/sign-up-form";

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-12">
        <div className="grid w-full overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.06)] lg:grid-cols-[1.1fr,0.9fr]">
          <div className="px-8 py-10 sm:px-10">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Typepanel
            </span>
            <h1 className="mt-6 text-2xl font-semibold text-primary sm:text-3xl">
              Create account
            </h1>
            <div className="mt-8">
              <SignUpForm />
            </div>
          </div>
          <div className="hidden border-l border-neutral-200 bg-neutral-50/60 lg:block">
            <div className="h-full p-8">
              <div className="h-full rounded-2xl border border-neutral-200 bg-white shadow-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
