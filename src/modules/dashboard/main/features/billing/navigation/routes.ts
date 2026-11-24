import { PERMISSIONS } from "@/auth";
import type { RouteConfig } from "@/router";

export const billingRoutes: RouteConfig[] = [
    {
        path: "billing",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "billing:title",
            requiresAuth: true,
        },
        permissions: [PERMISSIONS.BILLING.VIEW_ANY, PERMISSIONS.BILLING.VIEW],
    },
];
