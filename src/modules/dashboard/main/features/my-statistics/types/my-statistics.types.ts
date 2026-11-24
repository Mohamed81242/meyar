export interface DonutSegment {
    label: string;
    count: number;
    percentage: number;
    color: string;
}

export interface DonutStatData {
    title: string;
    total: number;
    centerLabel?: string;
    segments: DonutSegment[];
}

export interface SummaryMetricItem {
    id: string;
    title: string;
    value: number | string;
    badgeColor: string;
    iconType: "layers" | "check" | "gear";
}

export interface OpenTicketItem {
    id: string;
    title: string;
    reference: string;
    status: string;
    createdAt: string;
}

export interface TimeSeriesBarPoint {
    period: string; // e.g., "2026-11"
    waitToStart: number;
    inProgress: number;
    complete: number;
}

export interface TasksKpiBreakdown {
    waitToStart: number;
    inProgress: number;
    completed: number;
}

export interface ActionsKpiBreakdown {
    awaitingStart: number;
    ongoing: number;
}

export interface MyStatisticsOverview {
    summaryMetrics: {
        inProgressTasks: number;
        completedTasks: number;
        openActions: number;
    };
    inspectionTasksDonut: DonutStatData;
    actionsDonut: DonutStatData;
    tasksOpen: OpenTicketItem[];
    actionsOpen: OpenTicketItem[];
    issuesOpen: OpenTicketItem[];
    barHistory: TimeSeriesBarPoint[];
    breakdown: {
        tasks: TasksKpiBreakdown;
        actions: ActionsKpiBreakdown;
    };
}

export interface StatisticsQueryParams {
    period?: "last_week" | "last_month" | "last_year" | "all";
    tab?: "inspection_tasks" | "procedures";
    [key: string]: unknown;
}
