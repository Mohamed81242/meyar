import React from "react";
import { MoreHorizontal, ChevronUp, TrendingUp } from "lucide-react";
import type { TimePerformancePoint } from "../types";

interface Props {
    sitePerformanceOverTime: TimePerformancePoint[];
}

export const SitePerformanceTimeCard: React.FC<Props> = ({
    sitePerformanceOverTime,
}) => {
    const point = sitePerformanceOverTime[0];

    return (
        <div className="dashboard-card p-5 select-none">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#2563EB]">
                        <TrendingUp className="w-4 h-4" />
                    </div>
                    <h2 className="text-sm font-bold text-[#0F172A]">أداء الموقع عبر الوقت</h2>
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

            {/* Line Chart Area */}
            <div className="my-6 px-4">
                <div className="relative h-48 border-b border-l border-[#E2E8F0] flex items-center justify-center">
                    {/* Y Axis percentage markers */}
                    <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-[#94A3B8] pr-1">
                        <span>100%</span>
                        <span>80%</span>
                        <span>60%</span>
                        <span>40%</span>
                        <span>20%</span>
                        <span>0%</span>
                    </div>

                    {/* Chart Data Point & Tooltip Box */}
                    {point && (
                        <div className="relative flex flex-col items-center">
                            {/* Floating Tooltip Box */}
                            <div className="bg-[#0F172A] text-white rounded-lg p-2.5 shadow-xl text-xs flex flex-col items-start gap-1 mb-2 z-10 min-w-[170px]">
                                <span className="text-[10px] text-[#94A3B8] font-medium">
                                    {point.date}
                                </span>
                                <div className="flex items-center justify-between w-full">
                                    <span className="font-bold text-white">
                                        المعدل: {point.rate}%
                                    </span>
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#DC2626]/20 text-[#EF4444]">
                                        {point.statusText}
                                    </span>
                                </div>
                                <span className="text-[10px] text-[#CBD5E1]">سيلفش - Sellfish</span>
                            </div>

                            {/* Point on the Line */}
                            <div className="relative flex items-center justify-center">
                                <div className="w-3 h-3 rounded-full bg-[#2563EB] ring-4 ring-[#2563EB]/20 z-10" />
                            </div>

                            {/* X-axis Label */}
                            <span className="text-[11px] font-medium text-[#475569] mt-3">
                                {point.date}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
