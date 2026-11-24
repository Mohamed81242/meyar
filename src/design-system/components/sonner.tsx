import {
    CircleCheckIcon,
    InfoIcon,
    Loader2Icon,
    OctagonXIcon,
    TriangleAlertIcon,
} from "lucide-react";
import * as React from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

import { AnimatePresence, motion } from "motion/react";

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                    bounce: 0.5,
                }}
                className="z-[10000]"
            >
                <Sonner
                    theme="system"
                    className="toaster group"
                    icons={{
                        success: <CircleCheckIcon className="size-4" />,
                        info: <InfoIcon className="size-4" />,
                        warning: <TriangleAlertIcon className="size-4" />,
                        error: <OctagonXIcon className="size-4" />,
                        loading: <Loader2Icon className="size-4 animate-spin" />,
                    }}
                    style={
                        {
                            "--normal-bg": "var(--popover)",
                            "--normal-text": "var(--popover-foreground)",
                            "--normal-border": "var(--border)",
                            "--border-radius": "var(--radius)",
                        } as React.CSSProperties
                    }
                    toastOptions={{
                        classNames: {
                            toast: "cn-toast",
                        },
                    }}
                    {...props}
                />
            </motion.div>
        </AnimatePresence>
    );
};

export { Toaster };
