import type { RouteConfig } from "@/router";

export const billingRoutes: RouteConfig[] = [
    {
        path: "billing",
        lazy: () =>
            import("@/modules/dashboard/settings/pages/SettingsPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "billing:title",
            requiresAuth: true,
        },
    },
    {
        path: "profile",
        lazy: () =>
            import("@/modules/dashboard/settings/pages/SettingsPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "settings:title",
            requiresAuth: true,
        },
    },
    {
        path: "profile/:tab?",
        lazy: () =>
            import("@/modules/dashboard/settings/pages/SettingsPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "settings:title",
            requiresAuth: true,
        },
    },
];
