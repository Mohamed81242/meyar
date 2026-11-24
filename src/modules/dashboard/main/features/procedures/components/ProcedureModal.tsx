import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/shared/hooks";
import { useCreateProcedures, useUpdateProcedures } from "../api";
import type { Procedure, ProcedurePriority, ProcedureStatus } from "../types";
import { toast } from "sonner";

interface ProcedureModalProps {
    isOpen: boolean;
    onClose: () => void;
    procedure?: Procedure | null;
}

export const ProcedureModal: React.FC<ProcedureModalProps> = ({
    isOpen,
    onClose,
    procedure,
}) => {
    const { t } = useLanguage("procedures");
    const { mutateAsync: createProcedure, isPending: isCreating } = useCreateProcedures();
    const { mutateAsync: updateProcedure, isPending: isUpdating } = useUpdateProcedures();

    const [taskTitle, setTaskTitle] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [priority, setPriority] = useState<ProcedurePriority>("Medium");
    const [status, setStatus] = useState<ProcedureStatus>("Completed");
    const [delayDays, setDelayDays] = useState(0);

    const isEdit = Boolean(procedure);
    const isLoading = isCreating || isUpdating;

    useEffect(() => {
        if (procedure) {
            setTaskTitle(procedure.taskTitle);
            setCompanyName(procedure.companyName);
            setPriority(procedure.priority);
            setStatus(procedure.status);
            setDelayDays(procedure.delayDays);
        } else {
            setTaskTitle("");
            setCompanyName("شركة سامي سليمان سندي");
            setPriority("Medium");
            setStatus("Completed");
            setDelayDays(0);
        }
    }, [procedure, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!taskTitle.trim() || !companyName.trim()) {
            toast.error(t("fillRequired", "Please fill in all required fields"));
            return;
        }

        try {
            if (isEdit && procedure) {
                await updateProcedure({
                    id: procedure.id,
                    data: {
                        taskTitle,
                        companyName,
                        priority,
                        status,
                        delayDays,
                    },
                });
                toast.success(t("updatedSuccess", "Procedure updated successfully"));
            } else {
                await createProcedure({
                    taskTitle,
                    companyName,
                    priority,
                    status,
                    delayDays,
                });
                toast.success(t("createdSuccess", "Procedure created successfully"));
            }
            onClose();
        } catch {
            toast.error(t("actionFailed", "An error occurred"));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none animate-in fade-in duration-200">
            <div className="bg-white dark:bg-dashboard-card rounded-2xl shadow-xl w-full max-w-lg border border-[#E2E8F0] dark:border-dashboard-border overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-[#F1F5F9] dark:border-dashboard-border flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#0F172A] dark:text-dashboard-foreground">
                        {isEdit ? t("editProcedure", "Edit Procedure") : t("addProcedure", "Add New Procedure")}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] dark:hover:bg-dashboard-secondary transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
                    {/* Task Title */}
                    <div className="space-y-1.5">
                        <label className="font-semibold text-[#334155] dark:text-dashboard-foreground">
                            {t("taskTitleLabel", "Task Description / Procedure")} <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            rows={3}
                            placeholder={t("taskTitlePlaceholder", "e.g. يجب فصل غرف تحضير الدواجن عن الاسماك")}
                            className="w-full p-3 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background text-xs text-[#0F172A] dark:text-dashboard-foreground outline-none focus:border-dashboard-primary transition-colors"
                            required
                        />
                    </div>

                    {/* Company / Entity */}
                    <div className="space-y-1.5">
                        <label className="font-semibold text-[#334155] dark:text-dashboard-foreground">
                            {t("companyLabel", "Company / Entity")} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder={t("companyPlaceholder", "e.g. شركة سامي سليمان سندي")}
                            className="w-full h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background text-xs text-[#0F172A] dark:text-dashboard-foreground outline-none focus:border-dashboard-primary transition-colors"
                            required
                        />
                    </div>

                    {/* Priority & Status Row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="font-semibold text-[#334155] dark:text-dashboard-foreground">
                                {t("priorityLabel", "Priority")}
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as ProcedurePriority)}
                                className="w-full h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background text-xs text-[#0F172A] dark:text-dashboard-foreground outline-none cursor-pointer"
                            >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="font-semibold text-[#334155] dark:text-dashboard-foreground">
                                {t("statusLabel", "Status")}
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as ProcedureStatus)}
                                className="w-full h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background text-xs text-[#0F172A] dark:text-dashboard-foreground outline-none cursor-pointer"
                            >
                                <option value="Completed">Completed</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </div>
                    </div>

                    {/* Delay Days */}
                    <div className="space-y-1.5">
                        <label className="font-semibold text-[#334155] dark:text-dashboard-foreground">
                            {t("delayDaysLabel", "Delay Days")}
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={delayDays}
                            onChange={(e) => setDelayDays(Number(e.target.value))}
                            className="w-full h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background text-xs text-[#0F172A] dark:text-dashboard-foreground outline-none focus:border-dashboard-primary transition-colors"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#F1F5F9] dark:border-dashboard-border">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-9 px-4 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-card text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                        >
                            {t("cancel", "Cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="h-9 px-5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-semibold text-white transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                        >
                            {isLoading ? t("saving", "Saving...") : isEdit ? t("save", "Save Changes") : t("add", "Add Procedure")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
