import React from "react";
import { ChevronDown, ChevronRight, X, Search } from "lucide-react";
import { useLanguage } from "@/shared/hooks";
import type { ProcedureFilterState } from "../types";

interface ProcedureFilterPanelProps {
    isOpen: boolean;
    onToggle: () => void;
    filters: ProcedureFilterState;
    onChange: (filters: ProcedureFilterState) => void;
    onApply: () => void;
    onReset: () => void;
}

export const ProcedureFilterPanel: React.FC<ProcedureFilterPanelProps> = ({
    isOpen,
    onToggle,
    filters,
    onChange,
    onApply,
    onReset,
}) => {
    const { t } = useLanguage("procedures");

    const updateField = (field: keyof ProcedureFilterState, value: string) => {
        onChange({ ...filters, [field]: value });
    };

    return (
        <div className="dashboard-card overflow-hidden transition-all select-none">
            {/* Collapsible Header matching Screenshot 1 */}
            <button
                type="button"
                onClick={onToggle}
                className="w-full p-4 px-6 flex items-center justify-between text-xs font-semibold text-[#0F172A] dark:text-dashboard-foreground hover:bg-dashboard-secondary/30 transition-colors cursor-pointer"
            >
                <div className="flex items-center gap-2">
                    {isOpen ? (
                        <ChevronDown className="w-4 h-4 text-[#2563EB]" />
                    ) : (
                        <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
                    )}
                    <span>{t("filter", "Filter")}</span>
                </div>
            </button>

            {/* Filter Content */}
            {isOpen && (
                <div className="p-6 pt-2 border-t border-[#F1F5F9] dark:border-dashboard-border flex flex-col gap-4 text-xs animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {/* Search Task Title */}
                        <div className="relative flex items-center h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background focus-within:border-dashboard-primary transition-colors">
                            <Search className="w-4 h-4 text-[#94A3B8] shrink-0 mr-2" />
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => updateField("search", e.target.value)}
                                placeholder={t("searchPlaceholder", "Search tasks...")}
                                className="w-full bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground placeholder:text-[#94A3B8]"
                            />
                            {filters.search && (
                                <button
                                    type="button"
                                    onClick={() => updateField("search", "")}
                                    className="p-1 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Entity / Company Dropdown */}
                        <div className="relative flex items-center h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background focus-within:border-dashboard-primary transition-colors">
                            <select
                                value={filters.company}
                                onChange={(e) => updateField("company", e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground cursor-pointer appearance-none"
                            >
                                <option value="">{t("allCompanies", "All Companies / Entities")}</option>
                                <option value="شركة سامي سليمان سندي">شركة سامي سليمان سندي</option>
                                <option value="سيلفش - Sellfish">سيلفش - Sellfish</option>
                                <option value="مصنع حلويات حبيب الفاخرة">مصنع حلويات حبيب الفاخرة</option>
                                <option value="شركة طيبات المدينة">شركة طيبات المدينة</option>
                            </select>
                            {filters.company && (
                                <button
                                    type="button"
                                    onClick={() => updateField("company", "")}
                                    className="p-1 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Status Dropdown */}
                        <div className="relative flex items-center h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background focus-within:border-dashboard-primary transition-colors">
                            <select
                                value={filters.status}
                                onChange={(e) => updateField("status", e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground cursor-pointer appearance-none"
                            >
                                <option value="all">{t("allStatuses", "All Statuses")}</option>
                                <option value="completed">Completed</option>
                                <option value="in progress">In Progress</option>
                                <option value="pending">Pending</option>
                            </select>
                            {filters.status !== "all" && filters.status && (
                                <button
                                    type="button"
                                    onClick={() => updateField("status", "all")}
                                    className="p-1 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Priority Dropdown */}
                        <div className="relative flex items-center h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background focus-within:border-dashboard-primary transition-colors">
                            <select
                                value={filters.priority}
                                onChange={(e) => updateField("priority", e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground cursor-pointer appearance-none"
                            >
                                <option value="all">{t("allPriorities", "All Priorities")}</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                            {filters.priority !== "all" && filters.priority && (
                                <button
                                    type="button"
                                    onClick={() => updateField("priority", "all")}
                                    className="p-1 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Bottom Buttons */}
                    <div className="flex items-center justify-end gap-2.5 pt-2">
                        <button
                            type="button"
                            onClick={onReset}
                            className="h-9 px-4 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-card text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                        >
                            {t("reset", "Reset")}
                        </button>
                        <button
                            type="button"
                            onClick={onApply}
                            className="h-9 px-5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-semibold text-white transition-colors cursor-pointer shadow-xs"
                        >
                            {t("apply", "Apply")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
