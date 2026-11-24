import type { StatisticsLiveQueryParams } from "../types";

export const statisticsLiveKeys = {
    all: ["statistics-live"] as const,
    overview: (params?: StatisticsLiveQueryParams) =>
        params
            ? ([...statisticsLiveKeys.all, "overview", params] as const)
            : ([...statisticsLiveKeys.all, "overview"] as const),
};
