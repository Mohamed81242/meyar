import type { StatisticsQueryParams } from "../types";

export const myStatisticsKeys = {
    all: ["my-statistics"] as const,
    overview: (params?: StatisticsQueryParams) =>
        params ? ([...myStatisticsKeys.all, "overview", params] as const) : ([...myStatisticsKeys.all, "overview"] as const),
};
