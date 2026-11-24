import React from "react";
import { X, Sun, Moon, Settings, Check, Contrast, Layers } from "lucide-react";
import {
    useDashboardTheme,
    useThemeCustomizer,
    PRESET_COLORS,
    getSecondaryTint,
} from "../../../hooks/useDashboardTheme";
import { useLayoutStore } from "@/shared/hooks/useLayoutStore";

interface AppearanceDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AppearanceDrawer: React.FC<AppearanceDrawerProps> = ({ isOpen, onClose }) => {
    const { darkMode, setDarkMode } = useDashboardTheme();
    const { draftPrimary, setDraftPrimary, save } = useThemeCustomizer();
    const orientation = useLayoutStore((state) => state.orientation);
    const setOrientation = useLayoutStore((state) => state.setOrientation);
    const contrastMode = useLayoutStore((state) => state.contrastMode);
    const setContrastMode = useLayoutStore((state) => state.setContrastMode);

    if (!isOpen) return null;

    const handleSelectColor = (color: string) => {
        setDraftPrimary(color);
        const secondary = getSecondaryTint(color, darkMode);
        // Persist immediately for responsive preview
        try {
            const raw = localStorage.getItem("dashboard-theme-config-v3");
            const config = raw ? JSON.parse(raw) : {};
            config.primary = color;
            localStorage.setItem("dashboard-theme-config-v3", JSON.stringify(config));
            document.documentElement.style.setProperty("--color-dashboard-primary", color);
            document.documentElement.style.setProperty("--color-dashboard-secondary", secondary);
            document.documentElement.style.setProperty("--color-dashboard-sidebar-primary", color);
            document.documentElement.style.setProperty("--color-dashboard-sidebar-accent", secondary);
            document.documentElement.style.setProperty("--color-dashboard-ring", color);
            document.documentElement.style.setProperty("--color-dashboard-sidebar-ring", color);
        } catch {
            // ignore
        }
        save(color);
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            />

            {/* Slide-over panel */}
            <div className="relative w-full max-w-sm bg-white dark:bg-dashboard-card h-full shadow-2xl p-6 overflow-y-auto flex flex-col gap-6 z-10 border-l border-dashboard-border">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-dashboard-border pb-4">
                    <h2 className="text-base font-bold text-dashboard-foreground">
                        Customize site appearance
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-dashboard-muted-foreground hover:text-dashboard-foreground p-1 rounded-lg hover:bg-dashboard-secondary transition-colors cursor-pointer"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5 text-rose-500" />
                    </button>
                </div>

                {/* Section 1: Day / Dark / Auto */}
                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={() => setDarkMode(false)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold gap-2 transition-all cursor-pointer ${
                            !darkMode
                                ? "border-dashboard-primary bg-dashboard-secondary text-dashboard-primary"
                                : "border-dashboard-border bg-dashboard-card text-dashboard-muted-foreground hover:border-dashboard-primary/40"
                        }`}
                    >
                        <Sun className="w-5 h-5 text-amber-500" />
                        <span>Day mode</span>
                    </button>

                    <button
                        onClick={() => setDarkMode(true)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold gap-2 transition-all cursor-pointer ${
                            darkMode
                                ? "border-dashboard-primary bg-dashboard-secondary text-dashboard-primary"
                                : "border-dashboard-border bg-dashboard-card text-dashboard-muted-foreground hover:border-dashboard-primary/40"
                        }`}
                    >
                        <Moon className="w-5 h-5" />
                        <span>Dark mode</span>
                    </button>

                    <button
                        onClick={() => {
                            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                            setDarkMode(prefersDark);
                        }}
                        className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashboard-border bg-dashboard-card text-dashboard-muted-foreground text-xs font-semibold gap-2 hover:border-dashboard-primary/40 transition-all cursor-pointer"
                    >
                        <Settings className="w-5 h-5 text-gray-400" />
                        <span>Auto</span>
                    </button>
                </div>

                {/* Section 2: Theme Contrast */}
                <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-bold text-dashboard-foreground">
                        Theme Contrast
                    </h3>
                    <p className="text-xs text-dashboard-muted-foreground">
                        Choose theme contrast/shadow
                    </p>
                    <div className="grid grid-cols-2 gap-3 mt-1">
                        <button
                            onClick={() => setContrastMode("contrast")}
                            className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-xs font-semibold gap-2 transition-all cursor-pointer ${
                                contrastMode === "contrast"
                                    ? "border-dashboard-primary bg-dashboard-secondary text-dashboard-primary"
                                    : "border-dashboard-border text-dashboard-muted-foreground hover:border-dashboard-primary/40"
                            }`}
                        >
                            <Contrast className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                            <span>Contrast</span>
                        </button>
                        <button
                            onClick={() => setContrastMode("shadow")}
                            className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-xs font-semibold gap-2 transition-all cursor-pointer ${
                                contrastMode === "shadow"
                                    ? "border-dashboard-primary bg-dashboard-secondary text-dashboard-primary"
                                    : "border-dashboard-border text-dashboard-muted-foreground hover:border-dashboard-primary/40"
                            }`}
                        >
                            <Layers className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                            <span>Shadow</span>
                        </button>
                    </div>
                </div>

