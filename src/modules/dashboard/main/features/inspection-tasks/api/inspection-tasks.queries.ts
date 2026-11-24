import { useQuery } from "@tanstack/react-query";
import { inspectionTasksApi } from "./inspection-tasks.api";
import { inspectionTasksKeys } from "./inspection-tasks.keys";
import type { ListQueryParams } from "@/shared/api";

export function useInspectionTasksList(params?: ListQueryParams) {
    return useQuery({
        queryKey: inspectionTasksKeys.list(params),
        queryFn: ({ signal }) => inspectionTasksApi.getList(params, signal),
    });
}

// Backwards compatibility alias
export const useInspectionTaskssList = useInspectionTasksList;

export function useInspectionTask(id: string) {
    return useQuery({
        queryKey: inspectionTasksKeys.detail(id),
        queryFn: ({ signal }) => inspectionTasksApi.getById(id, signal),
        enabled: Boolean(id),
    });
}

export const useInspectionTasks = useInspectionTask;
