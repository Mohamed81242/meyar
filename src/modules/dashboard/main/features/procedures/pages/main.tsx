import React, { useState } from "react";
import { useLanguage } from "@/shared/hooks";
import { useDebounce } from "@/shared/observability";
import {
    ChevronRight,
    MoreVertical,
    CheckCircle2,
    ChevronUp,
    ChevronDown,
    Settings,
    Edit2,
    Trash2,
} from "lucide-react";
import { useProceduressList } from "../api";
import {
    ProcedureFilterPanel,
    ProcedureModal,
    DeleteProcedureModal,
} from "../components";
import type { Procedure, ProcedureFilterState, ProcedurePriority } from "../types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/design-system/components/dropdown-menu";

const DEFAULT_FILTERS: ProcedureFilterState = {
    search: "",
    company: "",
    status: "all",
    priority: "all",
};

export default function ProceduresPage() {
    const { t } = useLanguage("procedures");

    // Filter states
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<ProcedureFilterState>(DEFAULT_FILTERS);
    const debouncedSearch = useDebounce(filters.search, 300);

    // Selected rows state
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Modals state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProcedure, setEditingProcedure] = useState<Procedure | null>(null);
    const [deletingProcedure, setDeletingProcedure] = useState<Procedure | null>(null);

    // Query Data
    const { data, isLoading } = useProceduressList({
        search: debouncedSearch || undefined,
        status: filters.status !== "all" ? filters.status : undefined,
    });

    const items: Procedure[] = (data as any)?.items || [];
    const totalItems: number = (data as any)?.total ?? items.length;

    // Checkbox selection
    const isAllSelected = items.length > 0 && selectedIds.length === items.length;
    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(items.map((i) => i.id));
        }
    };

    const handleSelectRow = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleOpenEdit = (procedure: Procedure) => {
        setEditingProcedure(procedure);
        setIsModalOpen(true);
    };

    const renderPriorityBadge = (priority: ProcedurePriority) => {
        if (priority === "High") {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FEE2E2] dark:bg-red-950/40 text-[#EF4444] text-xs font-bold shadow-2xs">
                    <ChevronUp className="w-3.5 h-3.5 stroke-3" />
                    <span>High</span>
                </span>
            );
        }
        if (priority === "Low") {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EEF2FF] dark:bg-indigo-950/40 text-[#4F46E5] text-xs font-bold shadow-2xs">
                    <ChevronDown className="w-3.5 h-3.5 stroke-3" />
                    <span>Low</span>
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FEF3C7] dark:bg-amber-950/40 text-[#D97706] text-xs font-bold shadow-2xs">
                <span>Medium</span>
            </span>
        );
    };

    return (
        <div className="space-y-4 pb-12 select-none text-[#1E293B]">
            {/* Breadcrumb Navigation matching Screenshot 1 */}
            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <span>{t("home", "Home")}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span className="text-[#334155] font-semibold">
                    {t("title", "Procedures")}
                </span>
            </div>

            {/* Page Title matching Screenshot 1 */}
            <div>
                <h1 className="text-2xl font-bold text-[#0F172A] dark:text-dashboard-foreground tracking-tight">
                    {t("title", "Procedures")}
                </h1>
            </div>

            {/* Collapsible Filter Panel matching Screenshot 1 */}
            <ProcedureFilterPanel
                isOpen={isFilterOpen}
                onToggle={() => setIsFilterOpen(!isFilterOpen)}
                filters={filters}
                onChange={setFilters}
                onApply={() => {}}
                onReset={() => setFilters(DEFAULT_FILTERS)}
            />

            {/* Action Bar & Total Items Toolbar matching Screenshot 1 */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                {/* Left: Total Items */}
                <div className="text-xs font-semibold text-[#64748B] dark:text-dashboard-muted-foreground">
                    {t("totalItems", "Total Items:")}{" "}
                    <span className="font-bold text-[#0F172A] dark:text-dashboard-foreground">
                        {totalItems}
                    </span>
                </div>

                {/* Right: قائمة الترتيب Button matching Screenshot 1 */}
                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={() => {}}
                        className="h-9 px-3.5 text-xs font-semibold rounded-lg border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-card text-[#334155] dark:text-dashboard-foreground hover:bg-[#F8FAFC] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                        <Settings className="w-4 h-4 text-[#64748B]" />
                        <span>{t("orderList", "قائمة الترتيب")}</span>
                    </button>
                </div>
            </div>

            {/* Table Card matching Screenshot 1 */}
            <div className="dashboard-card overflow-hidden flex flex-col">
                <div className="overflow-x-auto hide-scrollbar">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="border-b border-[#F1F5F9] dark:border-dashboard-border text-[#64748B] dark:text-dashboard-muted-foreground text-xs uppercase font-semibold">
                                <th className="py-3.5 px-4 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                                        aria-label="Select all procedures"
                                    />
                                </th>
                                <th className="py-3.5 px-6 font-bold tracking-wider text-start">
                                    {t("columns.tasks", "TASKS")}
                                </th>
                                <th className="py-3.5 px-6 font-bold tracking-wider text-start">
                                    {t("columns.status", "STATUS")}
                                </th>
                                <th className="py-3.5 px-6 font-bold tracking-wider text-start">
                                    {t("columns.priority", "PRIORITY")}
                                </th>
                                <th className="py-3.5 px-6 font-bold tracking-wider text-end">
                                    {t("columns.action", "ACTION")}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1F5F9] dark:divide-dashboard-border">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-dashboard-primary" />
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center text-[#94A3B8]">
                                        {t("noProcedures", "No procedures found")}
                                    </td>
                                </tr>
                            ) : (
                                items.map((procedure) => {
                                    const isSelected = selectedIds.includes(procedure.id);

                                    return (
                                        <tr
                                            key={procedure.id}
                                            className={`hover:bg-[#F8FAFC] dark:hover:bg-dashboard-secondary/40 transition-colors ${
                                                isSelected ? "bg-[#EFF6FF]/40 dark:bg-dashboard-secondary" : ""
                                            }`}
                                        >
                                            {/* Checkbox */}
                                            <td className="py-4 px-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleSelectRow(procedure.id)}
                                                    className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                                                    aria-label={`Select ${procedure.taskTitle}`}
                                                />
                                            </td>

                                            {/* Column: TASKS */}
                                            <td className="py-4 px-6 text-start">
                                                <div className="flex flex-col gap-1 max-w-lg">
                                                    <span className="font-bold text-sm text-[#0F172A] dark:text-dashboard-foreground">
                                                        {procedure.taskTitle}
                                                    </span>
                                                    <span className="text-xs text-[#64748B] dark:text-dashboard-muted-foreground">
                                                        {procedure.companyName}
                                                    </span>
                                                    <div className="text-[11px] text-[#94A3B8] flex flex-col gap-0.5 pt-0.5">
                                                        <span>Creation Date: {procedure.createdAt}</span>
                                                        <span>Modify Date: {procedure.modifiedAt}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Column: STATUS with Delay Subtitle */}
                                            <td className="py-4 px-6 text-start">
                                                <div className="flex flex-col gap-1">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCFCE7] dark:bg-emerald-950/40 text-[#16A34A] text-xs font-semibold w-fit border border-[#BBF7D0] dark:border-emerald-800/40 shadow-2xs">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        <span>{procedure.status}</span>
                                                    </span>
                                                    {procedure.delayDays > 0 && (
                                                        <span className="text-xs font-medium text-[#EF4444]">
                                                            {procedure.delayDays} متأخر Day
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Column: PRIORITY */}
                                            <td className="py-4 px-6 text-start">
                                                {renderPriorityBadge(procedure.priority)}
                                            </td>

                                            {/* Column: ACTION */}
                                            <td className="py-4 px-6 text-end">
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            className="w-7 h-7 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] dark:hover:bg-dashboard-secondary transition-colors flex items-center justify-center cursor-pointer outline-none"
                                                            aria-label="Actions"
                                                        >
                                                            <MoreVertical className="w-4 h-4" />
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="w-32 bg-white dark:bg-dashboard-card shadow-lg border border-[#E2E8F0] dark:border-dashboard-border rounded-xl p-1 text-xs z-50"
                                                        >
                                                            <DropdownMenuItem
                                                                onClick={() => handleOpenEdit(procedure)}
                                                                className="flex items-center gap-2 px-3 py-2 text-[#334155] dark:text-dashboard-foreground hover:bg-[#F1F5F9] dark:hover:bg-dashboard-secondary rounded-lg cursor-pointer transition-colors"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5 text-[#64748B]" />
                                                                <span>{t("actions.edit", "Edit")}</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => setDeletingProcedure(procedure)}
                                                                className="flex items-center gap-2 px-3 py-2 text-[#DC2626] hover:bg-[#FEF2F2] dark:hover:bg-red-950/20 rounded-lg cursor-pointer transition-colors"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5 text-[#DC2626]" />
                                                                <span>{t("actions.delete", "Delete")}</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create / Edit Procedure Modal */}
            <ProcedureModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                procedure={editingProcedure}
            />

            {/* Delete Confirmation Modal */}
            <DeleteProcedureModal
                isOpen={Boolean(deletingProcedure)}
                onClose={() => setDeletingProcedure(null)}
                procedure={deletingProcedure}
            />
        </div>
    );
}
