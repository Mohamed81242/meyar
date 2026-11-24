import type { RouteConfig } from "@/router";

export const proceduresRoutes: RouteConfig[] = [
    {
        path: "procedures",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "procedures:title",
            requiresAuth: true,
        },
        requireAllPermissions: true,
    },
];
