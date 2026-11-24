import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companyTagsApi } from "./company-tags.api";
import { companyTagsKeys } from "./company-tags.keys";
import type { CompanyTagCreatePayload, CompanyTagUpdatePayload } from "../types";

export function useCreateCompanyTag() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CompanyTagCreatePayload) => companyTagsApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: companyTagsKeys.lists() });
        },
    });
}

export const useCreateCompanyTags = useCreateCompanyTag;

export function useUpdateCompanyTag() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CompanyTagUpdatePayload }) =>
            companyTagsApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: companyTagsKeys.lists() });
            queryClient.invalidateQueries({ queryKey: companyTagsKeys.detail(id) });
        },
    });
}

export const useUpdateCompanyTags = useUpdateCompanyTag;

export function useDeleteCompanyTag() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => companyTagsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: companyTagsKeys.lists() });
        },
    });
}

export const useDeleteCompanyTags = useDeleteCompanyTag;
