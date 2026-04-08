"use client";

import React, { useState } from "react";
import { Modal } from "features/common/components/ui/modal";
import { Button } from "features/common/components/ui/button";
import { Input } from "features/common/components/ui/input";
import { X, Type } from "lucide-react";
import { addTextToKnowledgeBase } from "features/admin/actions/knowledge.action";
import { toast } from "react-hot-toast";

interface AddTextContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  kbId: string;
  onSuccess: () => void;
}

export function AddTextContentModal({
  isOpen,
  onClose,
  kbId,
  onSuccess,
}: AddTextContentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Please enter a title for this content");
      return;
    }
    if (!content) {
      toast.error("Please enter some knowledge content");
      return;
    }

    setIsLoading(true);
    const res = await addTextToKnowledgeBase(kbId, title, content);
    setIsLoading(false);

    if (res.success) {
      toast.success(res.message);
      onSuccess();
      onClose();
      setTitle("");
      setContent("");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-100 rounded-lg text-neutral-900">
              <Type size={20} />
            </div>
            <h2 className="text-xl font-bold text-neutral-900">
              Add Text Knowledge
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-neutral-700">
              Content Title
            </label>
            <Input
              placeholder="e.g. Return Policy, Company Overview"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-neutral-700">
              Knowledge Content
            </label>
            <textarea
              className="w-full min-h-[300px] rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition resize-none leading-relaxed"
              placeholder="Paste or type your knowledge content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 font-bold h-11"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-neutral-900 text-white font-bold h-11"
              loading={isLoading}
            >
              Add to Collection
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
