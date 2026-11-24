import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "./users.api";
import { usersKeys } from "./users.keys";

export function useCreateUsers() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: usersApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
        },
    });
}

export function useUpdateUsers() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => usersApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
            queryClient.invalidateQueries({ queryKey: usersKeys.detail(id) });
        },
    });
}

export function useDeleteUsers() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: usersApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
        },
    });
}
