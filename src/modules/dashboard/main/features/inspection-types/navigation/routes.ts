import type { RouteConfig } from "@/router";

export const inspectionTypesRoutes: RouteConfig[] = [
    {
        path: "inspection-types",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "inspection-types:title",
            requiresAuth: true,
        },
        requireAllPermissions: true,
    },
];
