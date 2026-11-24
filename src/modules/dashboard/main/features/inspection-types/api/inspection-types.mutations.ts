import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inspectionTypesApi } from "./inspection-types.api";
import { inspectionTypesKeys } from "./inspection-types.keys";

export function useCreateInspectionTypes() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: inspectionTypesApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inspectionTypesKeys.lists() });
        },
    });
}

export function useUpdateInspectionTypes() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => inspectionTypesApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: inspectionTypesKeys.lists() });
            queryClient.invalidateQueries({ queryKey: inspectionTypesKeys.detail(id) });
        },
    });
}

export function useDeleteInspectionTypes() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: inspectionTypesApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inspectionTypesKeys.lists() });
        },
    });
}
