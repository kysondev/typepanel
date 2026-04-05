"use client";

import React, { useEffect, useState } from "react";
import { Cpu, Plus, MoreVertical, Trash2, Loader2 } from "lucide-react";
import { Button } from "features/common/components/ui/button";
import { getModels, deleteModel } from "features/admin/actions/model.action";
import { toast } from "react-hot-toast";
import { ConfirmModal } from "@common/components/ui/confirm-modal";
import { AddModelModal } from "./add-model-modal";
import { EditModelModal } from "./edit-model-modal";

export default function ModelsTab() {
  const [models, setModels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<string | null>(null);
  const [modelToEdit, setModelToEdit] = useState<any | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchModels = async () => {
    setIsLoading(true);
    const res = await getModels();
    if (res.success) {
      setModels(res.data || []);
    } else {
      toast.error(res.message || "Failed to load models");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleDelete = async () => {
    if (!modelToDelete) return;
    setIsDeleting(true);
    const res = await deleteModel(modelToDelete);
    if (res.success) {
      toast.success(res.message);
      setModels(models.filter((m) => m.id !== modelToDelete));
    } else {
      toast.error(res.message);
    }
    setIsDeleting(false);
    setModelToDelete(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Models</h1>
          <p className="text-neutral-500 text-sm">
            Configure and manage the AI models available for your chatbots.
          </p>
        </div>
        <Button 
          size="sm" 
          className="bg-[#0A0A0A] text-white px-4"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} className="mr-2" /> Add New Model
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-neutral-400" size={40} />
          <p className="text-neutral-500 text-sm font-medium">Loading models...</p>
        </div>
      ) : models.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-neutral-200 rounded-3xl">
          <Cpu className="mx-auto text-neutral-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-neutral-900">No models found</h3>
          <p className="text-neutral-500 text-sm mt-1 mb-6">
            You haven't added any AI models yet.
          </p>
          <Button 
            size="sm" 
            className="bg-[#0A0A0A] text-white px-6"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={16} className="mr-2" /> Add Your First Model
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <div
              key={model.id}
              className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between hover:border-neutral-300 transition-colors"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-neutral-50 rounded-lg">
                    <Cpu size={20} className="text-neutral-600" />
                  </div>
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
                      {model.model}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs text-neutral-500 font-medium">
                      Added On
                    </span>
                    <span className="text-xs text-neutral-700">
                      {new Date(model.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setModelToEdit(model);
                    setIsEditModalOpen(true);
                  }}
                  className="flex-1 text-xs font-bold border-neutral-200"
                >
                  Edit Configuration
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setModelToDelete(model.id)}
                  className="px-2 border-neutral-200 text-neutral-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="border-2 border-dashed border-neutral-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-neutral-300 hover:bg-neutral-50/50 transition-all min-h-[280px] group"
          >
            <div className="p-3 bg-neutral-50 rounded-full group-hover:bg-white transition-colors">
              <Plus
                size={24}
                className="text-neutral-400 group-hover:text-neutral-900"
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-neutral-900">
                Connect New Model
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Connect your preferred AI provider
              </p>
            </div>
          </button>
        </div>
      )}

      <AddModelModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={fetchModels}
      />

      <EditModelModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setModelToEdit(null);
        }}
        onSuccess={fetchModels}
        model={modelToEdit}
      />

      <ConfirmModal
        isOpen={!!modelToDelete}
        onClose={() => setModelToDelete(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Model"
        description="Are you sure you want to delete this model? Chatbots using this model will stop working."
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
