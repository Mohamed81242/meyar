import { useQuery } from "@tanstack/react-query";
import { companyTagsApi } from "./company-tags.api";
import { companyTagsKeys } from "./company-tags.keys";
import type { ListQueryParams } from "@/shared/api";

export function useCompanyTagssList(params?: ListQueryParams) {
    return useQuery({
        queryKey: companyTagsKeys.list(params),
        queryFn: ({ signal }) => companyTagsApi.getList(params, signal),
    });
}

export function useCompanyTags(id: string) {
    return useQuery({
        queryKey: companyTagsKeys.detail(id),
        queryFn: ({ signal }) => companyTagsApi.getById(id, signal),
        enabled: !!id,
    });
}
