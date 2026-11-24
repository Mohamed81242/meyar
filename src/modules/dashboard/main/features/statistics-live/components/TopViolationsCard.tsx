import React from "react";
import { MoreHorizontal, ChevronUp, AlertTriangle, AlertCircle } from "lucide-react";
import type { CommonViolationItem } from "../types";

interface Props {
    topViolations: {
        entityName: string;
        count: number;
    };
    commonViolations: CommonViolationItem[];
}

export const TopViolationsCard: React.FC<Props> = ({
    topViolations,
    commonViolations,
}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 select-none">
            {/* Left: Top 25 Entities in Violations */}
            <div className="dashboard-card p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#2563EB]">
                            <AlertTriangle className="w-4 h-4" />
                        </div>
                        <h2 className="text-sm font-bold text-[#0F172A]">
                            اعلى 25 جهات في المخالفات
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

                {/* Bar Chart Area */}
                <div className="my-6 px-4">
                    <div className="relative h-44 flex items-end justify-center border-b border-[#E2E8F0]">
                        {/* Grid ticks */}
                        <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-[#94A3B8] pr-1">
                            <span>15</span>
                            <span>10</span>
                            <span>5</span>
                            <span>0</span>
                        </div>

                        {/* Bar */}
                        <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-[#DC2626] mb-1">
                                {topViolations.count}
                            </span>
                            <div className="w-14 h-36 bg-[#DC2626] rounded-t-md transition-all duration-500" />
                            <span className="text-[11px] font-medium text-[#475569] mt-2">
                                {topViolations.entityName}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Common Violations List */}
            <div className="dashboard-card p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#2563EB]">
                            <AlertCircle className="w-4 h-4" />
                        </div>
                        <h2 className="text-sm font-bold text-[#0F172A]">مخالفات شائعة</h2>
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

                {/* Violations List */}
                <div className="space-y-2.5 my-3">
                    {commonViolations.map((v) => (
                        <div
                            key={v.id}
                            className="flex items-start gap-2.5 p-2 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors"
                        >
                            <span className="w-5 h-5 rounded-full bg-[#E2E8F0] text-[#334155] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                                {v.count}
                            </span>
                            <p className="text-xs text-[#334155] leading-relaxed flex-1">
                                {v.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
