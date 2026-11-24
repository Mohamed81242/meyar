import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companiesApi } from "./companies.api";
import { companiesKeys } from "./companies.keys";

export function useCreateCompanies() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: companiesApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: companiesKeys.lists() });
        },
    });
}

export function useUpdateCompanies() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => companiesApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: companiesKeys.lists() });
            queryClient.invalidateQueries({ queryKey: companiesKeys.detail(id) });
        },
    });
}

export function useDeleteCompanies() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: companiesApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: companiesKeys.lists() });
        },
    });
}
