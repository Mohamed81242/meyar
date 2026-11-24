import React, { useState } from "react";
import {
    Menu,
    Search,
    Bell,
    Maximize2,
    Minimize2,
    LogOut,
    Settings,
    Languages,
} from "lucide-react";
import { useSidebarStore } from "@/shared/hooks/useSidebarStore";
import { useLanguage } from "@/shared/hooks";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/design-system/components/dropdown-menu";
import { authStore } from "@/auth";
import { useLogout } from "@/modules/auth/features/auth/api";
import { useNavigate } from "react-router-dom";

export const Navbar: React.FC = () => {
    const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
    const { currentLanguage, changeLanguage } = useLanguage();
    const user = authStore((state) => state.user);
    const { mutate: logout } = useLogout();
    const navigate = useNavigate();

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
        <header className="h-14 bg-white border-b border-[#E2E8F0] px-5 flex items-center justify-between shrink-0 z-30 select-none text-[#1E293B]">
            {/* Left side: Hamburger Toggle + Search Bar */}
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleSidebar}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    aria-label="Toggle Sidebar"
                >
                    <Menu className="w-4 h-4" />
                </button>

                {/* Search Bar matching Image 2 */}
                <div className="hidden sm:flex items-center gap-2 px-2.5 h-8 rounded-lg border border-[#E2E8F0] bg-white w-52 md:w-60 text-xs text-[#94A3B8]">
                    <Search className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                    <input
                        type="text"
                        placeholder="Ctrl + K"
                        aria-label="Search"
                        className="bg-transparent border-none outline-none text-[11px] text-[#0F172A] placeholder:text-[#94A3B8] flex-1 w-full"
                    />
                </div>
            </div>

            {/* Right side: Language, Notification, Fullscreen, User Avatar */}
            <div className="flex items-center gap-2">
                {/* Language Switcher */}
                <button
                    onClick={handleToggleLanguage}
                    title={currentLanguage === "ar" ? "Switch to English" : "التبديل إلى العربية"}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                    <Languages className="w-3.5 h-3.5 text-[#64748B]" />
                </button>

                {/* Notification Bell with Badge */}
                <button
                    className="relative w-7 h-7 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    aria-label="Notifications"
                >
                    <Bell className="w-3.5 h-3.5" />
                    <span className="absolute top-0.5 right-0.5 min-w-[13px] h-[13px] px-0.5 rounded-full bg-[#10B981] text-white text-[8px] font-bold flex items-center justify-center leading-none">
                        5
                    </span>
                </button>

                {/* Fullscreen Button */}
                <button
                    onClick={toggleFullscreen}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    aria-label="Toggle Fullscreen"
                >
                    {isFullscreen ? (
                        <Minimize2 className="w-3.5 h-3.5" />
                    ) : (
                        <Maximize2 className="w-3.5 h-3.5" />
                    )}
                </button>

                {/* User Avatar with Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger
                        className="flex items-center gap-1.5 cursor-pointer outline-none ml-1"
                        aria-label="User profile menu"
                    >
                        <div className="w-7 h-7 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] flex items-center justify-center text-xs overflow-hidden shrink-0 shadow-2xs">
                            👦
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-48 bg-white border border-[#E2E8F0] rounded-xl p-1 shadow-lg text-xs"
                    >
                        <div className="px-3 py-2 border-b border-[#F1F5F9]">
                            <p className="text-xs font-bold text-[#0F172A]">
                                {user?.name || "فراس حافظ"}
                            </p>
                            <p className="text-[10px] text-[#64748B] truncate">
                                {user?.email || "rmz.alemtithal@gmail.com"}
                            </p>
                        </div>
                        <DropdownMenuItem
                            onClick={() => navigate("/dashboard/billing")}
                            className="flex items-center gap-2 text-xs py-2 px-3 text-[#0F172A] hover:bg-[#F8FAFC] rounded-lg cursor-pointer"
                        >
                            <Settings className="w-3.5 h-3.5" />
                            <span>Billing & Plans</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-[#F1F5F9] my-1" />
                        <DropdownMenuItem
                            onClick={() => logout()}
                            className="flex items-center gap-2 text-xs py-2 px-3 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default Navbar;
