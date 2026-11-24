import { useQuery } from "@tanstack/react-query";
import { inspectionTypesApi } from "./inspection-types.api";
import { inspectionTypesKeys } from "./inspection-types.keys";
import type { ListQueryParams } from "@/shared/api";

export function useInspectionTypessList(params?: ListQueryParams) {
    return useQuery({
        queryKey: inspectionTypesKeys.list(params),
        queryFn: ({ signal }) => inspectionTypesApi.getList(params, signal),
    });
}

export function useInspectionTypes(id: string) {
    return useQuery({
        queryKey: inspectionTypesKeys.detail(id),
        queryFn: ({ signal }) => inspectionTypesApi.getById(id, signal),
        enabled: !!id,
    });
}
