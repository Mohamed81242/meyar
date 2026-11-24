import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inspectionTasksApi } from "./inspection-tasks.api";
import { inspectionTasksKeys } from "./inspection-tasks.keys";
import type {
    InspectionTaskCreatePayload,
    InspectionTaskUpdatePayload,
} from "../types";

export function useCreateInspectionTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: InspectionTaskCreatePayload) =>
            inspectionTasksApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inspectionTasksKeys.lists() });
        },
    });
}

export const useCreateInspectionTasks = useCreateInspectionTask;

export function useUpdateInspectionTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: InspectionTaskUpdatePayload;
        }) => inspectionTasksApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: inspectionTasksKeys.lists() });
            queryClient.invalidateQueries({ queryKey: inspectionTasksKeys.detail(id) });
        },
    });
}

export const useUpdateInspectionTasks = useUpdateInspectionTask;

export function useDeleteInspectionTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => inspectionTasksApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inspectionTasksKeys.lists() });
        },
    });
}

export const useDeleteInspectionTasks = useDeleteInspectionTask;
