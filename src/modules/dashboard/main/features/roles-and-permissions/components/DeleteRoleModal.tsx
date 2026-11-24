import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/design-system/components/dialog";
import { useDeleteRolesAndPermissions } from "../api";
import type { Role } from "../types";
import { toast } from "sonner";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    role: Role | null;
}

export const DeleteRoleModal: React.FC<Props> = ({ isOpen, onClose, role }) => {
    const deleteMutation = useDeleteRolesAndPermissions();

    const handleDelete = () => {
        if (!role) return;
        deleteMutation.mutate(role.id, {
            onSuccess: () => {
                toast.success("Role deleted successfully");
                onClose();
            },
            onError: () => {
                toast.error("Failed to delete role");
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-white dark:bg-dashboard-card p-6 rounded-2xl border border-dashboard-border shadow-xl select-none">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold text-[#0F172A] dark:text-white">
                        Delete Role
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4 text-xs text-[#64748B]">
                    Are you sure you want to delete the role{" "}
                    <span className="font-bold text-[#0F172A] dark:text-white">
                        "{role?.name}"
                    </span>
                    ? This action cannot be undone.
                </div>

                <DialogFooter className="gap-2 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-50 text-white transition-colors cursor-pointer"
                    >
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
