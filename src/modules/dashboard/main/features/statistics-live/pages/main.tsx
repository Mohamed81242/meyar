import React, { useState } from "react";
import { useLanguage } from "@/shared/hooks";
import { ChevronRight, PieChart, CheckCircle2, BarChart3, Loader2 } from "lucide-react";
import {
    useStatisticsLiveOverview,
    useExportStatisticsReport,
} from "../api";
import {
    LiveToolbar,
    LiveDonutCard,
    TasksByResultCard,
    TemplateResultsCard,
    AllTasksAndCommitmentCard,
    TopViolationsCard,
    DistrictAverageComplianceCard,
    SitesAverageComplianceCard,
    SitePerformanceTimeCard,
    EntitiesPerformanceCard,
    EmptyIllustration,
} from "../components";

export default function StatisticsLivePage() {
    const { t } = useLanguage("statistics-live");

    // Realtime & Filter toggles
    const [isRealtime, setIsRealtime] = useState(true);
    const [advancedFilter, setAdvancedFilter] = useState(false);

    // Queries & Mutations
    const { data, isLoading, error } = useStatisticsLiveOverview({
        realtime: isRealtime,
        advancedFilter,
    });
    const exportMutation = useExportStatisticsReport();

    const handleExport = (format: "excel" | "pdf") => {
        exportMutation.mutate(format);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-5 pb-12 select-none">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <span>{t("main.home", "Home")}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span className="text-[#334155] font-semibold">{t("main.title", "Statistics Live")}</span>
            </div>

            {/* Page Title & Main Header */}
            <div>
                <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                    {t("main.title", "Statistics Live")}
                </h1>
            </div>

            {/* Top Toolbar */}
            <LiveToolbar
                isRealtime={isRealtime}
                onToggleRealtime={setIsRealtime}
                advancedFilter={advancedFilter}
                onToggleAdvancedFilter={setAdvancedFilter}
                onExportExcel={() => handleExport("excel")}
                onExportPdf={() => handleExport("pdf")}
                onPrint={handlePrint}
            />

            {/* Loading State */}
            {isLoading && !data && (
                <div className="dashboard-card p-12 flex flex-col items-center justify-center text-center">
                    <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin mb-3" />
                    <p className="text-sm font-semibold text-[#64748B]">
                        {t("main.loading", "جاري تحميل البيانات الحية...")}
                    </p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="dashboard-card p-8 flex flex-col items-center justify-center text-center">
                    <p className="text-sm font-semibold text-[#DC2626] mb-2">
                        {t("main.error", "حدث خطأ أثناء تحميل البيانات")}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold"
                    >
                        {t("main.retry", "إعادة المحاولة")}
                    </button>
                </div>
            )}

            {/* Main Content Dashboard Rows */}
            {data && (
                <div className="space-y-5">
                    {/* Row 1: 3 Donut / Distribution Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <LiveDonutCard
                            icon={PieChart}
                            data={data.assessmentStatuses}
                        />
                        <LiveDonutCard
                            icon={CheckCircle2}
                            data={data.successRate}
                        />
                        <div className="dashboard-card p-5 flex flex-col justify-between">
                            <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
                                <div className="w-7 h-7 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#2563EB]">
                                    <BarChart3 className="w-4 h-4" />
                                </div>
                                <h2 className="text-sm font-bold text-[#0F172A]">
                                    {t("row1.scoreDistribution", "توزيع درجات التقييمات")}
                                </h2>
                            </div>
                            <div className="flex-1 flex items-center justify-center py-6">
                                <EmptyIllustration />
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Tasks by Result */}
                    <TasksByResultCard tasksByResult={data.tasksByResult} />

                    {/* Row 3: Template Results & District Results */}
                    <TemplateResultsCard
                        templateResults={data.templateResults}
                        districtResults={data.districtResults}
                    />

                    {/* Row 4: All Tasks & Schedule Adherence */}
                    <AllTasksAndCommitmentCard
                        allTasks={data.allTasks}
                        scheduleAdherence={data.scheduleAdherence}
                    />

                    {/* Row 5: Top Violations & Common Violations */}
                    <TopViolationsCard
                        topViolations={data.topViolations}
                        commonViolations={data.commonViolations}
                    />

                    {/* Row 6: District Average Compliance */}
                    <DistrictAverageComplianceCard
                        districtComplianceAverage={data.districtComplianceAverage}
                    />

                    {/* Row 7: Sites Average Compliance */}
                    <SitesAverageComplianceCard
                        sitesAverageCompliance={data.sitesAverageCompliance}
                    />

                    {/* Row 8: Site Performance Over Time */}
                    <SitePerformanceTimeCard
                        sitePerformanceOverTime={data.sitePerformanceOverTime}
                    />

                    {/* Row 9: Entities Performance */}
                    <EntitiesPerformanceCard
                        entitiesPerformance={data.entitiesPerformance}
                    />
                </div>
            )}
        </div>
    );
}
