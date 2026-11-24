import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inspectionTemplatesApi } from "./inspection-templates.api";
import { inspectionTemplatesKeys } from "./inspection-templates.keys";
import type {
    InspectionTemplateCreatePayload,
    InspectionTemplateUpdatePayload,
} from "../types";

export function useCreateInspectionTemplate() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: InspectionTemplateCreatePayload) =>
            inspectionTemplatesApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inspectionTemplatesKeys.lists() });
        },
    });
}

export const useCreateInspectionTemplates = useCreateInspectionTemplate;

export function useUpdateInspectionTemplate() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: InspectionTemplateUpdatePayload;
        }) => inspectionTemplatesApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: inspectionTemplatesKeys.lists() });
            queryClient.invalidateQueries({ queryKey: inspectionTemplatesKeys.detail(id) });
        },
    });
}

export const useUpdateInspectionTemplates = useUpdateInspectionTemplate;

export function useDeleteInspectionTemplate() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => inspectionTemplatesApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inspectionTemplatesKeys.lists() });
        },
    });
}

export const useDeleteInspectionTemplates = useDeleteInspectionTemplate;
