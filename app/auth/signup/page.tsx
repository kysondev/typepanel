import SignUpForm from "features/core/auth/components/SignUpForm";

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr,0.95fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600 shadow-sm">
              Typepanel · Minimal chat workspace
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold text-neutral-900 sm:text-4xl">
                Create your account
              </h1>
              <p className="text-base text-neutral-500">
                Join a focused space where you can chat, keep your history, and
                stay in sync across devices.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-neutral-600">
              <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 shadow-sm">
                Fast responses
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 shadow-sm">
                Synced history
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 shadow-sm">
                Private by default
              </span>
            </div>
          </div>

          <div className="w-full max-w-xl lg:ml-auto">
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.06)]">
              <div className="border-b border-neutral-200 px-8 py-6">
                <h2 className="font-semibold text-primary">Create Account</h2>
                <p className="text-sm text-neutral-500">
                  Set up your profile to start chatting and save your threads.
                </p>
              </div>
              <div className="px-8 py-6">
                <SignUpForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
