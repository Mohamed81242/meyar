import { useQuery } from "@tanstack/react-query";
import { registrationOfCompaniesApi } from "./registration-of-companies.api";
import { registrationOfCompaniesKeys } from "./registration-of-companies.keys";
import type { ListQueryParams } from "@/shared/api";

export function useRegistrationOfCompaniessList(params?: ListQueryParams) {
    return useQuery({
        queryKey: registrationOfCompaniesKeys.list(params),
        queryFn: ({ signal }) => registrationOfCompaniesApi.getList(params, signal),
    });
}

export function useRegistrationOfCompanies(id: string) {
    return useQuery({
        queryKey: registrationOfCompaniesKeys.detail(id),
        queryFn: ({ signal }) => registrationOfCompaniesApi.getById(id, signal),
        enabled: !!id,
    });
}
