import { useState } from "react";

export interface FeatureLayoutState<TTab = string> {
    activeTab: TTab;
    setActiveTab: (tab: TTab) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    viewMode: "list" | "grid" | "board";
    setViewMode: (mode: "list" | "grid" | "board") => void;
    isSidebarOpen: boolean;
    setSidebarOpen: (isOpen: boolean) => void;
    isFilterOpen: boolean;
    setFilterOpen: (isOpen: boolean) => void;
}

export function useFeatureLayout<TTab = string>(defaultTab: TTab, defaultView: "list" | "grid" | "board" = "list"): FeatureLayoutState<TTab> {
    const [activeTab, setActiveTab] = useState<TTab>(defaultTab);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"list" | "grid" | "board">(defaultView);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isFilterOpen, setFilterOpen] = useState(false);

    return {
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        viewMode,
        setViewMode,
        isSidebarOpen,
        setSidebarOpen,
        isFilterOpen,
        setFilterOpen
    };
}
