"use client";

import { useState } from "react";
import { Modal } from "@common/components/ui/modal";
import { Button } from "./button";
import { Input } from "./input";
import { updateUser } from "features/core/admin/admin.controller";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export function EditUserModal({ isOpen, onClose, user }: EditUserModalProps) {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await updateUser(user.id, { name, email });

    if (res.success) {
      toast.success(res.message);
      router.refresh();
      onClose();
    } else {
      toast.error(res.message);
    }
    setIsLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <form onSubmit={handleSubmit}>
        <div className="p-6">
          <h3 className="text-lg font-bold text-neutral-900">Manage User</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Update user information. Admins cannot edit other admins.
          </p>

          <div className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="text-sm font-medium text-neutral-700"
              >
                Full Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-neutral-700"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-neutral-50/50 border-t border-neutral-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg h-9"
          >
            Cancel
          </Button>
          <Button type="submit" loading={isLoading} className="rounded-lg h-9">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
