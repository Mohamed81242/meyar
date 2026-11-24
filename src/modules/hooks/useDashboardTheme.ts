import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

export interface ThemePalette {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    foreground?: string;
    card?: string;
    border?: string;
}

export interface DashboardThemeConfig {
    primary?: string;
    light?: ThemePalette;
    dark?: ThemePalette;
}

export const PRESET_COLORS = [
    "#2563EB", // Royal Blue (Default - MEAYAR main brand color)
    "#7c3aed", // Purple
    "#1e3a8a", // Dark Blue / Navy
    "#0d9488", // Teal
    "#ea580c", // Orange
    "#16a34a", // Green
    "#059669", // Emerald
];

export const DEFAULT_LIGHT_HEX_VALUES = {
    primary: PRESET_COLORS[0],
};

export const DEFAULT_DARK_HEX_VALUES = {
    primary: PRESET_COLORS[0],
};

const STORAGE_KEY = "dashboard-theme-config-v3";
const DARK_MODE_KEY = "dashboard-dark-mode";

interface HSL {
    h: number;
    s: number;
    l: number;
}

function hexToHsl(hex: string): HSL {
    const cleanHex = hex.replace(/^#/, "");
    let r = 0,
        g = 0,
        b = 0;
    if (cleanHex.length === 3) {
        r = parseInt(cleanHex[0] + cleanHex[0], 16) / 255;
        g = parseInt(cleanHex[1] + cleanHex[1], 16) / 255;
        b = parseInt(cleanHex[2] + cleanHex[2], 16) / 255;
    } else if (cleanHex.length === 6) {
        r = parseInt(cleanHex.substring(0, 2), 16) / 255;
        g = parseInt(cleanHex.substring(2, 4), 16) / 255;
        b = parseInt(cleanHex.substring(4, 6), 16) / 255;
    }

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    };
}

function hslToHex({ h, s, l }: HSL): string {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
    }

    const rVal = Math.max(0, Math.min(255, Math.round((r + m) * 255)));
    const gVal = Math.max(0, Math.min(255, Math.round((g + m) * 255)));
    const bVal = Math.max(0, Math.min(255, Math.round((b + m) * 255)));
    const rHex = rVal.toString(16).padStart(2, "0");
    const gHex = gVal.toString(16).padStart(2, "0");
    const bHex = bVal.toString(16).padStart(2, "0");

    return `#${rHex}${gHex}${bHex}`;
}

export function isColorDark(hex: string): boolean {
    const cleanHex = hex.replace("#", "");
    if (cleanHex.length !== 6) return false;
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
    return hsp < 127.5;
}

function getContrastingShade(bgHex: string): string {
    const cleanHex = bgHex.toLowerCase();
    const presetContrast: Record<string, string> = {
        "#7edd0a": "#000000",
        "#0a6fdb": "#ffffff",
        "#0d9488": "#ffffff",
        "#4f46e5": "#ffffff",
        "#7c3aed": "#ffffff",
        "#e11d48": "#ffffff",
        "#ea580c": "#ffffff",
        "#475569": "#ffffff",
    };

    if (presetContrast[cleanHex] !== undefined) {
        return presetContrast[cleanHex];
    }

    const isDark = isColorDark(bgHex);
    return isDark ? "#ffffff" : "#000000";
}

export function getOppositeColor(primaryHex: string, isDark: boolean): string {
    const hsl = hexToHsl(primaryHex);
    if (isDark) {
        return "#050505";
    } else {
        return "#fcfcfc";
    }
}

const SECONDARY_TINT_MAP: Record<string, string> = {
    "#2563eb": "#EFF6FF", // Blue 50
    "#7c3aed": "#F5F3FF", // Purple 50
    "#1e3a8a": "#EFF6FF", // Navy / Blue tint
    "#0d9488": "#F0FDFA", // Teal 50
    "#ea580c": "#FFF7ED", // Orange 50
    "#16a34a": "#F0FDF4", // Green 50
    "#059669": "#ECFDF5", // Emerald 50
};

