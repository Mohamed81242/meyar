/**
 * Route Error Boundary
 *
 * Error boundary component for route-level error handling.
 * Displays a user-friendly error message when a route fails.
 */

import { API_CONFIG } from "@/shared/api";
import { errorHistory } from "@/shared/observability/errorHistory";
import { AlertTriangle, Home, RefreshCw, WifiOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
    isRouteErrorResponse,
    Link,
    useLocation,
    useRouteError,
} from "react-router-dom";
import { Button } from "@/design-system/components/button";

export function RouteErrorBoundary() {
    const error = useRouteError();
    const { t } = useTranslation();
    const location = useLocation();

    // Record where this route error happened
    errorHistory.record(location.pathname + location.search);

    let title = t("errors.unexpected", "Something went wrong");
    let message = t("errors.tryAgain", "Please try again later.");
    let statusCode: number | undefined;

    if (isRouteErrorResponse(error)) {
        statusCode = error.status;

        switch (error.status) {
            case 404:
                title = t("errors.notFound", "Page Not Found");
                message = t(
                    "errors.notFoundMessage",
                    "The page you're looking for doesn't exist.",
                );
                break;
            case 401:
                title = t("errors.unauthorized", "Unauthorized");
                message = t(
                    "errors.unauthorizedMessage",
                    "You need to log in to access this page.",
                );
                break;
            case 403:
                title = t("errors.forbidden", "Access Denied");
                message = t(
                    "errors.forbiddenMessage",
                    "You don't have permission to access this page.",
                );
                break;
            case 500:
                title = t("errors.serverError", "Server Error");
                message = t(
                    "errors.serverErrorMessage",
                    "Something went wrong on our end.",
                );
                break;
            default:
                message = error.statusText || message;
        }
    } else if (error instanceof Error) {
        if (API_CONFIG.ENV_MODE === "development" || API_CONFIG.ENV_MODE === "DEV") {
            message = error.message;
        }
    }

    const Icon = statusCode === 404 ? WifiOff : AlertTriangle;

    return (
        <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center p-6 bg-dashboard-background">
            <div className="max-w-md w-full bg-dashboard-card rounded-2xl border border-dashboard-border p-8 text-center shadow-xl flex flex-col items-center">
                {/* Icon Container */}
                <div className="w-16 h-16 rounded-2xl bg-dashboard-danger/10 text-dashboard-danger flex items-center justify-center mb-4 border border-dashboard-danger/20">
                    <Icon className="w-8 h-8" />
                </div>

                {statusCode && (
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-dashboard-secondary text-dashboard-primary border border-dashboard-border">
                        {statusCode}
                    </span>
                )}

                <h2 className="text-xl font-bold text-dashboard-foreground mt-3 mb-1">
                    {title}
                </h2>

                <p className="text-xs text-dashboard-muted-foreground mb-6 max-w-sm leading-relaxed">
                    {message}
                </p>

                <div className="flex flex-col sm:flex-row gap-2.5 w-full justify-center">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => window.location.reload()}
                        className="rounded-xl border-dashboard-border text-dashboard-foreground hover:bg-dashboard-secondary text-xs h-10 px-4 gap-2 font-medium"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{t("actions.retry", "Try Again")}</span>
                    </Button>
                    <Link
                        to="/dashboard/billing"
                        className="inline-flex items-center justify-center rounded-xl bg-dashboard-primary hover:bg-dashboard-primary/90 text-white text-xs h-10 px-4 gap-2 font-semibold shadow-xs transition-colors"
                    >
                        <Home className="w-3.5 h-3.5" />
                        <span>{t("actions.goHome", "Dashboard Home")}</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RouteErrorBoundary;
