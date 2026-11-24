import type { RouteConfig } from "@/router";

export const inspectionTemplatesRoutes: RouteConfig[] = [
    {
        path: "inspection-templates",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "inspection-templates:title",
            requiresAuth: true,
        },
        requireAllPermissions: true,
    },
    {
        path: "inspection_templates",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "inspection-templates:title",
            requiresAuth: true,
        },
        requireAllPermissions: true,
    },
];
