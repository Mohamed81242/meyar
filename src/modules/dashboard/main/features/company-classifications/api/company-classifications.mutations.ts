import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companyClassificationsApi } from "./company-classifications.api";
import { companyClassificationsKeys } from "./company-classifications.keys";

export function useCreateCompanyClassifications() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: companyClassificationsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: companyClassificationsKeys.lists() });
        },
    });
}

export function useUpdateCompanyClassifications() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => companyClassificationsApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: companyClassificationsKeys.lists() });
            queryClient.invalidateQueries({ queryKey: companyClassificationsKeys.detail(id) });
        },
    });
}

export function useDeleteCompanyClassifications() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: companyClassificationsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: companyClassificationsKeys.lists() });
        },
    });
}
