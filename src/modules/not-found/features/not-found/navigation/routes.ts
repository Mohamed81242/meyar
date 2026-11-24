/**
 * Not Found Feature - Routes
 *
 * Route configuration for the 404 not found page.
 */

import type { FeatureRouteModule } from "@/router/routes.types";

/**
 * Not Found feature route module
 *
 * Explicit /404 route. The actual router entry is wired in main.tsx
 * to ensure it matches before the /:slug/* catch-all.
 */
export const notFoundRoutes: FeatureRouteModule = {
    id: "not-found",
    name: "Not Found",
    basePath: "/404",
    layout: "site",
    routes: {
        lazy: () => import("../pages/NotFoundPage"),
        meta: {
            titleKey: "dashboard:pages.shared.auth.notFound.pageNotFound",
        },
    },
};

export default notFoundRoutes;
