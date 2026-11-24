/**
 * usePermissions Hook
 *
 * Hook for checking user permissions.
 * Integrates with the permission store and supports API-fetched permissions.
 */

import { authStore } from "@/auth/auth.store";
import { useAuthPermissionsQuery } from "@/modules/auth/features/auth/api/auth.queries";
import { useMemo } from "react";

/**
 * Helper to safely extract permission strings from various response structures:
 * - { permissions: string[] }
 * - string[]
 * - ApiPermission[] ({ id, name, ... })
 */
function extractPermissionStrings(data: unknown): string[] {
    if (!data) return [];

    // If it's an array
    if (Array.isArray(data)) {
        return data.map((item) => {
            if (typeof item === "string") return item;
            if (item && typeof item === "object" && "name" in item && typeof item.name === "string") {
                return item.name;
            }
            return String(item);
        });
    }

    // If it's an object containing permissions array: { permissions: [...], ... }
    if (typeof data === "object" && data !== null) {
        const obj = data as Record<string, unknown>;
        if (Array.isArray(obj.permissions)) {
            return extractPermissionStrings(obj.permissions);
        }
        if (Array.isArray(obj.data)) {
            return extractPermissionStrings(obj.data);
        }
    }

    return [];
}

/**
 * Check if a permission matches (supports wildcards and aliases)
 */
function permissionMatches(userPerm: string, required: string): boolean {
    if (userPerm === "*") return true;
    if (userPerm === required) return true;
    if (userPerm.endsWith(".*") && required.startsWith(userPerm.slice(0, -2)))
        return true;
    if (userPerm.startsWith("*.") && required.endsWith(userPerm.slice(1)))
        return true;

    // Normalize singular/plural (e.g., "user.create" matching "users.create" or vice versa)
    const normalize = (p: string) => {
        const parts = p.split(".");
        if (parts.length === 2) {
            let [resource, action] = parts;
            if (resource.endsWith("s")) resource = resource.slice(0, -1);
            return `${resource}.${action}`;
        }
        return p;
    };

    if (normalize(userPerm) === normalize(required)) return true;

    return false;
}

/**
 * Hook for checking user permissions
 *
 * @example
 * ```tsx
 * const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();
 *
 * if (hasPermission('users.create')) {
 *     // Show create button
 * }
 *
 * if (hasAnyPermission(['users.update', 'users.delete'])) {
 *     // Show actions menu
 * }
 * ```
 */
export function usePermissions() {
    const isAuthenticated = authStore((state) => state.isAuthenticated);
    const user = authStore((state) => state.user);

    // Fetch user permissions from backend API
    const {
        data: permissionsData,
        isLoading,
        error,
    } = useAuthPermissionsQuery({
        enabled: isAuthenticated,
        group: false, // flat list
    });

    const userPermissionsNames = useMemo(() => {
        const fromUser = extractPermissionStrings(user?.permissions);
        const fromApi = extractPermissionStrings(permissionsData?.data ?? permissionsData);

        const list = Array.from(new Set([...fromUser, ...fromApi]));
        return list;
    }, [user?.permissions, permissionsData]);

    const hasPermission = (permission: string) =>
        userPermissionsNames.some((p) => permissionMatches(p, permission));

    const hasAnyPermission = (perms: string[]) => perms.some(hasPermission);

    const hasAllPermissions = (perms: string[]) => perms.every(hasPermission);

    const hasRole = (role: string) => {
        const roleStr = typeof user?.role === "object" && user?.role !== null
            ? (user.role as any).name
            : user?.role;
        return String(roleStr || "").toLowerCase() === role.toLowerCase();
    };

    const hasAnyRole = (roles: string[]) => roles.some(hasRole);

    const hasAllRoles = (roles: string[]) => roles.every(hasRole);

    return {
        permissions: userPermissionsNames,
        isPermissionsLoaded: !isLoading || Boolean(user?.permissions?.length) || Boolean(userPermissionsNames.length),
        isPermissionsLoading: isLoading && !user?.permissions?.length && !userPermissionsNames.length,
        permissionsError: error,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        hasAnyRole,
        hasAllRoles,
    };
}

export default usePermissions;
