"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "features/common/components/ui/modal";
import { Button } from "features/common/components/ui/button";
import { Input } from "features/common/components/ui/input";
import { X, Database } from "lucide-react";
import { updateModelHandler } from "features/core/model/model.controller";
import { toast } from "react-hot-toast";

interface EditModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  model: any;
}

export function EditModelModal({
  isOpen,
  onClose,
  onSuccess,
  model,
}: EditModelModalProps) {
  const [name, setName] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [tone, setTone] = useState("professional");
  const [temperature, setTemperature] = useState(0.7);
  const [contextLength, setContextLength] = useState(4096);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (model) {
      setName(model.name);
      setSystemPrompt(model.systemPrompt || "");
      setTone(model.tone || "professional");
      setTemperature(model.temperature ?? 0.7);
      setContextLength(model.contextLength ?? 4096);
    }
  }, [model]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setIsLoading(true);
    const res = await updateModelHandler(model.id, {
      name,
      systemPrompt,
      tone,
      temperature,
      contextLength,
    });
    setIsLoading(false);

    if (res.success) {
      toast.success(res.message);
      onSuccess();
      onClose();
    } else {
      toast.error(res.message);
    }
  };

  const tones = [
    { value: "professional", label: "Professional" },
    { value: "friendly", label: "Friendly" },
    { value: "playful", label: "Playful" },
    { value: "concise", label: "Concise" },
    { value: "creative", label: "Creative" },
    { value: "supportive", label: "Supportive" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-900">
            Edit Configuration
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-neutral-700">
                Display Name
              </label>
              <Input
                placeholder="e.g. My Custom AI Model"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-neutral-700">Tone</label>
              <select
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                {tones.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-neutral-700 flex justify-between items-center">
                Temperature
                <span className="text-xs font-mono text-neutral-400">
                  {temperature}
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                className="w-full h-2 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-neutral-900"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-neutral-700">
                Context Length
              </label>
              <Input
                type="number"
                placeholder="e.g. 4096"
                value={contextLength}
                onChange={(e) => setContextLength(parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-neutral-700">
              System Prompt
            </label>
            <textarea
              className="w-full min-h-[120px] rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition resize-none"
              placeholder="Define how the AI should behave..."
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-neutral-700 flex items-center gap-2">
                <Database size={16} /> Knowledge Bases
              </label>
            </div>

            {model?.knowledgeBases && model.knowledgeBases.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {model.knowledgeBases.map((kb: any) => (
                  <div
                    key={kb.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-neutral-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-white rounded-lg border border-neutral-100">
                        <Database size={14} className="text-neutral-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neutral-900">
                          {kb.name}
                        </p>
                        {kb.description && (
                          <p className="text-xs text-neutral-500 line-clamp-1">
                            {kb.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 bg-neutral-50 rounded-xl border border-dashed border-neutral-200 text-center">
                <p className="text-xs text-neutral-400 font-medium">
                  No knowledge bases attached
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-neutral-100">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-neutral-900 text-white"
              loading={isLoading}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
