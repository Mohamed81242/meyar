import type { RouteConfig } from "@/router";

export const inspectionTasksRoutes: RouteConfig[] = [
    {
        path: "inspection-tasks",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "inspection-tasks:title",
            requiresAuth: true,
        },
        requireAllPermissions: true,
    },
];
