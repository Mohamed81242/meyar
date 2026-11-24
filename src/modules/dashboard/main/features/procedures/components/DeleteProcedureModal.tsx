import React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useLanguage } from "@/shared/hooks";
import { useDeleteProcedures } from "../api";
import type { Procedure } from "../types";
import { toast } from "sonner";

interface DeleteProcedureModalProps {
    isOpen: boolean;
    onClose: () => void;
    procedure: Procedure | null;
}

export const DeleteProcedureModal: React.FC<DeleteProcedureModalProps> = ({
    isOpen,
    onClose,
    procedure,
}) => {
    const { t } = useLanguage("procedures");
    const { mutateAsync: deleteProcedure, isPending } = useDeleteProcedures();

    if (!isOpen || !procedure) return null;

    const handleDelete = async () => {
        try {
            await deleteProcedure(procedure.id);
            toast.success(t("deletedSuccess", "Procedure deleted successfully"));
            onClose();
        } catch {
            toast.error(t("actionFailed", "An error occurred"));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none animate-in fade-in duration-200">
            <div className="bg-white dark:bg-dashboard-card rounded-2xl shadow-xl w-full max-w-md border border-[#E2E8F0] dark:border-dashboard-border overflow-hidden p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-6 h-6" />
                </div>

                <h3 className="font-bold text-base text-[#0F172A] dark:text-dashboard-foreground mb-2">
                    {t("deleteConfirmTitle", "Delete Procedure")}
                </h3>

                <p className="text-xs text-[#64748B] dark:text-dashboard-muted-foreground mb-6 leading-relaxed">
                    {t(
                        "deleteConfirmDesc",
                        "Are you sure you want to delete this procedure? This action cannot be undone."
                    )}
                </p>

                <div className="bg-[#F8FAFC] dark:bg-dashboard-background p-3 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border text-xs text-start mb-6">
                    <div className="font-bold text-[#0F172A] dark:text-dashboard-foreground mb-0.5 line-clamp-2">
                        {procedure.taskTitle}
                    </div>
                    <div className="text-[11px] text-[#64748B] dark:text-dashboard-muted-foreground">
                        {procedure.companyName}
                    </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        className="h-9 px-4 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-card text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    >
                        {t("cancel", "Cancel")}
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isPending}
                        className="h-9 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-semibold text-white transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5 disabled:opacity-50"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{isPending ? t("deleting", "Deleting...") : t("delete", "Delete")}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
