import React from "react";
import { MoreHorizontal, ChevronUp, Clock, ShieldCheck } from "lucide-react";
import { EmptyIllustration } from "./EmptyIllustration";
import type { LiveTaskCardItem } from "../types";

interface Props {
    tasksByResult: {
        compliant: LiveTaskCardItem[];
        nonCompliant: LiveTaskCardItem[];
        unable: LiveTaskCardItem[];
    };
}

export const TasksByResultCard: React.FC<Props> = ({ tasksByResult }) => {
    const { compliant, nonCompliant, unable } = tasksByResult;

    return (
        <div className="dashboard-card p-5 select-none">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                <h2 className="text-sm font-bold text-[#0F172A]">المهام حسب نتيجة التقييم</h2>
                <div className="flex items-center gap-1 text-[#94A3B8]">
                    <button
                        className="w-6 h-6 rounded flex items-center justify-center hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                        aria-label="خيارات"
                    >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                    <button
                        className="w-6 h-6 rounded flex items-center justify-center hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                        aria-label="طي / توسيع"
                    >
                        <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* 3 Columns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {/* Column 1: Compliant */}
                <div className="flex flex-col rounded-xl border border-[#F1F5F9] p-3 min-h-[160px]">
                    <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                        <span className="text-xs font-semibold text-[#059669]">
                            مهام ممتثلة ({compliant.length})
                        </span>
                    </div>
                    {compliant.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center">
                            <EmptyIllustration />
                        </div>
                    ) : (
                        <div className="space-y-2 mt-2">
                            {compliant.map((task) => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Column 2: Non Compliant */}
                <div className="flex flex-col rounded-xl border border-[#F1F5F9] p-3 min-h-[160px]">
                    <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                        <span className="text-xs font-semibold text-[#DC2626]">
                            مهام غير ممتثلة ({nonCompliant.length})
                        </span>
                    </div>
                    {nonCompliant.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center">
                            <EmptyIllustration />
                        </div>
                    ) : (
                        <div className="space-y-2 mt-2">
                            {nonCompliant.map((task) => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Column 3: Unable */}
                <div className="flex flex-col rounded-xl border border-[#F1F5F9] p-3 min-h-[160px]">
                    <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                        <span className="text-xs font-semibold text-[#64748B]">
                            تعذر ({unable.length})
                        </span>
                    </div>
                    {unable.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center">
                            <EmptyIllustration />
                        </div>
                    ) : (
                        <div className="space-y-2 mt-2">
                            {unable.map((task) => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const TaskCard: React.FC<{ task: LiveTaskCardItem }> = ({ task }) => {
    return (
        <div className="bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-xl p-3 shadow-2xs transition-all flex items-start gap-3">
            {/* Score Circle Badge */}
            <div className="w-10 h-10 rounded-full bg-[#FEF2F2] border border-[#FEE2E2] flex items-center justify-center text-[#DC2626] font-bold text-sm shrink-0">
                {task.score}
            </div>

            {/* Task Info */}
            <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-[#0F172A] truncate">{task.title}</h4>
                <p className="text-[11px] text-[#64748B] mt-0.5 truncate">{task.category}</p>

                <div className="flex flex-wrap items-center gap-2 mt-2">
                    {/* Badge */}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#2563EB] text-[10px] font-medium">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{task.badgeText}</span>
                    </span>

                    {/* Timestamp */}
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#94A3B8]">
                        <Clock className="w-3 h-3" />
                        <span>{task.timestamp}</span>
                    </span>
                </div>
            </div>
        </div>
    );
};
