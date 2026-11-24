import React from "react";
import { ChevronDown, ChevronRight, X, Calendar, Search } from "lucide-react";
import { useLanguage } from "@/shared/hooks";

export interface TemplateFilterState {
    search: string;
    evaluationType: string;
    createDate: string;
    modifyDate: string;
    publishDate: string;
    user: string;
    group: string;
    folder: string;
    permission: string;
    instantInspection: boolean;
}

interface TemplateFilterPanelProps {
    isOpen: boolean;
    onToggle: () => void;
    filters: TemplateFilterState;
    onChange: (filters: TemplateFilterState) => void;
    onApply: () => void;
    onReset: () => void;
}

export const TemplateFilterPanel: React.FC<TemplateFilterPanelProps> = ({
    isOpen,
    onToggle,
    filters,
    onChange,
    onApply,
    onReset,
}) => {
    const { t } = useLanguage("inspection-templates");

    const updateField = (field: keyof TemplateFilterState, value: any) => {
        onChange({ ...filters, [field]: value });
    };

    return (
        <div className="dashboard-card overflow-hidden transition-all">
            {/* Collapsible Header matching Screenshot 1 & 2 */}
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

            {/* Filter Content matching Screenshot 2 */}
            {isOpen && (
                <div className="p-6 pt-2 border-t border-[#F1F5F9] dark:border-dashboard-border flex flex-col gap-5 text-xs animate-in fade-in duration-200">
                    {/* Row 1: Search & Evaluation Types */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search Input */}
                        <div className="relative flex items-center h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background focus-within:border-dashboard-primary transition-colors">
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => updateField("search", e.target.value)}
                                placeholder={t("searchPlaceholder", "Search")}
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

                        {/* Evaluation Types Dropdown */}
                        <div className="relative flex items-center h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background focus-within:border-dashboard-primary transition-colors">
                            <select
                                value={filters.evaluationType}
                                onChange={(e) => updateField("evaluationType", e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground cursor-pointer appearance-none"
                            >
                                <option value="">{t("evaluationTypesPlaceholder", "انواع التقييمات")}</option>
                                <option value="compliance">Compliance And Inspection</option>
                                <option value="quality">Quality And Measurement</option>
                            </select>
                            {filters.evaluationType && (
                                <button
                                    type="button"
                                    onClick={() => updateField("evaluationType", "")}
                                    className="p-1 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Row 2: Date pickers (Create Date, Modify Date, Publish Date) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Create Date */}
                        <div className="relative flex items-center h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background focus-within:border-dashboard-primary transition-colors">
                            <Calendar className="w-4 h-4 text-[#94A3B8] shrink-0 mr-2" />
                            <input
                                type="text"
                                value={filters.createDate}
                                onChange={(e) => updateField("createDate", e.target.value)}
                                placeholder={t("createDatePlaceholder", "Create Date")}
                                className="w-full bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground placeholder:text-[#94A3B8]"
                            />
                            {filters.createDate && (
                                <button
                                    type="button"
                                    onClick={() => updateField("createDate", "")}
                                    className="p-1 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Modify Date */}
                        <div className="relative flex items-center h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background focus-within:border-dashboard-primary transition-colors">
                            <Calendar className="w-4 h-4 text-[#94A3B8] shrink-0 mr-2" />
                            <input
                                type="text"
                                value={filters.modifyDate}
                                onChange={(e) => updateField("modifyDate", e.target.value)}
                                placeholder={t("modifyDatePlaceholder", "Modify Date")}
                                className="w-full bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground placeholder:text-[#94A3B8]"
                            />
                            {filters.modifyDate && (
                                <button
                                    type="button"
                                    onClick={() => updateField("modifyDate", "")}
                                    className="p-1 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Publish Date */}
                        <div className="relative flex items-center h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background focus-within:border-dashboard-primary transition-colors">
                            <Calendar className="w-4 h-4 text-[#94A3B8] shrink-0 mr-2" />
                            <input
                                type="text"
                                value={filters.publishDate}
                                onChange={(e) => updateField("publishDate", e.target.value)}
                                placeholder={t("publishDatePlaceholder", "Publish Date")}
                                className="w-full bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground placeholder:text-[#94A3B8]"
                            />
                            {filters.publishDate && (
                                <button
                                    type="button"
                                    onClick={() => updateField("publishDate", "")}
                                    className="p-1 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Row 3: Select User, Select Group */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Select User */}
                        <div className="relative flex items-center h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background focus-within:border-dashboard-primary transition-colors">
                            <select
                                value={filters.user}
                                onChange={(e) => updateField("user", e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground cursor-pointer appearance-none"
                            >
                                <option value="">{t("selectUserPlaceholder", "اختر المستخدم")}</option>
                                <option value="user-1">عبدالرحمن قاسم</option>
                                <option value="user-2">فراس حافظ</option>
                            </select>
                            {filters.user && (
                                <button
                                    type="button"
                                    onClick={() => updateField("user", "")}
                                    className="p-1 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Select Group */}
                        <div className="relative flex items-center h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background focus-within:border-dashboard-primary transition-colors">
                            <select
                                value={filters.group}
                                onChange={(e) => updateField("group", e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground cursor-pointer appearance-none"
                            >
                                <option value="">{t("selectGroupPlaceholder", "اختر المجموعة")}</option>
                                <option value="group-1">مجموعة التفتيش الميداني</option>
                                <option value="group-2">مجموعة الجودة والسلامة</option>
                            </select>
                            {filters.group && (
                                <button
                                    type="button"
                                    onClick={() => updateField("group", "")}
                                    className="p-1 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Row 4: Select Folder, Permissions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Select Folder */}
                        <div className="relative flex items-center h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background focus-within:border-dashboard-primary transition-colors">
                            <select
                                value={filters.folder}
                                onChange={(e) => updateField("folder", e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground cursor-pointer appearance-none"
                            >
                                <option value="">{t("selectFolderPlaceholder", "اختر المجلد")}</option>
                                <option value="folder-1">بنود الإعاشة</option>
                                <option value="folder-2">بنود المطاعم</option>
                            </select>
                            {filters.folder && (
                                <button
                                    type="button"
                                    onClick={() => updateField("folder", "")}
                                    className="p-1 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Permissions */}
                        <div className="relative flex items-center h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background focus-within:border-dashboard-primary transition-colors">
                            <select
                                value={filters.permission}
                                onChange={(e) => updateField("permission", e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground cursor-pointer appearance-none"
                            >
                                <option value="">{t("permissionsPlaceholder", "Permissions")}</option>
                                <option value="admin">أدمن</option>
                                <option value="inspector">مراقب</option>
                            </select>
                            {filters.permission && (
                                <button
                                    type="button"
                                    onClick={() => updateField("permission", "")}
                                    className="p-1 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filter Footer: Instant Inspection Switch, Save Filter, Apply matching Screenshot 2 */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-[#F1F5F9] dark:border-dashboard-border">
                        {/* Instant Inspection Switch */}
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-medium text-[#64748B] dark:text-dashboard-muted-foreground">
                                {t("instantInspection", "Instant Inspection")}
                            </span>
                            <button
                                type="button"
                                onClick={() =>
                                    updateField("instantInspection", !filters.instantInspection)
                                }
                                className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
                                    filters.instantInspection
                                        ? "bg-[#2563EB]"
                                        : "bg-[#CBD5E1] dark:bg-slate-700"
                                }`}
                                aria-label="Toggle instant inspection"
                            >
                                <div
                                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                        filters.instantInspection ? "translate-x-5" : "translate-x-0"
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2.5">
                            <button
                                type="button"
                                onClick={onReset}
                                className="h-9 px-5 text-xs font-semibold rounded-lg border border-[#2563EB] text-[#2563EB] bg-white dark:bg-dashboard-card hover:bg-[#EFF6FF] transition-colors cursor-pointer"
                            >
                                {t("saveFilter", "Save Filter")}
                            </button>
                            <button
                                type="button"
                                onClick={onApply}
                                className="h-9 px-6 text-xs font-semibold rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-xs"
                            >
                                {t("apply", "Apply")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
