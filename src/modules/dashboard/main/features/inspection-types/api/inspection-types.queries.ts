import { useQuery } from "@tanstack/react-query";
import { inspectionTypesApi } from "./inspection-types.api";
import { inspectionTypesKeys } from "./inspection-types.keys";
import type { ListQueryParams } from "@/shared/api";

export function useInspectionTypesList(params?: ListQueryParams) {
    return useQuery({
        queryKey: inspectionTypesKeys.list(params),
        queryFn: ({ signal }) => inspectionTypesApi.getList(params, signal),
    });
}

// Backwards compatibility alias
export const useInspectionTypessList = useInspectionTypesList;

export function useInspectionType(id: string) {
    return useQuery({
        queryKey: inspectionTypesKeys.detail(id),
        queryFn: ({ signal }) => inspectionTypesApi.getById(id, signal),
        enabled: Boolean(id),
    });
}

export const useInspectionTypes = useInspectionType;
