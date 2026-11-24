/**
 * Permission Configuration
 *
 * Reusable permission configuration pattern for features.
 * Follows SOLID principles - Single Responsibility for each config.
 */

import { PERMISSIONS } from "./permissions.constants";

// ============================================================================
// Types
// ============================================================================

/**
 * Standard CRUD permission set for a resource
 */
export interface ResourcePermissions {
    viewAny: string;
    view: string;
    create: string;
    update: string;
    delete: string;
    restore?: string;
    forceDelete?: string;
    [key: string]: string | undefined;
}

/**
 * Permission configuration for a feature
 */
export interface FeaturePermissionConfig {
    /** Feature identifier */
    featureId: string;
    /** Resource permissions map */
    resources: Record<string, ResourcePermissions>;
}

/**
 * Route permission configuration
 */
export interface RoutePermissionConfig {
    /** Required permissions (user must have at least one) */
    permissions?: string[];
    /** Require all permissions instead of any */
    requireAll?: boolean;
    /** Required roles */
    roles?: string[];
}

/**
 * Action permission configuration for UI components
 */
export interface ActionPermissionConfig {
    /** Permission required for this action */
    permission: string;
    /** Fallback behavior when no permission */
    fallbackBehavior?: "hide" | "disable";
}

// ============================================================================
// Permission Builders
// ============================================================================

/**
 * Creates a standard CRUD permission set for a feature resource
 */
export function createResourcePermissions(
    resourceKey: keyof typeof PERMISSIONS,
): ResourcePermissions {
    const resource = PERMISSIONS[resourceKey] as Record<string, string>;

    return {
        viewAny: resource.VIEW_ANY ?? `${resourceKey.toLowerCase()}.viewAny`,
        view: resource.VIEW ?? `${resourceKey.toLowerCase()}.view`,
        create: resource.CREATE ?? `${resourceKey.toLowerCase()}.create`,
        update: resource.UPDATE ?? `${resourceKey.toLowerCase()}.update`,
        delete: resource.DELETE ?? `${resourceKey.toLowerCase()}.delete`,
        restore: resource.RESTORE,
        forceDelete: resource.FORCE_DELETE,
    };
}

/**
 * Creates permission config for list/view/create/edit/delete actions
 */
export function createCrudPermissionConfig(permissions: ResourcePermissions) {
    return {
        list: { permissions: [permissions.viewAny] },
        view: { permissions: [permissions.view] },
        create: { permissions: [permissions.create] },
        edit: { permissions: [permissions.update] },
        delete: { permissions: [permissions.delete] },
        restore: permissions.restore
            ? { permissions: [permissions.restore] }
            : undefined,
        forceDelete: permissions.forceDelete
            ? { permissions: [permissions.forceDelete] }
            : undefined,
    };
}

// ============================================================================
// Feature Permissions (1-to-1 per Feature Module)
// ============================================================================

export const overviewPermissions = {
    view: PERMISSIONS.OVERVIEW.VIEW,
    export: PERMISSIONS.OVERVIEW.EXPORT,
} as const;

export const usersPermissions = createResourcePermissions("USERS");
export const groupsPermissions = createResourcePermissions("GROUPS");
export const notasPermissions = createResourcePermissions("NOTAS");
export const billingPermissions = createResourcePermissions("BILLING");
export const bannersPermissions = createResourcePermissions("BANNERS");

export const settingsPermissions = createResourcePermissions("SETTINGS");
export const notificationsPermissions = createResourcePermissions("NOTIFICATIONS");
export const rolesPermissions = createResourcePermissions("ROLES_PERMISSIONS");
export const servicesPermissions = createResourcePermissions("SERVICES");
export const courtsPermissions = createResourcePermissions("COURTS");
export const faqPermissions = createResourcePermissions("FAQ");

// Aliases for compatibility
export const userPermissions = usersPermissions;
export const groupPermissions = groupsPermissions;
export const notaPermissions = notasPermissions;
export const bannerPermissions = bannersPermissions;
export const settingPermissions = settingsPermissions;
export const notificationPermissions = notificationsPermissions;
export const rolePermissions = rolesPermissions;
export const servicePermissions = servicesPermissions;
export const courtPermissions = courtsPermissions;
export const dashboardPermissions = overviewPermissions;

// ============================================================================
// All Feature Permissions Export
// ============================================================================

export const featurePermissions = {
    overview: overviewPermissions,
    users: usersPermissions,
    groups: groupsPermissions,
    notas: notasPermissions,
    billing: billingPermissions,
    banners: bannersPermissions,
    settings: settingsPermissions,
    notifications: notificationsPermissions,
    rolesPermissions: rolesPermissions,
    services: servicesPermissions,
    courts: courtsPermissions,
    faq: faqPermissions,
} as const;
