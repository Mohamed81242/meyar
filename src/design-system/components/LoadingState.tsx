/**
 * LoadingState Component
 *
 * Standardized loading UI for different contexts.
 *
 * @example
 * ```tsx
 * // Default loading
 * <LoadingState />
 *
 * // With message
 * <LoadingState message="Loading courses..." />
 *
 * // Small inline
 * <LoadingState size="sm" fullScreen={false} />
 *
 * // Overlay
 * <LoadingState overlay />
 * ```
 */

import type { BaseComponentProps, LoadingStateProps } from "../types";

interface Props extends LoadingStateProps, BaseComponentProps {}

const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-[3px]",
    lg: "h-14 w-14 border-4",
};

const glowSizeClasses = {
    sm: "h-8 w-8",
    md: "h-16 w-16",
    lg: "h-20 w-20",
};

/**
 * Loading state component
 */
export function LoadingState({
    message,
    size = "md",
    fullScreen = true,
    overlay = false,
    className = "",
    testId,
}: Props) {
    const content = (
        <div
            className={`${
                fullScreen ? "h-full" : "h-full min-h-[200px]"
            } flex flex-col items-center justify-center gap-6`}
        >
            <div className="relative flex items-center justify-center">
                {/* Subtle glowing aura */}
                <div
                    className={`absolute ${glowSizeClasses[size]} bg-dashboard-primary/10 rounded-full blur-xl animate-pulse`}
                />

                {/* Faint background track */}
                <div
                    className={`absolute rounded-full ${sizeClasses[size]} border-dashboard-border`}
                />

                {/* Sleek spinning gradient ring */}
                <div
                    className={`relative animate-spin rounded-full ${sizeClasses[size]} border-transparent border-t-dashboard-primary border-r-dashboard-primary/30`}
                    style={{ animationDuration: "0.8s" }}
                />
            </div>

            {message && (
                <p className="text-xs font-semibold  tracking-widest text-dashboard-muted-foreground animate-pulse">
                    {message}
                </p>
            )}
        </div>
    );

    if (overlay) {
        return (
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm ${className}`}
                data-testid={testId}
            >
                {content}
            </div>
        );
    }

    return (
        <div
            className={`flex items-center justify-center ${
                fullScreen ? "h-screen" : "h-full min-h-[200px]"
            } ${className}`}
            data-testid={testId}
        >
            {content}
        </div>
    );
}

export default LoadingState;
