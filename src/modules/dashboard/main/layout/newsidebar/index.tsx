import { authStore } from "@/auth";
import { Button } from "@/design-system/components/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/design-system/components/dropdown-menu";
import { useLogout } from "@/modules/auth/features/auth/api";
import { settingsPaths } from "@/modules/dashboard/settings/navigation";
import { useNavItems } from "@/navigation";
import { paths } from "@/router";
import { cn } from "@/utils";
import {
    Bell,
    Bot,
    Briefcase,
    Building2,
    ChevronDown,
    ClipboardPen,
    CreditCard,
    FolderKanban,
    Headphones,
    LayoutDashboard,
    Link2,
    Lock,
    LogOut,
    Mail,
    Monitor,
    MoreHorizontal,
    Settings,
    ShoppingCart,
    User,
    Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
    isCollapsed?: boolean;
    onExpand?: () => void;
}

const getSectionIcon = (id: string) => {
    const normalized = id.toLowerCase();
    if (normalized.includes("dashboard")) return LayoutDashboard;
    if (normalized.includes("desk")) return Headphones;
    if (normalized.includes("asset")) return Monitor;
    if (normalized.includes("project")) return FolderKanban;
    if (normalized.includes("market")) return ShoppingCart;
    if (normalized.includes("org")) return Building2;
    if (normalized.includes("ai") || normalized.includes("automation"))
        return Bot;
    if (normalized.includes("people")) return Users;
    if (normalized.includes("setting")) return Settings;
    if (normalized.includes("contracts")) return ClipboardPen;
    return Briefcase; // Default
};

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onExpand }) => {
    const { t } = useTranslation("sidebar");
    const location = useLocation();
    const { user } = authStore();
    const { mutate: logout } = useLogout();
    const { sections } = useNavItems("dashboard-main");

    const [activeSectionId, setActiveSectionId] = useState<string>("");
    const [isHoverExpanded, setIsHoverExpanded] = useState(false);
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
        () => {
            // Expand SLA Configuration by default if path contains sla-configuration
            const pathname = window.location.pathname;
            return {
                "sla-configuration": pathname.includes("sla-configuration"),
            };
        },
    );

    const effectivelyCollapsed = isCollapsed && !isHoverExpanded;

    const toggleExpand = (key: string) => {
        setExpandedItems((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    // Automatically set the active section based on the current URL
    useEffect(() => {
        const matchingSection = sections.find((section) =>
            section.items.some(
                (item) =>
                    location.pathname.startsWith(item.href) &&
                    (item.href !== "/dashboard" ||
                        location.pathname === "/dashboard"),
            ),
        );
        if (matchingSection) {
            setActiveSectionId(matchingSection.id);
        } else if (!activeSectionId && sections.length > 0) {
            setActiveSectionId(sections[0].id);
        }
    }, [location.pathname, sections]);

    // Dynamic Channels Fetching
    const isChannelsActive = activeSectionId?.toLowerCase() === "channels";

    const renderNavItem = (item: any) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = !!expandedItems[item.key];
        const isChannelRoute =
            typeof item.href === "string" &&
            item.href.startsWith("/dashboard/channels");
        const isActive = isChannelRoute
            ? location.pathname === item.href
            : location.pathname.startsWith(item.href) &&
              (item.href !== "/dashboard" ||
                  location.pathname === "/dashboard");
        const Icon = item.icon;

        if (hasChildren) {
            return (
                <div key={item.key} className="flex flex-col space-y-1">
                    <div
                        className={cn(
                            "flex items-center transition-all font-medium rounded-md group min-w-0 pr-2",
                            isActive
                                ? "bg-dashboard-primary/20 text-dashboard-foreground font-bold"
                                : "text-dashboard-foreground hover:bg-dashboard-secondary hover:text-dashboard-foreground",
                        )}
                    >
                        {/* Expand/Collapse Toggle Button */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleExpand(item.key);
                            }}
                            className="w-5 h-5 ml-1 rounded hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                            aria-label={isExpanded ? "Collapse" : "Expand"}
                        >
                            <ChevronDown
                                size={12}
                                className={cn(
                                    "transition-transform text-dashboard-foreground/75",
                                    !isExpanded && "-rotate-90",
                                )}
                            />
                        </button>

                        {/* Link */}
                        <Link
                            to={item.href}
                            onClick={() => {
                                if (!isExpanded) {
                                    setExpandedItems((prev) => ({
                                        ...prev,
                                        [item.key]: true,
                                    }));
                                }
                            }}
                            className="flex-1 flex items-center gap-2 py-2 text-[13px] min-w-0"
                        >
                            {Icon && (
                                <Icon
                                    size={16}
                                    className={cn(
                                        "shrink-0",
                                        isActive
                                            ? "text-dashboard-foreground"
                                            : "text-dashboard-foreground/70 group-hover:text-dashboard-foreground",
                                    )}
                                />
                            )}
                            <span className="truncate text-xs">
                                {t(item.labelKey) || item.label}
                            </span>
                        </Link>
                    </div>

                    {/* Render child elements if expanded */}
                    {isExpanded && (
                        <div className="ps-6 pe-1 relative flex flex-col space-y-1 border-l border-dashboard-border/60 ml-4 py-0.5">
                            {item.children.map((child: any) => {
                                const isChildActive =
                                    location.pathname === child.href;
                                const ChildIcon = child.icon;
                                return (
                                    <Link
                                        key={child.href}
                                        to={child.href}
                                        className={cn(
                                            "flex items-center transition-all font-medium rounded-md group min-w-0 gap-2.5 px-2.5 py-1.5 text-[12px]",
                                            isChildActive
                                                ? "bg-dashboard-primary/20 text-dashboard-foreground font-bold"
                                                : "text-dashboard-muted-foreground hover:bg-dashboard-secondary hover:text-dashboard-foreground",
                                        )}
                                    >
                                        {ChildIcon && (
                                            <ChildIcon
                                                size={13}
                                                className={cn(
                                                    "shrink-0",
                                                    isChildActive
                                                        ? "text-dashboard-foreground"
                                                        : "text-dashboard-muted-foreground group-hover:text-dashboard-foreground",
                                                )}
                                            />
                                        )}
                                        <span className="truncate text-xs">
                                            {t(child.labelKey) || child.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            );
        }

        const isChannelItem =
            activeSectionId?.toLowerCase() === "channels" &&
            item.key !== "channels-all";

        return (
            <div
                key={item.href}
                className="relative flex items-center group min-w-0 w-full"
            >
                <Link
                    to={item.href}
                    className={cn(
                        "flex items-center transition-all font-medium rounded-md min-w-0 flex-1",
                        "gap-3 px-3 py-2 text-[13px]", // Always expanded for the right panel
                        isActive
                            ? "bg-dashboard-primary/20 text-dashboard-foreground font-bold"
                            : "text-dashboard-foreground hover:bg-dashboard-secondary hover:text-dashboard-foreground",
                        isChannelItem ? "pr-8" : "",
                    )}
                >
                    {Icon && (
                        <Icon
                            size={16}
                            className={cn(
                                "shrink-0",
                                isActive
                                    ? "text-dashboard-foreground"
                                    : "text-dashboard-foreground/70 group-hover:text-dashboard-foreground",
                            )}
                        />
                    )}
                    <span className="truncate text-xs">
                        {t(item.labelKey) || item.label}
                    </span>
                </Link>

                {/* Channel Actions Dropdown */}
                {isChannelItem && (
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <button className="flex items-center justify-center h-6 w-6 rounded-md text-dashboard-muted-foreground hover:bg-dashboard-border/50 hover:text-dashboard-foreground focus:outline-none cursor-pointer">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="start"
                                className="w-64 border-dashboard-border shadow-xl"
                            >
                                <DropdownMenuItem className="flex items-center cursor-pointer hover:bg-dashboard-secondary rounded-sm px-2 py-1.5 text-xs text-dashboard-foreground">
                                    <Mail className="w-4 h-4 mr-2 text-dashboard-muted-foreground" />
                                    <span>Mark as unread</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center cursor-pointer hover:bg-dashboard-secondary rounded-sm px-2 py-1.5 text-xs text-dashboard-foreground">
                                    <Link2 className="w-4 h-4 mr-2 text-dashboard-muted-foreground" />
                                    <span>Copy link</span>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="bg-dashboard-border my-1" />

                                <DropdownMenuItem className="flex items-center cursor-pointer hover:bg-dashboard-secondary rounded-sm px-2 py-1.5 text-xs text-dashboard-foreground">
                                    <Mail className="w-4 h-4 mr-2 text-dashboard-muted-foreground" />
                                    <span>Email to Channel</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center cursor-pointer hover:bg-dashboard-secondary rounded-sm px-2 py-1.5 text-xs text-dashboard-foreground">
                                    <Bell className="w-4 h-4 mr-2 text-dashboard-muted-foreground" />
                                    <span>Notification settings</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div
            id="sidebar-container"
            className="h-full shrink-0 bg-dashboard-background py-3 flex flex-row relative z-50 overflow-visible"
            onMouseLeave={() => {
                if (isHoverExpanded) {
                    setIsHoverExpanded(false);
                }
            }}
        >
            {/* 1. Left Rail (Modules) */}
            <div className="w-17 shrink-0 h-full flex flex-col z-20">
                <div className="flex-1 bg-dashboard-primary/90 mx-1  rounded-t-lg  overflow-visible   flex flex-col gap-3">
                    <div className="h-16 flex bg-red items-center justify-center shrink-0">
                        <Link
                            to={paths.site.home()}
                            className="flex items-center justify-center"
                        >
                            <div className="w-8 h-8 bg-dashboard-primary rounded flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                    IT
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Section Icons */}
                    {sections.map((section) => {
                        const Icon = getSectionIcon(section.id);
                        const isActive = activeSectionId === section.id;

                        return (
                            <Button
                                key={section.id}
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    setActiveSectionId(section.id);
                                    if (isCollapsed && onExpand) {
                                        onExpand();
                                    }
                                }}
                                onMouseEnter={() => {
                                    setActiveSectionId(section.id);
                                    if (isCollapsed) {
                                        setIsHoverExpanded(true);
                                    }
                                }}
                                tooltip={t(section.labelKey) || section.label}
                                tooltipPlacement="right"
                                tooltipDelay={0}
                                className={cn(
                                    "w-10 h-10 mx-auto flex items-center justify-center rounded-lg transition-all group relative border border-transparent",
                                    isActive
                                        ? "bg-dashboard-secondary text-dashboard-foreground hover:bg-dashboard-primary/30 hover:text-dashboard-primary"
                                        : "text-white hover:bg-dashboard-secondary hover:text-dashboard-foreground",
                                )}
                            >
                                <Icon
                                    size={20}
                                    className={cn(
                                        "transition-transform",
                                        isActive
                                            ? "scale-110"
                                            : "group-hover:scale-110",
                                    )}
                                />
                            </Button>
                        );
                    })}
                </div>

                {/* Footer / User Profile (Left Rail) */}
                <div className="shrink-0  bg-dashboard-primary/90 m-1 mt-0 rounded-b-lg p-2 ">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="w-12 h-12 mx-auto flex items-center justify-center rounded-xl hover:bg-dashboard-secondary transition-colors cursor-pointer outline-none">
                            <div className="bg-dashboard-secondary rounded-lg flex items-center justify-center font-bold text-dashboard-muted-foreground h-10 w-10 text-lg">
                                {user?.name?.charAt(0) || "B"}
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="start"
                            side="right"
                            sideOffset={16}
                            className="w-64 p-0 rounded-dashboard border border-dashboard-border shadow-lg overflow-hidden bg-dashboard-card"
                        >
                            <div className="p-4 flex items-center gap-3">
                                <div className="h-10 w-10 bg-dashboard-secondary rounded-dashboard flex items-center justify-center font-bold text-dashboard-muted-foreground shrink-0">
                                    {user?.name?.charAt(0) || "B"}
                                    {user?.name?.split(" ")?.[1]?.charAt(0) ||
                                        "Y"}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-bold text-dashboard-foreground leading-none mb-1">
                                        {user?.name || "Belal Esam Yosry"}
                                    </span>
                                    <span className="text-[12px] text-dashboard-muted-foreground">
                                        {user?.email || "byosry@gmail.com"}
                                    </span>
                                </div>
                            </div>
                            <DropdownMenuSeparator className="bg-dashboard-border m-0" />
                            <div className="p-1.5 flex flex-col gap-0.5">
                                <DropdownMenuItem className="gap-3 px-3 py-2.5 rounded-dashboard text-dashboard-foreground cursor-pointer outline-none">
                                    <CreditCard
                                        size={18}
                                        className="text-dashboard-muted-foreground"
                                    />
                                    <span className="text-[13px] font-medium">
                                        Billing
                                    </span>
                                </DropdownMenuItem>
                         
                                <DropdownMenuItem className="gap-3 px-3 py-2.5 rounded-dashboard text-dashboard-foreground cursor-pointer outline-none">
                                    <Lock
                                        size={18}
                                        className="text-dashboard-muted-foreground"
                                    />
                                    <span className="text-[13px] font-medium">
                                        Security
                                    </span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-3 px-3 py-2.5 rounded-dashboard text-dashboard-foreground cursor-pointer outline-none">
                                    <Bell
                                        size={18}
                                        className="text-dashboard-muted-foreground"
                                    />
                                    <span className="text-[13px] font-medium">
                                        Notifications
                                    </span>
                                </DropdownMenuItem>
                            </div>
                            <DropdownMenuSeparator className="bg-dashboard-border m-0" />
                            <div className="p-1.5">
                                <DropdownMenuItem
                                    onClick={() => logout()}
                                    className="gap-3 px-3 py-2.5 rounded-dashboard text-dashboard-foreground cursor-pointer outline-none"
                                >
                                    <LogOut
                                        size={18}
                                        className="text-dashboard-muted-foreground"
                                    />
                                    <span className="text-[13px] font-medium">
                                        Sign Out
                                    </span>
                                </DropdownMenuItem>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* 2. Right Panel (Data Items) */}
            <motion.div
                initial={false}
                animate={{
                    width: effectivelyCollapsed ? 0 : 200,
                    opacity: effectivelyCollapsed ? 0 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="shrink-0 h-full flex flex-col relative z-10 overflow-hidden"
            >
                <div className="w-50  shrink-0 h-full flex flex-col relative">
                    <div className="flex-1 flex flex-col bg-dashboard-card rounded-xl shadow-xl overflow-hidden border border-dashboard-border relative">
                        {/* Header Logo Text */}
                        <div className="h-16 flex items-center px-6 shrink-0 border-b border-transparent">
                            <span className="text-xl font-bold text-dashboard-foreground">
                                {sections.find((s) => s.id === activeSectionId)
                                    ?.label || ""}
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto hide-scrollbar p-3 space-y-1">
                            {sections
                                .find((s) => s.id === activeSectionId)
                                ?.items.map((item: any) => renderNavItem(item))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Sidebar;
