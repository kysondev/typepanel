import { Button } from "@common/components/ui/button";
import { Cpu, Database, Plus, Users } from "lucide-react";
import { getAdminStats } from "features/admin/actions/admin.action";

export default async function OverviewTab() {
  const statsRes = await getAdminStats();
  const data = statsRes.success
    ? statsRes.data
    : { users: 0, models: 0, messages: 0 };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-neutral-500 text-sm">
            See how your platform is performing today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-[#0A0A0A] text-white px-4">
            <Plus size={16} className="mr-2" /> New Chatbot
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="text-neutral-400">
              <Users size={24} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">
                Total Users
              </p>
              <p className="text-2xl font-bold mt-0.5">
                {data?.users.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="text-neutral-400">
              <Cpu size={24} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">
                Models Created
              </p>
              <p className="text-2xl font-bold mt-0.5">
                {data?.models.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="text-neutral-400">
              <Database size={24} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">
                Total Messages
              </p>
              <p className="text-2xl font-bold mt-0.5">
                {data?.messages.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
