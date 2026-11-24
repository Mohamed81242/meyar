/**
 * Auth Feature - Routes
 *
 * Route configuration for the auth feature.
 * Uses the new FeatureRouteModule format.
 *
 */

import type { FeatureRouteModule } from "@/router/routes.types";

/**
 * Auth feature route module
 *
 * Note: Use i18n keys as strings. Translations are resolved at runtime
 * by components that consume these meta values.
 */
export const authRoutes: FeatureRouteModule = {
    id: "auth",
    name: "Auth",
    basePath: "/",
    layout: "auth",
    routes: {
        meta: {
            requiresAuth: false,
        },
        children: [
            {
                path: "login",
                lazy: () => import("../pages/login"),
                meta: {
                    titleKey: "auth:auth.meta.login",
                },
                handle: {
                    crumb: "auth:auth.meta.login",
                },
            },
            {
                path: "forgot-password",
                lazy: () => import("../pages/forgot-password"),
                meta: {
                    titleKey: "auth:auth.forgotPasswordTitle",
                },
                handle: {
                    crumb: "auth:auth.forgotPasswordTitle",
                },
            },
            {
                path: "forgot-password-verify",
                lazy: () => import("../pages/forgot-password-verify"),
                meta: {
                    titleKey: "auth:auth.verifyYourEmail",
                },
                handle: {
                    crumb: "auth:auth.verifyYourEmail",
                },
            },
            {
                path: "reset-password",
                lazy: () => import("../pages/reset-password"),
                meta: {
                    titleKey: "auth:auth.createNewPassword",
                },
                handle: {
                    crumb: "auth:auth.createNewPassword",
                },
            },
            {
                path: "reset-password-success",
                lazy: () => import("../pages/reset-password-success"),
                meta: {
                    titleKey: "auth:auth.passwordResetSuccess",
                },
                handle: {
                    crumb: "auth:auth.passwordResetSuccess",
                },
            },
        ],
    },
};

export default authRoutes;
