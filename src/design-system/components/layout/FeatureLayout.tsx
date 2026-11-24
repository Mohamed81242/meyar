import { cn } from "@/utils";
import { exportToCSV, exportToExcel, exportToPrint } from "@/utils/fileUtils";
import {
    ChevronDown,
    Download,
    FileSpreadsheet,
    FileText,
    KanbanSquare,
    LayoutGrid,
    List,
    Network,
    Plus,
    Printer,
    Search,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { HeaderBreadcrumbs } from "@/modules/dashboard/main/layout/navbar/HeaderBreadcrumbs";
import { HeaderSettings } from "@/modules/dashboard/main/layout/navbar/HeaderSettings";
import { useSidebarStore } from "@/shared/hooks/useSidebarStore";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../dropdown-menu";

type FeatureLayoutProps = React.HTMLAttributes<HTMLDivElement>;

export function FeatureLayout({
    className,
    children,
    ...props
}: FeatureLayoutProps) {
    return (
        <div
            className={cn(
                "flex flex-col h-full  bg-dashboard-background overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700",
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}

// ── Header & Toolbar ─────────────────────────────────────────────────────────

interface FeatureLayoutHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    subtitle?: string;
}

FeatureLayout.Header = function FeatureLayoutHeader({
    className,
    title,
    subtitle,
    children,
    ...props
}: FeatureLayoutHeaderProps) {
    const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);

    return (
        <div
            className={cn(
                "flex items-center justify-between px-6 py-4 bg-dashboard-card border-b border-dashboard-border shrink-0 gap-4",
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between gap-4 w-full">
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-dashboard-muted-foreground hover:bg-dashboard-secondary hover:text-dashboard-foreground transition-colors shrink-0 outline-none cursor-pointer border border-transparent hover:border-dashboard-border"
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
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                            <path d="M9 3v18" />
                        </svg>
                    </button>
                    {(title || subtitle) && (
                        <div className="flex flex-col gap-0.5">
                            <HeaderBreadcrumbs />
                            {title && (
                                <h1 className="text-xl font-extrabold text-dashboard-foreground tracking-tight">
                                    {title}
                                </h1>
                            )}
                            {subtitle && (
                                <p className="text-xs text-dashboard-muted-foreground font-normal">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    )}
                </div>
                
                <div className="flex items-center gap-2">
                    {children}
                    <HeaderSettings />
                </div>
            </div>
        </div>
    );
};

interface TabItem {
    id: string;
    label: React.ReactNode;
    count?: number;
}

interface FeatureLayoutTabsProps {
    tabs: TabItem[];
    activeTab: string;
    onChange: (tabId: string) => void;
    onAdd?: () => void;
}

FeatureLayout.Tabs = function FeatureLayoutTabs({
    tabs,
    activeTab,
    onChange,
    onAdd,
}: FeatureLayoutTabsProps) {
    return (
        <div className="flex-1 w-full flex items-center justify-end gap-2">
            <div className="flex items-center rounded-2xl p-1 bg-dashboard-muted/60 border border-dashboard-border">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={cn(
                            "px-4 py-1.5 text-xs font-bold rounded-xl transition-all outline-none cursor-pointer flex items-center gap-2",
                            activeTab === tab.id
                                ? "bg-dashboard-primary text-dashboard-primary-foreground shadow-xs"
                                : "bg-transparent text-dashboard-muted-foreground hover:bg-dashboard-secondary hover:text-dashboard-foreground",
                        )}
                    >
                        {tab.label}
                        {tab.count !== undefined && (
                            <span
                                className={cn(
                                    "text-[10px] font-extrabold px-1.5 py-0.2 rounded-full",
                                    activeTab === tab.id
                                        ? "bg-white/20 text-white"
                                        : "bg-dashboard-border text-dashboard-muted-foreground",
                                )}
                            >
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>
            {onAdd && (
                <button
                    onClick={onAdd}
                    className="w-9 h-9 rounded-xl bg-dashboard-primary text-dashboard-primary-foreground hover:bg-[#5B3BE0] flex items-center justify-center transition-all shadow-xs outline-none cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

type FeatureLayoutToolbarProps = React.HTMLAttributes<HTMLDivElement>;

FeatureLayout.Toolbar = function FeatureLayoutToolbar({
    className,
    children,
    ...props
}: FeatureLayoutToolbarProps) {
    return (
        <div
            className={cn(
                "flex-1 flex items-center justify-end gap-2 shrink-0",
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
};

interface ViewToggleProps<T extends string = any> {
    id?: string;
    view: T;
    onChange: (view: T) => void;
    options?: T[];
}

FeatureLayout.ViewToggle = function FeatureLayoutViewToggle<
    T extends string = any,
>({
    id,
    view,
    onChange,
    options = ["list", "board"] as any,
}: ViewToggleProps<T>) {
    const getViewLabel = (val: string) => {
        if (val === "tree") return "Tree";
        if (val === "flow") return "Diagram Flow";
        return val;
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <button
                        id={id}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-dashboard-muted-foreground hover:text-dashboard-foreground hover:bg-dashboard-secondary border border-transparent hover:border-dashboard-border transition-colors outline-none cursor-pointer text-[13px] font-medium"
                    >
                        {(view === "list" || view === "tree") && (
                            <List className="w-4 h-4" />
                        )}
                        {view === "grid" && <LayoutGrid className="w-4 h-4" />}
                        {view === "board" && (
                            <KanbanSquare className="w-4 h-4" />
                        )}
                        {view === "flow" && <Network className="w-4 h-4" />}
                        <span className="capitalize">{getViewLabel(view)}</span>
                        <ChevronDown className="w-3.5 h-3.5 opacity-50 ml-1" />
                    </button>
                }
            />
            <DropdownMenuContent
                align="end"
                className="w-36 bg-dashboard-card border border-dashboard-border rounded-xl p-1 shadow-lg"
            >
                {options.map((opt) => (
                    <DropdownMenuItem
                        key={opt}
                        onClick={() => onChange(opt)}
                        className={cn(
                            "flex items-center gap-2 px-2 py-1.5 text-[13px] rounded-lg cursor-pointer outline-none",
                            view === opt
                                ? "bg-dashboard-secondary text-dashboard-foreground"
                                : "text-dashboard-muted-foreground hover:text-dashboard-background",
                        )}
                    >
                        {(opt === "list" || opt === "tree") && (
                            <List className="w-4 h-4" />
                        )}
                        {opt === "grid" && <LayoutGrid className="w-4 h-4" />}
                        {opt === "board" && (
                            <KanbanSquare className="w-4 h-4" />
                        )}
                        {opt === "flow" && <Network className="w-4 h-4" />}
                        <span className="capitalize">{getViewLabel(opt)}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

FeatureLayout.Search = function FeatureLayoutSearch({
    id,
    value,
    onChange,
    placeholder,
}: {
    id?: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
}) {
    return (
        <div id={id} className="relative group flex items-center">
            <Search className="w-4 h-4 text-dashboard-muted-foreground absolute left-2.5 pointer-events-none group-focus-within:text-dashboard-foreground transition-colors" />
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-8 hover:w-48 focus:w-48 h-8 bg-transparent hover:bg-dashboard-secondary focus:bg-dashboard-secondary border border-transparent hover:border-dashboard-border focus:border-dashboard-border rounded-full pl-8 pr-3 text-[13px] text-dashboard-foreground placeholder:text-transparent focus:placeholder:text-dashboard-muted-foreground transition-all duration-300 outline-none cursor-pointer focus:cursor-text"
            />
        </div>
    );
};

FeatureLayout.IconButton = function FeatureLayoutIconButton({
    id,
    icon: Icon,
    onClick,
    active,
}: {
    id?: string;
    icon: any;
    onClick: () => void;
    active?: boolean;
}) {
    return (
        <button
            id={id}
            onClick={onClick}
            className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors outline-none cursor-pointer border",
                active
                    ? "bg-dashboard-secondary text-dashboard-foreground border-dashboard-border"
                    : "bg-transparent text-dashboard-muted-foreground hover:bg-dashboard-secondary hover:text-dashboard-foreground border-transparent hover:border-dashboard-border",
            )}
        >
            <Icon className="w-4 h-4" />
        </button>
    );
};

FeatureLayout.ExportButton = function FeatureLayoutExportButton<
    T extends object,
>({
    data,
    columns,
    filename = "export",
}: {
    data: T[];
    columns?: { header: string; accessor: keyof T | ((row: T) => any) }[];
    filename?: string;
}) {
    // Auto-generate columns from the first row's keys if none are provided
    const getColumns = () =>
        columns ||
        (data.length > 0
            ? Object.keys(data[0]).map((key) => ({
                  // Convert camelCase to Title Case (e.g. "firstName" -> "First Name")
                  header:
                      key.charAt(0).toUpperCase() +
                      key
                          .slice(1)
                          .replace(/([A-Z])/g, " $1")
                          .trim(),
                  accessor: key as keyof T,
              }))
            : []);

    // Strip extension from filename if provided, so we can append .csv or .xlsx correctly
    const baseFilename = filename.replace(/\.(csv|xlsx)$/i, "");

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <button className="w-8 h-8 rounded-full flex items-center justify-center transition-colors outline-none cursor-pointer border bg-transparent text-dashboard-muted-foreground hover:bg-dashboard-secondary hover:text-dashboard-foreground border-transparent hover:border-dashboard-border">
                        <Download className="w-4 h-4" />
                    </button>
                }
            />
            <DropdownMenuContent
                align="end"
                className="w-44 z-100 bg-dashboard-card border border-dashboard-border rounded-xl shadow-lg"
            >
                <DropdownMenuItem
                    className="cursor-pointer text-[13px] font-medium focus:bg-dashboard-secondary focus:text-dashboard-foreground flex items-center gap-2.5 p-2 rounded-md"
                    onClick={() =>
                        exportToCSV(data, getColumns(), `${baseFilename}.csv`)
                    }
                >
                    <FileText className="w-4 h-4 text-dashboard-muted-foreground" />
                    Export to CSV
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="cursor-pointer text-[13px] font-medium focus:bg-dashboard-secondary focus:text-dashboard-foreground flex items-center gap-2.5 p-2 rounded-md"
                    onClick={() =>
                        exportToExcel(
                            data,
                            getColumns(),
                            `${baseFilename}.xlsx`,
                        )
                    }
                >
                    <FileSpreadsheet className="w-4 h-4 text-green-500/80" />
                    Export to Excel
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="cursor-pointer text-[13px] font-medium focus:bg-dashboard-secondary focus:text-dashboard-foreground flex items-center gap-2.5 p-2 rounded-md"
                    onClick={() =>
                        exportToPrint(data, getColumns(), baseFilename)
                    }
                >
                    <Printer className="w-4 h-4 text-blue-500/80" />
                    Print / Save as PDF
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

// ── Body & Layout ────────────────────────────────────────────────────────────

FeatureLayout.Body = function FeatureLayoutBody({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "flex flex-col flex-1 min-h-0 w-full h-full overflow-hidden relative",
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
};

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    position?: "left" | "right";
}

FeatureLayout.Sidebar = function FeatureLayoutSidebar({
    className,
    position = "left",
    children,
    ...props
}: SidebarProps) {
    return (
        <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 288, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
                "shrink-0 overflow-x-hidden overflow-y-auto",
                position === "left"
                    ? "bg-dashboard-sidebar "
                    : "bg-dashboard-secondary/30 rounded-l-[24px]",
                className,
            )}
            {...(props as any)}
        >
            <div className="w-72 h-full">{children}</div>
        </motion.div>
    );
};

FeatureLayout.Content = function FeatureLayoutContent({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "flex-1 min-h-0 w-full h-full overflow-y-auto overflow-x-hidden",
                className,
            )}
            style={{ WebkitOverflowScrolling: "touch" }}
            {...props}
        >
            {children}
        </div>
    );
};

FeatureLayout.DetailContent = function FeatureLayoutDetailContent({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "flex flex-col lg:flex-row gap-6 max-w-350 mx-auto p-6 min-h-full w-full",
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
};

FeatureLayout.DetailMain = function FeatureLayoutDetailMain({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("flex-1 min-w-0 flex flex-col gap-6", className)}
            {...props}
        >
            {children}
        </div>
    );
};

FeatureLayout.DetailSidebar = function FeatureLayoutDetailSidebar({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "w-full lg:w-[320px] shrink-0 flex flex-col gap-6",
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
};

FeatureLayout.Footer = function FeatureLayoutFooter({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "sticky bottom-0 w-full mt-auto py-4 px-6 border-t border-dashboard-border bg-dashboard-card flex items-center justify-end gap-3 shrink-0 z-10",
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
};
