import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companyTagsApi } from "./company-tags.api";
import { companyTagsKeys } from "./company-tags.keys";

export function useCreateCompanyTags() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: companyTagsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: companyTagsKeys.lists() });
        },
    });
}

export function useUpdateCompanyTags() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => companyTagsApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: companyTagsKeys.lists() });
            queryClient.invalidateQueries({ queryKey: companyTagsKeys.detail(id) });
        },
    });
}

export function useDeleteCompanyTags() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: companyTagsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: companyTagsKeys.lists() });
        },
    });
}
