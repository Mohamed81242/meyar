import { useQuery } from "@tanstack/react-query";
import { statisticsLiveApi } from "./statistics-live.api";
import { statisticsLiveKeys } from "./statistics-live.keys";
import type { StatisticsLiveQueryParams } from "../types";

export function useStatisticsLiveOverview(params?: StatisticsLiveQueryParams) {
    return useQuery({
        queryKey: statisticsLiveKeys.overview(params),
        queryFn: ({ signal }) => statisticsLiveApi.getOverview(params, signal),
        refetchInterval: params?.realtime ? 5000 : false, // 5s live polling if realtime toggle is on
    });
}
