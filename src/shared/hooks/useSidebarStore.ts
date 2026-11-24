import { create } from "zustand";

interface SidebarStore {
    isSidebarCollapsed: boolean;
    setIsSidebarCollapsed: (val: boolean) => void;
    toggleSidebar: () => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
    isSidebarCollapsed: false,
    setIsSidebarCollapsed: (val) => set({ isSidebarCollapsed: val }),
    toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}));
