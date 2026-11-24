import { cn } from "@/utils";
import { ArrowLeft } from "lucide-react";
import type { FlowGraphHeaderConfig } from "./types";

export function FlowGraphHeader({
    show = true,
    backButton,
    title,
    badge,
    actions = [],
    children,
    className,
}: FlowGraphHeaderConfig) {
    if (!show) return null;

    const showBackButton = backButton?.show !== false && !!backButton?.onClick;

    return (
        <div
            className={cn(
                "absolute top-4 left-4 z-10 flex items-center gap-4",
                className,
            )}
        >
            {showBackButton && (
                <button
                    onClick={backButton.onClick}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-dashboard-card border border-dashboard-border shadow-lg hover:bg-dashboard-secondary transition-colors text-dashboard-muted-foreground hover:text-dashboard-foreground"
                >
                    <ArrowLeft size={18} />
                </button>
            )}

            {(title || badge) && (
                <div className="bg-dashboard-card border border-dashboard-border shadow-lg px-4 py-2 rounded-xl flex items-center gap-3">
                    {title && (
                        <span className="font-semibold text-dashboard-foreground text-sm">
                            {title}
                        </span>
                    )}
                    {badge && (
                        <span className="px-2 py-0.5 rounded-full bg-dashboard-secondary text-xs text-dashboard-muted-foreground">
                            {badge}
                        </span>
                    )}
                </div>
            )}

            {actions.map((action) => (
                <button
                    key={action.id}
                    onClick={action.onClick}
                    className={cn(
                        "flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-dashboard-card border border-dashboard-border shadow-lg hover:bg-dashboard-secondary transition-colors text-dashboard-muted-foreground hover:text-dashboard-foreground text-xs font-semibold",
                        action.className,
                    )}
                >
                    {action.icon}
                    <span>{action.label}</span>
                </button>
            ))}

            {children}
        </div>
    );
}
