import { authStore } from "@/auth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/design-system/components/dropdown-menu";
import { useLogout } from "@/modules/auth/features/auth/api";
import { useNavItems } from "@/navigation";
import { cn } from "@/utils";
import {
    ArrowUpRight,
    Bell,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    CreditCard,
    Gift,
    Lock,
    LogOut,
    MoreHorizontal,
    User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useParams } from "react-router-dom";
import { settingsPaths } from "../../navigation";
interface SidebarProps {
    isCollapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false }) => {
    const { t } = useTranslation("sidebar");
    const location = useLocation();
    const { id: projectId } = useParams();
    const { user } = authStore();
    const { mutate: logout } = useLogout();
    const { sections } = useNavItems("dashboard-settings");

    const [isPlanExpanded, setIsPlanExpanded] = useState(true);
    const [expandedSections, setExpandedSections] = useState<
        Record<string, boolean>
    >({});

    useEffect(() => {
        setExpandedSections(
            sections.reduce(
                (acc, section) => {
                    acc[section.id] = true;
                    return acc;
                },
                {} as Record<string, boolean>,
            ),
        );
    }, [sections]);

    const renderNavItem = (item: any) => {
        // Replace dynamic parameters in href

        // Determine active item based on current pathname (prioritize longer, more specific matches)
        // A simple prefix check works for most routes, but exact match is better for root
        const isActive = location.pathname === item.href;
        const Icon = item.icon;

        return (
            <Link
                key={item.href}
                to={item.href}
                className={cn(
                    "flex items-center transition-all font-medium rounded-md group min-w-0",
                    isCollapsed
                        ? "justify-center h-8 w-8 mx-auto"
                        : "gap-2.5 px-3 py-1.5 text-[13px]",
                    isActive
                        ? "bg-dashboard-border/80 text-dashboard-foreground"
                        : "text-dashboard-muted-foreground hover:bg-dashboard-secondary hover:text-dashboard-foreground",
                )}
                title={isCollapsed ? t(item.labelKey) || item.label : undefined}
            >
                {Icon && (
                    <Icon
                        size={14}
                        className={cn(
                            "shrink-0",
                            isActive
                                ? "text-dashboard-foreground"
                                : "text-dashboard-muted-foreground group-hover:text-dashboard-foreground",
                        )}
                    />
                )}
                {!isCollapsed && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="truncate text-xs"
                    >
                        {t(item.labelKey) || item.label}
                    </motion.span>
                )}
            </Link>
        );
    };

    return (
        <motion.div
            id="settings-sidebar"
            initial={false}
            animate={{ width: isCollapsed ? 80 : 220 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-full shrink-0 bg-dashboard-background border-r border-dashboard-border flex flex-col relative z-50 overflow-hidden"
        >
            {/* Back Button */}
            <div
                className={cn(
                    "shrink-0 pt-4 pb-2",
                    isCollapsed ? "px-2" : "px-4",
                )}
            >
                <Link
                    to="/dashboard/overview"
                    className={cn(
                        "flex items-center text-dashboard-muted-foreground hover:text-dashboard-foreground transition-colors",
                        isCollapsed
                            ? "justify-center h-8 w-8 mx-auto rounded-md hover:bg-dashboard-secondary"
                            : "gap-2.5 px-2 py-1.5 rounded-md hover:bg-dashboard-secondary text-[13px] font-medium",
                    )}
                    title={
                        isCollapsed
                            ? t("shared:backToApp") || "Back to app"
                            : undefined
                    }
                >
                    <ChevronLeft
                        size={16}
                        className="shrink-0 rtl:rotate-180"
                    />
                    {!isCollapsed && <span>Back to app</span>}
                </Link>
            </div>

            {/* Scrollable Content */}
            <div
                className={cn(
                    "flex-1 overflow-y-auto hide-scrollbar pb-4 space-y-6",
                    isCollapsed ? "px-2" : "px-5",
                )}
            >
                {/* Workspace / Project Context Switcher */}
                {!isCollapsed ? (
                    <></>
                ) : // <button
                //     className="w-full flex items-center justify-between rounded-dashboard hover:bg-dashboard-secondary transition-colors border border-transparent hover:border-dashboard-border group mt-2 py-3 px-3 text-left"
                // >
                //     <div className="flex items-center gap-3">
                //         <div className="flex flex-col whitespace-nowrap overflow-hidden">
                //             <span className="text-[12px] font-bold text-dashboard-foreground leading-none mb-1">
                //                 Company Name
                //             </span>
                //         </div>
                //     </div>
                //     <ChevronsUpDown
                //         size={16}
                //         className="text-dashboard-muted-foreground shrink-0"
                //     />
                // </button>
                null}

                {/* Sections */}
                {sections.map((section, index) => {
                    const isExpanded = expandedSections[section.id] ?? true;
                    const canToggle =
                        section.collapsible &&
                        !isCollapsed &&
                        section.showHeader;

                    return (
                        <div
                            key={section.id}
                            className={
                                index === 0 ? "flex flex-col space-y-1" : ""
                            }
                        >
                            {section.showHeader && !isCollapsed && (
                                <button
                                    onClick={() =>
                                        canToggle &&
                                        setExpandedSections((prev) => ({
                                            ...prev,
                                            [section.id]: !prev[section.id],
                                        }))
                                    }
                                    className={cn(
                                        "w-full flex items-center justify-between pe-4 text-[11px] font-bold text-dashboard-muted-foreground  tracking-widest mb-3 mt-4 whitespace-nowrap",
                                        canToggle &&
                                            "cursor-pointer hover:text-dashboard-foreground transition-colors",
                                    )}
                                >
                                    <span>
                                        {t(section.labelKey) || section.label}
                                    </span>
                                    {canToggle && (
                                        <motion.span
                                            animate={{
                                                rotate: isExpanded ? 90 : 0,
                                            }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <ChevronRight
                                                size={12}
                                                className="text-dashboard-muted-foreground rtl:rotate-180"
                                            />
                                        </motion.span>
                                    )}
                                </button>
                            )}
                            {/* Optional separator when collapsed */}
                            {section.showHeader && isCollapsed && index > 0 && (
                                <div className="w-8 h-px bg-dashboard-border mx-auto my-4" />
                            )}
                            <AnimatePresence initial={false}>
                                {(isExpanded || isCollapsed) && (
                                    <motion.div
                                        key={`items-${section.id}`}
                                        initial={{
                                            opacity: 0,
                                            height: 0,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            height: "auto",
                                        }}
                                        exit={{
                                            opacity: 0,
                                            height: 0,
                                        }}
                                        transition={{ duration: 0.2 }}
                                        className={cn(
                                            "flex flex-col overflow-hidden",
                                            isCollapsed
                                                ? "space-y-2"
                                                : "space-y-1",
                                        )}
                                    >
                                        {section.items.map(renderNavItem)}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
     
     
            {/* Footer Area */}
            <div
                className={cn(
                    "shrink-0 bg-dashboard-card",
                    isCollapsed ? "p-2" : "p-4",
                )}
            >
                {/* User Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger
                        className={cn(
                            "w-full flex items-center rounded-dashboard hover:bg-dashboard-secondary transition-colors cursor-pointer",
                            isCollapsed
                                ? "justify-center p-2"
                                : "justify-between p-2",
                        )}
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div
                                className={cn(
                                    "bg-dashboard-secondary rounded-lg flex items-center justify-center font-bold text-dashboard-muted-foreground shrink-0",
                                    isCollapsed
                                        ? "h-12 w-12 text-lg"
                                        : "h-10 w-10",
                                )}
                            >
                                {user?.name?.charAt(0) || "B"}
                            </div>
                            {!isCollapsed && (
                                <div className="flex flex-col text-left whitespace-nowrap overflow-hidden">
                                    <span className="text-[13px] font-bold text-dashboard-foreground leading-none mb-1">
                                        {user?.name || "Bilal Esam Yosry"}
                                    </span>
                                    <span className="text-[11px] text-dashboard-muted-foreground">
                                        {user?.email || "byosry@gmail.com"}
                                    </span>
                                </div>
                            )}
                        </div>
                        {!isCollapsed && (
                            <MoreHorizontal
                                size={18}
                                className="text-dashboard-muted-foreground shrink-0"
                            />
                        )}
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="start"
                        side="right"
                        sideOffset={16}
                        className="w-64 p-0 rounded-dashboard border border-dashboard-border shadow-lg overflow-hidden bg-dashboard-card"
                    >
                        {/* Header Area */}
                     


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
        </motion.div>
    );
};

export default Sidebar;
