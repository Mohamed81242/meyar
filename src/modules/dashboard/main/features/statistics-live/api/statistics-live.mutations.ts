import { useMutation, useQueryClient } from "@tanstack/react-query";
import { statisticsLiveApi } from "./statistics-live.api";
import { statisticsLiveKeys } from "./statistics-live.keys";

export function useCreateStatisticsLive() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: statisticsLiveApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: statisticsLiveKeys.lists() });
        },
    });
}

export function useUpdateStatisticsLive() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => statisticsLiveApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: statisticsLiveKeys.lists() });
            queryClient.invalidateQueries({ queryKey: statisticsLiveKeys.detail(id) });
        },
    });
}

export function useDeleteStatisticsLive() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: statisticsLiveApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: statisticsLiveKeys.lists() });
        },
    });
}
