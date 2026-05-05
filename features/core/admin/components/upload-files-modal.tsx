"use client";

import React, { useState, useRef } from "react";
import { Modal } from "features/common/components/ui/modal";
import { Button } from "features/common/components/ui/button";
import { X, Upload, FileText, Trash2, AlertCircle } from "lucide-react";
import { uploadFilesToKnowledgeBaseHandler } from "features/core/knowledge/knowledge.controller";
import { toast } from "react-hot-toast";

interface UploadFilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  kbId: string;
  onSuccess: () => void;
}

export function UploadFilesModal({
  isOpen,
  onClose,
  kbId,
  onSuccess,
}: UploadFilesModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newFiles = filesArray.filter(
        (file) => file.name.endsWith(".txt") || file.type === "text/plain",
      );

      if (newFiles.length !== filesArray.length) {
        toast.error("Only .txt files are supported currently.");
      }

      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one .txt file");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    const res = await uploadFilesToKnowledgeBaseHandler(kbId, formData);
    setIsLoading(false);

    if (res.success) {
      toast.success(res.message);
      onSuccess();
      onClose();
      setSelectedFiles([]);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-100 rounded-lg text-neutral-900">
              <Upload size={20} />
            </div>
            <h2 className="text-xl font-bold text-neutral-900">
              Upload Documents
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-neutral-200 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-neutral-900/20 hover:bg-neutral-50 transition-all group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept=".txt"
              className="hidden"
            />
            <div className="p-4 bg-neutral-100 rounded-2xl text-neutral-400 group-hover:bg-neutral-900 group-hover:text-white transition-all mb-4">
              <Upload size={24} />
            </div>
            <p className="text-sm font-bold text-neutral-900">
              Click to browse or drag and drop
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Currently supporting .txt files
            </p>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">
                Selected Files ({selectedFiles.length})
              </p>
              <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {selectedFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-100 group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-1.5 bg-white rounded-lg text-neutral-400 border border-neutral-100">
                        <FileText size={14} />
                      </div>
                      <p className="text-xs font-bold text-neutral-700 truncate">
                        {file.name}
                      </p>
                      <span className="text-[10px] text-neutral-400 font-medium">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
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
              disabled={selectedFiles.length === 0}
            >
              Upload {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
