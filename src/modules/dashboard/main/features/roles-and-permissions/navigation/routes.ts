import type { RouteConfig } from "@/router";

export const rolesAndPermissionsRoutes: RouteConfig[] = [
    {
        path: "roles-and-permissions",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "roles-and-permissions:title",
            requiresAuth: true,
        },
        requireAllPermissions: true,
    },
    {
        path: "roles_and_permissions",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "roles-and-permissions:title",
            requiresAuth: true,
        },
        requireAllPermissions: true,
    },
    {
        path: "roles and permissions",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "roles-and-permissions:title",
            requiresAuth: true,
        },
        requireAllPermissions: true,
    },
];
