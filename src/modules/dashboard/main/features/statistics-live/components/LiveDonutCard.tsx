import React from "react";
import { MoreHorizontal, ChevronUp } from "lucide-react";
import type { DonutStatData } from "../types";

interface Props {
    icon: React.ComponentType<{ className?: string }>;
    data: DonutStatData;
}

export const LiveDonutCard: React.FC<Props> = ({ icon: HeaderIcon, data }) => {
    const { title, total, centerLabel = "الإجمالي", segments } = data;

    // SVG Donut Calculations
    const size = 150;
    const strokeWidth = 18;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    let accumulatedDash = 0;

    return (
        <div className="dashboard-card p-5 flex flex-col justify-between h-full select-none">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#2563EB]">
                        <HeaderIcon className="w-4 h-4" />
                    </div>
                    <h2 className="text-sm font-bold text-[#0F172A]">{title}</h2>
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

            {/* Donut Chart */}
            <div className="relative flex items-center justify-center my-4">
                <svg width={size} height={size} className="transform -rotate-90">
                    {/* Background Track */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        stroke="#F1F5F9"
                        strokeWidth={strokeWidth}
                    />

                    {/* Segments */}
                    {segments.map((segment) => {
                        if (segment.percentage <= 0) return null;
                        const dashLength = (segment.percentage / 100) * circumference;
                        const strokeDasharray = `${dashLength} ${circumference - dashLength}`;
                        const strokeDashoffset = -accumulatedDash;
                        accumulatedDash += dashLength;

                        return (
                            <circle
                                key={segment.label}
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                fill="transparent"
                                stroke={segment.color}
                                strokeWidth={strokeWidth}
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                className="transition-all duration-500 ease-out"
                            />
                        );
                    })}
                </svg>

                {/* Center Counter */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="text-[11px] text-[#64748B] font-medium leading-none mb-1">
                        {centerLabel}
                    </span>
                    <span className="text-xl font-bold text-[#0F172A] leading-none">
                        {total}
                    </span>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-2 border-t border-[#F1F5F9] text-[11px] text-[#475569]">
                {segments.map((seg) => (
                    <div key={seg.label} className="flex items-center gap-1.5">
                        <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: seg.color }}
                        />
                        <span>
                            {seg.count} {seg.label} ({seg.percentage}%)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
