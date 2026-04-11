"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "features/common/components/ui/modal";
import { Button } from "features/common/components/ui/button";
import { Input } from "features/common/components/ui/input";
import { X } from "lucide-react";
import { createModel } from "features/admin/actions/model.action";
import { toast } from "react-hot-toast";

interface AddModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddModelModal({
  isOpen,
  onClose,
  onSuccess,
}: AddModelModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    model: "gpt-4o-mini",
    provider: "gpt",
    apiKeyEnc: "",
  });

  useEffect(() => {
    const model =
      formData.provider === "gpt" ? "gpt-4o-mini" : "gemini-2.5-pro";
    setFormData((prev) => ({ ...prev, model }));
  }, [formData.provider]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.model ||
      !formData.provider ||
      !formData.apiKeyEnc
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    const res = await createModel(formData);
    setIsLoading(false);

    if (res.success) {
      toast.success(res.message);
      onSuccess();
      onClose();
      setFormData({
        name: "",
        model: "gpt-4o-mini",
        provider: "gpt",
        apiKeyEnc: "",
      });
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-900">Add New Model</h2>
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
              Display Name
            </label>
            <Input
              placeholder="e.g. My Custom GPT"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-neutral-700">
              Provider
            </label>
            <select
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition"
              value={formData.provider}
              onChange={(e) =>
                setFormData({ ...formData, provider: e.target.value })
              }
            >
              <option value="gpt">GPT (OpenAI)</option>
              <option value="gemini">Gemini (Google)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-neutral-700">
              API Key
            </label>
            <Input
              type="password"
              placeholder="Enter your API key"
              value={formData.apiKeyEnc}
              onChange={(e) =>
                setFormData({ ...formData, apiKeyEnc: e.target.value })
              }
              required
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
              Create Model
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
