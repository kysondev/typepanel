"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Upload,
  Type,
  Loader2,
  FileText,
  Trash2,
  Search,
  FileJson,
} from "lucide-react";
import { Button } from "features/common/components/ui/button";
import Link from "next/link";
import {
  getKnowledgeBaseByIdHandler,
  getKnowledgeDocumentsHandler,
  deleteKnowledgeDocument,
} from "features/core/knowledge/knowledge.controller";
import { toast } from "react-hot-toast";
import { AddTextContentModal } from "./add-text-content-modal";
import { UploadFilesModal } from "./upload-files-modal";
import { Input } from "features/common/components/ui/input";
import { ConfirmModal } from "@common/components/ui/confirm-modal";

interface KnowledgeCollectionViewProps {
  id: string;
}

export function KnowledgeCollectionView({ id }: KnowledgeCollectionViewProps) {
  const [collection, setCollection] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDocsLoading, setIsDocsLoading] = useState(true);
  const [isAddTextModalOpen, setIsAddTextModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [docToDelete, setDocToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const res = await getKnowledgeBaseByIdHandler(id);
    if (res.success) {
      setCollection(res.data);
    } else {
      toast.error(res.message || "Failed to load collection");
    }
    setIsLoading(false);
  };

  const fetchDocuments = async () => {
    setIsDocsLoading(true);
    const res = await getKnowledgeDocumentsHandler(id);
    if (res.success) {
      setDocuments(res.data || []);
    } else {
      toast.error(res.message || "Failed to load documents");
    }
    setIsDocsLoading(false);
  };

  useEffect(() => {
    fetchData();
    fetchDocuments();
  }, [id]);

  const handleDeleteDoc = async () => {
    if (!docToDelete) return;
    setIsDeleting(true);
    const res = await deleteKnowledgeDocument(docToDelete);
    if (res.success) {
      toast.success(res.message);
      fetchDocuments();
    } else {
      toast.error(res.message);
    }
    setIsDeleting(false);
    setDocToDelete(null);
  };

  const filteredDocs = documents.filter((doc) =>
    doc.filename.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="animate-spin text-neutral-400" size={40} />
        <p className="text-neutral-500 text-sm font-medium">
          Loading collection...
        </p>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-bold text-neutral-900">
          Collection not found
        </h3>
        <Link href="/admin/knowledge">
          <Button variant="link" className="mt-2">
            Back to Knowledge Base
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
        <div className="flex items-center gap-4">
          <Link href="/admin/knowledge">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 border border-neutral-100 bg-white shadow-sm"
            >
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 leading-tight">
              {collection.name}
            </h1>
            <p className="text-neutral-500 text-sm mt-0.5">
              {collection.description || "No description provided"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="font-bold border-neutral-200 h-10 px-4"
            onClick={() => setIsAddTextModalOpen(true)}
          >
            <Type size={14} className="mr-2" /> Add Text
          </Button>
          <Button
            size="sm"
            className="bg-neutral-900 text-white font-bold h-10 px-4"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <Upload size={14} className="mr-2" /> Upload Files
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            Total Documents
          </p>
          <p className="text-3xl font-bold text-neutral-900 mt-2">
            {documents.length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            Last Updated
          </p>
          <p className="text-xl font-bold text-neutral-900 mt-2">
            {documents.length > 0
              ? new Date(documents[0].createdAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-neutral-900">Documents</h2>
          <div className="relative max-w-xs w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              size={14}
            />
            <Input
              placeholder="Search documents..."
              className="pl-9 h-9 text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isDocsLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-2xl border border-neutral-200">
            <Loader2 className="animate-spin text-neutral-400" size={32} />
            <p className="text-neutral-500 text-xs font-medium">
              Loading documents...
            </p>
          </div>
        ) : documents.length === 0 ? (
          <div className="bg-neutral-50/50 border-2 border-dashed border-neutral-200 rounded-2xl py-20 flex flex-col items-center justify-center text-center px-6">
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-neutral-100 mb-5 text-neutral-300">
              <FileJson size={32} />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">
              Your collection is empty
            </h3>
            <p className="text-neutral-500 text-sm max-w-sm mt-2 mb-8 leading-relaxed">
              Add some text or upload files to start building your knowledge
              base.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                size="sm"
                className="font-bold text-neutral-700 bg-white border-neutral-200 h-10 px-6"
                onClick={() => setIsAddTextModalOpen(true)}
              >
                <Type size={16} className="mr-2" /> Add Text content
              </Button>
              <Button
                size="sm"
                className="bg-neutral-900 text-white font-bold h-10 px-6"
                onClick={() => setIsUploadModalOpen(true)}
              >
                <Upload size={16} className="mr-2" /> Upload Files
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50/50 border-b border-neutral-100">
                    <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      Document
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      Created At
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredDocs.map((doc) => (
                    <tr
                      key={doc.id}
                      className="group hover:bg-neutral-50/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-neutral-100 rounded-lg text-neutral-600 group-hover:bg-neutral-900 group-hover:text-white transition-all">
                            <FileText size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-neutral-900 truncate max-w-[200px] md:max-w-md">
                              {doc.filename}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-neutral-500">
                        {new Date(doc.createdAt).toLocaleDateString()} at{" "}
                        {new Date(doc.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                          onClick={() => setDocToDelete(doc.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredDocs.length === 0 && searchQuery && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-10 text-center text-neutral-500 text-sm"
                      >
                        No documents found matching "{searchQuery}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <AddTextContentModal
        isOpen={isAddTextModalOpen}
        onClose={() => setIsAddTextModalOpen(false)}
        kbId={id}
        onSuccess={fetchDocuments}
      />

      <UploadFilesModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        kbId={id}
        onSuccess={fetchDocuments}
      />

      <ConfirmModal
        isOpen={!!docToDelete}
        onClose={() => setDocToDelete(null)}
        onConfirm={handleDeleteDoc}
        isLoading={isDeleting}
        title="Delete Document"
        description="Are you sure you want to delete this document from your knowledge base? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
