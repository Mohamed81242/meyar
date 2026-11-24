import { useMutation, useQueryClient } from "@tanstack/react-query";
import { evaluationOptionsApi } from "./evaluation-options.api";
import { evaluationOptionsKeys } from "./evaluation-options.keys";

export function useCreateEvaluationOptions() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: evaluationOptionsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: evaluationOptionsKeys.lists() });
        },
    });
}

export function useUpdateEvaluationOptions() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => evaluationOptionsApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: evaluationOptionsKeys.lists() });
            queryClient.invalidateQueries({ queryKey: evaluationOptionsKeys.detail(id) });
        },
    });
}

export function useDeleteEvaluationOptions() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: evaluationOptionsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: evaluationOptionsKeys.lists() });
        },
    });
}
