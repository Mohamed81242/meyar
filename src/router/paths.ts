/**
 * Centralized Typed Path Builders
 *
 * Single source of truth for all route paths.
 * Eliminates hardcoded strings throughout the app.
 *
 * @example
 * ```ts
 * import { paths } from '@/router/paths';
 *
 * // Static paths
 * navigate(paths.auth.login());
 *
 * // Dynamic paths
 * navigate(paths.courses.detail(courseId));
 * ```
 */

import { To } from "react-router-dom";
import {
    featurePaths,
    registerFeaturePaths,
    type FeaturePaths,
} from "./paths.registry";

// Re-export registry for convenience
export { featurePaths, registerFeaturePaths, type FeaturePaths };

// ============================================================================
// Feature Path Imports (lazy to avoid circular deps)
// ============================================================================

// Import feature paths - they self-register via registerFeaturePaths
import { dashboardPaths } from "@/modules/dashboard/main/navigation";
import { settingsPaths } from "@/modules/dashboard/settings/navigation";
import { authPaths } from "@/modules/auth/features/auth/navigation";
import { sitePaths } from "@/modules/landing/features/landing/navigation/paths";
// import { classroomPaths } from "@/modules/dashboard/main/features/classroom/navigation/paths";
// import { adminPaths } from "@/modules/dashboard/main/features/admin/navigation/paths";

// ============================================================================
// Path Builder Factory
// ============================================================================

type PathParams = Record<string, string | number>;

/**
 * Creates a type-safe path builder function
 */
const createPath = <T extends PathParams = Record<string, never>>(
    template: string,
) => {
    return (params?: T): To => {
        if (!params) return template;
        return Object.entries(params).reduce(
            (path, [key, value]) => path.replace(`:${key}`, String(value)),
            template,
        );
    };
};

// ============================================================================
// Global Paths (non-feature specific)
// ============================================================================

export const paths = {
    // ========================================================================
    // Site (Public) - from feature
    // ========================================================================
    site: sitePaths,

    // ========================================================================
    // Auth - from feature
    // ========================================================================
    auth: authPaths,

    // ========================================================================
    // Dashboard (Root)
    // ========================================================================
    dashboard: dashboardPaths,

    // ========================================================================
    // Settings
    // ========================================================================
    settings: settingsPaths,


    // ========================================================================
    // Shared Pages
    // ========================================================================
    shared: {
        notFound: createPath("/404"),
        unauthorized: createPath("/unauthorized"),
    },
} as const;

// ============================================================================
// Type Exports
// ============================================================================

export type Paths = typeof paths;

/**
 * Helper type to extract all possible path strings
 */
export type AppPath = string;
