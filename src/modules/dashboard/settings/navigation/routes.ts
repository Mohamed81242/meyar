import type { FeatureRouteModule, RouteConfig } from "@/router/routes.types";

export const settingsRoutes: RouteConfig[] = [
    {
        index: true,
        lazy: () =>
            import("../pages/SettingsPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "settings:title",
            requiresAuth: true,
        },
    },
    {
        path: ":tab",
        lazy: () =>
            import("../pages/SettingsPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "settings:title",
            requiresAuth: true,
        },
    },
];

export const settingsRouteModule: FeatureRouteModule = {
    id: "settings",
    name: "Settings",
    basePath: "/dashboard/settings",
    layout: "dashboard-main",
    routes: {
        children: settingsRoutes,
    },
};

export default settingsRouteModule;
