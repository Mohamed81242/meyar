import { Plus, SlidersHorizontal } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "../button";
import { FeatureLayout } from "../layout/FeatureLayout";
import { RelationshipFlow } from "./RelationshipFlow";
import type { RelationshipFlowProps } from "./types";

export interface TreeFlowLayoutProps {
    title: ReactNode;
    subtitle?: ReactNode;
    tabs?: {
        id: string;
        label: ReactNode;
        icon?: ReactNode;
    }[];
    activeTab?: string;
    onTabChange?: (tabId: string) => void;
    viewMode: "tree" | "flow";
    onViewModeChange: (viewMode: "tree" | "flow") => void;
    isDataLoading?: boolean;
    treePanelTitle?: ReactNode;
    addBtnLabel?: string;
    onAddRoot?: () => void;

    searchQuery?: string;
    onSearchChange?: (val: string) => void;
    onFilterToggle?: () => void;
    isFilterActive?: boolean;
    filterSidebar?: ReactNode;

    // Flow/Diagram Props
    flowProps: Omit<RelationshipFlowProps, "className">;

    // Custom Tree View Component/Content
    treeContent: ReactNode;

    // Any extra modals/dialogs
    children?: ReactNode;
}

export function TreeFlowLayout({
    title,
    subtitle,
    tabs,
    activeTab,
    onTabChange,
    viewMode,
    onViewModeChange,
    isDataLoading = false,
    treePanelTitle,
    addBtnLabel = "Add Item",
    onAddRoot,
    searchQuery,
    onSearchChange,
    onFilterToggle,
    isFilterActive,
    filterSidebar,
    flowProps,
    treeContent,
    children,
}: TreeFlowLayoutProps) {
    return (
        <FeatureLayout>
            <FeatureLayout.Header>
                <div className="flex flex-col gap-1 flex-1">
                    <h1 className="text-md font-bold text-dashboard-foreground">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-xs text-dashboard-muted-foreground">
                            {subtitle}
                        </p>
                    )}
                </div>

                {tabs && tabs.length > 0 && activeTab && onTabChange && (
                    <div id="catalog-tabs-container" className="flex-none">
                        <div id="classification-tabs">
                            <FeatureLayout.Tabs
                                tabs={tabs.map((tab) => ({
                                    id: tab.id,
                                    label: (
                                        <span className="flex items-center gap-2">
                                            {tab.icon}
                                            {tab.label}
                                        </span>
                                    ),
                                }))}
                                activeTab={activeTab}
                                onChange={onTabChange}
                            />
                        </div>
                    </div>
                )}

                <div id="catalog-search-filters" className="flex items-center gap-2 shrink-0">
                    <FeatureLayout.Toolbar>
                        {onSearchChange && (
                            <FeatureLayout.Search
                                value={searchQuery || ""}
                                onChange={onSearchChange}
                                placeholder="Search..."
                            />
                        )}
                        {onFilterToggle && (
                            <FeatureLayout.IconButton
                                icon={SlidersHorizontal}
                                onClick={onFilterToggle}
                                active={isFilterActive}
                            />
                        )}
                        <FeatureLayout.ViewToggle
                            id="classification-view-toggle"
                            view={viewMode}
                            onChange={(mode) =>
                                onViewModeChange(
                                    mode === "tree" ? "tree" : "flow",
                                )
                            }
                            options={["tree", "flow"]}
                        />
                        {viewMode === "tree" && onAddRoot && (
                            <FeatureLayout.IconButton
                                id="catalog-new-service-btn"
                                icon={Plus}
                                onClick={onAddRoot}
                            />
                        )}
                    </FeatureLayout.Toolbar>
                </div>
            </FeatureLayout.Header>

            <FeatureLayout.Body>
                <FeatureLayout.Content>
                    <div className="p-6 h-full flex flex-col min-h-0 overflow-hidden">
                        {viewMode === "tree" ? (
                            <div id="catalog-list-table" className="flex-1 flex flex-col min-h-0 overflow-hidden animate-in fade-in duration-300">
                                <section className="flex flex-col flex-1 min-h-0 bg-dashboard-card border border-dashboard-border rounded-[24px] shadow-sm p-5">
                                    <div className="flex items-center justify-between mb-4 flex-none border-b border-dashboard-border/50 pb-3">
                                        <h2 className="text-sm font-bold text-dashboard-foreground flex items-center gap-2">
                                            {treePanelTitle || "Hierarchy Tree"}
                                        </h2>
                                        {onAddRoot && (
                                            <Button
                                                onClick={onAddRoot}
                                                className="bg-transparent hover:bg-dashboard-primary/95 text-dashboard-foreground hover:text-dashboard-background rounded-full px-4 text-xs font-semibold flex items-center gap-1.5 cursor-pointer h-9 shrink-0 shadow-sm"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                {addBtnLabel}
                                            </Button>
                                        )}
                                    </div>
                                    <div className="flex-1 overflow-y-auto pr-1">
                                        {isDataLoading ? (
                                            <div className="p-10 text-sm text-center text-dashboard-muted-foreground flex flex-col items-center justify-center h-full">
                                                <div className="w-8 h-8 border-4 border-dashboard-primary/30 border-t-dashboard-primary rounded-full animate-spin mb-4" />
                                                Loading items...
                                            </div>
                                        ) : (
                                            treeContent
                                        )}
                                    </div>
                                </section>
                            </div>
                        ) : (
                            <div className="flex-1 w-full bg-dashboard-card border border-dashboard-border rounded-[24px] overflow-hidden shadow-sm relative min-h-0 animate-in fade-in duration-300">
                                {isDataLoading ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-sm text-dashboard-muted-foreground">
                                        <div className="w-8 h-8 border-4 border-dashboard-primary/30 border-t-dashboard-primary rounded-full animate-spin mb-4" />
                                        Loading diagram...
                                    </div>
                                ) : (
                                    <RelationshipFlow
                                        {...flowProps}
                                        className="h-full w-full"
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </FeatureLayout.Content>

                {filterSidebar}
            </FeatureLayout.Body>
            {children}
        </FeatureLayout>
    );
}
export default TreeFlowLayout;
