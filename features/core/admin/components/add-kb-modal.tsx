"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "features/common/components/ui/modal";
import { Button } from "features/common/components/ui/button";
import { Input } from "features/common/components/ui/input";
import { X, Cpu } from "lucide-react";
import { createKnowledgeBaseHandler } from "features/core/knowledge/knowledge.controller";
import { getModelsHandler } from "features/core/model/model.controller";
import { toast } from "react-hot-toast";

interface AddKBModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddKBModal({ isOpen, onClose, onSuccess }: AddKBModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("");

  useEffect(() => {
    const fetchModels = async () => {
      const res = await getModelsHandler();
      if (res.success) {
        setModels(res.data || []);
        if (res.data && res.data.length > 0) {
          setSelectedModelId(res.data[0].id);
        }
      }
    };
    if (isOpen) {
      fetchModels();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Please enter a name for the collection");
      return;
    }
    if (!selectedModelId) {
      toast.error("Please select a model for embeddings");
      return;
    }

    setIsLoading(true);
    const res = await createKnowledgeBaseHandler({
      name,
      description,
      chatbotId: selectedModelId,
    });
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
          <h2 className="text-xl font-bold text-neutral-900">
            Create New Collection
          </h2>
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
              className="w-full min-h-[80px] rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition resize-none"
              placeholder="What kind of knowledge is in this collection?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-neutral-700 flex items-center gap-2">
              <Cpu size={14} /> Attach to Chatbot
            </label>
            <select
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition"
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a chatbot
              </option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.provider.toUpperCase()})
                </option>
              ))}
            </select>
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
              disabled={models.length === 0}
            >
              Create Collection
            </Button>
          </div>
          {models.length === 0 && (
            <p className="text-center text-xs text-red-500 font-medium">
              You need to create a Chatbot in the Models tab first to get an API
              key.
            </p>
          )}
        </form>
      </div>
    </Modal>
  );
}
