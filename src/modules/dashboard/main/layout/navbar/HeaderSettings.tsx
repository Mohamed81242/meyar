import { Button } from "@/design-system/components/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/design-system/components/dropdown-menu";
import { settingsPaths } from "@/modules/dashboard/settings/navigation";
import { useLanguage } from "@/shared/hooks";
import { cn } from "@/utils";
import { Check, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    isColorDark,
    PRESET_COLORS,
    useDashboardTheme,
    useThemeCustomizer,
} from "../../../../hooks/useDashboardTheme";

export const HeaderSettings = () => {
    const navigate = useNavigate();
    const { currentLanguage, changeLanguage } = useLanguage();

    const { draftPrimary, setDraftPrimary, save, reset, cancel, darkMode } =
        useThemeCustomizer();

    const { setDarkMode } = useDashboardTheme();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleOpenChange = (open: boolean) => {
        setIsDropdownOpen(open);
        if (!open) {
            cancel();
        }
    };
    const handleSave = () => {
        save();
        setIsDropdownOpen(false);
    };

    const handleReset = () => {
        reset();
        setIsDropdownOpen(false);
    };

    return (
        <DropdownMenu open={isDropdownOpen} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger
                title={
                    currentLanguage === "ar"
                        ? "الإعدادات السريعة"
                        : "Quick Settings"
                }
                className="h-8 w-8 rounded-lg flex items-center justify-center text-dashboard-muted-foreground hover:bg-dashboard-secondary hover:text-dashboard-foreground transition-colors cursor-pointer outline-none"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                sideOffset={12}
                className="w-56 p-2 rounded-dashboard border border-dashboard-border shadow-lg bg-dashboard-card flex flex-col gap-2"
            >
                <div
                    onClick={() => navigate(settingsPaths.root())}
                    className="hover:bg-dashboard-primary/10 cursor-pointer group-hover:text-dashboard-foreground text-xs font-semibold text-dashboard-foreground px-2 py-1 flex items-center gap-2"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                    {currentLanguage === "ar"
                        ? "الإعدادات العامة"
                        : "General Settings"}
                </div>

                <div className="h-px bg-dashboard-border mx-1" />

                {/* Dark Mode */}
                <div
                    onClick={(e) => {
                        e.preventDefault();
                        setDarkMode(!darkMode);
                    }}
                    className="hover:bg-dashboard-primary/10 cursor-pointer flex items-center justify-between p-2"
                >
                    <span className="text-xs font-medium text-dashboard-foreground group-hover:text-dashboard-foreground">
                        {currentLanguage === "ar"
                            ? "الوضع الليلي"
                            : "Dark Mode"}
                    </span>
                    {darkMode ? (
                        <Sun className="h-4 w-4" />
                    ) : (
                        <Moon className="h-4 w-4" />
                    )}
                </div>

                <div className="h-px bg-dashboard-border mx-1" />

                {/* Language */}
                <div className="hover:bg-dashboard-primary/10 cursor-pointer flex flex-col gap-1 p-2">
                    <span className="text-[11px] font-semibold text-dashboard-muted-foreground px-1">
                        {currentLanguage === "ar"
                            ? "اللغة"
                            : "Language"}
                    </span>
                    <DropdownMenuItem
                        onClick={() => changeLanguage("en")}
                        className={cn(
                            "flex items-center justify-between px-2 py-1.5 rounded-md text-xs font-medium cursor-pointer outline-none hover:bg-dashboard-secondary",
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
                            "flex items-center justify-between px-2 py-1.5 rounded-md text-xs font-medium cursor-pointer outline-none hover:bg-dashboard-secondary",
                            currentLanguage === "ar" &&
                                "bg-dashboard-secondary text-dashboard-primary font-bold",
                        )}
                    >
                        <span>العربية</span>
                        {currentLanguage === "ar" && (
                            <Check className="h-3.5 w-3.5 text-dashboard-primary" />
                        )}
                    </DropdownMenuItem>
                </div>

                <div className="h-px bg-dashboard-border mx-1" />

                {/* Theme Color */}
                <div className="hover:bg-dashboard-primary/10 cursor-pointer flex flex-col gap-2 p-2">
                    <span className="text-[11px] font-semibold text-dashboard-muted-foreground">
                        {currentLanguage === "ar"
                            ? "لون المظهر"
                            : "Theme Color"}
                    </span>
                    <div className="grid grid-cols-5 gap-1.5">
                        {PRESET_COLORS.map((color) => {
                            const isSelected =
                                draftPrimary.toLowerCase() ===
                                color.toLowerCase();
                            const isDark = isColorDark(color);
                            return (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setDraftPrimary(color);
                                    }}
                                    className="w-6 h-6 rounded-full border border-dashboard-border cursor-pointer hover:scale-110 transition-transform relative flex items-center justify-center shadow-sm focus:outline-none"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                >
                                    {isSelected && (
                                        <div
                                            className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-white" : "bg-black"} shadow-sm`}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    <div className="flex gap-2 mt-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                e.preventDefault();
                                handleReset();
                            }}
                            className="flex-1 text-[10px] h-7 px-2 border-dashboard-border hover:bg-dashboard-secondary text-dashboard-foreground cursor-pointer"
                        >
                            {currentLanguage === "ar"
                                ? "إعادة تعيين"
                                : "Reset"}
                        </Button>
                        <Button
                            size="sm"
                            onClick={(e) => {
                                e.preventDefault();
                                handleSave();
                            }}
                            className="flex-1 text-[10px] h-7 px-2 bg-dashboard-primary hover:bg-dashboard-primary/90 text-dashboard-primary-foreground font-medium cursor-pointer"
                        >
                            {currentLanguage === "ar" ? "حفظ" : "Save"}
                        </Button>
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
