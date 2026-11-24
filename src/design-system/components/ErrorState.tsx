/**
 * ErrorState — modern error UI for inline, card, and full-page contexts.
 */

import { cn } from "@/utils";
import { AlertTriangle, Home, RefreshCw, WifiOff } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import type { BaseComponentProps, ErrorStateProps } from "../types";
import { Button } from "./button";

interface Props extends ErrorStateProps, BaseComponentProps {}

/** Normalizes unknown errors into a display message. */
export function getErrorMessage(
    error: unknown,
    fallback = "Something went wrong. Please try again.",
): string {
    if (error instanceof Error && error.message) return error.message;
    if (typeof error === "string" && error.trim()) return error;
    if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof (error as { message: unknown }).message === "string"
    ) {
        return (error as { message: string }).message;
    }
    return fallback;
}

export function ErrorState({
    title,
    message,
    error,
    onRetry,
    showIcon = true,
    variant = "fullPage",
    primaryColor,
    accentColor,
    className = "",
    testId,
}: Props) {
    const { t } = useTranslation();
    const resolvedMessage =
        message ??
        (error !== undefined
            ? getErrorMessage(error)
            : t("errors.unexpected", "Something went wrong"));
    const resolvedTitle =
        title ?? t("errors.unexpected", "Something went wrong");

    if (variant === "inline") {
        return (
            <motion.div
                role="alert"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "inline-flex items-center gap-2.5 rounded-xl border border-dashboard-destructive/20 bg-dashboard-destructive/10 px-3 py-2 text-sm text-dashboard-destructive",
                    className,
                )}
                data-testid={testId}
            >
                {showIcon && (
                    <AlertTriangle className="size-4 shrink-0 text-dashboard-destructive" />
                )}
                <span>{resolvedMessage}</span>
                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="font-semibold text-dashboard-destructive/80 underline-offset-2 hover:underline"
                    >
                        {t("actions.retry", "Retry")}
                    </button>
                )}
            </motion.div>
        );
    }

    const Icon = variant === "fullPage" ? WifiOff : AlertTriangle;

    const card = (
        <motion.div
            role="alert"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            className={cn(
                "relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-dashboard-border bg-dashboard-card p-8 shadow-2xl shadow-dashboard-destructive/10 md:p-10",
                className,
            )}
            data-testid={testId}
        >
            <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full opacity-30 blur-3xl"
                style={{
                    background: accentColor ?? "var(--color-dashboard-accent)",
                }}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-20 -left-16 size-56 rounded-full opacity-20 blur-3xl"
                style={{
                    background:
                        primaryColor ?? "var(--color-dashboard-secondary)",
                }}
            />

            <div className="relative z-10 flex flex-col items-center text-center">
                {showIcon && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.35 }}
                        className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-dashboard-destructive/15 via-dashboard-accent/10 to-dashboard-primary/20 ring-1 ring-dashboard-destructive/20"
                    >
                        <Icon
                            className="size-8 text-dashboard-destructive"
                            strokeWidth={1.75}
                        />
                    </motion.div>
                )}

                <p className="mb-2 text-[10px] font-black  tracking-[0.2em] text-dashboard-destructive">
                    {t("errors.errorLabel", "Error")}
                </p>
                <h2 className="text-2xl font-black tracking-tight text-dashboard-foreground md:text-3xl">
                    {resolvedTitle}
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-dashboard-muted-foreground">
                    {resolvedMessage}
                </p>

                <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                    {onRetry && (
                        <Button
                            type="button"
                            onClick={onRetry}
                            className="h-11 gap-2 rounded-xl bg-dashboard-destructive px-6 text-dashboard-destructive-foreground shadow-lg shadow-dashboard-destructive/20 hover:bg-dashboard-destructive/90"
                        >
                            <RefreshCw className="size-4" />
                            {t("actions.tryAgain", "Try again")}
                        </Button>
                    )}
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 gap-2 rounded-xl border-dashboard-border px-6"
                        onClick={() => {
                            window.location.href = "/";
                        }}
                    >
                        <Home className="size-4" />
                        {t("actions.goHome", "Go home")}
                    </Button>
                </div>
            </div>
        </motion.div>
    );

    if (variant === "fullPage") {
        return (
            <div
                className={cn(
                    "relative flex h-[90vh] items-center justify-center overflow-hidden px-6 py-16",
                    className,
                )}
                data-testid={testId}
            >
                <motion.div
                    className="pointer-events-none absolute inset-0 opacity-40"
                    style={{
                        backgroundImage: `radial-gradient(circle at 20% 20%, ${accentColor ?? "var(--color-dashboard-accent)"}33 0%, transparent 45%), radial-gradient(circle at 80% 80%, ${primaryColor ?? "var(--color-dashboard-secondary)"}44 0%, transparent 50%)`,
                    }}
                />
                <div className="relative z-10 w-full flex justify-center">
                    {card}
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className={cn("flex w-full justify-center p-4", className)}
            data-testid={testId}
        >
            {card}
        </motion.div>
    );
}

export default ErrorState;
