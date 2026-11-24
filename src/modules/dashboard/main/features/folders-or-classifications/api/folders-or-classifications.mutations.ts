import { useMutation, useQueryClient } from "@tanstack/react-query";
import { foldersOrClassificationsApi } from "./folders-or-classifications.api";
import { foldersOrClassificationsKeys } from "./folders-or-classifications.keys";
import type { TemplateFolderCreatePayload, TemplateFolderUpdatePayload } from "../types";

export function useCreateFoldersOrClassification() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: TemplateFolderCreatePayload) => foldersOrClassificationsApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: foldersOrClassificationsKeys.lists() });
        },
    });
}

export const useCreateFoldersOrClassifications = useCreateFoldersOrClassification;

export function useUpdateFoldersOrClassification() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: TemplateFolderUpdatePayload }) =>
            foldersOrClassificationsApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: foldersOrClassificationsKeys.lists() });
            queryClient.invalidateQueries({ queryKey: foldersOrClassificationsKeys.detail(id) });
        },
    });
}

export const useUpdateFoldersOrClassifications = useUpdateFoldersOrClassification;

export function useDeleteFoldersOrClassification() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => foldersOrClassificationsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: foldersOrClassificationsKeys.lists() });
        },
    });
}

export const useDeleteFoldersOrClassifications = useDeleteFoldersOrClassification;
