import React from "react";
import { ChevronDown, ChevronRight, X, Calendar } from "lucide-react";
import { useLanguage } from "@/shared/hooks";

export interface TaskFilterState {
    evalScoreCategory: string;
    user: string;
    group: string;
    status: string;
    template: string;
    entity: string;
    scoreMin: number;
    scoreMax: number;
    createDate: string;
    completeDate: string;
    conductDate: string;
    approveDate: string;
    specialName: string;
    entityTags: string;
    startedLate: boolean;
    startedOnTime: boolean;
    startedEarly: boolean;
    endedLate: boolean;
    endedOnTime: boolean;
    endedEarly: boolean;
    archivedTasks: boolean;
    instantOnly: boolean;
}

interface TaskFilterPanelProps {
    isOpen: boolean;
    onToggle: () => void;
    filters: TaskFilterState;
    onChange: (filters: TaskFilterState) => void;
    onApply: () => void;
    onReset: () => void;
}

export const TaskFilterPanel: React.FC<TaskFilterPanelProps> = ({
    isOpen,
    onToggle,
    filters,
    onChange,
    onApply,
    onReset,
}) => {
    const { t } = useLanguage("inspection-tasks");

    const updateField = (field: keyof TaskFilterState, value: any) => {
        onChange({ ...filters, [field]: value });
    };

    return (
        <div className="dashboard-card overflow-hidden transition-all select-none">
            {/* Collapsible Header */}
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

            {/* Filter Content matching Screenshot 1 */}
            {isOpen && (
                <div className="p-6 pt-2 border-t border-[#F1F5F9] dark:border-dashboard-border flex flex-col gap-4 text-xs animate-in fade-in duration-200">
                    {/* Row 1: درجة التقييم, اختر المستخدم, اختر المجموعة */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* درجة التقييم */}
                        <div className="relative flex items-center h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background focus-within:border-dashboard-primary transition-colors">
                            <select
                                value={filters.evalScoreCategory}
                                onChange={(e) => updateField("evalScoreCategory", e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground cursor-pointer appearance-none"
                            >
                                <option value="">{t("evalScoreCategory", "درجة التقييم")}</option>
                                <option value="high">مرتفع (85% فأكثر)</option>
                                <option value="medium">متوسط (70% - 84%)</option>
                                <option value="low">منخفض (أقل من 70%)</option>
                            </select>
                            {filters.evalScoreCategory && (
                                <button
                                    type="button"
                                    onClick={() => updateField("evalScoreCategory", "")}
                                    className="p-1 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* اختر المستخدم */}
                        <div className="relative flex items-center h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background focus-within:border-dashboard-primary transition-colors">
                            <select
                                value={filters.user}
                                onChange={(e) => updateField("user", e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground cursor-pointer appearance-none"
                            >
                                <option value="">{t("selectUser", "اختر المستخدم")}</option>
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

                        {/* اختر المجموعة */}
                        <div className="relative flex items-center h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background focus-within:border-dashboard-primary transition-colors">
                            <select
                                value={filters.group}
                                onChange={(e) => updateField("group", e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground cursor-pointer appearance-none"
                            >
                                <option value="">{t("selectGroup", "اختر المجموعة")}</option>
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

                    {/* Row 2: الحالة, قالب التقييم, الجهات, %درجة التقييم: (0 - 100) */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                        {/* الحالة */}
                        <div className="relative flex items-center h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background focus-within:border-dashboard-primary transition-colors">
                            <select
                                value={filters.status}
                                onChange={(e) => updateField("status", e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground cursor-pointer appearance-none"
                            >
                                <option value="">{t("status", "الحالة")}</option>
                                <option value="completed">Completed</option>
                                <option value="in_progress">In Progress</option>
                                <option value="pending">Pending</option>
                            </select>
                            {filters.status && (
                                <button
                                    type="button"
                                    onClick={() => updateField("status", "")}
                                    className="p-1 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* قالب التقييم */}
                        <div className="relative flex items-center h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background focus-within:border-dashboard-primary transition-colors">
                            <select
                                value={filters.template}
                                onChange={(e) => updateField("template", e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground cursor-pointer appearance-none"
                            >
                                <option value="">{t("evalTemplate", "قالب التقييم")}</option>
                                <option value="template-1">بنود تفتيش المطاعم</option>
                                <option value="template-2">بنود تفتيش سلامة الغذاء للمصانع</option>
                                <option value="template-3">بنود تفتيش الإعاشة</option>
                            </select>
                            {filters.template && (
                                <button
                                    type="button"
                                    onClick={() => updateField("template", "")}
                                    className="p-1 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* الجهات */}
                        <div className="relative flex items-center h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background focus-within:border-dashboard-primary transition-colors">
                            <select
                                value={filters.entity}
                                onChange={(e) => updateField("entity", e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground cursor-pointer appearance-none"
                            >
                                <option value="">{t("entities", "الجهات")}</option>
                                <option value="ent-1">سيلفش - Sellfish</option>
                                <option value="ent-2">مصنع حلويات دبيب الفاخرة</option>
                                <option value="ent-3">شركة طيبات المدينة</option>
                            </select>
                            {filters.entity && (
                                <button
                                    type="button"
                                    onClick={() => updateField("entity", "")}
                                    className="p-1 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* %درجة التقييم: (0 - 100) Slider matching Screenshot 1 */}
                        <div className="flex flex-col gap-1 px-1">
                            <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                                <span className="font-semibold">%درجة التقييم: (0 - 100)</span>
                                <span className="font-bold text-[#2563EB]">{filters.scoreMin}% - {filters.scoreMax}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={filters.scoreMax}
                                onChange={(e) => updateField("scoreMax", Number(e.target.value))}
                                className="w-full h-1.5 bg-[#CBD5E1] rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
                            />
                        </div>
                    </div>

                    {/* Row 3: Create Date, Complete Date, Conduct Date, Approve Date */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="relative flex items-center h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background focus-within:border-dashboard-primary transition-colors">
                            <Calendar className="w-4 h-4 text-[#94A3B8] shrink-0 mr-2" />
                            <input
                                type="text"
                                value={filters.createDate}
                                onChange={(e) => updateField("createDate", e.target.value)}
                                placeholder="Create Date"
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

                        <div className="relative flex items-center h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background focus-within:border-dashboard-primary transition-colors">
                            <Calendar className="w-4 h-4 text-[#94A3B8] shrink-0 mr-2" />
                            <input
                                type="text"
                                value={filters.completeDate}
                                onChange={(e) => updateField("completeDate", e.target.value)}
                                placeholder="Complete Date"
                                className="w-full bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground placeholder:text-[#94A3B8]"
                            />
                            {filters.completeDate && (
                                <button
                                    type="button"
                                    onClick={() => updateField("completeDate", "")}
                                    className="p-1 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        <div className="relative flex items-center h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background focus-within:border-dashboard-primary transition-colors">
                            <Calendar className="w-4 h-4 text-[#94A3B8] shrink-0 mr-2" />
                            <input
                                type="text"
                                value={filters.conductDate}
                                onChange={(e) => updateField("conductDate", e.target.value)}
                                placeholder="Conduct Date"
                                className="w-full bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground placeholder:text-[#94A3B8]"
                            />
                            {filters.conductDate && (
                                <button
                                    type="button"
                                    onClick={() => updateField("conductDate", "")}
                                    className="p-1 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        <div className="relative flex items-center h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background focus-within:border-dashboard-primary transition-colors">
                            <Calendar className="w-4 h-4 text-[#94A3B8] shrink-0 mr-2" />
                            <input
                                type="text"
                                value={filters.approveDate}
                                onChange={(e) => updateField("approveDate", e.target.value)}
                                placeholder="Approve Date"
                                className="w-full bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground placeholder:text-[#94A3B8]"
                            />
                            {filters.approveDate && (
                                <button
                                    type="button"
                                    onClick={() => updateField("approveDate", "")}
                                    className="p-1 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Row 4: Special Name, وسوم الجهات */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="relative flex items-center h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background focus-within:border-dashboard-primary transition-colors">
                            <input
                                type="text"
                                value={filters.specialName}
                                onChange={(e) => updateField("specialName", e.target.value)}
                                placeholder="Special Name"
                                className="w-full bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground placeholder:text-[#94A3B8]"
                            />
                            {filters.specialName && (
                                <button
                                    type="button"
                                    onClick={() => updateField("specialName", "")}
                                    className="p-1 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        <div className="relative flex items-center h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background focus-within:border-dashboard-primary transition-colors">
                            <select
                                value={filters.entityTags}
                                onChange={(e) => updateField("entityTags", e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground cursor-pointer appearance-none"
                            >
                                <option value="">وسوم الجهات</option>
                                <option value="vip">VIP</option>
                                <option value="main">فرع رئيسي</option>
                            </select>
                            {filters.entityTags && (
                                <button
                                    type="button"
                                    onClick={() => updateField("entityTags", "")}
                                    className="p-1 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Row 5: Switches for التنفيذ (Started Late, Started On Time, Started Early) */}
                    <div className="flex items-center gap-6 flex-wrap pt-1">
                        <span className="font-bold text-[#0F172A] dark:text-dashboard-foreground">التنفيذ:</span>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <span className="text-[#64748B]">Started Late</span>
                            <input
                                type="checkbox"
                                checked={filters.startedLate}
                                onChange={(e) => updateField("startedLate", e.target.checked)}
                                className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] cursor-pointer"
                            />
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <span className="text-[#64748B]">Started On Time</span>
                            <input
                                type="checkbox"
                                checked={filters.startedOnTime}
                                onChange={(e) => updateField("startedOnTime", e.target.checked)}
                                className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] cursor-pointer"
                            />
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <span className="text-[#64748B]">Started Early</span>
                            <input
                                type="checkbox"
                                checked={filters.startedEarly}
                                onChange={(e) => updateField("startedEarly", e.target.checked)}
                                className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] cursor-pointer"
                            />
                        </label>
                    </div>

                    {/* Row 6: Switches for الإكتمال (Ended Late, Ended On Time, Ended Early) */}
                    <div className="flex items-center gap-6 flex-wrap">
                        <span className="font-bold text-[#0F172A] dark:text-dashboard-foreground">الإكتمال:</span>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <span className="text-[#64748B]">Ended Late</span>
                            <input
                                type="checkbox"
                                checked={filters.endedLate}
                                onChange={(e) => updateField("endedLate", e.target.checked)}
                                className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] cursor-pointer"
                            />
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <span className="text-[#64748B]">Ended On Time</span>
                            <input
                                type="checkbox"
                                checked={filters.endedOnTime}
                                onChange={(e) => updateField("endedOnTime", e.target.checked)}
                                className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] cursor-pointer"
                            />
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <span className="text-[#64748B]">Ended Early</span>
                            <input
                                type="checkbox"
                                checked={filters.endedEarly}
                                onChange={(e) => updateField("endedEarly", e.target.checked)}
                                className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] cursor-pointer"
                            />
                        </label>
                    </div>

                    {/* Row 7: Other Toggles & Bottom Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-[#F1F5F9] dark:border-dashboard-border">
                        <div className="flex items-center gap-6 flex-wrap">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <span className="font-medium text-[#64748B]">المهام المؤرشفة</span>
                                <input
                                    type="checkbox"
                                    checked={filters.archivedTasks}
                                    onChange={(e) => updateField("archivedTasks", e.target.checked)}
                                    className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] cursor-pointer"
                                />
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <span className="font-medium text-[#64748B]">عرض المهام اللحظية فقط</span>
                                <input
                                    type="checkbox"
                                    checked={filters.instantOnly}
                                    onChange={(e) => updateField("instantOnly", e.target.checked)}
                                    className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] cursor-pointer"
                                />
                            </label>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <button
                                type="button"
                                onClick={onReset}
                                className="h-9 px-5 text-xs font-semibold rounded-lg border border-[#2563EB] text-[#2563EB] bg-white dark:bg-dashboard-card hover:bg-[#EFF6FF] transition-colors cursor-pointer"
                            >
                                Save Filter
                            </button>
                            <button
                                type="button"
                                onClick={onApply}
                                className="h-9 px-6 text-xs font-semibold rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-xs"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