                {/* Section 3: Custom Theme Colors */}
                <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-bold text-dashboard-foreground">
                        Custom Theme
                    </h3>
                    <p className="text-xs text-dashboard-muted-foreground">
                        Choose your primary theme color
                    </p>
                    <div className="grid grid-cols-4 gap-2.5 mt-1">
                        {PRESET_COLORS.map((color, idx) => {
                            const isSelected = (draftPrimary || "#2563EB").toLowerCase() === color.toLowerCase();
                            return (
                                <button
                                    key={color}
                                    onClick={() => handleSelectColor(color)}
                                    className="h-12 rounded-xl flex flex-col items-center justify-center text-white text-[11px] font-bold transition-transform hover:scale-105 relative shadow-xs cursor-pointer"
                                    style={{ backgroundColor: color }}
                                >
                                    {isSelected && <Check className="w-4 h-4 text-white" />}
                                    {idx === 0 && <span className="text-[10px] opacity-90">default</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Section 4: Menu Orientation */}
                <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-bold text-dashboard-foreground">
                        Menu Orientation
                    </h3>
                    <p className="text-xs text-dashboard-muted-foreground">
                        Choose vertical or horizontal navigation layout
                    </p>
                    <div className="grid grid-cols-2 gap-3 mt-1">
                        {/* Vertical Preview Card */}
                        <button
                            onClick={() => setOrientation("vertical")}
                            className={`p-2.5 rounded-xl border flex flex-col gap-2 transition-all cursor-pointer ${
                                orientation === "vertical"
                                    ? "border-dashboard-primary bg-dashboard-secondary/40 ring-1 ring-dashboard-primary"
                                    : "border-dashboard-border hover:border-dashboard-primary/40"
                            }`}
                        >
                            <div className="w-full h-14 bg-dashboard-muted rounded-lg flex p-1 gap-1 border border-dashboard-border">
                                <div className="w-1/4 h-full bg-dashboard-primary rounded-xs" />
                                <div className="flex-1 h-full bg-white dark:bg-dashboard-card rounded-xs border border-dashboard-border" />
                            </div>
                            <span className="text-xs font-semibold text-center text-dashboard-foreground">
                                Vertical
                            </span>
                        </button>

                        {/* Horizontal Preview Card */}
                        <button
                            onClick={() => setOrientation("horizontal")}
                            className={`p-2.5 rounded-xl border flex flex-col gap-2 transition-all cursor-pointer ${
                                orientation === "horizontal"
                                    ? "border-dashboard-primary bg-dashboard-secondary/40 ring-1 ring-dashboard-primary"
                                    : "border-dashboard-border hover:border-dashboard-primary/40"
                            }`}
                        >
                            <div className="w-full h-14 bg-dashboard-muted rounded-lg flex flex-col p-1 gap-1 border border-dashboard-border">
                                <div className="w-full h-3 bg-dashboard-primary rounded-xs" />
                                <div className="flex-1 w-full bg-white dark:bg-dashboard-card rounded-xs border border-dashboard-border" />
                            </div>
                            <span className="text-xs font-semibold text-center text-dashboard-foreground">
                                Horizontal
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppearanceDrawer;
