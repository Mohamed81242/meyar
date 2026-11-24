import { useLoading } from "@/contexts/LoadingContext";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export function LoadingOverlay({
    companyName = "AQARIA",
    primaryColor = "#0E2B2F",
    accentColor = "green",
}: {
    companyName: string;
    primaryColor: string;
    accentColor: string;
}) {
    const [isVisible, setIsVisible] = useState(true);
    const { setLoadingComplete } = useLoading();

    useEffect(() => {
        // Prevent scrolling and hide scrollbar while loading
        document.body.style.overflow = "hidden";
        document.body.style.scrollbarWidth = "none"; // Firefox

        // Hide overlay after 2.5 seconds to allow animations to start
        const timer = setTimeout(() => {
            setIsVisible(false);
            setLoadingComplete();
            // Restore scrolling when overlay is hidden
            document.body.style.overflow = "";
            document.body.style.scrollbarWidth = "";
        }, 2500);

        return () => {
            clearTimeout(timer);
            // Clean up styles if component unmounts
            document.body.style.overflow = "";
            document.body.style.scrollbarWidth = "";
        };
    }, [setLoadingComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-100 flex items-center justify-center"
                    style={{
                        backgroundColor: primaryColor!,
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="flex flex-col items-center gap-6"
                    >
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="text-6xl font-display font-extrabold text-white tracking-tighter"
                        >
                            {companyName}
                        </motion.h1>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: 200 }}
                            transition={{
                                delay: 0.6,
                                duration: 1,
                                ease: "easeInOut",
                            }}
                            className="h-0.5"
                            style={{
                                backgroundColor: accentColor!,
                            }}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
