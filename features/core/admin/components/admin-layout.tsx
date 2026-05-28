"use client";

import React from "react";
import {
  Users,
  Database,
  Cpu,
  LayoutDashboard,
  LogOut,
  Search,
  ChevronRight,
  Bell,
  MessageSquare,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "features/common/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const sidebarItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      href: "/admin",
    },
    { id: "users", label: "Users", icon: Users, href: "/admin/users" },
    { id: "models", label: "Models", icon: Cpu, href: "/admin/models" },
    {
      id: "knowledge",
      label: "Knowledge Bases",
      icon: Database,
      href: "/admin/knowledge",
    },
  ];

  const activeTab =
    sidebarItems.find((item) => item.href === pathname)?.id || "overview";

  return (
    <div className="flex h-screen bg-[#FDFDFD] text-[#0A0A0A] font-sans">
      <aside className="w-64 bg-[#0A0A0A] flex flex-col text-neutral-400 shrink-0">
        <div className="p-6 mb-4">
          <Link href="/admin" className="flex items-center gap-2 px-2">
            <Image
              src="/logo.png"
              alt="TypePanel"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <h1 className="text-white text-lg font-bold tracking-tight">
              TypePanel
            </h1>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1.5">
          {sidebarItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                pathname === item.href
                  ? "bg-neutral-800 text-white"
                  : "hover:text-white hover:bg-neutral-900"
              }`}
            >
              <item.icon
                size={18}
                className={`${pathname === item.href ? "text-white" : "text-neutral-500 group-hover:text-white"}`}
              />
              {item.label}
              {pathname === item.href && (
                <ChevronRight size={14} className="ml-auto text-neutral-500" />
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-neutral-800/50">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-500 hover:text-red-400 hover:bg-red-400/5 transition-colors">
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 bg-white/50 backdrop-blur-md border-b border-neutral-100 shrink-0">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-neutral-400 font-medium">Admin</span>
            <ChevronRight size={14} className="text-neutral-300" />
            <span className="text-neutral-900 font-semibold capitalize">
              {activeTab}
            </span>
          </div>

          <Link href="/chat">
            <Button
              variant="outline"
              size="sm"
              className="font-bold border-neutral-200 h-9 px-4 text-xs"
            >
              <MessageSquare size={14} className="mr-2" />
              Go to Chat
            </Button>
          </Link>
        </header>

        <main className="flex-1 overflow-auto bg-[#FDFDFD]">
          <div className="p-8 max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
