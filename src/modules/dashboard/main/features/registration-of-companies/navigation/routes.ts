import type { RouteConfig } from "@/router";

export const registrationOfCompaniesRoutes: RouteConfig[] = [
    {
        path: "registration-of-companies",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "registration-of-companies:title",
            requiresAuth: true,
        },
        requireAllPermissions: true,
    },
];
