import { useQuery } from "@tanstack/react-query";
import { statisticsLiveApi } from "./statistics-live.api";
import { statisticsLiveKeys } from "./statistics-live.keys";
import type { ListQueryParams } from "@/shared/api";

export function useStatisticsLivesList(params?: ListQueryParams) {
    return useQuery({
        queryKey: statisticsLiveKeys.list(params),
        queryFn: ({ signal }) => statisticsLiveApi.getList(params, signal),
    });
}

export function useStatisticsLive(id: string) {
    return useQuery({
        queryKey: statisticsLiveKeys.detail(id),
        queryFn: ({ signal }) => statisticsLiveApi.getById(id, signal),
        enabled: !!id,
    });
}
