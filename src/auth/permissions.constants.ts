/**
 * Permission Constants
 *
 * Unified, feature-based permission constants for Nota Dashboard.
 * Maps 1-to-1 to each dashboard feature/module and its CRUD operations.
 */

export const PERMISSIONS = {
    // 1. Overview & Analytics
    OVERVIEW: {
        VIEW: "overview.view",
        EXPORT: "overview.export",
    },

    // 2. Lawyers & Users
    USERS: {
        VIEW_ANY: "users.viewAny",
        VIEW: "users.view",
        CREATE: "users.create",
        UPDATE: "users.update",
        DELETE: "users.delete",
        RESTORE: "users.restore",
        FORCE_DELETE: "users.forceDelete",
        BLOCK: "users.block",
        UNBLOCK: "users.unblock",
        VERIFY: "users.verify",
    },

    // 3. Groups & Community
    GROUPS: {
        VIEW_ANY: "groups.viewAny",
        VIEW: "groups.view",
        CREATE: "groups.create",
        UPDATE: "groups.update",
        DELETE: "groups.delete",
        MODERATE: "groups.moderate",
    },

    // 4. Delegations & Notas
    NOTAS: {
        VIEW_ANY: "notas.viewAny",
        VIEW: "notas.view",
        CREATE: "notas.create",
        UPDATE: "notas.update",
        DELETE: "notas.delete",
        RESTORE: "notas.restore",
        FORCE_DELETE: "notas.forceDelete",
        MODERATE: "notas.moderate",
        APPROVE: "notas.approve",
        REJECT: "notas.reject",
    },

    // 5. Billing & Finance
    BILLING: {
        VIEW_ANY: "billing.viewAny",
        VIEW: "billing.view",
        CREATE: "billing.create",
        UPDATE: "billing.update",
        DELETE: "billing.delete",
        ADJUST: "billing.adjust",
        EXPORT: "billing.export",
    },

    // 6. Banners & Sponsored Ads
    BANNERS: {
        VIEW_ANY: "banners.viewAny",
        VIEW: "banners.view",
        CREATE: "banners.create",
        UPDATE: "banners.update",
        DELETE: "banners.delete",
        RESTORE: "banners.restore",
        FORCE_DELETE: "banners.forceDelete",
    },

    // 7. System Settings
    SETTINGS: {
        VIEW_ANY: "settings.viewAny",
        VIEW: "settings.view",
        CREATE: "settings.create",
        UPDATE: "settings.update",
        DELETE: "settings.delete",
        RESTORE: "settings.restore",
        FORCE_DELETE: "settings.forceDelete",
    },

    // 8. Notifications
    NOTIFICATIONS: {
        VIEW_ANY: "notifications.viewAny",
        VIEW: "notifications.view",
        CREATE: "notifications.create",
        UPDATE: "notifications.update",
        DELETE: "notifications.delete",
        RESTORE: "notifications.restore",
        FORCE_DELETE: "notifications.forceDelete",
        SEND: "notifications.send",
    },

    // 9. Roles & Permissions
    ROLES_PERMISSIONS: {
        VIEW_ANY: "roles.viewAny",
        VIEW: "roles.view",
        CREATE: "roles.create",
        UPDATE: "roles.update",
        DELETE: "roles.delete",
        RESTORE: "roles.restore",
        FORCE_DELETE: "roles.forceDelete",
        ASSIGN: "roles.assign",
    },

    // 10. Legal Services Catalog
    SERVICES: {
        VIEW_ANY: "services.viewAny",
        VIEW: "services.view",
        CREATE: "services.create",
        UPDATE: "services.update",
        DELETE: "services.delete",
        RESTORE: "services.restore",
        FORCE_DELETE: "services.forceDelete",
    },

    // 11. Courts & Judicial Locations
    COURTS: {
        VIEW_ANY: "courts.viewAny",
        VIEW: "courts.view",
        CREATE: "courts.create",
        UPDATE: "courts.update",
        DELETE: "courts.delete",
        RESTORE: "courts.restore",
        FORCE_DELETE: "courts.forceDelete",
    },

    // 12. Frequently Asked Questions
    FAQ: {
        VIEW_ANY: "faq.viewAny",
        VIEW: "faq.view",
        CREATE: "faq.create",
        UPDATE: "faq.update",
        DELETE: "faq.delete",
        RESTORE: "faq.restore",
        FORCE_DELETE: "faq.forceDelete",
    },

    // 13. Story Tags
    TAGS: {
        VIEW_ANY: "tags.viewAny",
        VIEW: "tags.view",
        CREATE: "tags.create",
        UPDATE: "tags.update",
        DELETE: "tags.delete",
        RESTORE: "tags.restore",
        FORCE_DELETE: "tags.forceDelete",
    },
} as const;

/**
 * Backward-compatibility aliases (singular names mapping directly to feature constants)
 */
export const PERMISSION_ALIASES = {
    DASHBOARD: PERMISSIONS.OVERVIEW,
    USER: PERMISSIONS.USERS,
    COMMUNITY: PERMISSIONS.GROUPS,
    GROUP: PERMISSIONS.GROUPS,
    NOTA: PERMISSIONS.NOTAS,
    DELEGATION: PERMISSIONS.NOTAS,
    FINANCE: PERMISSIONS.BILLING,
    BANNER: PERMISSIONS.BANNERS,
    AD: PERMISSIONS.BANNERS,
    SETTING: PERMISSIONS.SETTINGS,
    NOTIFICATION: PERMISSIONS.NOTIFICATIONS,
    ROLE: PERMISSIONS.ROLES_PERMISSIONS,
    SERVICE: PERMISSIONS.SERVICES,
    COURT: PERMISSIONS.COURTS,
    TAG: PERMISSIONS.TAGS,
} as const;

/**
 * Feature group names for UI display
 */
export const PERMISSION_GROUPS = {
    OVERVIEW: "Overview",
    USERS: "Users",
    GROUPS: "Groups",
    NOTAS: "Notas",
    BILLING: "Billing",
    BANNERS: "Banners",
    SETTINGS: "Settings",
    NOTIFICATIONS: "Notifications",
    ROLES_PERMISSIONS: "Roles & Permissions",
    SERVICES: "Services",
    COURTS: "Courts",
    FAQ: "FAQ",
    TAGS: "Story Tags",
} as const;

/**
 * Type for all permission values
 */
export type PermissionValue =
    (typeof PERMISSIONS)[keyof typeof PERMISSIONS][keyof (typeof PERMISSIONS)[keyof typeof PERMISSIONS]];

/**
 * Type for permission group names
 */
export type PermissionGroupName =
    (typeof PERMISSION_GROUPS)[keyof typeof PERMISSION_GROUPS];
