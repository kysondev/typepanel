"use client";

import { Modal } from "./modal";
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
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
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
    </Modal>
  );
}
