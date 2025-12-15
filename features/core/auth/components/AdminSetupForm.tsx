import { Button } from "features/common/components/ui/button";
import { Input } from "features/common/components/ui/input";

const AdminSetupForm = () => {
  return (
    <form className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="workspaceName"
            className="mb-1.5 block text-xs font-medium text-neutral-600"
          >
            Workspace name
          </label>
          <Input
            id="workspaceName"
            name="workspaceName"
            placeholder="TypePanel Team"
            autoComplete="organization"
            className="text-[#0A0A0A]"
          />
        </div>
        <div>
          <label
            htmlFor="adminName"
            className="mb-1.5 block text-xs font-medium text-neutral-600"
          >
            Admin name
          </label>
          <Input
            id="adminName"
            name="adminName"
            placeholder="Alex Doe"
            autoComplete="name"
            className="text-[#0A0A0A]"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="adminEmail"
          className="mb-1.5 block text-xs font-medium text-neutral-600"
        >
          Admin email
        </label>
        <Input
          type="email"
          id="adminEmail"
          name="adminEmail"
          placeholder="you@example.com"
          autoComplete="email"
          className="text-[#0A0A0A]"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-xs font-medium text-neutral-600"
          >
            Password
          </label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Create a strong password"
            autoComplete="new-password"
            className="text-[#0A0A0A]"
          />
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-xs font-medium text-neutral-600"
          >
            Confirm password
          </label>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Re-enter password"
            autoComplete="new-password"
            className="text-[#0A0A0A]"
          />
        </div>
      </div>

      <div className="rounded-lg border border-dashed border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-600">
        This first account becomes the workspace owner. Use a work email you can
        keep long-term.
      </div>

      <Button
        type="button"
        size="form"
        className="mt-1 w-full rounded-lg bg-[#0A0A0A] text-white shadow-[0_14px_34px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#1d1d1d] focus-visible:ring-[#0A0A0A]/15 disabled:opacity-80"
      >
        Create admin account
      </Button>
    </form>
  );
};

export default AdminSetupForm;