export function getSecondaryTint(primaryHex: string, isDark: boolean): string {
    if (isDark) return "#1E293B";
    const clean = primaryHex.toLowerCase();
    if (SECONDARY_TINT_MAP[clean]) {
        return SECONDARY_TINT_MAP[clean];
    }
    return `color-mix(in srgb, ${primaryHex} 10%, white)`;
}

export function generatePalette(
    primaryHex: string,
    isDark: boolean,
): Required<ThemePalette> {
    if (isDark) {
        return {
            primary: primaryHex,
            secondary: "#1E293B",
            accent: "#1E293B",
            background: "#0F172A",
            foreground: "#F8FAFC",
            card: "#1E293B",
            border: "#334155",
        };
    } else {
        const sec = getSecondaryTint(primaryHex, false);
        return {
            primary: primaryHex,
            secondary: sec,
            accent: sec,
            background: "#F4F6F8",
            foreground: "#1E293B",
            card: "#FFFFFF",
            border: "#E5E7EB",
        };
    }
}

// Module-level global state to synchronize all hook instances synchronously
let globalDarkMode = false;
try {
    const saved = localStorage.getItem(DARK_MODE_KEY);
    if (saved !== null) {
        globalDarkMode = saved === "true";
    }
} catch {
    globalDarkMode = false;
}

const listeners = new Set<(val: boolean) => void>();

const syncDarkMode = (val: boolean) => {
    globalDarkMode = val;
    listeners.forEach((listener) => {
        try {
            listener(val);
        } catch {
            console.error("Failed to sync dark mode");
        }
    });
};

