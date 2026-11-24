import { useQuery } from "@tanstack/react-query";
import { inspectionTemplatesApi } from "./inspection-templates.api";
import { inspectionTemplatesKeys } from "./inspection-templates.keys";
import type { ListQueryParams } from "@/shared/api";

export function useInspectionTemplatesList(params?: ListQueryParams) {
    return useQuery({
        queryKey: inspectionTemplatesKeys.list(params),
        queryFn: ({ signal }) => inspectionTemplatesApi.getList(params, signal),
    });
}

// Backwards compatibility alias
export const useInspectionTemplatessList = useInspectionTemplatesList;

export function useInspectionTemplate(id: string) {
    return useQuery({
        queryKey: inspectionTemplatesKeys.detail(id),
        queryFn: ({ signal }) => inspectionTemplatesApi.getById(id, signal),
        enabled: Boolean(id),
    });
}

export const useInspectionTemplates = useInspectionTemplate;
