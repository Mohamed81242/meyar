/**
 * Reports Feature - Path Builders
 *
 * Centralized, type-safe path builders for the reports feature.
 * Import these instead of hardcoding path strings.
 *
 * @example
 * ```ts
 * import { authPaths } from '@/modules/auth/features/auth/paths';
 *
 * navigate(authPaths.login());
 * navigate(authPaths.magicLink(token));
 * navigate(authPaths.resetPassword());
 * ```
 */

import { registerFeaturePaths } from "@/router/paths.registry";

export const authPaths = registerFeaturePaths("auth", {
    /**
     * Login (index route)
     */
    login: () => `/login`,
    /**
     * Forgot Password
     */
    forgotPassword: () => `/forgot-password`,
    /**
     * Forgot Password Verify
     */
    forgotPasswordVerify: () => `/forgot-password-verify`,
    /**
     * Reset Password
     */
    resetPassword: () => `/reset-password`,
    /**
     * Reset Password Success
     */
    resetPasswordSuccess: () => `/reset-password-success`,
});

export type AuthPaths = typeof authPaths;
