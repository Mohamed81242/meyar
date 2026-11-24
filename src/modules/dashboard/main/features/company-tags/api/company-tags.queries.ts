import { useQuery } from "@tanstack/react-query";
import { companyTagsApi } from "./company-tags.api";
import { companyTagsKeys } from "./company-tags.keys";
import type { ListQueryParams } from "@/shared/api";

export function useCompanyTagsList(params?: ListQueryParams) {
    return useQuery({
        queryKey: companyTagsKeys.list(params),
        queryFn: ({ signal }) => companyTagsApi.getList(params, signal),
    });
}

// Backwards compatibility alias
export const useCompanyTagssList = useCompanyTagsList;

export function useCompanyTag(id: string) {
    return useQuery({
        queryKey: companyTagsKeys.detail(id),
        queryFn: ({ signal }) => companyTagsApi.getById(id, signal),
        enabled: Boolean(id),
    });
}

export const useCompanyTags = useCompanyTag;
