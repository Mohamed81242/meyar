/**
 * useNavItems Hook
 *
 * Returns filtered navigation items based on current user's role and permissions.
 * Uses the existing usePermissions hook for permission checking.
 * Also filters based on acceptance exam status for students.
 *
 * @example
 * ```tsx
 * const { sections, flatItems, findByHref } = useNavItems();
 *
 * // Render sections in sidebar
 * sections.map(section => (
 *     <NavSection key={section.id} {...section} />
 * ));
 * ```
 */

import { authStore } from "@/auth/auth.store";
import type { Permission } from "@/auth/auth.types";
import { usePermissions } from "@/auth/usePermissions";
import { useCallback, useMemo } from "react";
import type {
    NavFilterOptions,
    NavItem,
    NavModuleKey,
    NavSectionConfig,
} from "../nav.types";
import { navRegistry } from "../navRegistry";

interface UseNavItemsReturn {
    /**
     * Sections with their filtered items
     */
    sections: Array<NavSectionConfig & { items: NavItem[] }>;

    /**
     * Flat list of all accessible items
     */
    flatItems: NavItem[];

    /**
     * Find nav item by href
     */
    findByHref: (href: string) => NavItem | undefined;

    /**
     * Check if a path is active
     */
    isActive: (href: string, currentPath: string) => boolean;

    /**
     * Permission utilities from usePermissions hook
     */
    hasPermission: (permission: Permission) => boolean;
    hasAnyPermission: (permissions: Permission[]) => boolean;
    hasAllPermissions: (permissions: Permission[]) => boolean;
    hasRole: (role: string) => boolean;
    hasAnyRole: (roles: string[]) => boolean;

    /**
     * Current user's permissions
     */
    permissions: Permission[];

    /**
     * Whether the student needs to complete the acceptance exam
     */
    // needsAcceptanceExam: boolean;
}

export const useNavItems = (
    moduleKey?: NavModuleKey,
    overrideOptions?: Partial<NavFilterOptions>,
): UseNavItemsReturn => {
    // Subscribe to user changes from auth store to react to login/logout
    const user = authStore((state) => state.user);

    const {
        permissions,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        hasAnyRole,
    } = usePermissions();

    // Get user role for filtering
    const userRole = useMemo(() => {
        const roleStr = typeof user?.role === "string" ? user.role : user?.role?.name;
        return roleStr?.toLowerCase() as NavFilterOptions["role"];
    }, [user?.role]);

    const filterOptions: NavFilterOptions = useMemo(
        () => ({
            role: userRole,
            permissions,
            includeHidden: false,
            module: moduleKey,
            ...overrideOptions,
        }),
        [userRole, permissions, moduleKey, overrideOptions],
    );

    const sections = useMemo(() => {
        const allSections = navRegistry.getSectionsWithItems(filterOptions);

        return allSections.filter((section) => section.items.length > 0);
    }, [filterOptions]);

    const flatItems = useMemo(
        () => navRegistry.getFlatList(filterOptions),
        [filterOptions],
    );

    const findByHref = useCallback((href: string): NavItem | undefined => {
        return navRegistry.findByHref(href);
    }, []);

    const isActive = useCallback(
        (href: string, currentPath: string): boolean => {
            if (href === currentPath) return true;
            // Check if current path starts with href (for nested routes)
            if (href !== "/" && currentPath.startsWith(href)) return true;
            return false;
        },
        [],
    );

    return {
        sections,
        flatItems,
        findByHref,
        isActive,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        hasAnyRole,
        permissions,
        // needsAcceptanceExam,
    };
};

export default useNavItems;
