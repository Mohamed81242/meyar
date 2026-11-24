import { ArrowLeft, Home, ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/design-system/components/button";

export function UnauthorizedPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center p-6 bg-dashboard-background">
            <div className="max-w-md w-full bg-dashboard-card rounded-2xl border border-dashboard-border p-8 text-center shadow-xl flex flex-col items-center">
                {/* Shield Warning Icon */}
                <div className="w-16 h-16 rounded-2xl bg-dashboard-primary/10 text-dashboard-primary flex items-center justify-center mb-4 border border-dashboard-primary/20">
                    <ShieldAlert className="w-8 h-8" />
                </div>

                {/* 403 Code Badge */}
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-dashboard-secondary text-dashboard-primary border border-dashboard-border">
                    403 Forbidden
                </span>

                {/* Title */}
                <h1 className="text-xl font-bold text-dashboard-foreground mt-3 mb-1">
                    {t("auth:auth.unauthorized.unauthorizedAccess", "Access Restricted")}
                </h1>

                {/* Description */}
                <p className="text-xs text-dashboard-muted-foreground mb-6 max-w-sm leading-relaxed">
                    {t(
                        "auth:auth.unauthorized.noPermission",
                        "You do not have permission to view this resource. Please contact your system administrator if you believe this is an error."
                    )}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2.5 w-full justify-center">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="rounded-xl border-dashboard-border text-dashboard-foreground hover:bg-dashboard-secondary text-xs h-10 px-4 gap-2 font-medium"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                        <span>{t("auth:auth.unauthorized.goBack", "Go Back")}</span>
                    </Button>
                    <Button
                        type="button"
                        onClick={() => navigate("/dashboard/billing")}
                        className="rounded-xl bg-dashboard-primary hover:bg-dashboard-primary/90 text-white text-xs h-10 px-4 gap-2 font-semibold shadow-xs"
                    >
                        <Home className="w-3.5 h-3.5" />
                        <span>{t("auth:auth.unauthorized.goHome", "Dashboard Home")}</span>
                    </Button>
                </div>

                {/* Footer Notice */}
                <div className="mt-6 pt-4 border-t border-dashboard-border/60 w-full text-center">
                    <p className="text-[11px] text-dashboard-muted-foreground">
                        {t("auth:auth.unauthorized.needHelp", "Need assistance? Contact support or system management")}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default UnauthorizedPage;
