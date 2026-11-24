import type { RouteConfig } from "@/router";

export const sortingMechanismsRoutes: RouteConfig[] = [
    {
        path: "sorting-mechanisms",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "sorting-mechanisms:title",
            requiresAuth: true,
        },
        requireAllPermissions: true,
    },
];
