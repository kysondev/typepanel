"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Upload, Type, Loader2, Database } from "lucide-react";
import { Button } from "features/common/components/ui/button";
import Link from "next/link";
import { getKnowledgeBaseById } from "features/admin/actions/knowledge.action";
import { toast } from "react-hot-toast";

interface KnowledgeCollectionViewProps {
  id: string;
}

export function KnowledgeCollectionView({ id }: KnowledgeCollectionViewProps) {
  const [collection, setCollection] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      setIsLoading(true);
      const res = await getKnowledgeBaseById(id);
      if (res.success) {
        setCollection(res.data);
      } else {
        toast.error(res.message || "Failed to load collection");
      }
      setIsLoading(false);
    };

    fetchCollection();
  }, [id]);

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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
        <div className="flex items-center gap-4">
          <Link href="/admin/knowledge">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 border border-neutral-100 bg-white"
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
            className="font-bold border-neutral-200"
          >
            <Type size={14} className="mr-2" /> Add Text
          </Button>
          <Button size="sm" className="bg-neutral-900 text-white font-bold">
            <Upload size={14} className="mr-2" /> Upload Files
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            Total Documents
          </p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">0</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            Total Size
          </p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">0 KB</p>
        </div>
      </div>

      <div className="bg-neutral-50/50 border-2 border-dashed border-neutral-200 rounded-2xl py-16 flex flex-col items-center justify-center text-center px-6">
        <div className="p-4 bg-white rounded-2xl shadow-sm border border-neutral-100 mb-5">
          <Database size={32} className="text-neutral-300" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900">
          Your collection is empty
        </h3>
        <p className="text-neutral-500 text-sm max-w-sm mt-2 mb-8 leading-relaxed">
          Add some text or upload files to start building your knowledge base.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            size="sm"
            className="font-bold text-neutral-700 bg-white border-neutral-200"
          >
            <Type size={16} className="mr-2" /> Add Text content
          </Button>
          <Button size="sm" className="bg-neutral-900 text-white font-bold">
            <Upload size={16} className="mr-2" /> Upload Files
          </Button>
        </div>
      </div>
    </div>
  );
}
