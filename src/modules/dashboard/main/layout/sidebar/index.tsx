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
    CheckSquare,
    LayoutGrid,
    CreditCard,
    Bell,
    ChevronDown,
    ChevronRight,
    LogOut,
} from "lucide-react";
import { cn } from "@/utils";
import { MeayarLogo } from "@/assets/MeayarLogo";
import { authStore } from "@/auth";
import { useLogout } from "@/modules/auth/features/auth/api";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/design-system/components/dropdown-menu";

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
    const { mutate: logout } = useLogout();

    // Track expanded sub-menus (User Management expanded by default as in Image 1 & 2)
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
        Statistics: false,
        "User Management": true,
        "Company Management": false,
        "Inspection Settings": false,
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
                        { title: "My Statistics", href: "/dashboard/billing?tab=my-statistics", icon: TrendingUp },
                        { title: "Statistics Live", href: "/dashboard/billing?tab=statistics-live", icon: BarChart2 },
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
                        { title: "Roles and Permissions", href: "/dashboard/billing?tab=roles", icon: ShieldCheck },
                        { title: "Users", href: "/dashboard/billing", icon: Users },
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
                        { title: "Company Profile", href: "/dashboard/billing?tab=company", icon: Building2 },
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
                        { title: "Settings List", href: "/dashboard/billing?tab=inspection-settings", icon: CheckSquare },
                    ],
                },
                {
                    title: "Inspection Templates",
                    icon: LayoutGrid,
                    href: "/dashboard/billing?tab=inspection-templates",
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
                            <div className="px-3 py-1 text-[11px] font-bold text-[#94A3B8] tracking-wider uppercase">
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
                                        location.pathname === sub.href &&
                                        (!sub.href.includes("?") || location.search === sub.href.split("?")[1] || (sub.title === "Users" && (!location.search || location.search === "" || location.search === "?tab=users")))
                                );

                                return (
                                    <div key={item.title} className="space-y-1">
                                        <button
                                            type="button"
                                            onClick={() => toggleGroup(item.title)}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer",
                                                isGroupActive
                                                    ? "bg-[#EFF6FF] text-[#2563EB]"
                                                    : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]",
                                                isCollapsed && "justify-center px-0"
                                            )}
                                            title={isCollapsed ? item.title : undefined}
                                        >
                                            <ItemIcon
                                                className={cn(
                                                    "w-4 h-4 shrink-0",
                                                    isGroupActive ? "text-[#2563EB]" : "text-[#64748B]"
                                                )}
                                            />
                                            {!isCollapsed && (
                                                <>
                                                    <span className="flex-1 text-start truncate">
                                                        {item.title}
                                                    </span>
                                                    <ChevronDown
                                                        className={cn(
                                                            "w-3.5 h-3.5 transition-transform duration-200",
                                                            isGroupActive ? "text-[#2563EB]" : "text-[#94A3B8]",
                                                            isExpanded && "rotate-180"
                                                        )}
                                                    />
                                                </>
                                            )}
                                        </button>

                                        {/* Sub Items */}
                                        {!isCollapsed && isExpanded && (
                                            <div className="space-y-1 ps-4 pe-1 mt-1">
                                                {item.subItems!.map((sub) => {
                                                    const SubIcon = sub.icon;
                                                    const isActive =
                                                        (sub.title === "Users" && (!location.search || location.search === "" || location.search === "?tab=users")) ||
                                                        (location.pathname === sub.href &&
                                                            (!sub.href.includes("?") || location.search === sub.href.split("?")[1]));

                                                    return (
                                                        <Link
                                                            key={sub.title}
                                                            to={sub.href}
                                                            className={cn(
                                                                "flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl transition-all",
                                                                isActive
                                                                    ? "text-[#2563EB] font-bold"
                                                                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] font-medium"
                                                            )}
                                                        >
                                                            {SubIcon && (
                                                                <SubIcon
                                                                    className={cn(
                                                                        "w-3.5 h-3.5 shrink-0",
                                                                        isActive ? "text-[#2563EB]" : "text-[#94A3B8]"
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
                            const isActive = location.pathname === item.href && (!item.href.includes("?") || location.search === item.href.split("?")[1]);
                            return (
                                <Link
                                    key={item.title}
                                    to={item.href || "#"}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-all",
                                        isCollapsed && "justify-center px-0",
                                        isActive
                                            ? "bg-[#EFF6FF] text-[#2563EB]"
                                            : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                                    )}
                                    title={isCollapsed ? item.title : undefined}
                                >
                                    <ItemIcon
                                        className={cn(
                                            "w-4 h-4 shrink-0",
                                            isActive ? "text-[#2563EB]" : "text-[#64748B]"
                                        )}
                                    />
                                    {!isCollapsed && <span className="truncate">{item.title}</span>}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Bottom Profile & Subscription Cards matching Image 1 */}
            <div className="shrink-0 border-t border-[#E2E8F0] p-2.5 space-y-2">
                {/* User Profile Card */}
                <DropdownMenu>
                    <DropdownMenuTrigger
                        className="w-full focus:outline-none cursor-pointer"
                        aria-label="User Profile"
                    >
                        <div
                            className={cn(
                                "flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#F8FAFC] transition-colors",
                                isCollapsed && "justify-center p-1"
                            )}
                        >
                            <div className="w-8 h-8 rounded-full bg-[#FEF3C7] flex items-center justify-center text-xs shrink-0 shadow-2xs">
                                👦
                            </div>
                            {!isCollapsed && (
                                <>
                                    <div className="flex flex-col text-start overflow-hidden min-w-0 flex-1 leading-tight">
                                        <span className="text-xs font-bold text-[#0F172A] truncate">
                                            {user?.name || "فراس حافظ"}
                                        </span>
                                        <span className="text-[10px] text-[#64748B]">
                                            أدمن
                                        </span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-[#94A3B8] shrink-0" />
                                </>
                            )}
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align={isCollapsed ? "center" : "start"}
                        side="right"
                        sideOffset={12}
                        className="w-48 p-1 rounded-xl border border-[#E2E8F0] shadow-xl bg-white text-xs"
                    >
                        <DropdownMenuItem
                            onClick={() => logout()}
                            className="gap-2 px-2.5 py-2 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>تسجيل الخروج</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Subscription Plan Card */}
                {!isCollapsed && (
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-2.5 space-y-1">
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
                    </div>
                )}
            </div>
        </motion.aside>
    );
};

export default Sidebar;
