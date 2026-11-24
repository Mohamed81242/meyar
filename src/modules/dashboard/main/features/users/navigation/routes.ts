import type { RouteConfig } from "@/router";

export const usersRoutes: RouteConfig[] = [
    {
        path: "users",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "users:title",
            requiresAuth: true,
        },
        requireAllPermissions: true,
    },
];
