import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inspectionTemplatesApi } from "./inspection-templates.api";
import { inspectionTemplatesKeys } from "./inspection-templates.keys";

export function useCreateInspectionTemplates() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: inspectionTemplatesApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inspectionTemplatesKeys.lists() });
        },
    });
}

export function useUpdateInspectionTemplates() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => inspectionTemplatesApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: inspectionTemplatesKeys.lists() });
            queryClient.invalidateQueries({ queryKey: inspectionTemplatesKeys.detail(id) });
        },
    });
}

export function useDeleteInspectionTemplates() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: inspectionTemplatesApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inspectionTemplatesKeys.lists() });
        },
    });
}
