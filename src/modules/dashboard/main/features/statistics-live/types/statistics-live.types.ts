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

export interface LiveTaskCardItem {
    id: string;
    title: string;
    entityName: string;
    category: string;
    score: number;
    timestamp: string;
    badgeText: string;
    status: "compliant" | "non_compliant" | "unable";
}

export interface CommonViolationItem {
    id: string;
    count: number;
    text: string;
}

export interface TemplateResultData {
    compliant: number;
    nonCompliant: number;
    unable: number;
    barValue: number;
}

export interface SiteComplianceData {
    siteName: string;
    ratingText: string;
    barValue: number;
    status: "compliant" | "non_compliant";
}

export interface TimePerformancePoint {
    date: string;
    rate: number;
    statusText: string;
    details: string;
}

export interface EntityPerformanceData {
    entityName: string;
    score: number;
}

export interface StatisticsLiveOverview {
    // Row 1
    assessmentStatuses: DonutStatData;
    successRate: DonutStatData;
    scoreDistribution: DonutStatData | null;

    // Row 2
    tasksByResult: {
        compliant: LiveTaskCardItem[];
        nonCompliant: LiveTaskCardItem[];
        unable: LiveTaskCardItem[];
    };

    // Row 3
    templateResults: TemplateResultData;
    districtResults: any | null;

    // Row 4
    allTasks: LiveTaskCardItem[];
    scheduleAdherence: any | null;

    // Row 5
    topViolations: {
        entityName: string;
        count: number;
    };
    commonViolations: CommonViolationItem[];

    // Row 6
    districtComplianceAverage: any | null;

    // Row 7
    sitesAverageCompliance: SiteComplianceData;

    // Row 8
    sitePerformanceOverTime: TimePerformancePoint[];

    // Row 9
    entitiesPerformance: EntityPerformanceData;
}

export interface StatisticsLiveQueryParams {
    realtime?: boolean;
    advancedFilter?: boolean;
    period?: string;
    [key: string]: unknown;
}
