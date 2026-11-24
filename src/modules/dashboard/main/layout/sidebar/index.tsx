import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import {
    LineChart,
    TrendingUp,
    BarChart2,
    Users,
    ShieldCheck,
    Building2,
    Building,
    FileText,
    Tag,
    CheckSquare,
    LayoutGrid,
    Type,
    FolderCheck,
    AlertTriangle,
    CheckCircle2,
    GitBranch,
    ArrowUpDown,
    CreditCard,
    Bell,
    ChevronDown,
    ChevronRight,
    LogOut,
    Settings,
} from "lucide-react";
import { cn } from "@/utils";
import { MeayarLogo } from "@/assets/MeayarLogo";
import { authStore } from "@/auth";
import { UserAvatarMenu } from "../navbar/UserAvatarMenu";

interface SidebarProps {
    isCollapsed?: boolean;
    onExpand?: () => void;
}

interface NavSubItem {
    title: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
}

interface NavGroupItem {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    href?: string;
    subItems?: NavSubItem[];
}

interface NavSection {
    sectionTitle: string;
    items: NavGroupItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false }) => {
    const location = useLocation();
    const user = authStore((state) => state.user);

    // Track expanded sub-menus (User Management expanded by default as in Image 1 & 2)
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
        Statistics: location.pathname.includes("statistics"),
        "User Management": location.pathname.includes("user") || location.pathname.includes("role") || location.pathname === "/dashboard/billing",
        "Company Management": location.pathname.includes("compan"),
        "Inspection Settings": location.pathname.includes("inspection") || location.pathname.includes("folder") || location.pathname.includes("evaluation"),
    });

    const toggleGroup = (title: string) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    const sidebarSections: NavSection[] = [
        {
            sectionTitle: "STATISTICS",
            items: [
                {
                    title: "Statistics",
                    icon: LineChart,
                    subItems: [
                        { title: "My Statistics", href: "/dashboard/my-statistics", icon: TrendingUp },
                        { title: "Statistics Live", href: "/dashboard/statistics-live", icon: BarChart2 },
                    ],
                },
            ],
        },
        {
            sectionTitle: "USER MANAGEMENT",
            items: [
                {
                    title: "User Management",
                    icon: Users,
                    subItems: [
                        { title: "Roles and Permissions", href: "/dashboard/roles-and-permissions", icon: ShieldCheck },
                        { title: "Users", href: "/dashboard/users", icon: Users },
                    ],
                },
            ],
        },
        {
            sectionTitle: "COMPANY MANAGEMENT",
            items: [
                {
                    title: "Company Management",
                    icon: Building2,
                    subItems: [
                        { title: "Company Classifications", href: "/dashboard/company-classifications", icon: Building2 },
                        { title: "companies", href: "/dashboard/companies", icon: Building },
                        { title: "Registration Of Companies", href: "/dashboard/registration-of-companies", icon: FileText },
                        { title: "Company Tags", href: "/dashboard/company-tags", icon: Tag },
                    ],
                },
            ],
        },
        {
            sectionTitle: "INSPECTION MANAGEMENT",
            items: [
                {
                    title: "Inspection Settings",
                    icon: CheckSquare,
                    subItems: [
                        { title: "Inspection Types", href: "/dashboard/inspection-types", icon: Type },
                        { title: "Folders or Classifications", href: "/dashboard/folders-or-classifications", icon: FolderCheck },
                        { title: "Inspection Templates", href: "/dashboard/inspection-templates", icon: LayoutGrid },
                        { title: "Options could not be evaluated", href: "/dashboard/evaluation-options", icon: AlertTriangle },
                    ],
                },
                {
                    title: "Inspection Templates",
                    icon: LayoutGrid,
                    href: "/dashboard/inspection-templates",
                },
                {
                    title: "Inspection Tasks",
                    icon: CheckCircle2,
                    href: "/dashboard/inspection-tasks",
                },
                {
                    title: "Procedures",
                    icon: GitBranch,
                    href: "/dashboard/procedures",
                },
            ],
        },
        {
            sectionTitle: "REVIEW CRITERIA",
            items: [
                {
                    title: "Sorting mechanisms",
                    icon: ArrowUpDown,
                    href: "/dashboard/sorting-mechanisms",
                },
            ],
        },
    ];

    const currentWidth = isCollapsed ? 76 : 256;

    return (
        <motion.aside
            id="main-sidebar"
            initial={false}
            animate={{ width: currentWidth }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="h-full shrink-0 flex flex-col bg-white border-r border-[#E2E8F0] select-none z-40 relative text-[#1E293B]"
        >
            {/* Top Brand Header */}
            <div className="h-16 flex items-center px-5 border-b border-[#E2E8F0] shrink-0">
                <Link to="/dashboard/billing" className="flex items-center gap-3">
                    <MeayarLogo collapsed={isCollapsed} />
                </Link>
            </div>

            {/* Scrollable Navigation */}
            <div className="flex-1 overflow-y-auto hide-scrollbar px-3 py-3 space-y-4">
                {sidebarSections.map((section) => (
                    <div key={section.sectionTitle} className="space-y-1">
                        {!isCollapsed && (
                            <div className="px-3 py-1.5 text-xs font-bold text-[#94A3B8] tracking-wider uppercase">
                                {section.sectionTitle}
                            </div>
                        )}

                        {section.items.map((item) => {
                            const ItemIcon = item.icon;
                            const hasSubItems = item.subItems && item.subItems.length > 0;
                            const isExpanded = !!expandedGroups[item.title];

                            // Group with children
                            if (hasSubItems) {
                                const isGroupActive = item.subItems?.some(
                                    (sub) =>
                                        location.pathname === sub.href ||
                                        (sub.href !== "/dashboard" && location.pathname.startsWith(sub.href))
                                );

                                return (
                                    <div key={item.title} className="space-y-1">
                                        <button
                                            type="button"
                                            onClick={() => toggleGroup(item.title)}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-3.5 py-2 text-sm rounded-xl transition-colors cursor-pointer",
                                                isGroupActive
                                                    ? "bg-dashboard-secondary text-dashboard-primary font-bold"
                                                    : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] font-semibold",
                                                isCollapsed && "justify-center px-0"
                                            )}
                                            title={isCollapsed ? item.title : undefined}
                                        >
                                            <ItemIcon
                                                className={cn(
                                                    "w-4 h-4 shrink-0",
                                                    isGroupActive ? "text-dashboard-primary" : "text-[#64748B]"
                                                )}
                                            />
                                            {!isCollapsed && (
                                                <>
                                                    <span className="flex-1 text-start truncate text-sm">
                                                        {item.title}
                                                    </span>
                                                    <ChevronDown
                                                        className={cn(
                                                            "w-3.5 h-3.5 transition-transform duration-200",
                                                            isGroupActive ? "text-dashboard-primary" : "text-[#94A3B8]",
                                                            isExpanded && "rotate-180"
                                                        )}
                                                    />
                                                </>
                                            )}
                                        </button>

                                        {/* Sub Items */}
                                        {!isCollapsed && isExpanded && (
                                            <div className="space-y-0.5 ps-4 pe-1 mt-0.5">
                                                {item.subItems!.map((sub) => {
                                                    const SubIcon = sub.icon;
                                                    const isActive =
                                                        location.pathname === sub.href ||
                                                        (sub.href !== "/dashboard" && location.pathname.startsWith(sub.href));

                                                    return (
                                                        <Link
                                                            key={sub.title}
                                                            to={sub.href}
                                                            className={cn(
                                                                "flex items-center gap-2.5 px-3 py-1.5 text-xs rounded-lg transition-all",
                                                                isActive
                                                                    ? "text-dashboard-primary font-bold bg-dashboard-secondary/50"
                                                                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] font-medium"
                                                            )}
                                                        >
                                                            {SubIcon && (
                                                                <SubIcon
                                                                    className={cn(
                                                                        "w-3.5 h-3.5 shrink-0",
                                                                        isActive ? "text-dashboard-primary" : "text-[#94A3B8]"
                                                                    )}
                                                                />
                                                            )}
                                                            <span className="truncate">{sub.title}</span>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            // Single link item
                            const isActive = Boolean(
                                item.href &&
                                    (location.pathname === item.href ||
                                        (item.href !== "/dashboard" && location.pathname.startsWith(item.href)))
                            );
                            return (
                                <Link
                                    key={item.title}
                                    to={item.href || "#"}
                                    className={cn(
                                        "flex items-center gap-3 px-3.5 py-2 text-sm rounded-xl transition-all",
                                        isCollapsed && "justify-center px-0",
                                        isActive
                                            ? "bg-dashboard-secondary text-dashboard-primary font-bold"
                                            : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] font-semibold"
                                    )}
                                    title={isCollapsed ? item.title : undefined}
                                >
                                    <ItemIcon
                                        className={cn(
                                            "w-4 h-4 shrink-0",
                                            isActive ? "text-dashboard-primary" : "text-[#64748B]"
                                        )}
                                    />
                                    {!isCollapsed && <span className="truncate">{item.title}</span>}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Bottom Profile & Subscription Cards */}
            <div className="shrink-0 border-t border-[#E2E8F0] p-2.5 space-y-2">
                {/* User Profile Card with Menu */}
                <UserAvatarMenu
                    side="right"
                    align={isCollapsed ? "center" : "end"}
                    className="w-full text-start block"
                >
                    <div
                        className={cn(
                            "flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#F8FAFC] dark:hover:bg-dashboard-secondary transition-colors cursor-pointer",
                            isCollapsed && "justify-center p-1"
                        )}
                    >
                        <div className="w-9 h-9 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] flex items-center justify-center text-sm shrink-0 overflow-hidden shadow-2xs">
                            👦
                        </div>
                        {!isCollapsed && (
                            <>
                                <div className="flex flex-col text-start overflow-hidden min-w-0 flex-1 leading-tight">
                                    <span className="text-xs font-bold text-[#0F172A] dark:text-dashboard-foreground truncate">
                                        {user?.name || "فراس حافظ"}
                                    </span>
                                    <span className="text-[11px] text-[#64748B]">
                                        أدمن
                                    </span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-[#94A3B8] shrink-0" />
                            </>
                        )}
                    </div>
                </UserAvatarMenu>

                {/* Subscription Plan Card */}
                {!isCollapsed && (
                    <Link
                        to="/dashboard/settings?tab=subscriptions"
                        className="block bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl p-2.5 space-y-1 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#0F172A]">
                                Basic Plan
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6] text-[10px] font-semibold">
                                Active
                            </span>
                        </div>
                        <p className="text-[10px] text-[#64748B] tracking-tight">
                            [27 Days] تاريخ الاستحقاق: 2026/12/22
                        </p>
                    </Link>
                )}
            </div>
        </motion.aside>
    );
};

export default Sidebar;
