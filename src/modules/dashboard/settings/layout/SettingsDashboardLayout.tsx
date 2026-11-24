import { useLanguage } from "@/shared/hooks";
import { ServerErrorGuard } from "@/shared/observability";
// import { useTour } from "goguide";
import { AnimatePresence, motion } from "motion/react";
import { Suspense, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDashboardTheme } from "../../../hooks/useDashboardTheme";
import { Navbar } from "./navbar";
import Sidebar from "./sidebar";
import { TemplateStyles } from "./styles";
import { ThemeTransitionOverlay } from "./ThemeTransitionOverlay";

function ProjectsDashboardLayout() {
    const { t, currentLanguage } = useLanguage("dashboard");
    const location = useLocation();
    const lang = currentLanguage as "en" | "ar";
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    // const { startTour } = useTour();

    // useEffect(() => {
    //     startTour("settings");
    // }, []);

    // Initialize custom dashboard theme colors from localStorage
    const { darkMode } = useDashboardTheme();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1500) {
                setIsSidebarCollapsed(true);
            } else {
                setIsSidebarCollapsed(false);
            }
        };

        // Check on initial load
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Parse pathname to get current tab
    const pathname = location.pathname;
    const currentTab = (() => {
        const pathSegments = pathname.split("/");
        // Get the most specific segment (usually the last or second to last)
        const relevantSegments = pathSegments.filter(
            (s) => s && s !== "dashboard",
        );
        const routeKey =
            relevantSegments[relevantSegments.length - 1] || "overview";

        // For multi-segment routes, try nested structure first
        if (relevantSegments.length > 1) {
            const nestedKey = `adminLayout.routes_nested.${relevantSegments[0].replace(/-/g, "_")}.${relevantSegments[1].replace(/-/g, "_")}`;
            return nestedKey;
        }

        // For single-segment routes, use flat structure
        return `adminLayout.routes.${routeKey}`;
    })();

    return (
        <TemplateStyles themeName="dashboard">
            <ThemeTransitionOverlay />

            <div
                className="flex flex-row bg-dashboard-background font-sans h-screen w-full overflow-hidden"
                dir={lang === "ar" ? "rtl" : "ltr"}
            >
                {/* Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: -30, y: 30 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full z-50 shrink-0 flex"
                >
                    <Sidebar isCollapsed={isSidebarCollapsed} />
                </motion.div>

                {/* Main Content Area */}
                <motion.main
                    initial={{ opacity: 0, x: 30, y: 30 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{
                        duration: 1,
                        ease: [0.16, 1, 0.3, 1],
                        delay: 0.1,
                    }}
                    className="flex-1 flex flex-col overflow-hidden bg-dashboard-background relative"
                >
                    {/* Floating Header */}
                    <div id="settings-navbar">
                        <Navbar
                            isSidebarCollapsed={isSidebarCollapsed}
                            setIsSidebarCollapsed={setIsSidebarCollapsed}
                        />
                    </div>

                    {/* Content with Animation */}
                    <div
                        id="settings-content-viewport"
                        className="flex-1 overflow-hidden relative pb-6 mb-[.7rem] mx-[.7rem] border  border-dashboard-chart-5/15 rounded-br-dashboard rounded-bl-dashboard  bg-dashboard-accent px-6 md:px-10"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${currentTab}-${lang}`}
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="h-full overflow-y-auto"
                            >
                                <Suspense
                                    fallback={
                                        <div className="h-full flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dashboard-primary"></div>
                                        </div>
                                    }
                                >
                                    <ServerErrorGuard>
                                        <Outlet />
                                    </ServerErrorGuard>
                                </Suspense>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.main>
            </div>
        </TemplateStyles>
    );
}

export default ProjectsDashboardLayout;
