import type { RouteConfig } from "@/router";

export const statisticsLiveRoutes: RouteConfig[] = [
    {
        path: "statistics-live",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "statistics-live:title",
            requiresAuth: true,
        },
        requireAllPermissions: true,
    },
];
