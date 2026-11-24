import type { StatisticsLiveOverview, StatisticsLiveQueryParams } from "../types";

export const mockStatisticsLiveData: StatisticsLiveOverview = {
    // Row 1: Donut Cards
    assessmentStatuses: {
        title: "حالات مهام التقييم",
        total: 1,
        centerLabel: "اجمالي",
        segments: [
            { label: "Wait to Start", count: 0, percentage: 0, color: "#EAB308" },
            { label: "In Progress", count: 0, percentage: 0, color: "#8B5CF6" },
            { label: "Complete", count: 1, percentage: 100, color: "#059669" },
        ],
    },
    successRate: {
        title: "نسبة نجاح المهام",
        total: 1,
        centerLabel: "الإجمالي",
        segments: [
            { label: "مهام ممتثلة", count: 0, percentage: 0, color: "#059669" },
            { label: "مهام غير ممتثلة", count: 1, percentage: 100, color: "#DC2626" },
        ],
    },
    scoreDistribution: null,

    // Row 2: Tasks by result
    tasksByResult: {
        compliant: [],
        nonCompliant: [
            {
                id: "task-1",
                title: "سيلفش - Sellfish",
                entityName: "سيلفش - Sellfish",
                category: "بنود تفتيش المطاعم",
                score: 85,
                timestamp: "PM 01:14:46 , 2026/11/24",
                badgeText: "رمز الامتثال",
                status: "non_compliant",
            },
        ],
        unable: [],
    },

    // Row 3
    templateResults: {
        compliant: 0,
        nonCompliant: 1,
        unable: 0,
        barValue: 1,
    },
    districtResults: null,

    // Row 4
    allTasks: [
        {
            id: "task-1",
            title: "سيلفش - Sellfish",
            entityName: "سيلفش - Sellfish",
            category: "بنود تفتيش المطاعم",
            score: 85,
            timestamp: "PM 01:14:46 , 2026/11/24",
            badgeText: "رمز الامتثال",
            status: "non_compliant",
        },
    ],
    scheduleAdherence: null,

    // Row 5
    topViolations: {
        entityName: "سيلفش - Sellfish",
        count: 14,
    },
    commonViolations: [
        {
            id: "viol-1",
            count: 1,
            text: "توفير مقياس حرارة مناسب لقياس درجات حرارة الأغذية عند الاستلام والتحضير وعند الحاجة",
        },
        {
            id: "viol-2",
            count: 1,
            text: "عدم تكديس الأغذية داخل الثلاجات والفريزرات بما يعيق دوران الهواء والتبريد",
        },
        {
            id: "viol-3",
            count: 1,
            text: "خلو المنشأة ومناطق التحضير والتخزين من الحشرات والقوارض والطيور وآثارها",
        },
        {
            id: "viol-4",
            count: 1,
            text: "إغلاق الفتحات ومصادر دخول الحشرات والقوارض والمحافظة على الأبواب والنوافذ بحالة سليمة",
        },
        {
            id: "viol-5",
            count: 1,
            text: "أن تكون معدات وأدوات التحضير بحالة جيدة وسهلة التنظيف والتعقيم",
        },
    ],

    // Row 6
    districtComplianceAverage: null,

    // Row 7
    sitesAverageCompliance: {
        siteName: "سيلفش - Sellfish",
        ratingText: "جيدة 1",
        barValue: 1,
        status: "non_compliant",
    },

    // Row 8
    sitePerformanceOverTime: [
        {
            date: "24 نوفمبر 2026 , 01:14 م",
            rate: 85.42,
            statusText: "غير ممتثلة",
            details: "نسبة الإنجاز الحالية",
        },
    ],

    // Row 9
    entitiesPerformance: {
        entityName: "سيلفش - Sellfish",
        score: 85,
    },
};

export const mockStatisticsLiveApi = {
    getOverview: async (
        _params?: StatisticsLiveQueryParams,
        _signal?: AbortSignal
    ): Promise<StatisticsLiveOverview> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockStatisticsLiveData);
            }, 250);
        });
    },

    exportReport: async (format: "excel" | "pdf"): Promise<{ downloadUrl: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ downloadUrl: `#export-${format}` });
            }, 300);
        });
    },
};
