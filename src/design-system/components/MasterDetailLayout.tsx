import * as React from "react";
import { cn } from "@/utils";
import { ChevronLeft } from "lucide-react";

interface MasterDetailContextValue {
    isDetailActive: boolean;
    onBack?: () => void;
    backLabel?: string;
    activeItemTitle: React.ReactNode | null;
    setActiveItemTitle: (title: React.ReactNode) => void;
}

const MasterDetailContext = React.createContext<MasterDetailContextValue | null>(null);

function useMasterDetail() {
    const context = React.useContext(MasterDetailContext);
    if (!context) {
        throw new Error(
            "MasterDetail compound components must be used within a MasterDetailLayout"
        );
    }
    return context;
}

export interface MasterDetailLayoutProps extends React.ComponentPropsWithoutRef<"div"> {
    isDetailActive?: boolean;
    onBack?: () => void;
    backLabel?: string;
    children: React.ReactNode;
}

export function MasterDetailLayout({
    isDetailActive = false,
    onBack,
    backLabel,
    className,
    children,
    ...props
}: MasterDetailLayoutProps) {
    const [activeItemTitle, setActiveItemTitle] = React.useState<React.ReactNode | null>(null);

    const contextValue = React.useMemo(
        () => ({
            isDetailActive,
            onBack,
            backLabel,
            activeItemTitle,
            setActiveItemTitle,
        }),
        [isDetailActive, onBack, backLabel, activeItemTitle]
    );

    return (
        <MasterDetailContext.Provider value={contextValue}>
            <div
                className={cn(
                    "flex h-full w-full overflow-hidden bg-dashboard-background text-dashboard-foreground font-sans",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </MasterDetailContext.Provider>
    );
}

// ----------------------------------------------------------------------

export interface SidebarProps extends React.ComponentPropsWithoutRef<"aside"> {
    children: React.ReactNode;
}

export function Sidebar({ className, children, ...props }: SidebarProps) {
    const { isDetailActive } = useMasterDetail();

    return (
        <aside
            className={cn(
                "w-full md:w-80 lg:w-96 border-r border-dashboard-border flex flex-col h-full bg-dashboard-card shrink-0 transition-all duration-300",
                isDetailActive ? "hidden md:flex" : "flex",
                className
            )}
            {...props}
        >
            {children}
        </aside>
    );
}

// ----------------------------------------------------------------------

export interface SidebarHeaderProps extends Omit<React.ComponentPropsWithoutRef<"div">, "title"> {
    title: React.ReactNode;
    action?: React.ReactNode;
    count?: number;
}

export function SidebarHeader({ className, title, action, count, ...props }: SidebarHeaderProps) {
    return (
        <div
            className={cn(
                "flex items-center justify-between p-4 border-b border-dashboard-border bg-dashboard-card shrink-0 min-h-16",
                className
            )}
            {...props}
        >
            <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-dashboard-foreground leading-tight tracking-tight">
                    {title}
                </h2>
                {count !== undefined && (
                    <span className="flex items-center justify-center px-2 py-0.5 rounded-full bg-dashboard-muted text-dashboard-muted-foreground text-xs font-medium">
                        {count}
                    </span>
                )}
            </div>
            {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
    );
}

// ----------------------------------------------------------------------

export interface SidebarSearchProps extends React.ComponentPropsWithoutRef<"div"> {
    icon?: React.ReactNode;
    inputProps?: React.ComponentPropsWithoutRef<"input">;
}

export function SidebarSearch({ className, icon, inputProps, ...props }: SidebarSearchProps) {
    const { className: inputClassName, ...restInputProps } = inputProps || {};
    return (
        <div
            className={cn(
                "p-4 bg-dashboard-card border-b border-dashboard-border shrink-0",
                className
            )}
            {...props}
        >
            <div className="relative flex items-center">
                {icon && (
                    <div className="absolute left-3 text-dashboard-muted-foreground pointer-events-none flex items-center justify-center">
                        {icon}
                    </div>
                )}
                <input
                    type="text"
                    className={cn(
                        "w-full h-10 pr-4 rounded-xl border border-dashboard-border bg-dashboard-background text-sm text-dashboard-foreground placeholder:text-dashboard-muted-foreground outline-none transition-colors focus:border-dashboard-primary focus:ring-1 focus:ring-dashboard-primary",
                        icon ? "pl-10" : "pl-4",
                        inputClassName
                    )}
                    {...restInputProps}
                />
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------

export interface SidebarListProps extends React.ComponentPropsWithoutRef<"div"> {
    children: React.ReactNode;
}

export function SidebarList({ className, children, ...props }: SidebarListProps) {
    return (
        <div
            className={cn(
                "flex-1 overflow-y-auto p-4 space-y-2 bg-dashboard-card",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

// ----------------------------------------------------------------------

export interface SidebarItemProps extends Omit<React.ComponentPropsWithoutRef<"div">, "title"> {
    active?: boolean;
    icon?: React.ReactNode;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    action?: React.ReactNode;
}

export function SidebarItem({
    className,
    active = false,
    icon,
    title,
    subtitle,
    action,
    ...props
}: SidebarItemProps) {
    const { setActiveItemTitle } = useMasterDetail();

    React.useEffect(() => {
        if (active && title) {
            setActiveItemTitle(title);
        }
    }, [active, title, setActiveItemTitle]);

    return (
        <div
            className={cn(
                "flex items-center justify-between p-3 rounded-dashboard-radius cursor-pointer transition-colors duration-150 group",
                active
                    ? "bg-dashboard-secondary text-dashboard-foreground"
                    : "bg-transparent text-dashboard-foreground hover:bg-dashboard-secondary",
                className
            )}
            {...props}
        >
            <div className="flex items-center gap-3 min-w-0 flex-1">
                {icon && (
                    <div
                        className={cn(
                            "flex items-center justify-center size-10 rounded-dashboard-radius shrink-0 transition-colors border",
                            active
                                ? "bg-dashboard-card text-dashboard-foreground border-dashboard-border"
                                : "bg-transparent text-dashboard-muted-foreground border-transparent group-hover:bg-dashboard-card group-hover:border-dashboard-border"
                        )}
                    >
                        {icon}
                    </div>
                )}
                <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm truncate">{title}</div>
                    {subtitle && (
                        <div className="text-xs text-dashboard-muted-foreground truncate mt-0.5">
                            {subtitle}
                        </div>
                    )}
                </div>
            </div>
            {action && (
                <div
                    className="ml-2 shrink-0 flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    {action}
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------

export interface ContentProps extends React.ComponentPropsWithoutRef<"div"> {
    children: React.ReactNode;
    showBackButtonOnDesktop?: boolean;
}

export function Content({
    className,
    children,
    showBackButtonOnDesktop = false,
    ...props
}: ContentProps) {
    const { isDetailActive, onBack, backLabel, activeItemTitle } = useMasterDetail();

    const label = backLabel !== undefined ? backLabel : (activeItemTitle ?? "Back");

    return (
        <div
            className={cn(
                "flex-1 flex flex-col h-full bg-dashboard-background overflow-hidden transition-all duration-300",
                isDetailActive ? "flex" : "hidden md:flex",
                className
            )}
            {...props}
        >
            {/* Mobile back button header */}
            {onBack && (
                <div
                    className={cn(
                        "flex items-center h-14 border-b border-dashboard-border bg-dashboard-card px-4 shrink-0",
                        showBackButtonOnDesktop ? "flex" : "md:hidden"
                    )}
                >
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-sm font-semibold text-dashboard-foreground hover:text-dashboard-primary transition-colors cursor-pointer"
                    >
                        <ChevronLeft className="size-5 rtl:rotate-180" />
                        <span>{label}</span>
                    </button>
                </div>
            )}
            {children}
        </div>
    );
}

// ----------------------------------------------------------------------

export interface ContentBodyProps extends React.ComponentPropsWithoutRef<"div"> {
    children: React.ReactNode;
}

export function ContentBody({ className, children, ...props }: ContentBodyProps) {
    return (
        <div
            className={cn(
                "flex-1 overflow-y-auto p-4 md:p-6 space-y-6 min-w-0",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

// ----------------------------------------------------------------------

export interface ContentFooterProps extends React.ComponentPropsWithoutRef<"div"> {
    children: React.ReactNode;
}

export function ContentFooter({ className, children, ...props }: ContentFooterProps) {
    return (
        <div
            className={cn(
                "border-t border-dashboard-border bg-dashboard-card p-4 flex items-center justify-end gap-3 shrink-0",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

// ----------------------------------------------------------------------

export interface LayoutEmptyStateProps extends Omit<React.ComponentPropsWithoutRef<"div">, "title"> {
    icon?: React.ReactNode;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    variant?: "sidebar" | "content";
    action?: React.ReactNode;
}

export function LayoutEmptyState({
    className,
    icon,
    title,
    subtitle,
    variant = "content",
    action,
    ...props
}: LayoutEmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center p-8 text-center",
                variant === "sidebar" ? "my-auto py-16 h-full" : "min-h-100 h-full flex-1",
                className
            )}
            {...props}
        >
            {icon && (
                <div
                    className={cn(
                        "flex items-center justify-center mb-4",
                        variant === "content"
                            ? "size-16 rounded-dashboard-radius bg-dashboard-muted text-dashboard-muted-foreground"
                            : "text-dashboard-muted-foreground"
                    )}
                >
                    {icon}
                </div>
            )}
            <h3 className="font-bold text-base text-dashboard-foreground">
                {title}
            </h3>
            {subtitle && (
                <p className="text-xs text-dashboard-muted-foreground mt-1 max-w-[240px] mx-auto leading-relaxed font-normal">
                    {subtitle}
                </p>
            )}
            {action && (
                <div className="mt-4">
                    {action}
                </div>
            )}
        </div>
    );
}

// Attach subcomponents
MasterDetailLayout.Sidebar = Sidebar;
MasterDetailLayout.SidebarHeader = SidebarHeader;
MasterDetailLayout.SidebarSearch = SidebarSearch;
MasterDetailLayout.SidebarList = SidebarList;
MasterDetailLayout.SidebarItem = SidebarItem;
MasterDetailLayout.Content = Content;
MasterDetailLayout.ContentBody = ContentBody;
MasterDetailLayout.ContentFooter = ContentFooter;
MasterDetailLayout.EmptyState = LayoutEmptyState;
