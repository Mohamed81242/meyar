import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registrationOfCompaniesApi } from "./registration-of-companies.api";
import { registrationOfCompaniesKeys } from "./registration-of-companies.keys";

export function useCreateRegistrationOfCompanies() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: registrationOfCompaniesApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: registrationOfCompaniesKeys.lists() });
        },
    });
}

export function useUpdateRegistrationOfCompanies() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => registrationOfCompaniesApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: registrationOfCompaniesKeys.lists() });
            queryClient.invalidateQueries({ queryKey: registrationOfCompaniesKeys.detail(id) });
        },
    });
}

export function useDeleteRegistrationOfCompanies() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: registrationOfCompaniesApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: registrationOfCompaniesKeys.lists() });
        },
    });
}
