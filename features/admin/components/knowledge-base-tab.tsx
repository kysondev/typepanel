"use client";

import React from "react";
import {
  Database,
  Plus,
  Edit,
  Trash2,
  FileText,
  HardDrive,
} from "lucide-react";
import { Button } from "features/common/components/ui/button";

export function KnowledgeBase() {
  const collections = [
    {
      id: "1",
      name: "asdfgh",
      description: "just testing if this even works lol",
      documents: 1,
      size: "12 KB",
      lastUpdated: "2 mins ago",
    },
    {
      id: "2",
      name: "Stuff and Things",
      description: "random pdfs and some notes",
      documents: 14,
      size: "4.2 MB",
      lastUpdated: "Yesterday",
    },
    {
      id: "3",
      name: "Testing",
      description: "i hope the embeddings dont break this time",
      documents: 0,
      size: "0 KB",
      lastUpdated: "5 days ago",
    },
  ];

  const systemStatus = [
    {
      name: "Vector Storage",
      provider: "PostgreSQL (pgvector)",
      status: "Healthy",
      icon: Database,
    },
    {
      name: "Object Storage",
      provider: "Minio (S3)",
      status: "Online",
      icon: HardDrive,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Knowledge Base
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Manage your collections and document storage.
          </p>
        </div>
        <Button
          size="sm"
          className="bg-[#0A0A0A] text-white px-4 hover:bg-neutral-800"
        >
          <Plus size={16} className="mr-2" /> Create Collection
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {systemStatus.map((system) => (
          <div
            key={system.name}
            className="bg-white p-4 rounded-xl border border-neutral-200 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-neutral-100 text-neutral-900">
                <system.icon size={18} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-neutral-900 leading-none">
                  {system.name}
                </p>
                <p className="text-[11px] text-neutral-500 font-medium mt-1">
                  {system.provider}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-neutral-50 rounded-md border border-neutral-100">
              <div className="h-1 w-1 rounded-full bg-neutral-900" />
              <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-tight">
                {system.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {collections.map((coll) => (
            <div
              key={coll.id}
              className="group bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm hover:border-neutral-900 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="p-3 bg-neutral-100 rounded-xl text-neutral-600 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-neutral-900 truncate">
                        {coll.name}
                      </h3>
                    </div>
                    <p className="text-sm text-neutral-500 mt-0.5 line-clamp-1">
                      {coll.description}
                    </p>

                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-600">
                        <span className="text-neutral-900 font-bold">
                          {coll.documents}
                        </span>
                        <span className="text-neutral-400">docs</span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-neutral-200" />
                      <div className="text-[13px] font-medium text-neutral-600">
                        {coll.size}
                      </div>
                      <div className="w-1 h-1 rounded-full bg-neutral-200" />
                      <div className="text-[12px] font-medium text-neutral-400">
                        Updated {coll.lastUpdated}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <button className="border-2 border-dashed border-neutral-100 rounded-2xl p-6 flex items-center justify-center gap-3 hover:border-neutral-300 hover:bg-neutral-50/50 transition-all group">
            <div className="p-2 bg-neutral-50 rounded-full group-hover:bg-white transition-colors">
              <Plus
                size={20}
                className="text-neutral-300 group-hover:text-neutral-900"
              />
            </div>
            <p className="text-sm font-bold text-neutral-400 group-hover:text-neutral-900 transition-colors">
              New Knowledge Collection
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
