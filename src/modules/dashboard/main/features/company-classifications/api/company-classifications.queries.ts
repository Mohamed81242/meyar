import { useQuery } from "@tanstack/react-query";
import { companyClassificationsApi } from "./company-classifications.api";
import { companyClassificationsKeys } from "./company-classifications.keys";
import type { ListQueryParams } from "@/shared/api";

export function useCompanyClassificationssList(params?: ListQueryParams) {
    return useQuery({
        queryKey: companyClassificationsKeys.list(params),
        queryFn: ({ signal }) => companyClassificationsApi.getList(params, signal),
    });
}

export function useCompanyClassifications(id: string) {
    return useQuery({
        queryKey: companyClassificationsKeys.detail(id),
        queryFn: ({ signal }) => companyClassificationsApi.getById(id, signal),
        enabled: !!id,
    });
}
