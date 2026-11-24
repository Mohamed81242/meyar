import { useMutation, useQueryClient } from "@tanstack/react-query";
import { proceduresApi } from "./procedures.api";
import { proceduresKeys } from "./procedures.keys";

export function useCreateProcedures() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: proceduresApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: proceduresKeys.lists() });
        },
    });
}

export function useUpdateProcedures() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => proceduresApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: proceduresKeys.lists() });
            queryClient.invalidateQueries({ queryKey: proceduresKeys.detail(id) });
        },
    });
}

export function useDeleteProcedures() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: proceduresApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: proceduresKeys.lists() });
        },
    });
}
