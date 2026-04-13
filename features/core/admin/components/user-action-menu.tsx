"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Settings, ArrowUp, ArrowDown } from "lucide-react";
import { promoteUser, demoteUser } from "features/core/admin/admin.controller";
import { toast } from "react-hot-toast";
import { ConfirmModal } from "features/common/components/ui/confirm-modal";
import { EditUserModal } from "features/common/components/ui/edit-user-modal";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

export default function UserActionMenu({
  user,
  currentUser,
}: {
  user: User;
  currentUser: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [showDemoteModal, setShowDemoteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isTargetAdmin = user.role === "admin";
  const isSelf = currentUser?.id === user.id;

  const router = useRouter();

  const isDisabled = isTargetAdmin && !isSelf;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePromote = async () => {
    setIsLoading(true);
    const res = await promoteUser(user.id);
    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setIsLoading(false);
    setShowPromoteModal(false);
    setIsOpen(false);
  };

  const handleDemote = async () => {
    setIsLoading(true);
    const res = await demoteUser(user.id);
    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setIsLoading(false);
    setShowDemoteModal(false);
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative inline-block text-left" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-neutral-400 hover:text-[#0A0A0A] transition-colors p-1 rounded-md hover:bg-neutral-100"
        >
          <MoreVertical size={18} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-neutral-200 shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
            <div className="py-1">
              <button
                onClick={() => {
                  setShowEditModal(true);
                  setIsOpen(false);
                }}
                disabled={isDisabled || isLoading}
                className={`flex w-full items-center px-4 py-2 text-sm transition-colors ${
                  isDisabled
                    ? "text-neutral-300 cursor-not-allowed"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                <Settings className="mr-3" size={16} />
                Manage
              </button>

              <button
                onClick={() => setShowPromoteModal(true)}
                disabled={isDisabled || isLoading || user.role === "admin"}
                className={`flex w-full items-center px-4 py-2 text-sm transition-colors ${
                  isDisabled || user.role === "admin"
                    ? "text-neutral-300 cursor-not-allowed"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                <ArrowUp className="mr-3" size={16} />
                Promote
              </button>

              <button
                onClick={() => setShowDemoteModal(true)}
                disabled={
                  isDisabled || isLoading || user.role === "user" || isSelf
                }
                className={`flex w-full items-center px-4 py-2 text-sm transition-colors ${
                  isDisabled || user.role === "user" || isSelf
                    ? "text-neutral-300 cursor-not-allowed"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                <ArrowDown className="mr-3" size={16} />
                Demote
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showPromoteModal}
        onClose={() => setShowPromoteModal(false)}
        onConfirm={handlePromote}
        title="Promote to Admin"
        description={`Are you sure you want to promote ${user.name || user.email} to an administrator? They will have full access to all system settings.`}
        confirmText="Promote"
        isLoading={isLoading}
      />

      <ConfirmModal
        isOpen={showDemoteModal}
        onClose={() => setShowDemoteModal(false)}
        onConfirm={handleDemote}
        title="Demote to User"
        description={`Are you sure you want to demote ${user.name || user.email} to a regular user? They will lose all administrator privileges.`}
        confirmText="Demote"
        variant="destructive"
        isLoading={isLoading}
      />

      {showEditModal && (
        <EditUserModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          user={user}
        />
      )}
    </>
  );
}
