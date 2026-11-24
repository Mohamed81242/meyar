/**
 * Auth TanStack Query Hooks
 *
 * Query hooks for fetching auth data with caching and refetching.
 */

import type {
    ApiPermission,
    PermissionGroupApiResponse,
    RoleWithPermissions,
    User,
    UserAuthPermissionsData,
} from "@/auth/auth.types";
import type { ListQueryParams, SingleResponse } from "@/shared/api";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { authApi } from "./auth.api";

/**
 * Query keys factory for auth
 */
export const authQueryKeys = {
    all: ["auth"] as const,
    profile: () => [...authQueryKeys.all, "profile"] as const,
    permissions: () => [...authQueryKeys.all, "permissions"] as const,
    userPermissions: (group?: boolean) =>
        [...authQueryKeys.all, "user-permissions", { group }] as const,
    allPermissions: (group?: boolean) =>
        [...authQueryKeys.all, "all-permissions", { group }] as const,
    rolePermissions: (roleId: string | number) =>
        [...authQueryKeys.all, "role-permissions", roleId] as const,
    magicLink: (token: string) =>
        [...authQueryKeys.all, "magic-link", token] as const,
};

/**
 * Hook to fetch user profile
 */
export function useProfile(
    options?: Omit<
        UseQueryOptions<SingleResponse<User>, Error>,
        "queryKey" | "queryFn"
    >,
) {
    return useQuery({
        queryKey: authQueryKeys.profile(),
        queryFn: () => authApi.profile(),
        ...options,
    });
}

/**
 * Hook to verify magic link token
 */
export function useVerifyMagicLink(
    token: string,
    options?: Omit<
        UseQueryOptions<SingleResponse<User>, Error>,
        "queryKey" | "queryFn"
    >,
) {
    return useQuery({
        queryKey: authQueryKeys.magicLink(token),
        queryFn: () => authApi.verifyMagicLink(token),
        enabled: !!token,
        ...options,
    });
}

/**
 * Fetch all available permissions (system-managements)
 */
export function useAllPermissionsQuery(
    params?: ListQueryParams & { group?: boolean },
    options?: Omit<
        UseQueryOptions<
            SingleResponse<ApiPermission[] | PermissionGroupApiResponse[]>,
            Error
        >,
        "queryKey" | "queryFn"
    >,
) {
    const { group = false, ...queryParams } = params || {};
    return useQuery({
        queryKey: [...authQueryKeys.allPermissions(group), queryParams],
        queryFn: ({ signal }) => {
            if (group) {
                return authApi.getAllPermissions(
                    { group: true, ...queryParams },
                    signal,
                );
            }
            return authApi.getAllPermissions(
                { group: false, ...queryParams },
                signal,
            );
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        ...options,
    });
}
/**
 * Fetch user's assigned permissions
 */
/**
 * Fetch permissions for a specific role by ID
 */
export function usePermissionsByRoleQuery(
    roleId: string | number | undefined,
    options?: Omit<
        UseQueryOptions<SingleResponse<RoleWithPermissions[]>, Error>,
        "queryKey" | "queryFn"
    >,
) {
    return useQuery({
        queryKey: authQueryKeys.rolePermissions(roleId ?? ""),
        queryFn: ({ signal }) =>
            authApi.getPermissionsByRoleId(roleId!, signal),
        enabled: !!roleId,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        ...options,
    });
}

export function useAuthPermissionsQuery(
    options?: Omit<
        UseQueryOptions<
            SingleResponse<UserAuthPermissionsData | ApiPermission[] | string[] | PermissionGroupApiResponse[]>,
            Error
        >,
        "queryKey" | "queryFn"
    > & { group?: boolean },
) {
    const { group = false, ...queryOptions } = options || {};
    return useQuery({
        queryKey: authQueryKeys.userPermissions(group),
        queryFn: () => {
            if (group) {
                return authApi.getAuthPermissions({ group: true });
            }
            return authApi.getAuthPermissions({ group: false });
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: false,
        ...queryOptions,
    });
}
