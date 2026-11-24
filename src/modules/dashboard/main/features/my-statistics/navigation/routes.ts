import type { RouteConfig } from "@/router";

export const myStatisticsRoutes: RouteConfig[] = [
    {
        path: "my-statistics",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "my-statistics:title",
            requiresAuth: true,
        },
        requireAllPermissions: true,
    },
];
