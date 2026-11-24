import React, { useState } from "react";
import {
    BarChart2,
    CheckCircle2,
    Shield,
    ChevronDown,
} from "lucide-react";
import type {
    TimeSeriesBarPoint,
    TasksKpiBreakdown,
    ActionsKpiBreakdown,
} from "../types";

interface Props {
    barHistory: TimeSeriesBarPoint[];
    tasksBreakdown: TasksKpiBreakdown;
    actionsBreakdown: ActionsKpiBreakdown;
    activeTab: "inspection_tasks" | "procedures";
    onTabChange: (tab: "inspection_tasks" | "procedures") => void;
}

export const AnalyticsBarCard: React.FC<Props> = ({
    barHistory,
    tasksBreakdown,
    actionsBreakdown,
    activeTab,
    onTabChange,
}) => {
    const [period, setPeriod] = useState("Last Week");
    const [isPeriodOpen, setIsPeriodOpen] = useState(false);

    const periods = ["Last Week", "Last Month", "Last Year", "All Time"];

    // Default bar point
    const currentPoint = barHistory[0] || {
        period: "2026-11",
        waitToStart: 0,
        inProgress: 0,
        complete: 1,
    };

    return (
        <div className="dashboard-card p-6 flex flex-col gap-5 select-none">
            {/* Top Tabs matching Image 2 & 3 */}
            <div className="flex items-center gap-6 border-b border-[#F1F5F9] dark:border-dashboard-border text-sm">
                <button
                    onClick={() => onTabChange("inspection_tasks")}
                    className={`pb-3 font-bold transition-all relative cursor-pointer ${
                        activeTab === "inspection_tasks"
                            ? "text-dashboard-primary border-b-2 border-dashboard-primary"
                            : "text-[#64748B] dark:text-dashboard-muted-foreground hover:text-[#0F172A] dark:hover:text-dashboard-foreground font-medium"
                    }`}
                >
                    Inspection Tasks
                </button>
                <button
                    onClick={() => onTabChange("procedures")}
                    className={`pb-3 font-bold transition-all relative cursor-pointer ${
                        activeTab === "procedures"
                            ? "text-dashboard-primary border-b-2 border-dashboard-primary"
                            : "text-[#64748B] dark:text-dashboard-muted-foreground hover:text-[#0F172A] dark:hover:text-dashboard-foreground font-medium"
                    }`}
                >
                    Procedures
                </button>
            </div>

            {/* Toolbar row with Legend on left, Time Filter on right */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#475569] dark:text-dashboard-muted-foreground">
                {/* Left: Legend Dots */}
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1.5 font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" />
                        <span>Wait to Start</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                        <span>In Progress</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                        <span>Complete</span>
                    </div>
                </div>

                {/* Right: Period Dropdown Selector */}
                <div className="relative">
                    <button
                        onClick={() => setIsPeriodOpen(!isPeriodOpen)}
                        className="h-8 px-3 rounded-lg border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-card hover:bg-[#F8FAFC] dark:hover:bg-dashboard-secondary text-xs font-medium text-[#0F172A] dark:text-dashboard-foreground flex items-center gap-2 transition-colors cursor-pointer"
                        aria-label="Filter period"
                    >
                        <span>{period}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
                    </button>

                    {isPeriodOpen && (
                        <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-dashboard-card rounded-xl border border-[#E2E8F0] dark:border-dashboard-border shadow-lg py-1 z-20 text-xs">
                            {periods.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => {
                                        setPeriod(item);
                                        setIsPeriodOpen(false);
                                    }}
                                    className="w-full text-start px-3 py-1.5 hover:bg-dashboard-secondary hover:text-dashboard-primary transition-colors cursor-pointer text-[#0F172A] dark:text-dashboard-foreground"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Content Grid: Left Bar Chart Area, Right Side KPI Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
                {/* Left (Cols 1-8): Bar Chart Area */}
                <div className="lg:col-span-8 flex flex-col justify-end min-h-[220px] relative border-b border-[#F1F5F9] dark:border-dashboard-border pb-4">
                    {/* Subtle grid line */}
                    <div className="w-full border-t border-dashed border-[#E2E8F0] dark:border-dashboard-border mb-8" />

                    <div className="flex items-end justify-center gap-8 relative px-12">
                        {/* Green Bar Container */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-32 h-28 rounded-xl bg-[#10B981] flex items-center justify-center text-white font-bold text-sm shadow-xs transition-transform hover:scale-102">
                                {currentPoint.complete}
                            </div>
                            <span className="text-xs font-semibold text-[#64748B] dark:text-dashboard-muted-foreground">
                                {currentPoint.period}
                            </span>
                        </div>

                        {/* Tooltip Card matching Image 3 */}
                        <div className="bg-white dark:bg-dashboard-card rounded-xl border border-[#E2E8F0] dark:border-dashboard-border shadow-sm p-3 text-[11px] font-medium flex flex-col gap-1.5 min-w-[130px] mb-8">
                            <div className="flex items-center gap-2 text-[#475569] dark:text-dashboard-muted-foreground">
                                <span className="w-2 h-2 rounded-full bg-[#EAB308]" />
                                <span>Wait to Start: {currentPoint.waitToStart}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#475569] dark:text-dashboard-muted-foreground">
                                <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                                <span>In Progress: {currentPoint.inProgress}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#475569] dark:text-dashboard-muted-foreground">
                                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                                <span>Complete: {currentPoint.complete}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right (Cols 9-12): Side KPI Breakdown Panels matching Image 3 */}
                <div className="lg:col-span-4 flex flex-col gap-5 border-l border-transparent lg:border-[#F1F5F9] lg:dark:border-dashboard-border lg:ps-6">
                    {/* Panel 1: Tasks */}
                    <div className="flex flex-col gap-2.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A] dark:text-dashboard-foreground">
                            <BarChart2 className="w-4 h-4 text-[#64748B] dark:text-dashboard-muted-foreground" />
                            <span>Tasks</span>
                        </div>

                        <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between py-1">
                                <div className="flex items-center gap-2 text-[#475569] dark:text-dashboard-muted-foreground">
                                    <span className="w-2 h-2 rounded-full bg-[#EAB308]" />
                                    <span>Wait to start inspection tasks</span>
                                </div>
                                <span className="font-bold text-[#0F172A] dark:text-dashboard-foreground">
                                    {tasksBreakdown.waitToStart}
                                </span>
                            </div>

                            <div className="flex items-center justify-between py-1">
                                <div className="flex items-center gap-2 text-[#475569] dark:text-dashboard-muted-foreground">
                                    <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                                    <span>inProgress inspection tasks</span>
                                </div>
                                <span className="font-bold text-[#0F172A] dark:text-dashboard-foreground">
                                    {tasksBreakdown.inProgress}
                                </span>
                            </div>

                            <div className="flex items-center justify-between py-1">
                                <div className="flex items-center gap-2 text-[#475569] dark:text-dashboard-muted-foreground">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                                    <span>Completed inspection task</span>
                                </div>
                                <span className="font-bold text-[#0F172A] dark:text-dashboard-foreground">
                                    {tasksBreakdown.completed}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-[#F1F5F9] dark:border-dashboard-border" />

                    {/* Panel 2: Actions */}
                    <div className="flex flex-col gap-2.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A] dark:text-dashboard-foreground">
                            <BarChart2 className="w-4 h-4 text-[#64748B] dark:text-dashboard-muted-foreground" />
                            <span>Actions</span>
                        </div>

                        <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between py-1">
                                <div className="flex items-center gap-2 text-[#475569] dark:text-dashboard-muted-foreground">
                                    <Shield className="w-3.5 h-3.5 text-[#2563EB]" />
                                    <span>Actions awaiting start</span>
                                </div>
                                <span className="font-bold text-[#0F172A] dark:text-dashboard-foreground">
                                    {actionsBreakdown.awaitingStart}
                                </span>
                            </div>

                            <div className="flex items-center justify-between py-1">
                                <div className="flex items-center gap-2 text-[#475569] dark:text-dashboard-muted-foreground">
                                    <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                                    <span>Ongoing actions</span>
                                </div>
                                <span className="font-bold text-[#0F172A] dark:text-dashboard-foreground">
                                    {actionsBreakdown.ongoing}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
