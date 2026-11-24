import type { RouteConfig } from "@/router";

export const evaluationOptionsRoutes: RouteConfig[] = [
    {
        path: "evaluation-options",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "evaluation-options:title",
            requiresAuth: true,
        },
        requireAllPermissions: true,
    },
];
