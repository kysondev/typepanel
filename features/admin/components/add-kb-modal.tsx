"use client";

import React, { useState } from "react";
import { Modal } from "features/common/components/ui/modal";
import { Button } from "features/common/components/ui/button";
import { Input } from "features/common/components/ui/input";
import { X } from "lucide-react";
import { createKnowledgeBase } from "features/admin/actions/knowledge.action";
import { toast } from "react-hot-toast";

interface AddKBModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddKBModal({
  isOpen,
  onClose,
  onSuccess,
}: AddKBModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Please enter a name for the collection");
      return;
    }

    setIsLoading(true);
    const res = await createKnowledgeBase({ name, description });
    setIsLoading(false);

    if (res.success) {
      toast.success(res.message);
      onSuccess();
      onClose();
      setName("");
      setDescription("");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-900">Create New Collection</h2>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-neutral-700">
              Collection Name
            </label>
            <Input
              placeholder="e.g. Project Documentation"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-neutral-700">
              Description
            </label>
            <textarea
              className="w-full min-h-[100px] rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition resize-none"
              placeholder="What kind of knowledge is in this collection?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-4">
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
              Create Collection
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
