import React, { useState } from "react";
import {
    ChevronRight,
    CheckSquare,
    Target,
    ListTodo,
    FileText,
    Ticket,
} from "lucide-react";
import { useLanguage } from "@/shared/hooks";
import { useMyStatisticsOverview } from "../api";
import {
    SummaryMetricsColumn,
    DonutChartCard,
    EmptyOpenCard,
    AnalyticsBarCard,
} from "../components";

export default function MyStatisticsPage() {
    const { t } = useLanguage("my-statistics");
    const [activeTab, setActiveTab] = useState<"inspection_tasks" | "procedures">("inspection_tasks");

    const { data: overview, isLoading } = useMyStatisticsOverview({
        tab: activeTab,
    });

    if (isLoading || !overview) {
        return (
            <div className="flex flex-col gap-6 w-full animate-pulse select-none">
                <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded-md" />
                <div className="h-8 w-60 bg-slate-200 dark:bg-slate-700 rounded-md" />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    <div className="lg:col-span-4 h-64 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
                    <div className="lg:col-span-4 h-64 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
                    <div className="lg:col-span-4 h-64 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5 w-full select-none text-[#1E293B] dark:text-dashboard-foreground">
            {/* Breadcrumb matching Image 1 */}
            <div className="flex items-center gap-1.5 text-xs text-[#64748B] dark:text-dashboard-muted-foreground font-medium">
                <span>{t("home", "Home")}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span className="text-[#334155] dark:text-dashboard-foreground font-semibold">
                    {t("title", "My Statistics")}
                </span>
            </div>

            {/* Page Title */}
            <div>
                <h1 className="text-2xl font-bold text-[#0F172A] dark:text-dashboard-foreground tracking-tight">
                    {t("title", "My Statistics")}
                </h1>
            </div>

            {/* Section 1: Top Metrics & Donut Charts Grid matching Image 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* 3 Summary Metric Cards (Col span 4) */}
                <div className="lg:col-span-4">
                    <SummaryMetricsColumn
                        inProgressTasks={overview.summaryMetrics.inProgressTasks}
                        completedTasks={overview.summaryMetrics.completedTasks}
                        openActions={overview.summaryMetrics.openActions}
                    />
                </div>

                {/* Inspection Tasks Donut Chart (Col span 4) */}
                <div className="lg:col-span-4">
                    <DonutChartCard
                        icon={CheckSquare}
                        data={overview.inspectionTasksDonut}
                    />
                </div>

                {/* Actions Donut Chart (Col span 4) */}
                <div className="lg:col-span-4">
                    <DonutChartCard
                        icon={Target}
                        data={overview.actionsDonut}
                    />
                </div>
            </div>

            {/* Section 2: Open Items Cards matching Image 1 & 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <EmptyOpenCard
                    title={t("openCards.tasksOpen", "Tasks Open")}
                    icon={ListTodo}
                    emptyMessage={t("openCards.noTasks", "لا توجد مهام")}
                />
                <EmptyOpenCard
                    title={t("openCards.actionsOpen", "Actions Open")}
                    icon={FileText}
                    emptyMessage={t("openCards.noActions", "لا توجد اجراءات")}
                />
                <EmptyOpenCard
                    title={t("openCards.issuesOpen", "Issues Open")}
                    icon={Ticket}
                    emptyMessage={t("openCards.noIssues", "لا توجد مشاكل")}
                />
            </div>

            {/* Section 3: Bottom Analytics Bar & KPI Breakdown matching Image 2 & 3 */}
            <AnalyticsBarCard
                barHistory={overview.barHistory}
                tasksBreakdown={overview.breakdown.tasks}
                actionsBreakdown={overview.breakdown.actions}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
        </div>
    );
}
