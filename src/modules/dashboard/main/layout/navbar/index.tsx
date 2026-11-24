import React, { useState } from "react";
import {
    Menu,
    Search,
    Bell,
    Maximize2,
    Minimize2,
    Languages,
} from "lucide-react";
import { useSidebarStore } from "@/shared/hooks/useSidebarStore";
import { useLanguage } from "@/shared/hooks";
import { UserAvatarMenu } from "./UserAvatarMenu";

export const Navbar: React.FC = () => {
    const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
    const { currentLanguage, changeLanguage } = useLanguage();

    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
        } else {
            document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
        }
    };

    const handleToggleLanguage = () => {
        const nextLang = currentLanguage === "ar" ? "en" : "ar";
        changeLanguage(nextLang);
    };

    return (
        <header className="h-16 bg-white dark:bg-dashboard-card border-b border-[#E2E8F0] dark:border-dashboard-border px-6 flex items-center justify-between shrink-0 z-30 select-none text-[#1E293B] dark:text-dashboard-foreground">
            {/* Left side: Hamburger Toggle + Search Bar */}
            <div className="flex items-center gap-3.5">
                <button
                    onClick={toggleSidebar}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0F172A] dark:hover:text-dashboard-foreground hover:bg-[#F8FAFC] dark:hover:bg-dashboard-secondary transition-colors cursor-pointer"
                    aria-label="Toggle Sidebar"
                >
                    <Menu className="w-5 h-5" />
                </button>

                {/* Search Bar */}
                <div className="hidden sm:flex items-center gap-2.5 px-3 h-9 rounded-lg border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background w-60 md:w-68 text-xs text-[#94A3B8]">
                    <Search className="w-4 h-4 text-[#94A3B8] shrink-0" />
                    <input
                        type="text"
                        placeholder="Ctrl + K"
                        aria-label="Search"
                        className="bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground placeholder:text-[#94A3B8] flex-1 w-full"
                    />
                </div>
            </div>

            {/* Right side: Language, Notification, Fullscreen, User Avatar */}
            <div className="flex items-center gap-2.5">
                {/* Language Switcher */}
                <button
                    onClick={handleToggleLanguage}
                    title={currentLanguage === "ar" ? "Switch to English" : "التبديل إلى العربية"}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0F172A] dark:hover:text-dashboard-foreground hover:bg-[#F8FAFC] dark:hover:bg-dashboard-secondary transition-colors cursor-pointer"
                >
                    <Languages className="w-4 h-4 text-[#64748B]" />
                </button>

                {/* Notification Bell with Badge */}
                <button
                    className="relative w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0F172A] dark:hover:text-dashboard-foreground hover:bg-[#F8FAFC] dark:hover:bg-dashboard-secondary transition-colors cursor-pointer"
                    aria-label="Notifications"
                >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-0.5 right-0.5 min-w-[15px] h-[15px] px-0.5 rounded-full bg-[#10B981] text-white text-[9px] font-bold flex items-center justify-center leading-none">
                        5
                    </span>
                </button>

                {/* Fullscreen Button */}
                <button
                    onClick={toggleFullscreen}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0F172A] dark:hover:text-dashboard-foreground hover:bg-[#F8FAFC] dark:hover:bg-dashboard-secondary transition-colors cursor-pointer"
                    aria-label="Toggle Fullscreen"
                >
                    {isFullscreen ? (
                        <Minimize2 className="w-4 h-4" />
                    ) : (
                        <Maximize2 className="w-4 h-4" />
                    )}
                </button>

                {/* User Avatar with Dropdown Menu */}
                <UserAvatarMenu align="end" side="bottom" />
            </div>
        </header>
    );
};

export { HorizontalNavbar } from "./HorizontalNavbar";
export default Navbar;
