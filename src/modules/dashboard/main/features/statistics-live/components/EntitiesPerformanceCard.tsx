import React, { useState } from "react";
import { MoreHorizontal, ChevronUp, Briefcase } from "lucide-react";
import type { EntityPerformanceData } from "../types";

interface Props {
    entitiesPerformance: EntityPerformanceData;
}

export const EntitiesPerformanceCard: React.FC<Props> = ({
    entitiesPerformance,
}) => {
    const [showChart, setShowChart] = useState(true);

    return (
        <div className="dashboard-card p-5 select-none">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#2563EB]">
                        <Briefcase className="w-4 h-4" />
                    </div>
                    <h2 className="text-sm font-bold text-[#0F172A]">أداء الجهات</h2>
                </div>

                <div className="flex items-center gap-3">
                    {/* Toggle show chart */}
                    <div className="flex items-center gap-2 text-xs text-[#64748B]">
                        <span>عرض الرسم البياني</span>
                        <button
                            type="button"
                            onClick={() => setShowChart(!showChart)}
                            className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer ${
                                showChart ? "bg-[#2563EB]" : "bg-[#CBD5E1]"
                            }`}
                            aria-label="تبديل عرض الرسم البياني"
                        >
                            <div
                                className={`bg-white w-3.5 h-3.5 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${
                                    showChart ? "translate-x-3.5" : "translate-x-0"
                                }`}
                            />
                        </button>
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
            </div>

            {/* Bar Chart Area */}
            {showChart && (
                <div className="my-6 px-4">
                    <div className="relative h-44 flex items-end justify-center border-b border-[#E2E8F0]">
                        {/* Y-axis Ticks */}
                        <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-[#94A3B8] pr-1">
                            <span>100</span>
                            <span>75</span>
                            <span>50</span>
                            <span>25</span>
                            <span>0</span>
                        </div>

                        {/* Bar */}
                        <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-[#059669] mb-1">
                                {entitiesPerformance.score}
                            </span>
                            <div className="w-14 h-32 bg-[#059669] rounded-t-md transition-all duration-500" />
                            <span className="text-[11px] font-medium text-[#475569] mt-2">
                                {entitiesPerformance.entityName}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
