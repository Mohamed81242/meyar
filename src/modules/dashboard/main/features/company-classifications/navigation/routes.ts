import type { RouteConfig } from "@/router";

export const companyClassificationsRoutes: RouteConfig[] = [
    {
        path: "company-classifications",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "company-classifications:title",
            requiresAuth: true,
        },
        requireAllPermissions: true,
    },
];
