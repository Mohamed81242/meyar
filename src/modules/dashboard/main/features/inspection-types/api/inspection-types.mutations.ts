import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inspectionTypesApi } from "./inspection-types.api";
import { inspectionTypesKeys } from "./inspection-types.keys";
import type { InspectionTypeCreatePayload, InspectionTypeUpdatePayload } from "../types";

export function useCreateInspectionType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: InspectionTypeCreatePayload) => inspectionTypesApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inspectionTypesKeys.lists() });
        },
    });
}

export const useCreateInspectionTypes = useCreateInspectionType;

export function useUpdateInspectionType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: InspectionTypeUpdatePayload }) =>
            inspectionTypesApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: inspectionTypesKeys.lists() });
            queryClient.invalidateQueries({ queryKey: inspectionTypesKeys.detail(id) });
        },
    });
}

export const useUpdateInspectionTypes = useUpdateInspectionType;

export function useDeleteInspectionType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => inspectionTypesApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inspectionTypesKeys.lists() });
        },
    });
}

export const useDeleteInspectionTypes = useDeleteInspectionType;
