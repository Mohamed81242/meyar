import { useMutation, useQueryClient } from "@tanstack/react-query";
import { foldersOrClassificationsApi } from "./folders-or-classifications.api";
import { foldersOrClassificationsKeys } from "./folders-or-classifications.keys";

export function useCreateFoldersOrClassifications() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: foldersOrClassificationsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: foldersOrClassificationsKeys.lists() });
        },
    });
}

export function useUpdateFoldersOrClassifications() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => foldersOrClassificationsApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: foldersOrClassificationsKeys.lists() });
            queryClient.invalidateQueries({ queryKey: foldersOrClassificationsKeys.detail(id) });
        },
    });
}

export function useDeleteFoldersOrClassifications() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: foldersOrClassificationsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: foldersOrClassificationsKeys.lists() });
        },
    });
}
