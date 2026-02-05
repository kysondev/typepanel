import LoginForm from "features/core/auth/components/LoginForm";

export default function Page() {
  return (
    <div className="relative min-h-screen bg-white">
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage: "url(/login-grid.svg)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl items-center px-6 py-12">
        <div className="grid w-full overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.06)] lg:grid-cols-[1.1fr,0.9fr]">
          <div className="px-8 py-10 sm:px-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Typepanel
              </span>
            </div>
            <h1 className="mt-6 text-2xl font-semibold text-primary sm:text-3xl">
              Sign in
            </h1>
            <div className="mt-8">
              <LoginForm />
            </div>
          </div>
          <div className="hidden border-l border-neutral-200 bg-neutral-50/60 lg:flex">
            <div className="flex h-full w-full items-start px-8 py-10">
              <div className="relative w-full max-h-[60vh] aspect-[4/5] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                <img
                  src="/login2.jpg"
                  alt=""
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute right-6 top-10 space-y-3">
                  <div className="max-w-[190px] rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-900 shadow-lg">
                    Summarize the latest notes.
                  </div>
                  <div className="max-w-[200px] rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-900 shadow-lg">
                    Draft a follow-up email.
                  </div>
                </div>
                <div className="pointer-events-none absolute bottom-6 left-6 max-w-[210px] rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-900 shadow-lg">
                  Capture action items.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
