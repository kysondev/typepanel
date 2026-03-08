"use client";

import React from "react";
import { Cpu, Plus, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "features/common/components/ui/button";

export default function ModelsTab() {
  const models = [
    {
      name: "Test GPT",
      provider: "OpenAI",
      baseModel: "gpt-4o-2024-05-13",
      addedAt: "Feb 12, 2026",
    },
    {
      name: "Test Bot 2",
      provider: "Anthropic",
      baseModel: "claude-3-5-sonnet-20240620",
      addedAt: "Feb 20, 2026",
    },
    {
      name: "Test Bot 3",
      provider: "Self-hosted",
      baseModel: "llama-3-70b-instruct",
      addedAt: "Feb 28, 2026",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Models</h1>
          <p className="text-neutral-500 text-sm">
            Configure and manage the AI models available for your chatbots.
          </p>
        </div>
        <Button size="sm" className="bg-[#0A0A0A] text-white px-4">
          <Plus size={16} className="mr-2" /> Add New Model
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <div
            key={model.name}
            className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between hover:border-neutral-300 transition-colors"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-neutral-50 rounded-lg">
                  <Cpu size={20} className="text-neutral-600" />
                </div>
                <button className="text-neutral-400 hover:text-neutral-900 transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
              <h3 className="text-lg font-bold text-neutral-900">
                {model.name}
              </h3>
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mt-1">
                {model.provider}
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-neutral-50">
                  <span className="text-xs text-neutral-500 font-medium">
                    Base Model
                  </span>
                  <span className="text-xs font-mono text-neutral-700 bg-neutral-50 px-1.5 py-0.5 rounded">
                    {model.baseModel}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-neutral-500 font-medium">
                    Added On
                  </span>
                  <span className="text-xs text-neutral-700">
                    {model.addedAt}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs font-bold border-neutral-200"
              >
                Edit Configuration
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="px-2 border-neutral-200 text-neutral-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}

        <button className="border-2 border-dashed border-neutral-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-neutral-300 hover:bg-neutral-50/50 transition-all min-h-[280px] group">
          <div className="p-3 bg-neutral-50 rounded-full group-hover:bg-white transition-colors">
            <Plus
              size={24}
              className="text-neutral-400 group-hover:text-neutral-900"
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-neutral-900">
              Create Custom Model
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Connect a new LLM provider
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
