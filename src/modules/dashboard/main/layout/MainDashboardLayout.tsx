import React, { useState, useEffect, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { useLanguage } from "@/shared/hooks";
import { ServerErrorGuard } from "@/shared/observability";
import { useSidebarStore } from "@/shared/hooks/useSidebarStore";
import { useDashboardTheme } from "../../../hooks/useDashboardTheme";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { AppearanceDrawer } from "./AppearanceDrawer";
import { TemplateStyles } from "./styles";
import { ThemeTransitionOverlay } from "./ThemeTransitionOverlay";
import { Settings } from "lucide-react";

export function MainDashboardLayout() {
    const { currentLanguage } = useLanguage("dashboard");
    const lang = currentLanguage as "en" | "ar";
    const isSidebarCollapsed = useSidebarStore((state) => state.isSidebarCollapsed);
    const setIsSidebarCollapsed = useSidebarStore((state) => state.setIsSidebarCollapsed);

    // Initialize custom dashboard theme
    useDashboardTheme();

    const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1280) {
                setIsSidebarCollapsed(true);
            } else {
                setIsSidebarCollapsed(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [setIsSidebarCollapsed]);

    return (
        <TemplateStyles themeName="dashboard">
            <ThemeTransitionOverlay />

            <div
                className="flex flex-row font-sans h-screen w-full overflow-hidden bg-white dark:bg-dashboard-background"
                dir={lang === "ar" ? "rtl" : "ltr"}
            >
                {/* Left Sidebar */}
                <Sidebar
                    isCollapsed={isSidebarCollapsed}
                    onExpand={() => setIsSidebarCollapsed(false)}
                />

                {/* Main View Area */}
                <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative bg-[#F4F6F8] dark:bg-dashboard-background">
                    {/* Top Global Header (Navbar) */}
                    <Navbar />

                    {/* Scrollable Page Content */}
                    <div className="flex-1 min-h-0 overflow-y-auto p-6 md:p-8">
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
                    </div>

                    {/* Floating Appearance Settings Button matching Image 1 & 3 */}
                    <button
                        onClick={() => setIsAppearanceOpen(true)}
                        className="fixed right-3 top-36 z-40 w-10 h-10 rounded-full bg-[#EBF3FE] hover:bg-[#DBEAFE] text-[#2563EB] shadow-md cursor-pointer transition-transform hover:scale-105 flex items-center justify-center border border-[#BFDBFE]/60"
                        aria-label="Customize site appearance"
                        title="Customize site appearance"
                    >
                        <Settings className="w-5 h-5" />
                    </button>

                    {/* Appearance Customizer Slide-over Drawer */}
                    <AppearanceDrawer
                        isOpen={isAppearanceOpen}
                        onClose={() => setIsAppearanceOpen(false)}
                    />
                </main>
            </div>
        </TemplateStyles>
    );
}

export default MainDashboardLayout;
