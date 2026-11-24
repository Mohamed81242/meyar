import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sortingMechanismsApi } from "./sorting-mechanisms.api";
import { sortingMechanismsKeys } from "./sorting-mechanisms.keys";

export function useCreateSortingMechanisms() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: sortingMechanismsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sortingMechanismsKeys.lists() });
        },
    });
}

export function useUpdateSortingMechanisms() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => sortingMechanismsApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: sortingMechanismsKeys.lists() });
            queryClient.invalidateQueries({ queryKey: sortingMechanismsKeys.detail(id) });
        },
    });
}

export function useDeleteSortingMechanisms() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: sortingMechanismsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sortingMechanismsKeys.lists() });
        },
    });
}
