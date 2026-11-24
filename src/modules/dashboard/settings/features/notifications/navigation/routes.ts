import { PERMISSIONS } from "@/auth";
import type { RouteConfig } from "@/router";

export const notificationsRoutes: RouteConfig[] = [
    {
        path: "notifications",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "notifications:title",
            requiresAuth: true,
        },
        permissions: [PERMISSIONS.NOTIFICATIONS.VIEW_ANY, PERMISSIONS.NOTIFICATIONS.VIEW],
    },
];
