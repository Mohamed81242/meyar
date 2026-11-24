import React from "react";
import { MoreHorizontal, ChevronUp, CheckSquare, Calendar, Clock, ShieldCheck } from "lucide-react";
import { EmptyIllustration } from "./EmptyIllustration";
import type { LiveTaskCardItem } from "../types";

interface Props {
    allTasks: LiveTaskCardItem[];
    scheduleAdherence: any | null;
}

export const AllTasksAndCommitmentCard: React.FC<Props> = ({
    allTasks,
    scheduleAdherence,
}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 select-none">
            {/* Left: All Tasks Card */}
            <div className="dashboard-card p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#2563EB]">
                            <CheckSquare className="w-4 h-4" />
                        </div>
                        <h2 className="text-sm font-bold text-[#0F172A]">كل المهام</h2>
                        <span className="px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-[10px] font-bold">
                            {allTasks.length} Tasks
                        </span>
                    </div>
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

                {/* Tasks List */}
                <div className="space-y-3 my-4">
                    {allTasks.map((task) => (
                        <div
                            key={task.id}
                            className="bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-xl p-3 shadow-2xs transition-all flex items-start gap-3"
                        >
                            <div className="w-10 h-10 rounded-full bg-[#FEF2F2] border border-[#FEE2E2] flex items-center justify-center text-[#DC2626] font-bold text-sm shrink-0">
                                {task.score}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-[#0F172A] truncate">
                                    {task.title}
                                </h4>
                                <p className="text-[11px] text-[#64748B] mt-0.5 truncate">
                                    {task.category}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#2563EB] text-[10px] font-medium">
                                        <ShieldCheck className="w-3 h-3" />
                                        <span>{task.badgeText}</span>
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-[10px] text-[#94A3B8]">
                                        <Clock className="w-3 h-3" />
                                        <span>{task.timestamp}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Schedule Adherence Empty Card */}
            <div className="dashboard-card p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#2563EB]">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <h2 className="text-sm font-bold text-[#0F172A]">
                            الإلتزام بمواعيد البدء والإنتهاء
                        </h2>
                    </div>
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

                <div className="flex-1 flex items-center justify-center py-10">
                    <EmptyIllustration />
                </div>
            </div>
        </div>
    );
};
