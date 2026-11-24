import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/design-system/components/dialog";
import { useDeleteCompanyTags } from "../api";
import type { CompanyTags } from "../types";
import { toast } from "sonner";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    item: CompanyTags | null;
}

export const DeleteCompanyTagsModal: React.FC<Props> = ({ isOpen, onClose, item }) => {
    const deleteMutation = useDeleteCompanyTags();

    const handleConfirm = () => {
        if (!item) return;

        deleteMutation.mutate(item.id, {
            onSuccess: () => {
                toast.success("Deleted successfully");
                onClose();
            },
            onError: () => {
                toast.error("Failed to delete");
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-sm bg-white dark:bg-dashboard-card p-6 rounded-2xl border border-dashboard-border shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold text-dashboard-foreground">
                        Confirm Deletion
                    </DialogTitle>
                    <DialogDescription className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Are you sure you want to delete <strong className="text-dashboard-foreground">{item?.name}</strong>? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-semibold rounded-xl border border-gray-200 dark:border-dashboard-border text-gray-600 dark:text-gray-300 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={deleteMutation.isPending}
                        className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
