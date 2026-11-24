import React from "react";
import { MoreHorizontal, ChevronUp, BarChart2, MapPin } from "lucide-react";
import { EmptyIllustration } from "./EmptyIllustration";
import type { TemplateResultData } from "../types";

interface Props {
    templateResults: TemplateResultData;
    districtResults: any | null;
}

export const TemplateResultsCard: React.FC<Props> = ({
    templateResults,
    districtResults,
}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 select-none">
            {/* Left: Template Results Bar Chart */}
            <div className="dashboard-card p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#2563EB]">
                            <BarChart2 className="w-4 h-4" />
                        </div>
                        <h2 className="text-sm font-bold text-[#0F172A]">
                            نتيجة مهام التقييم بناء على القوالب
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
                            <span>1</span>
                            <span>0.5</span>
                            <span>0</span>
                        </div>

                        {/* Bar */}
                        <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-[#DC2626] mb-1">
                                {templateResults.barValue}
                            </span>
                            <div className="w-12 h-32 bg-[#DC2626] rounded-t-md transition-all duration-500" />
                            <span className="text-[11px] font-medium text-[#475569] mt-2">
                                بنود تفتيش المطاعم
                            </span>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-3 border-t border-[#F1F5F9] text-[11px] text-[#475569]">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
                        <span>0 مهام ممتثلة (0%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
                        <span>1 مهام غير ممتثلة (100%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8]" />
                        <span>0 تعذر (0%)</span>
                    </div>
                </div>
            </div>

            {/* Right: District Results Empty Card */}
            <div className="dashboard-card p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#2563EB]">
                            <MapPin className="w-4 h-4" />
                        </div>
                        <h2 className="text-sm font-bold text-[#0F172A]">
                            نتيجة مهام التقييم بناء على الحي/المنطقة
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
