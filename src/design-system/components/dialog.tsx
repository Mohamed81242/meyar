import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import * as React from "react";

import { useLanguage } from "@/shared/hooks";
import { cn } from "@/utils";
import { XIcon } from "lucide-react";
import { Button } from "./button";

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
    return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
    return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
    return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
    return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
    className,
    ...props
}: DialogPrimitive.Backdrop.Props) {
    return (
        <DialogPrimitive.Backdrop
            data-slot="dialog-overlay"
            className={cn(
                "fixed inset-0 isolate z-50 bg-black/40 duration-100 supports-backdrop-filter:backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
                className,
            )}
            {...props}
        />
    );
}

function DialogContent({
    className,
    children,
    showCloseButton = true,
    contentClassName,
    ...props
}: DialogPrimitive.Popup.Props & {
    showCloseButton?: boolean;
    contentClassName?: string;
}) {
    return (
        <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Popup
                data-slot="dialog-content"
                className={cn(
                    "fixed top-1/2 left-1/2 z-50 flex flex-col w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-0 overflow-hidden rounded-dashboard bg-dashboard-card p-0 text-sm text-dashboard-card-foreground shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-dashboard-border duration-100 outline-none sm:max-w-200 max-h-[85vh] data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
                    className,
                )}
                {...props}
            >
                <div
                    className={cn(
                        "flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar",
                        contentClassName,
                        typeof className === "string" &&
                            className.includes("p-0") &&
                            "p-0! sm:p-0! flex flex-col overflow-hidden",
                    )}
                >
                    {children}
                </div>
                {showCloseButton && (
                    <div className="absolute top-4 ltr:right-4 rtl:left-4 z-10 flex items-center gap-1">
                        <DialogPrimitive.Close
                            data-slot="dialog-close"
                            render={
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 rounded-md text-dashboard-muted-foreground hover:bg-dashboard-secondary hover:text-dashboard-foreground transition-all"
                                >
                                    <XIcon size={14} />
                                    <span className="sr-only">Close</span>
                                </Button>
                            }
                        />
                    </div>
                )}
            </DialogPrimitive.Popup>
        </DialogPortal>
    );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="dialog-header"
            className={cn("flex flex-col gap-2", className)}
            {...props}
        />
    );
}

function DialogFooter({
    className,
    showCloseButton = false,
    children,
    ...props
}: React.ComponentProps<"div"> & {
    showCloseButton?: boolean;
}) {
    const { t } = useLanguage();
    return (
        <div
            data-slot="dialog-footer"
            className={cn(
                "flex flex-col-reverse gap-3 sm:flex-row sm:justify-end mt-6",
                className,
            )}
            {...props}
        >
            {children}
            {showCloseButton && (
                <DialogPrimitive.Close
                    className="w-full sm:w-auto"
                    render={
                        <Button
                            variant="outline"
                            className="w-full rounded-dashboard-radius h-10 border-dashboard-border font-semibold px-6 text-dashboard-muted-foreground hover:bg-dashboard-secondary"
                        >
                            {t("dashboard:common.cancel")}
                        </Button>
                    }
                />
            )}
        </div>
    );
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
    return (
        <DialogPrimitive.Title
            data-slot="dialog-title"
            className={cn(
                "font-heading text-lg leading-none font-semibold text-dashboard-foreground",
                className,
            )}
            {...props}
        />
    );
}

function DialogDescription({
    className,
    ...props
}: DialogPrimitive.Description.Props) {
    return (
        <DialogPrimitive.Description
            data-slot="dialog-description"
            className={cn(
                "text-sm text-dashboard-muted-foreground mt-2 *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-dashboard-foreground",
                className,
            )}
            {...props}
        />
    );
}

export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
};
