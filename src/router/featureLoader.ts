/**
 * Feature Loader
 *
 * Auto-discovers and registers feature routes and navigation.
 * Uses Vite's glob import to find all feature modules.
 *
 * @example
 * ```ts
 * // In router/index.tsx
 * import { loadFeatures } from './featureLoader';
 *
 * loadFeatures();
 * const routes = routeRegistry.getRouteObjects();
 * ```
 */

import {

    // channelsNav,

    // dashboardNav,
    dashboardRouteModule,
    // marketplaceNav,
 
    billingNav,

    // peopleNavModule,

    // serviceDeskNav,

} from "@/modules/dashboard/main/navigation";

import {
    settingsRouteModule,
    settingsNavModule,  


} from "@/modules/dashboard/settings/navigation";


import type { FeatureNavModule } from "@/navigation/nav.types";
import { navRegistry } from "@/navigation/navRegistry";
import { routeRegistry } from "./routeRegistry";
import type { FeatureRouteModule } from "./routes.types";

// Manual imports for consolidated dashboard routes (excluded from glob to prevent circular deps)
// import { dashboardRouteModule } from "@/modules/dashboard/main/navigation/routes";
// import { dashboardNav } from "@/modules/dashboard/main/navigation/nav";

// ============================================================================
// Manual Feature Registration (Phase 1 - Incremental Migration)
// ============================================================================

/**
 * Manually register features during migration.
 * Replace with auto-discovery once all features are migrated.
 */
export const registerFeature = (
    routeModule?: FeatureRouteModule,
    navModule?: FeatureNavModule,
): void => {
    if (routeModule) {
        routeRegistry.register(routeModule);
    }
    if (navModule) {
        navRegistry.register(navModule);
    }
};

// ============================================================================
// Auto-Discovery (Phase 2 - After Migration)
// ============================================================================

/**
 * Feature module exports shape
 */
interface FeatureExports {
    default?: FeatureRouteModule;
    [key: string]: unknown;
}

interface NavExports {
    default?: FeatureNavModule;
    [key: string]: unknown;
}

/**
 * Auto-load all feature routes using Vite glob import
 *
 * This will find all routes.ts files in features/* directories
 * and register them automatically.
 */
export const loadFeatureRoutes = (): void => {
    // Vite glob import - eager loads all matching modules
    // Matches both top-level features and nested dashboard features
    // Excludes dashboard feature routes (consolidated in dashboard/navigation/routes.tsx)
    const routeModules = import.meta.glob<FeatureExports>(
        [
            "../modules/*/navigation/routes.{ts,tsx}",
            "../modules/*/features/*/navigation/routes.{ts,tsx}",
            "../modules/dashboard/*/navigation/routes.{ts,tsx}",
            "../modules/dashboard/*/*/navigation/routes.{ts,tsx}",
            "../modules/dashboard/*/*/*/navigation/routes.{ts,tsx}",
        ],
        { eager: true },
    );

    Object.entries(routeModules).forEach(([path, module]) => {
        // Validation function for FeatureRouteModule
        const isFeatureRouteModule = (
            exp: unknown,
        ): exp is FeatureRouteModule =>
            typeof exp === "object" &&
            exp !== null &&
            !Array.isArray(exp) &&
            "id" in exp &&
            "basePath" in exp &&
            "routes" in exp;

        // Find the route module export (default or named)
        const routeModule = isFeatureRouteModule(module.default)
            ? module.default
            : Object.values(module).find(isFeatureRouteModule);

        if (routeModule) {
            routeRegistry.register(routeModule);
            console.debug(`[Router] Registered routes: ${routeModule.id}`);
        }
    });
};

/**
 * Auto-load all feature navigation using Vite glob import
 */
export const loadFeatureNavigation = (): void => {
    // Excludes dashboard feature nav (consolidated in dashboard/navigation/nav.ts)
    const navModules = import.meta.glob<NavExports>(
        [
            "../modules/*/navigation/nav.{ts,tsx}",
            "../modules/*/features/*/navigation/nav.{ts,tsx}",
            "../modules/dashboard/*/navigation/nav.{ts,tsx}",
            "../modules/dashboard/*/*/navigation/nav.{ts,tsx}",
            "../modules/dashboard/*/*/*/navigation/nav.{ts,tsx}",
        ],
        { eager: true },
    );

    Object.entries(navModules).forEach(([path, module]) => {
        const isFeatureNavModule = (exp: unknown): exp is FeatureNavModule =>
            typeof exp === "object" &&
            exp !== null &&
            "featureId" in exp &&
            "section" in exp &&
            "items" in exp;

        const navModule = isFeatureNavModule(module.default)
            ? module.default
            : Object.values(module).find(isFeatureNavModule);

        if (navModule) {
            navRegistry.register(navModule);
            console.debug(
                `[Nav] Registered navigation: ${navModule.featureId}`,
            );
        } else {
            console.warn(`[Nav] No valid nav module found in: ${path}`);
        }
    });
};

/**
 * Load all features (routes + navigation)
 */
export const loadFeatures = (): void => {
    // Register consolidated dashboard & settings routes manually
    routeRegistry.register(dashboardRouteModule);
    routeRegistry.register(settingsRouteModule);

    // Register settings nav module
    navRegistry.register(settingsNavModule);


    navRegistry.register(billingNav);


 
    // Auto-discover and register other feature routes
    loadFeatureRoutes();
    loadFeatureNavigation();
};

// ============================================================================
// Development Helpers
// ============================================================================

/**
 * Get registration status for debugging
 */
export const getRegistrationStatus = (): {
    routes: string[];
    navigation: string[];
} => {
    return {
        routes: routeRegistry.getAll().map((m) => m.id),
        navigation: navRegistry.getAll().map((m) => m.featureId),
    };
};
