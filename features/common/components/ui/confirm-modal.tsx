"use client";

import { useEffect, useRef } from "react";
import { Button } from "./button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  isLoading = false,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden text-left"
      >
        <div className="p-6">
          <h3 className="text-lg font-bold text-neutral-900">{title}</h3>
          <p className="mt-2 text-sm text-neutral-500">{description}</p>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-neutral-50/50 border-t border-neutral-100">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg h-9"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={onConfirm}
            loading={isLoading}
            className="rounded-lg h-9"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
