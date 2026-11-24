import type { RouteConfig } from "@/router";

export const foldersOrClassificationsRoutes: RouteConfig[] = [
    {
        path: "folders-or-classifications",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "folders-or-classifications:title",
            requiresAuth: true,
        },
        requireAllPermissions: true,
    },
    {
        path: "folders-classifications",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "folders-or-classifications:title",
            requiresAuth: true,
        },
        requireAllPermissions: true,
    },
    {
        path: "folders_or_classifications",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "folders-or-classifications:title",
            requiresAuth: true,
        },
        requireAllPermissions: true,
    },
];
