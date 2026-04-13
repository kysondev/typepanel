"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, FileText, Loader2, ExternalLink } from "lucide-react";
import { Button } from "features/common/components/ui/button";
import { toast } from "react-hot-toast";
import { AddKBModal } from "./add-kb-modal";
import { ConfirmModal } from "@common/components/ui/confirm-modal";
import Link from "next/link";
import {
  deleteKnowledgeBaseHandler,
  getKnowledgeBasesHandler,
} from "features/core/knowledge/knowledge.controller";

export function KnowledgeBase() {
  const [collections, setCollections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [kbToDelete, setKbToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCollections = async () => {
    setIsLoading(true);
    const res = await getKnowledgeBasesHandler();
    if (res.success) {
      setCollections(res.data || []);
    } else {
      toast.error(res.message || "Failed to load collections");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleDelete = async () => {
    if (!kbToDelete) return;
    setIsDeleting(true);
    const res = await deleteKnowledgeBaseHandler(kbToDelete);
    if (res.success) {
      toast.success(res.message);
      setCollections(collections.filter((c) => c.id !== kbToDelete));
    } else {
      toast.error(res.message);
    }
    setIsDeleting(false);
    setKbToDelete(null);
  };

  return (
    <div className="space-y-8">
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
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} className="mr-2" /> Create Collection
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-neutral-400" size={40} />
          <p className="text-neutral-500 text-sm font-medium">
            Loading collections...
          </p>
        </div>
      ) : collections.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-neutral-200 rounded-3xl">
          <FileText className="mx-auto text-neutral-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-neutral-900">
            No collections found
          </h3>
          <p className="text-neutral-500 text-sm mt-1 mb-6">
            You haven't created any knowledge collections yet.
          </p>
          <Button
            size="sm"
            className="bg-[#0A0A0A] text-white px-6"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={16} className="mr-2" /> Create Your First Collection
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {collections.map((coll) => (
              <div
                key={coll.id}
                className="group bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm transition-all"
              >
                {" "}
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
                        {coll.description || "No description provided"}
                      </p>

                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-600">
                          <span className="text-neutral-900 font-bold">
                            {coll.documentCount || 0}
                          </span>
                          <span className="text-neutral-400">chunks</span>
                        </div>
                        <div className="text-[12px] font-medium text-neutral-400">
                          Created{" "}
                          {new Date(coll.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Link href={`/admin/knowledge/${coll.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                        title="View & Edit"
                      >
                        <ExternalLink size={16} />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                      onClick={() => setKbToDelete(coll.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="border-2 border-dashed border-neutral-100 rounded-2xl p-6 flex items-center justify-center gap-3 hover:border-neutral-300 hover:bg-neutral-50/50 transition-all group"
            >
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
      )}

      <AddKBModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchCollections}
      />

      <ConfirmModal
        isOpen={!!kbToDelete}
        onClose={() => setKbToDelete(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Collection"
        description="Are you sure you want to delete this collection? This action cannot be undone and all documents within will be permanently removed."
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
