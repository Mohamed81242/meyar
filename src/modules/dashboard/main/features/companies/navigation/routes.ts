import type { RouteConfig } from "@/router";

export const companiesRoutes: RouteConfig[] = [
    {
        path: "companies",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "companies:title",
            requiresAuth: true,
        },
        requireAllPermissions: true,
    },
];
