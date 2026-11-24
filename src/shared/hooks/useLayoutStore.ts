import { create } from "zustand";

export type MenuOrientation = "vertical" | "horizontal";
export type ContrastMode = "contrast" | "shadow";

interface LayoutState {
    orientation: MenuOrientation;
    contrastMode: ContrastMode;
    setOrientation: (orientation: MenuOrientation) => void;
    setContrastMode: (mode: ContrastMode) => void;
}

const ORIENTATION_KEY = "dashboard-menu-orientation";
const CONTRAST_KEY = "dashboard-contrast-mode";

const getInitialOrientation = (): MenuOrientation => {
    try {
        const saved = localStorage.getItem(ORIENTATION_KEY);
        if (saved === "horizontal" || saved === "vertical") return saved;
    } catch {
        // ignore
    }
    return "vertical";
};

const getInitialContrast = (): ContrastMode => {
    try {
        const saved = localStorage.getItem(CONTRAST_KEY);
        if (saved === "contrast" || saved === "shadow") return saved;
    } catch {
        // ignore
    }
    return "shadow";
};

// Initialize attributes on documentElement immediately
if (typeof document !== "undefined") {
    const initialContrast = getInitialContrast();
    const initialOrientation = getInitialOrientation();
    document.documentElement.setAttribute("data-contrast", initialContrast);
    document.documentElement.setAttribute("data-orientation", initialOrientation);
}

export const useLayoutStore = create<LayoutState>((set) => ({
    orientation: getInitialOrientation(),
    contrastMode: getInitialContrast(),
    setOrientation: (orientation: MenuOrientation) => {
        try {
            localStorage.setItem(ORIENTATION_KEY, orientation);
            if (typeof document !== "undefined") {
                document.documentElement.setAttribute("data-orientation", orientation);
            }
        } catch {
            // ignore
        }
        set({ orientation });
    },
    setContrastMode: (contrastMode: ContrastMode) => {
        try {
            localStorage.setItem(CONTRAST_KEY, contrastMode);
            if (typeof document !== "undefined") {
                document.documentElement.setAttribute("data-contrast", contrastMode);
            }
        } catch {
            // ignore
        }
        set({ contrastMode });
    },
}));
