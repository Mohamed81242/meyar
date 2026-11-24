import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
    ChevronDown,
    ChevronRight,
    Search,
    Languages,
    Bell,
    Maximize2,
    Minimize2,
} from "lucide-react";
import { cn } from "@/utils";
import { MeayarLogo } from "@/assets/MeayarLogo";
import { useLanguage } from "@/shared/hooks";
import { UserAvatarMenu } from "./UserAvatarMenu";

interface SubItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    children?: { title: string; href: string; icon: React.ComponentType<{ className?: string }> }[];
}

interface HorizontalNavItem {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    href?: string;
    subItems?: SubItem[];
}

export const HorizontalNavbar: React.FC = () => {
    const location = useLocation();
    const { currentLanguage, changeLanguage } = useLanguage();

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [hoveredSubMenu, setHoveredSubMenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Hover Handlers
    const handleMouseEnterItem = (title: string) => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        setOpenMenu(title);
    };

    const handleMouseLeaveItem = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        hoverTimeoutRef.current = setTimeout(() => {
            setOpenMenu(null);
            setHoveredSubMenu(null);
        }, 150);
    };

    // Close menu on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenu(null);
                setHoveredSubMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

    // Close on route change
    useEffect(() => {
        setOpenMenu(null);
        setHoveredSubMenu(null);
    }, [location.pathname]);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
        } else {
            document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
        }
    };

    const handleToggleLanguage = () => {
        const nextLang = currentLanguage === "ar" ? "en" : "ar";
        changeLanguage(nextLang);
    };

    const navItems: HorizontalNavItem[] = [
        {
            title: "Statistics",
            icon: LineChart,
            subItems: [
                { title: "My Statistics", href: "/dashboard/my-statistics", icon: TrendingUp },
                { title: "Statistics Live", href: "/dashboard/statistics-live", icon: BarChart2 },
            ],
        },
        {
            title: "User Management",
            icon: Users,
            subItems: [
                { title: "Roles and Permissions", href: "/dashboard/roles-and-permissions", icon: ShieldCheck },
                { title: "Users", href: "/dashboard/users", icon: Users },
            ],
        },
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
        {
            title: "Inspection Management",
            icon: CheckSquare,
            subItems: [
                {
                    title: "Inspection Settings",
                    href: "/dashboard/inspection-types",
                    icon: CheckSquare,
                    children: [
                        { title: "Inspection Types", href: "/dashboard/inspection-types", icon: Type },
                        { title: "Folders or Classifications", href: "/dashboard/folders-or-classifications", icon: FolderCheck },
                        { title: "Options could not be evaluated", href: "/dashboard/evaluation-options", icon: AlertTriangle },
                    ],
                },
                { title: "Inspection Templates", href: "/dashboard/inspection-templates", icon: LayoutGrid },
                { title: "Inspection Tasks", href: "/dashboard/inspection-tasks", icon: CheckCircle2 },
                { title: "Procedures", href: "/dashboard/procedures", icon: GitBranch },
            ],
        },
        {
            title: "Review criteria",
            icon: ArrowUpDown,
            subItems: [
                { title: "Sorting mechanisms", href: "/dashboard/sorting-mechanisms", icon: ArrowUpDown },
                { title: "Options could not be evaluated", href: "/dashboard/evaluation-options", icon: AlertTriangle },
            ],
        },
    ];

    const isItemActive = (item: HorizontalNavItem) => {
        if (item.href && location.pathname === item.href) return true;
        if (item.subItems) {
            return item.subItems.some((sub) => {
                if (location.pathname === sub.href) return true;
                if (sub.children) {
                    return sub.children.some((child) => location.pathname === child.href);
                }
                return false;
            });
        }
        return false;
    };

    return (
        <header className="w-full bg-white dark:bg-dashboard-card border-b border-[#E2E8F0] dark:border-dashboard-border shrink-0 z-50 select-none relative">
            {/* Top Global Bar matching Image 4 */}
            <div className="h-16 px-6 flex items-center justify-between border-b border-[#F1F5F9] dark:border-dashboard-border">
                {/* Left: Brand Logo + Search Input */}
                <div className="flex items-center gap-6">
                    <Link to="/dashboard/billing" className="flex items-center">
                        <MeayarLogo collapsed={false} />
                    </Link>

                    {/* Search Bar */}
                    <div className="hidden sm:flex items-center gap-2.5 px-3 h-9 rounded-lg border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background w-64 text-xs text-[#94A3B8] focus-within:border-dashboard-primary transition-colors">
                        <Search className="w-4 h-4 text-[#94A3B8] shrink-0" />
                        <input
                            type="text"
                            placeholder="Ctrl + K"
                            aria-label="Search"
                            className="bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground placeholder:text-[#94A3B8] flex-1 w-full"
                        />
                    </div>
                </div>

                {/* Right: Language, Notifications, Fullscreen, Profile */}
                <div className="flex items-center gap-2.5">
                    {/* Language Switcher */}
                    <button
                        onClick={handleToggleLanguage}
                        title={currentLanguage === "ar" ? "Switch to English" : "التبديل إلى العربية"}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-dashboard-secondary transition-colors cursor-pointer"
                    >
                        <Languages className="w-4 h-4" />
                    </button>

                    {/* Notification Bell with Badge 5 */}
                    <button
                        className="relative w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-dashboard-secondary transition-colors cursor-pointer"
                        aria-label="Notifications"
                    >
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-0.5 right-0.5 min-w-[15px] h-[15px] px-0.5 rounded-full bg-[#10B981] text-white text-[9px] font-bold flex items-center justify-center leading-none">
                            5
                        </span>
                    </button>

                    {/* Fullscreen Button */}
                    <button
                        onClick={toggleFullscreen}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-dashboard-secondary transition-colors cursor-pointer"
                        aria-label="Toggle Fullscreen"
                    >
                        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>

                    {/* User Avatar with Dropdown Menu */}
                    <UserAvatarMenu align="end" side="bottom" />
                </div>
            </div>

            {/* Bottom Horizontal Menu Navigation Bar: overflow-visible so dropdowns float over content */}
            <div ref={menuRef} className="px-6 h-12 flex items-center gap-2 text-xs relative overflow-visible">
                {navItems.map((item) => {
                    const active = isItemActive(item);
                    const isOpen = openMenu === item.title;
                    const ItemIcon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="relative"
                            onMouseEnter={() => item.subItems && handleMouseEnterItem(item.title)}
                            onMouseLeave={() => item.subItems && handleMouseLeaveItem()}
                        >
                            <button
                                type="button"
                                onClick={() => setOpenMenu(isOpen ? null : item.title)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap",
                                    active
                                        ? "bg-dashboard-secondary text-dashboard-primary font-bold shadow-2xs"
                                        : "text-[#475569] dark:text-dashboard-muted-foreground hover:bg-dashboard-secondary hover:text-dashboard-primary",
                                    isOpen && "bg-dashboard-secondary/70 text-dashboard-primary"
                                )}
                            >
                                <ItemIcon className={cn("w-4 h-4", active || isOpen ? "text-dashboard-primary" : "text-[#64748B]")} />
                                <span>{item.title}</span>
                                {item.subItems && (
                                    <ChevronDown
                                        className={cn(
                                            "w-3.5 h-3.5 transition-transform duration-200",
                                            isOpen && "rotate-180 text-dashboard-primary"
                                        )}
                                    />
                                )}
                            </button>

                            {/* Floating Dropdown Card matching Image 4 */}
                            {isOpen && item.subItems && (
                                <div
                                    className="absolute top-full start-0 mt-1.5 z-[100] min-w-[220px] bg-white dark:bg-dashboard-card rounded-2xl border border-[#E2E8F0] dark:border-dashboard-border shadow-2xl p-1.5 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-150"
                                    onMouseEnter={() => handleMouseEnterItem(item.title)}
                                    onMouseLeave={handleMouseLeaveItem}
                                >
                                    {/* Arrow Pointer matching Image 4 */}
                                    <div className="absolute -top-1.5 start-6 w-3 h-3 bg-white dark:bg-dashboard-card border-t border-l border-[#E2E8F0] dark:border-dashboard-border rotate-45" />

                                    {item.subItems.map((sub) => {
                                        const SubIcon = sub.icon;
                                        const isSubActive = location.pathname === sub.href;
                                        const hasChildren = sub.children && sub.children.length > 0;
                                        const isSubHovered = hoveredSubMenu === sub.title;

                                        return (
                                            <div
                                                key={sub.title}
                                                className="relative"
                                                onMouseEnter={() => hasChildren && setHoveredSubMenu(sub.title)}
                                                onMouseLeave={() => hasChildren && setHoveredSubMenu(null)}
                                            >
                                                <Link
                                                    to={sub.href}
                                                    onClick={() => !hasChildren && setOpenMenu(null)}
                                                    className={cn(
                                                        "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors relative z-10",
                                                        isSubActive
                                                            ? "bg-dashboard-secondary text-dashboard-primary font-bold"
                                                            : "text-[#334155] dark:text-dashboard-foreground hover:bg-dashboard-secondary hover:text-dashboard-primary"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <SubIcon className={cn("w-4 h-4", isSubActive ? "text-dashboard-primary" : "text-[#64748B]")} />
                                                        <span>{sub.title}</span>
                                                    </div>
                                                    {hasChildren && <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] rtl:rotate-180" />}
                                                </Link>

                                                {/* Nested Submenu if any */}
                                                {hasChildren && isSubHovered && (
                                                    <div className="absolute top-0 start-full ms-1 min-w-[210px] bg-white dark:bg-dashboard-card rounded-2xl border border-[#E2E8F0] dark:border-dashboard-border shadow-2xl p-1.5 flex flex-col gap-0.5 z-[110]">
                                                        {sub.children!.map((child) => {
                                                            const ChildIcon = child.icon;
                                                            const isChildActive = location.pathname === child.href;
                                                            return (
                                                                <Link
                                                                    key={child.title}
                                                                    to={child.href}
                                                                    onClick={() => setOpenMenu(null)}
                                                                    className={cn(
                                                                        "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors",
                                                                        isChildActive
                                                                            ? "bg-dashboard-secondary text-dashboard-primary font-bold"
                                                                            : "text-[#334155] dark:text-dashboard-foreground hover:bg-dashboard-secondary hover:text-dashboard-primary"
                                                                    )}
                                                                >
                                                                    <ChildIcon className={cn("w-4 h-4", isChildActive ? "text-dashboard-primary" : "text-[#64748B]")} />
                                                                    <span>{child.title}</span>
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </header>
    );
};

export default HorizontalNavbar;
