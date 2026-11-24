import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rolesAndPermissionsApi } from "./roles-and-permissions.api";
import { rolesAndPermissionsKeys } from "./roles-and-permissions.keys";

export function useCreateRolesAndPermissions() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: rolesAndPermissionsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: rolesAndPermissionsKeys.lists() });
        },
    });
}

export function useUpdateRolesAndPermissions() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => rolesAndPermissionsApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: rolesAndPermissionsKeys.lists() });
            queryClient.invalidateQueries({ queryKey: rolesAndPermissionsKeys.detail(id) });
        },
    });
}

export function useDeleteRolesAndPermissions() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: rolesAndPermissionsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: rolesAndPermissionsKeys.lists() });
        },
    });
}
