import { createElement } from "react";
import { Navigate } from "react-router-dom";
import type { RouteConfig } from "@/router";

export const billingRoutes: RouteConfig[] = [
    {
        index: true,
        element: createElement(Navigate, { to: "/dashboard/billing", replace: true }),
    },
    {
        path: "overview",
        element: createElement(Navigate, { to: "/dashboard/billing", replace: true }),
    },
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
