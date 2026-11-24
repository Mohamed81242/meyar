import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inspectionTasksApi } from "./inspection-tasks.api";
import { inspectionTasksKeys } from "./inspection-tasks.keys";

export function useCreateInspectionTasks() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: inspectionTasksApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inspectionTasksKeys.lists() });
        },
    });
}

export function useUpdateInspectionTasks() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => inspectionTasksApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: inspectionTasksKeys.lists() });
            queryClient.invalidateQueries({ queryKey: inspectionTasksKeys.detail(id) });
        },
    });
}

export function useDeleteInspectionTasks() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: inspectionTasksApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inspectionTasksKeys.lists() });
        },
    });
}
