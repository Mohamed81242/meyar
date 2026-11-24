import React from "react";
import { MoreHorizontal } from "lucide-react";
import type { DonutStatData } from "../types";

interface Props {
    icon: React.ComponentType<{ className?: string }>;
    data: DonutStatData;
}

export const DonutChartCard: React.FC<Props> = ({ icon: HeaderIcon, data }) => {
    const { title, total, centerLabel = "اجمالي", segments } = data;

    // SVG Donut Calculations
    const size = 160;
    const strokeWidth = 20;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    // Compute stroke-dasharray segments
    let accumulatedAngle = 0;

    return (
        <div className="dashboard-card p-5 flex flex-col justify-between h-full select-none">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <HeaderIcon className="w-4 h-4 text-[#0F172A]" />
                    <h2 className="text-sm font-bold text-[#0F172A]">{title}</h2>
                </div>
                <button
                    className="w-7 h-7 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] flex items-center justify-center transition-colors cursor-pointer"
                    aria-label={`Options for ${title}`}
                >
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            {/* Donut Chart Viewport */}
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

                    {/* Active Segments */}
                    {segments.map((segment) => {
                        if (segment.percentage <= 0) return null;
                        const dashLength = (segment.percentage / 100) * circumference;
                        const strokeDasharray = `${dashLength} ${circumference - dashLength}`;
                        const strokeDashoffset = -accumulatedAngle;
                        accumulatedAngle += dashLength;

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
                                className="transition-all duration-700 ease-out"
                            />
                        );
                    })}
                </svg>

                {/* Center Label and Value */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                    <span className="text-[11px] text-[#64748B] font-medium leading-tight">
                        {centerLabel}
                    </span>
                    <span className="text-2xl font-bold text-[#0F172A] leading-tight">
                        {total}
                    </span>
                </div>
            </div>

            {/* Legend Section matching Image 1 */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-2 border-t border-[#F8FAFC] text-[11px] font-medium text-[#475569]">
                {segments.map((segment) => (
                    <div key={segment.label} className="flex items-center gap-1.5 whitespace-nowrap">
                        <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: segment.color }}
                        />
                        <span>
                            {segment.count} {segment.label} ({segment.percentage}%)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
