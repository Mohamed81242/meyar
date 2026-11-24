import type { RouteConfig } from "@/router";

export const companyTagsRoutes: RouteConfig[] = [
    {
        path: "company-tags",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "company-tags:title",
            requiresAuth: true,
        },
        requireAllPermissions: true,
    },
    {
        path: "company_tags",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "company-tags:title",
            requiresAuth: true,
        },
        requireAllPermissions: true,
    },
];
