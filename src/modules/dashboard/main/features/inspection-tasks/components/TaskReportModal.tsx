import React from "react";
import { X, FileText, CheckCircle2, AlertTriangle, Calendar, Building, Printer, Download } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/design-system/components/dialog";
import type { InspectionTask } from "../types";
import { useLanguage } from "@/shared/hooks";
import { toast } from "sonner";

interface TaskReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: InspectionTask | null;
}

export const TaskReportModal: React.FC<TaskReportModalProps> = ({
    isOpen,
    onClose,
    task,
}) => {
    const { t } = useLanguage("inspection-tasks");

    if (!task) return null;

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        toast.success(t("reportDownloaded", "Report downloaded successfully"));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl bg-white dark:bg-dashboard-card p-0 rounded-3xl border border-dashboard-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 px-6 border-b border-[#F1F5F9] dark:border-dashboard-border shrink-0">
                    <div className="flex items-center gap-2.5">
                        <FileText className="w-5 h-5 text-[#10B981]" />
                        <DialogTitle className="text-sm font-bold text-[#0F172A] dark:text-dashboard-foreground">
                            {t("inspectionReport", "تقرير التفتيش")} — {task.entityName}
                        </DialogTitle>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-dashboard-secondary transition-colors cursor-pointer"
                            title="Print"
                        >
                            <Printer className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={handleDownload}
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-dashboard-secondary transition-colors cursor-pointer"
                            title="Download PDF"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-[#94A3B8] hover:text-[#0F172A] p-1.5 rounded-lg hover:bg-dashboard-secondary transition-colors cursor-pointer"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Report Content */}
                <div className="p-6 overflow-y-auto flex flex-col gap-6 text-xs">
                    {/* Top Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-dashboard-background border border-[#E2E8F0] dark:border-dashboard-border flex flex-col gap-1">
                            <span className="text-[11px] text-[#64748B]">الجهة الخاضعة للتفتيش</span>
                            <span className="text-sm font-bold text-[#0F172A] dark:text-dashboard-foreground flex items-center gap-1.5">
                                <Building className="w-4 h-4 text-[#2563EB]" />
                                {task.entityName}
                            </span>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-dashboard-background border border-[#E2E8F0] dark:border-dashboard-border flex flex-col gap-1">
                            <span className="text-[11px] text-[#64748B]">قالب التقييم المعتمد</span>
                            <span className="text-sm font-bold text-[#0F172A] dark:text-dashboard-foreground">
                                {task.templateName}
                            </span>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#F0FDF4] dark:bg-emerald-950/20 border border-[#BBF7D0] dark:border-emerald-900/40 flex flex-col gap-1">
                            <span className="text-[11px] text-[#16A34A]">درجة الامتثال الكلية</span>
                            <span className="text-lg font-extrabold text-[#15803D]">
                                {task.score.toFixed(2)}%
                            </span>
                        </div>
                    </div>

                    {/* Timeline & Metadata */}
                    <div className="p-4 rounded-2xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-card flex flex-col gap-3">
                        <h4 className="font-bold text-xs text-[#0F172A] dark:text-dashboard-foreground flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-[#64748B]" />
                            <span>سجل التوقيت والتنفيذ</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#64748B]">
                            <div>
                                <span className="block text-[11px] text-[#94A3B8]">تاريخ البدء:</span>
                                <span className="font-semibold text-[#334155] dark:text-dashboard-foreground">{task.startDate}</span>
                            </div>
                            <div>
                                <span className="block text-[11px] text-[#94A3B8]">تاريخ الإكمال:</span>
                                <span className="font-semibold text-[#334155] dark:text-dashboard-foreground">{task.completeDate || "--"}</span>
                            </div>
                            <div>
                                <span className="block text-[11px] text-[#94A3B8]">آخر تحديث:</span>
                                <span className="font-semibold text-[#334155] dark:text-dashboard-foreground">{task.lastUpdate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Scores & Flagged Items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Scores Breakdown */}
                        <div className="p-4 rounded-2xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-card flex flex-col gap-3">
                            <h4 className="font-bold text-xs text-[#0F172A] dark:text-dashboard-foreground flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                                <span>تفصيل الدرجات الفرعية</span>
                            </h4>
                            <div className="flex flex-col gap-2.5">
                                {(task.scores || [{ label: "النتيجة النهائية", score: task.score }]).map((s, idx) => (
                                    <div key={idx} className="flex flex-col gap-1">
                                        <div className="flex items-center justify-between text-xs font-semibold">
                                            <span className="text-[#334155] dark:text-dashboard-foreground">{s.label}</span>
                                            <span className="text-[#2563EB] font-bold">{s.score.toFixed(2)}%</span>
                                        </div>
                                        <div className="w-full h-2 rounded-full bg-[#E2E8F0] dark:bg-slate-700 overflow-hidden">
                                            <div
                                                className="h-full bg-[#10B981] rounded-full transition-all"
                                                style={{ width: `${s.score}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Flagged Items Alert */}
                        <div className="p-4 rounded-2xl border border-[#FED7AA] bg-[#FFF7ED] dark:bg-amber-950/20 dark:border-amber-900/40 flex flex-col justify-between gap-3">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-[#EA580C] font-bold text-xs">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>الملاحظات والمخالفات المسجلة</span>
                                </div>
                                <p className="text-xs text-[#9A3412] dark:text-amber-300 leading-relaxed">
                                    تم تسجيل <span className="font-extrabold text-[#C2410C]">{task.flaggedItemsCount}</span> مخالفة أثناء عملية التفتيش الميداني بحاجة إلى خطة عمل تصحيحية.
                                </p>
                            </div>
                            <div className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-black/20 text-[#EA580C] font-bold text-xs w-fit">
                                {task.flaggedItemsCount} Item Flagged
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
