import AdminSetupForm from "features/core/auth/components/AdminSetupForm";

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr,0.95fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600 shadow-sm">
              Typepanel · First-time setup
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold text-primary sm:text-4xl">
                Create your first admin
              </h1>
              <p className="text-base text-neutral-500">
                Lock in the workspace owner account used for billing, security,
                and inviting teammates later.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-neutral-600">
              <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 shadow-sm">
                One-time setup
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 shadow-sm">
                Owner permissions
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 shadow-sm">
                Invite later
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 shadow-sm">
                <p className="text-sm font-semibold text-neutral-900">
                  Keep credentials safe
                </p>
                <p className="mt-2 text-sm text-neutral-600">
                  Use a long password and a work inbox you can retain even if
                  team members change.
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 shadow-sm">
                <p className="text-sm font-semibold text-neutral-900">
                  Finish provisioning next
                </p>
                <p className="mt-2 text-sm text-neutral-600">
                  After the admin account exists you can add providers, invite
                  the team, and enable SSO.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-xl lg:ml-auto">
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.06)]">
              <div className="border-b border-neutral-200 px-8 py-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-semibold text-primary">Admin account</h2>
                  <span className="rounded-full bg-neutral-900 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-white">
                    Step 1
                  </span>
                </div>
                <p className="text-sm text-neutral-500">
                  This admin owns the workspace, manages billing, and will be
                  used to invite the rest of your team.
                </p>
              </div>
              <div className="px-8 py-6">
                <AdminSetupForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
