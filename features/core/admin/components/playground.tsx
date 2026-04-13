"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "features/common/components/ui/button";
import { Send, Loader2, RotateCcw } from "lucide-react";
import { getModelsHandler } from "features/core/model/model.controller";
import { testModel } from "features/core/admin/playground.controller";
import { toast } from "react-hot-toast";

export function Playground() {
  const [models, setModels] = useState<any[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingModels, setIsFetchingModels] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchModels = async () => {
      const res = await getModelsHandler();
      if (res.success && res.data) {
        setModels(res.data);
        if (res.data.length > 0) {
          setSelectedModelId(res.data[0].id);
        }
      }
      setIsFetchingModels(false);
    };
    fetchModels();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !selectedModelId || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    const newMessages = [
      ...messages,
      { role: "user" as const, content: userMessage },
    ];
    setMessages(newMessages);

    setIsLoading(true);
    const res = await testModel(selectedModelId, userMessage, messages);
    setIsLoading(false);

    if (res.success && res.data) {
      setMessages([
        ...newMessages,
        { role: "assistant" as const, content: res.data },
      ]);
    } else {
      toast.error(res.message || "Failed to get response");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm flex flex-col h-[600px]">
      <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/30">
        <h3 className="text-sm font-bold text-neutral-900">Model Playground</h3>

        <div className="flex items-center gap-2">
          {isFetchingModels ? (
            <Loader2 size={14} className="animate-spin text-neutral-400" />
          ) : (
            <select
              className="text-xs font-bold bg-white border border-neutral-200 rounded-md px-2 py-1 focus:outline-none"
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={() => setMessages([])}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors"
            title="Clear"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-neutral-400 text-xs font-medium">
            Select a model to start testing
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className="space-y-1.5 max-w-3xl mx-auto">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                {m.role === "assistant" ? "Assistant" : "Admin"}
              </p>
              <div className="text-sm text-neutral-800 leading-relaxed whitespace-pre-wrap">
                {m.content}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="space-y-1.5 max-w-3xl mx-auto animate-pulse">
            <p className="text-[10px] font-bold text-neutral-300 uppercase tracking-wider">
              Assistant
            </p>
            <div className="h-4 bg-neutral-50 rounded w-1/2" />
          </div>
        )}
      </div>

      <div className="p-5 border-t border-neutral-100">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto flex gap-3">
          <textarea
            rows={1}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isLoading || !selectedModelId}
            className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-all resize-none"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim() || !selectedModelId}
            size="icon"
            className="bg-neutral-900 text-white shrink-0 h-9 w-9 rounded-lg"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
