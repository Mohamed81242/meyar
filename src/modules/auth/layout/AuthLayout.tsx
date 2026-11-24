import { tokenService } from "@/auth";
import { authStore } from "@/auth/auth.store";
import { Images } from "@/constants/images";
import { Button } from "@/design-system/components/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/design-system/components/dropdown-menu";
import { TemplateStyles } from "@/modules/dashboard/main/layout/styles";
import { ThemeTransitionOverlay } from "@/modules/dashboard/main/layout/ThemeTransitionOverlay";
import { dashboardPaths } from "@/modules/dashboard/main/navigation";
import { useDashboardTheme } from "@/modules/hooks/useDashboardTheme";
import { useLanguage } from "@/shared/hooks";
import { cn } from "@/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowUpRight,
    Check,
    Globe,
    HelpCircle,
    Key,
    Layout,
    Mic,
    Moon,
    Pause,
    Play,
    Search,
    Settings,
    Sparkles,
    Sun,
    Volume2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

type SlideType = "transcription" | "tts" | "voices" | "ai-content";

function AuthLayout() {
    const { isAuthenticated, _hasHydrated } = authStore();
    const { isRTL, currentLanguage, changeLanguage } = useLanguage();
    const { darkMode, setDarkMode } = useDashboardTheme();
    const [activeSlide, setActiveSlide] = useState(0);

    const logoDark = "/logo-dark.png";
    const logoLight = "/logo-light.png";

  



    // Prevent flashing while hydrating
    if (!_hasHydrated) {
        return null;
    }

    // Redirect authenticated users
    if (isAuthenticated && tokenService.hasToken()) {
        const isFirstTime = authStore.getState().isFirstTimeUser;
        return <Navigate to={isFirstTime ? "/welcome" : dashboardPaths.root()} replace />;
    }

   

    return (
        <TemplateStyles themeName="dashboard">
            <ThemeTransitionOverlay />

            <div
                className="flex flex-row h-screen w-full overflow-hidden bg-dashboard-background"
                dir={isRTL ? "rtl" : "ltr"}
            >
                {/* Auth Navbar */}
                <div className="absolute top-0 left-0 right-0 h-14 flex items-center justify-between px-8 z-20">
                    {/* Theme toggle & Language switcher */}
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            tooltipDelay={500}
                            tooltipPlacement="bottom"
                            tooltip={darkMode ? "Light Mode" : "Dark Mode"}
                            className="text-dashboard-muted-foreground hover:text-dashboard-foreground hover:bg-dashboard-secondary transition-colors duration-500 ease-in-out"
                            onClick={() => setDarkMode(!darkMode)}
                        >
                            {darkMode ? (
                                <Sun className="h-[18px] w-[18px]" />
                            ) : (
                                <Moon className="h-[18px] w-[18px]" />
                            )}
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                title="Language / اللغة"
                                className="h-8 w-8 rounded-lg flex items-center justify-center text-dashboard-muted-foreground hover:bg-dashboard-secondary hover:text-dashboard-foreground transition-colors cursor-pointer outline-none"
                            >
                                <Globe className="h-[18px] w-[18px]" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                sideOffset={12}
                                className="w-32 p-1.5 rounded-xl border border-dashboard-border shadow-lg bg-dashboard-card"
                            >
                                <DropdownMenuItem
                                    onClick={() => changeLanguage("en")}
                                    className={cn(
                                        "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer outline-none hover:bg-dashboard-secondary",
                                        currentLanguage === "en" &&
                                            "bg-dashboard-secondary text-dashboard-primary font-bold",
                                    )}
                                >
                                    <span>English</span>
                                    {currentLanguage === "en" && (
                                        <Check className="h-3.5 w-3.5 text-dashboard-primary" />
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => changeLanguage("ar")}
                                    className={cn(
                                        "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer outline-none hover:bg-dashboard-secondary",
                                        currentLanguage === "ar" &&
                                            "bg-dashboard-secondary text-dashboard-primary font-bold",
                                    )}
                                >
                                    <span>العربية</span>
                                    {currentLanguage === "ar" && (
                                        <Check className="h-3.5 w-3.5 text-dashboard-primary" />
                                    )}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                {/* Form Column */}
                <div className="flex flex-col justify-center w-full  px-8 md:px-16 lg:px-20 py-12 bg-dashboard-card shadow-[0px_0px_50px_rgba(0,0,0,0.02)] border-r border-dashboard-border relative z-10 shrink-0 h-screen overflow-y-auto">
                    <div className="w-full max-w-[420px] mx-auto flex flex-col gap-6 py-6">
                        <Outlet />
                    </div>
                </div>

                {/* Preview Slideshow Column */}
           
            </div>
        </TemplateStyles>
    );
}

export default AuthLayout;
