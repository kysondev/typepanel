"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "features/common/components/ui/modal";
import { Button } from "features/common/components/ui/button";
import { Input } from "features/common/components/ui/input";
import { X, Database, Plus } from "lucide-react";
import { updateModel } from "features/admin/actions/model.action";
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (model) {
      setName(model.name);
    }
  }, [model]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setIsLoading(true);
    const res = await updateModel(model.id, { name });
    setIsLoading(false);

    if (res.success) {
      toast.success(res.message);
      onSuccess();
      onClose();
    } else {
      toast.error(res.message);
    }
  };

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
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-neutral-700">
              Display Name
            </label>
            <Input
              placeholder="e.g. My Custom GPT"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-neutral-700 flex items-center gap-2">
                <Database size={16} /> Knowledge Bases
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-xs font-bold text-neutral-600 hover:text-neutral-900"
              >
                <Plus size={14} className="mr-1" /> Attach
              </Button>
            </div>

            <div className="py-8 bg-neutral-50 rounded-xl border border-dashed border-neutral-200 text-center">
              <p className="text-xs text-neutral-400 font-medium">
                No knowledge bases attached
              </p>
            </div>
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
