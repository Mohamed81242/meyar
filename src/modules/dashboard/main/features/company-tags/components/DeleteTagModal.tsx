import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/design-system/components/dialog";
import { useDeleteCompanyTag } from "../api";
import type { CompanyTag } from "../types";
import { toast } from "sonner";
import { useLanguage } from "@/shared/hooks";

interface DeleteTagModalProps {
    isOpen: boolean;
    onClose: () => void;
    tag: CompanyTag | null;
}

export const DeleteTagModal: React.FC<DeleteTagModalProps> = ({
    isOpen,
    onClose,
    tag,
}) => {
    const { t } = useLanguage("company-tags");
    const deleteMutation = useDeleteCompanyTag();

    if (!tag) return null;

    const handleDelete = () => {
        deleteMutation.mutate(tag.id, {
            onSuccess: () => {
                toast.success(t("tagDeleted", "Tag deleted successfully"));
                onClose();
            },
            onError: () => {
                toast.error(t("failedToDelete", "Failed to delete tag"));
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-white dark:bg-dashboard-card p-6 rounded-2xl border border-dashboard-border shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold text-[#0F172A] dark:text-dashboard-foreground">
                        {t("deleteTag", "Delete Tag")}
                    </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-[#64748B] dark:text-dashboard-muted-foreground leading-relaxed">
                        {t(
                            "confirmDelete",
                            "Are you sure you want to delete this tag?"
                        )}{" "}
                        <span className="font-bold text-[#0F172A] dark:text-white">
                            "{tag.name}"
                        </span>
                        . {t("cannotUndo", "This action cannot be undone.")}
                    </p>
                </div>
                <DialogFooter className="flex items-center justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-semibold rounded-lg border border-[#E2E8F0] dark:border-dashboard-border text-[#64748B] hover:bg-dashboard-secondary transition-colors cursor-pointer"
                    >
                        {t("cancel", "Cancel")}
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#DC2626] hover:bg-red-700 text-white transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {deleteMutation.isPending
                            ? t("deleting", "Deleting...")
                            : t("delete", "Delete")}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
