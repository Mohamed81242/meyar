import { useQuery } from "@tanstack/react-query";
import { myStatisticsApi } from "./my-statistics.api";
import { myStatisticsKeys } from "./my-statistics.keys";
import type { StatisticsQueryParams } from "../types";

export function useMyStatisticsOverview(params?: StatisticsQueryParams) {
    return useQuery({
        queryKey: myStatisticsKeys.overview(params),
        queryFn: ({ signal }) => myStatisticsApi.getOverview(params, signal),
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}
