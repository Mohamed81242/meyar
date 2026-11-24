import * as React from "react";
import {
    AlertTriangle,
    CheckCircle2,
    HelpCircle,
    Info,
    ShieldAlert,
    Trash2,
} from "lucide-react";
import { Button } from "./button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./dialog";

export type ConfirmDialogVariant = "danger" | "warning" | "info" | "success";

export interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: React.ReactNode;
    description?: React.ReactNode;
    children?: React.ReactNode;
    variant?: ConfirmDialogVariant;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    isLoading?: boolean;
    loadingText?: string;
    icon?: React.ReactNode;
    hideIcon?: boolean;
    maxWidthClassName?: string;
}

const variantConfigs: Record<
    ConfirmDialogVariant,
    {
        defaultTitle: string;
        defaultConfirmText: string;
        icon: React.ReactNode;
        confirmButtonClass: string;
        confirmButtonVariant: "destructive" | "default" | "outline";
    }
> = {
    danger: {
        defaultTitle: "Confirm Deletion",
        defaultConfirmText: "Delete",
        icon: <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />,
        confirmButtonClass:
            "bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-semibold cursor-pointer",
        confirmButtonVariant: "destructive",
    },
    warning: {
        defaultTitle: "Warning",
        defaultConfirmText: "Proceed",
        icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
        confirmButtonClass:
            "bg-amber-500 hover:bg-amber-600 text-white rounded-full text-xs font-semibold cursor-pointer",
        confirmButtonVariant: "default",
    },
    info: {
        defaultTitle: "Confirm Action",
        defaultConfirmText: "Confirm",
        icon: <Info className="w-5 h-5 text-dashboard-primary shrink-0" />,
        confirmButtonClass:
            "bg-dashboard-primary hover:bg-dashboard-primary/90 text-white rounded-full text-xs font-semibold cursor-pointer",
        confirmButtonVariant: "default",
    },
    success: {
        defaultTitle: "Success Confirmation",
        defaultConfirmText: "OK",
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
        confirmButtonClass:
            "bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold cursor-pointer",
        confirmButtonVariant: "default",
    },
};

export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    children,
    variant = "danger",
    confirmText,
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    isLoading = false,
    loadingText,
    icon,
    hideIcon = false,
    maxWidthClassName = "sm:max-w-md",
}: ConfirmDialogProps) {
    const config = variantConfigs[variant];

    const displayTitle = title ?? config.defaultTitle;
    const displayConfirmText = confirmText ?? config.defaultConfirmText;
    const displayLoadingText =
        loadingText ?? (variant === "danger" ? "Deleting..." : "Processing...");

    const headerIcon = hideIcon ? null : icon ?? config.icon;

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={`${maxWidthClassName} bg-dashboard-card border-dashboard-border shadow-xl`}
            >
                <DialogHeader>
                    <DialogTitle className="text-dashboard-foreground flex items-center gap-2 text-base font-bold">
                        {headerIcon}
                        <span>{displayTitle}</span>
                    </DialogTitle>
                </DialogHeader>

                {description && (
                    <div className="text-xs text-dashboard-muted-foreground leading-relaxed py-1">
                        {description}
                    </div>
                )}

                {children}

                <DialogFooter className="gap-2 sm:gap-2 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="bg-dashboard-background border-dashboard-border text-dashboard-foreground hover:bg-dashboard-secondary rounded-full text-xs h-9 px-4 font-semibold cursor-pointer"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        variant={config.confirmButtonVariant}
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={config.confirmButtonClass}
                    >
                        {isLoading ? displayLoadingText : displayConfirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
