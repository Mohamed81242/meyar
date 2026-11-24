import { useQuery } from "@tanstack/react-query";
import { rolesAndPermissionsApi } from "./roles-and-permissions.api";
import { rolesAndPermissionsKeys } from "./roles-and-permissions.keys";
import type { ListQueryParams } from "@/shared/api";

export function useRolesAndPermissionssList(params?: ListQueryParams) {
    return useQuery({
        queryKey: rolesAndPermissionsKeys.list(params),
        queryFn: ({ signal }) => rolesAndPermissionsApi.getList(params, signal),
    });
}

export function useRolesAndPermissions(id: string) {
    return useQuery({
        queryKey: rolesAndPermissionsKeys.detail(id),
        queryFn: ({ signal }) => rolesAndPermissionsApi.getById(id, signal),
        enabled: !!id,
    });
}
