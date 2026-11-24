import { useQuery } from "@tanstack/react-query";
import { companiesApi } from "./companies.api";
import { companiesKeys } from "./companies.keys";
import type { ListQueryParams } from "@/shared/api";

export function useCompaniessList(params?: ListQueryParams) {
    return useQuery({
        queryKey: companiesKeys.list(params),
        queryFn: ({ signal }) => companiesApi.getList(params, signal),
    });
}

export const useCompaniesList = useCompaniessList;

export function useCompanies(id: string) {
    return useQuery({
        queryKey: companiesKeys.detail(id),
        queryFn: ({ signal }) => companiesApi.getById(id, signal),
        enabled: !!id,
    });
}
