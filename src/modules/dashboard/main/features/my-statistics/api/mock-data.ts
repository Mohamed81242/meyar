import type { MyStatisticsOverview, StatisticsQueryParams } from "../types";

export const mockMyStatisticsData: MyStatisticsOverview = {
    summaryMetrics: {
        inProgressTasks: 0,
        completedTasks: 9,
        openActions: 0,
    },
    inspectionTasksDonut: {
        title: "Inspection Tasks",
        total: 9,
        centerLabel: "Complete",
        segments: [
            { label: "Wait to Start", count: 0, percentage: 0, color: "#EAB308" },
            { label: "In Progress", count: 0, percentage: 0, color: "#8B5CF6" },
            { label: "Complete", count: 9, percentage: 100, color: "#059669" },
        ],
    },
    actionsDonut: {
        title: "Actions",
        total: 6,
        centerLabel: "اجمالي",
        segments: [
            { label: "Wait to Start", count: 0, percentage: 0, color: "#EAB308" },
            { label: "Complete", count: 6, percentage: 100, color: "#059669" },
            { label: "In Progress", count: 0, percentage: 0, color: "#8B5CF6" },
            { label: "Impossible", count: 0, percentage: 0, color: "#EF4444" },
        ],
    },
    tasksOpen: [],
    actionsOpen: [],
    issuesOpen: [],
    barHistory: [
        {
            period: "2026-11",
            waitToStart: 0,
            inProgress: 0,
            complete: 1,
        },
    ],
    breakdown: {
        tasks: {
            waitToStart: 0,
            inProgress: 0,
            completed: 1,
        },
        actions: {
            awaitingStart: 0,
            ongoing: 0,
        },
    },
};

export const mockMyStatisticsApi = {
    getOverview: async (
        params?: StatisticsQueryParams,
        _signal?: AbortSignal
    ): Promise<MyStatisticsOverview> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    ...mockMyStatisticsData,
                    barHistory:
                        params?.tab === "procedures"
                            ? [
                                  {
                                      period: "2026-11",
                                      waitToStart: 0,
                                      inProgress: 0,
                                      complete: 0,
                                  },
                              ]
                            : mockMyStatisticsData.barHistory,
                });
            }, 250);
        });
    },

    refresh: async (): Promise<{ success: boolean }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 300);
        });
    },
};
