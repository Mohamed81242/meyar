import { useQuery } from "@tanstack/react-query";
import { inspectionTemplatesApi } from "./inspection-templates.api";
import { inspectionTemplatesKeys } from "./inspection-templates.keys";
import type { ListQueryParams } from "@/shared/api";

export function useInspectionTemplatessList(params?: ListQueryParams) {
    return useQuery({
        queryKey: inspectionTemplatesKeys.list(params),
        queryFn: ({ signal }) => inspectionTemplatesApi.getList(params, signal),
    });
}

export function useInspectionTemplates(id: string) {
    return useQuery({
        queryKey: inspectionTemplatesKeys.detail(id),
        queryFn: ({ signal }) => inspectionTemplatesApi.getById(id, signal),
        enabled: !!id,
    });
}
