import React, { useState } from "react";
import { useLanguage } from "@/shared/hooks";
import { useDebounce } from "@/shared/observability";
import {
    ChevronRight,
    MoreVertical,
    Trash2,
    Settings,
    Shield,
    Flag,
    Check,
    FileText,
} from "lucide-react";
import { useInspectionTasksList } from "../api";
import {
    TaskFilterPanel,
    TaskReportModal,
    DeleteTaskModal,
    type TaskFilterState,
} from "../components";
import type { InspectionTask } from "../types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/design-system/components/dropdown-menu";

const DEFAULT_FILTERS: TaskFilterState = {
    evalScoreCategory: "",
    user: "",
    group: "",
    status: "",
    template: "",
    entity: "",
    scoreMin: 0,
    scoreMax: 100,
    createDate: "",
    completeDate: "",
    conductDate: "",
    approveDate: "",
    specialName: "",
    entityTags: "",
    startedLate: false,
    startedOnTime: false,
    startedEarly: false,
    endedLate: false,
    endedOnTime: false,
    endedEarly: false,
    archivedTasks: false,
    instantOnly: false,
};

export default function InspectionTasksPage() {
    const { t } = useLanguage("inspection-tasks");

    // Filter states
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<TaskFilterState>(DEFAULT_FILTERS);
    const debouncedSearch = useDebounce(filters.specialName, 300);

    // Pagination
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);

    // Selected rows state
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Modals state
    const [selectedTaskForReport, setSelectedTaskForReport] = useState<InspectionTask | null>(null);
    const [deletingTask, setDeletingTask] = useState<InspectionTask | null>(null);

    // Query Data
    const { data, isLoading } = useInspectionTasksList({
        page,
        perPage,
        search: debouncedSearch || undefined,
        status: filters.status || undefined,
    });

    const items: InspectionTask[] = (data as any)?.items || [];
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

    return (
        <div className="space-y-4 pb-12 select-none text-[#1E293B]">
            {/* Breadcrumb Navigation matching Screenshot 1 */}
            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <span>{t("home", "Home")}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span className="text-[#334155] font-semibold">
                    {t("title", "Inspection Tasks")}
                </span>
            </div>

            {/* Page Title matching Screenshot 1 */}
            <div>
                <h1 className="text-2xl font-bold text-[#0F172A] dark:text-dashboard-foreground tracking-tight">
                    {t("title", "Inspection Tasks")}
                </h1>
            </div>

            {/* Collapsible Filter Panel matching Screenshot 1 */}
            <TaskFilterPanel
                isOpen={isFilterOpen}
                onToggle={() => setIsFilterOpen(!isFilterOpen)}
                filters={filters}
                onChange={setFilters}
                onApply={() => setPage(1)}
                onReset={() => {
                    setFilters(DEFAULT_FILTERS);
                    setPage(1);
                }}
            />

            {/* Action Bar & Total Items Toolbar matching Screenshot 2 */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                {/* Left: Total Items */}
                <div className="text-xs font-semibold text-[#64748B] dark:text-dashboard-muted-foreground">
                    {t("totalItems", "Total Items:")}{" "}
                    <span className="font-bold text-[#0F172A] dark:text-dashboard-foreground">
                        {totalItems}
                    </span>
                </div>

                {/* Right: قائمة الترتيب Button matching Screenshot 2 */}
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

            {/* Table Card matching Screenshot 2 & 3 */}
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
                                        aria-label="Select all tasks"
                                    />
                                </th>
                                <th className="py-3.5 px-6 font-bold tracking-wider text-start">
                                    {t("columns.tasks", "TASKS")}
                                </th>
                                <th className="py-3.5 px-6 font-bold tracking-wider text-start">
                                    {t("columns.status", "STATUS")}
                                </th>
                                <th className="py-3.5 px-6 font-bold tracking-wider text-start">
                                    {t("columns.score", "SCORE")}
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
                                        {t("noTasks", "No inspection tasks found")}
                                    </td>
                                </tr>
                            ) : (
                                items.map((task) => {
                                    const isSelected = selectedIds.includes(task.id);

                                    return (
                                        <tr
                                            key={task.id}
                                            className={`hover:bg-[#F8FAFC] dark:hover:bg-dashboard-secondary/40 transition-colors ${
                                                isSelected ? "bg-[#EFF6FF]/40 dark:bg-dashboard-secondary" : ""
                                            }`}
                                        >
                                            <td className="py-4 px-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleSelectRow(task.id)}
                                                    className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                                                    aria-label={`Select ${task.entityName}`}
                                                />
                                            </td>

                                            {/* Column: TASKS matching Screenshot 2 */}
                                            <td className="py-4 px-6 text-start">
                                                <div className="flex items-start gap-3">
                                                    {/* Shield icon */}
                                                    <div className="w-9 h-11 rounded-lg overflow-hidden shrink-0 border border-[#E2E8F0] dark:border-dashboard-border flex items-center justify-center bg-[#F8FAFC] dark:bg-dashboard-background shadow-2xs">
                                                        <Shield className="w-5 h-5 text-[#EAB308]" />
                                                    </div>

                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-bold text-sm text-[#0F172A] dark:text-dashboard-foreground">
                                                            {task.entityName}
                                                        </span>
                                                        <span className="text-xs text-[#64748B] dark:text-dashboard-muted-foreground">
                                                            {task.templateName}
                                                        </span>
                                                        <div className="text-[11px] text-[#94A3B8] flex flex-col gap-0.5 pt-0.5">
                                                            <span>Last Update: {task.lastUpdate}</span>
                                                            <span>Start Date: {task.startDate}</span>
                                                        </div>
                                                        {/* Flagged items pill badge matching Screenshot 2 */}
                                                        {task.flaggedItemsCount > 0 && (
                                                            <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFEDD5] text-[#EA580C] text-[10px] font-bold w-fit">
                                                                <Flag className="w-3 h-3 fill-[#EA580C]" />
                                                                <span>{task.flaggedItemsCount} Item Flagged</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Column: STATUS matching Screenshot 2 */}
                                            <td className="py-4 px-6 text-start">
                                                <div className="flex flex-col gap-1.5">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981] text-white text-xs font-semibold w-fit shadow-2xs">
                                                        <Check className="w-3.5 h-3.5 stroke-3" />
                                                        <span>{t("completed", "Completed")}</span>
                                                    </span>
                                                    {task.completeDate && (
                                                        <span className="text-[11px] text-[#64748B] dark:text-dashboard-muted-foreground">
                                                            Complete Date: {task.completeDate}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Column: SCORE matching Screenshot 2 & 3 */}
                                            <td className="py-4 px-6 text-start">
                                                <div className="flex flex-col gap-2 min-w-[140px]">
                                                    {(task.scores || [{ label: "النتيجة النهائية", score: task.score }]).map(
                                                        (sc, idx) => (
                                                            <div key={idx} className="flex flex-col gap-0.5">
                                                                <div className="flex items-center gap-1.5 text-xs font-bold text-[#334155] dark:text-dashboard-foreground">
                                                                    <span>{sc.score.toFixed(2)}%</span>
                                                                    <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                                                                </div>
                                                                <div className="text-[10px] text-[#94A3B8]">{sc.label}</div>
                                                                <div className="w-32 h-1.5 rounded-full bg-[#F1F5F9] dark:bg-slate-700 overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-[#EF4444] rounded-full"
                                                                        style={{ width: `${Math.min(sc.score, 100)}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </td>

                                            {/* Column: ACTION matching Screenshot 2 & 3 */}
                                            <td className="py-4 px-6 text-end">
                                                <div className="flex items-center justify-end gap-3">
                                                    {/* Show Report button matching Screenshot 2 */}
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedTaskForReport(task)}
                                                        className="text-[#10B981] hover:text-emerald-700 font-semibold text-xs inline-flex items-center gap-1.5 hover:underline cursor-pointer transition-colors"
                                                    >
                                                        <FileText className="w-3.5 h-3.5" />
                                                        <span>{t("showReport", "Show Report")}</span>
                                                    </button>

                                                    {/* 3 Vertical dots */}
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            className="w-7 h-7 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] dark:hover:bg-dashboard-secondary transition-colors flex items-center justify-center cursor-pointer outline-none"
                                                            aria-label="Actions"
                                                        >
                                                            <MoreVertical className="w-4 h-4" />
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="w-36 bg-white dark:bg-dashboard-card shadow-lg border border-[#E2E8F0] dark:border-dashboard-border rounded-xl p-1 text-xs z-50"
                                                        >
                                                            <DropdownMenuItem
                                                                onClick={() => setSelectedTaskForReport(task)}
                                                                className="flex items-center gap-2 px-3 py-2 text-[#334155] dark:text-dashboard-foreground hover:bg-[#F1F5F9] dark:hover:bg-dashboard-secondary rounded-lg cursor-pointer transition-colors"
                                                            >
                                                                <FileText className="w-3.5 h-3.5 text-[#10B981]" />
                                                                <span>{t("viewReport", "View Report")}</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => setDeletingTask(task)}
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

            {/* Task Report Modal */}
            <TaskReportModal
                isOpen={Boolean(selectedTaskForReport)}
                onClose={() => setSelectedTaskForReport(null)}
                task={selectedTaskForReport}
            />

            {/* Delete Confirmation Modal */}
            <DeleteTaskModal
                isOpen={Boolean(deletingTask)}
                onClose={() => setDeletingTask(null)}
                task={deletingTask}
            />
        </div>
    );
}
