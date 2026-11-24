import { RootLayout } from "@/layouts";
import AuthLayout from "./modules/auth/layout/AuthLayout";
import SiteLayout from "./modules/landing/layout/SiteLayout";
import { ProtectedRoute } from "@/auth/ProtectedRoute";
import { RouteErrorBoundary, routeRegistry } from "@/router";
import { StrictMode, useMemo } from "react";
import { createRoot } from "react-dom/client";
import "react-phone-input-2/lib/bootstrap.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./i18n";
import "./index.css";
import Providers from "./providers/index.tsx";

// Import router to trigger feature registration
import "@/router";
import ErrorBoundaryClass from "./shared/observability/ErrorBoundary.tsx";

// Register built-in templates for builder system
import HomePage from "./modules/landing/features/landing/pages/LandingPage.tsx";

import MainDashboardLayout from "./modules/dashboard/main/layout/MainDashboardLayout";

function AppRouter() {
    const router = useMemo(() => {
        // Get routes grouped by layout type
        const routesByLayout = routeRegistry.getRoutesByLayout();

        // Create data router with layout-based route structure
        return createBrowserRouter([
            {
                path: "/",
                element: <RootLayout />,
                errorElement: <RouteErrorBoundary />,
                children: [
                    // Site routes (public landing pages)
                    {
                        element: <SiteLayout />,
                        children: [
                            { index: true, element: <HomePage /> },
                            {
                                path: "privacy",
                                lazy: () =>
                                    import(
                                        "@/modules/landing/features/landing/pages/PrivacyPage"
                                    ).then((m) => ({ Component: m.default })),
                            },
                            {
                                path: "delete-account",
                                lazy: () =>
                                    import(
                                        "@/modules/landing/features/landing/pages/DeleteAccountPage"
                                    ).then((m) => ({ Component: m.default })),
                            },
                            {
                                path: "support",
                                lazy: () =>
                                    import(
                                        "@/modules/landing/features/landing/pages/SupportPage"
                                    ).then((m) => ({ Component: m.default })),
                            },
                            ...(routesByLayout.site || []),
                        ],
                    },
                    // Auth routes (login, signup, etc.)
                    {
                        element: <AuthLayout />,
                        children: routesByLayout.auth,
                    },
                    // Unified Dashboard & Settings module (using main layout)
                    {
                        element: (
                            <ProtectedRoute>
                                <MainDashboardLayout />
                            </ProtectedRoute>
                        ),
                        children: [
                            ...(routesByLayout['dashboard-main'] || []),
                            ...(routesByLayout['dashboard-settings'] || []),
                        ],
                    },
                   
                    // Routes without layout wrapper
                    ...routesByLayout.none,
                ],
            },
        ]);
    }, []);

    return <RouterProvider router={router} />;
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Providers>
            <ErrorBoundaryClass>
                <AppRouter />
            </ErrorBoundaryClass>
        </Providers>
    </StrictMode>,
);
