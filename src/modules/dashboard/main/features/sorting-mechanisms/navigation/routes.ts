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
    {
        path: "sorting_mechanisms",
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
    {
        path: "review_criteria/mechanisms",
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
    {
        path: "review-criteria/mechanisms",
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
    {
        path: "mechanisms",
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