export function useDashboardTheme() {
    const [config, setConfig] = useState<DashboardThemeConfig>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.primary) {
                    return { primary: parsed.primary };
                }
                // Migration support for older light/dark structures
                if (parsed.light?.primary) {
                    return { primary: parsed.light.primary };
                }
                if (parsed.dark?.primary) {
                    return { primary: parsed.dark.primary };
                }
            }
            return { primary: PRESET_COLORS[0] };
        } catch {
            return { primary: PRESET_COLORS[0] };
        }
    });

    const [darkMode, setDarkMode] = useState<boolean>(globalDarkMode);

    // Subscribe to global theme changes
    useEffect(() => {
        const listener = (val: boolean) => {
            setDarkMode(val);
        };
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    }, []);

    const applyTheme = (palette: ThemePalette, isDark: boolean) => {
        const root = document.documentElement;

        // Resolve primary, falling back to brand default
        const primary = palette.primary || PRESET_COLORS[0];

        const completed = generatePalette(primary, isDark);

        const mappings: Record<keyof ThemePalette, string[]> = {
            primary: [
                "--color-dashboard-primary",
                "--color-dashboard-sidebar-primary",
            ],
            secondary: [
                "--color-dashboard-secondary",
                "--color-dashboard-input",
            ],
            accent: ["--color-dashboard-accent"],
            background: [
                "--color-dashboard-background",
                "--color-dashboard-popover",
            ],
            foreground: [
                "--color-dashboard-foreground",
                "--color-dashboard-popover-foreground",
            ],
            card: ["--color-dashboard-card"],
            border: [
                "--color-dashboard-border",
            ],
        };

        // Apply dynamic computed colors to matching CSS custom properties
        Object.entries(mappings).forEach(([key, cssVars]) => {
            const colorVal = completed[key as keyof ThemePalette];
            if (colorVal) {
                cssVars.forEach((cssVar) => {
                    root.style.setProperty(cssVar, colorVal);
                });
            } else {
                cssVars.forEach((cssVar) => {
                    root.style.removeProperty(cssVar);
                });
            }
        });

        // Set sidebar custom properties explicitly to avoid color bleeding
        root.style.setProperty(
            "--color-dashboard-sidebar",
            isDark ? "#1E293B" : "#FFFFFF"
        );
        root.style.setProperty(
            "--color-dashboard-sidebar-foreground",
            isDark ? "#F8FAFC" : "#334155"
        );
        root.style.setProperty(
            "--color-dashboard-sidebar-accent",
            isDark ? "#334155" : "#EFF6FF"
        );
        root.style.setProperty(
            "--color-dashboard-sidebar-border",
            isDark ? "#334155" : "#E5E7EB"
        );

        // Auto-adjust foreground colors for contrast if primary/secondary is set
        const primaryForeground = getContrastingShade(completed.primary);
        root.style.setProperty(
            "--color-dashboard-primary-foreground",
            primaryForeground,
        );
        root.style.setProperty(
            "--color-dashboard-sidebar-primary-foreground",
            primaryForeground,
        );

        const secondaryForeground = getContrastingShade(completed.secondary);
        root.style.setProperty(
            "--color-dashboard-secondary-foreground",
            secondaryForeground,
        );
        root.style.setProperty(
            "--color-dashboard-sidebar-accent-foreground",
            secondaryForeground,
        );

        const ringColor = isDark ? "#ffffff" : "#000000";
        root.style.setProperty("--color-dashboard-ring", ringColor);
        root.style.setProperty("--color-dashboard-sidebar-ring", ringColor);
    };

    const applyThemeModeAndClass = (
        nextDarkMode: boolean,
        nextConfig: DashboardThemeConfig,
    ) => {
        const root = document.documentElement;
        if (nextDarkMode) {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem(DARK_MODE_KEY, String(nextDarkMode));
        applyTheme({ primary: nextConfig.primary }, nextDarkMode);
    };

    // Apply colors and classes on mount or config change
    useEffect(() => {
        applyThemeModeAndClass(globalDarkMode, config);
    }, [config]);

    const setDarkModeWithTransition = (
        value: boolean | ((prev: boolean) => boolean),
    ) => {
        const nextValue =
            typeof value === "function" ? value(globalDarkMode) : value;

        if (!(document as any).startViewTransition) {
            applyThemeModeAndClass(nextValue, config);
            syncDarkMode(nextValue);
            return;
        }

        (document as any).startViewTransition(() => {
            flushSync(() => {
                applyThemeModeAndClass(nextValue, config);
                syncDarkMode(nextValue);
            });
        });
    };

    const setPrimaryColor = (color: string) => {
        const updated = {
            primary: color,
        };
        setConfig(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const setColor = (
        mode: "light" | "dark",
        key: keyof ThemePalette,
        value: string,
    ) => {
        if (key === "primary") {
            setPrimaryColor(value);
        }
    };

    const setModePalette = (mode: "light" | "dark", palette: ThemePalette) => {
        if (palette.primary) {
            setPrimaryColor(palette.primary);
        } else {
            resetTheme();
        }
    };

    const resetTheme = () => {
        setConfig({ primary: PRESET_COLORS[0] });
        localStorage.removeItem(STORAGE_KEY);
    };

    return {
        config,
        setColor,
        setPrimaryColor,
        setModePalette,
        resetTheme,
        darkMode,
        setDarkMode: setDarkModeWithTransition,
        applyTheme,
    };
}

export function useThemeCustomizer() {
    const { config, setPrimaryColor, resetTheme, darkMode, applyTheme } =
        useDashboardTheme();

    const [draftPrimary, setDraftPrimary] = useState<string>(
        () => config.primary || PRESET_COLORS[0],
    );

    // Sync draft state when global config changes (e.g. on main reset)
    useEffect(() => {
        setDraftPrimary(config.primary || PRESET_COLORS[0]);
    }, [config.primary]);

    // Preview changes in real-time as colors are selected
    useEffect(() => {
        applyTheme({ primary: draftPrimary }, darkMode);
    }, [draftPrimary, darkMode, applyTheme]);

    const save = (colorToSave?: string) => {
        const targetColor = colorToSave || draftPrimary;
        setDraftPrimary(targetColor);
        setPrimaryColor(targetColor);
    };

    const reset = () => {
        resetTheme();
    };

    const cancel = () => {
        setDraftPrimary(config.primary || PRESET_COLORS[0]);
    };

    const isDirty =
        draftPrimary.toLowerCase() !==
        (config.primary || PRESET_COLORS[0]).toLowerCase();

    return {
        draftPrimary,
        setDraftPrimary,
        isDirty,
        save,
        reset,
        cancel,
        darkMode,
    };
}
