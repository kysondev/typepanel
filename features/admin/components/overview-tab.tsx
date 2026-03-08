import { Button } from "@common/components/ui/button";
import { Cpu, Database, Plus, Users } from "lucide-react";

export default function OverviewTab() {
  const stats = [
    { label: "Total Users", value: "6,969", icon: Users },
    { label: "Models Created", value: "69", icon: Cpu },
    { label: "Total Messages", value: "69k", icon: Database },
  ];

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
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="text-neutral-400">
                <stat.icon size={24} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold mt-0.5">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
