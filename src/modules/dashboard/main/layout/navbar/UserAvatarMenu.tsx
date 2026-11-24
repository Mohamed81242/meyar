import React, { useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
    User,
    Settings,
    LogOut,
    Phone,
    Mail,
    KeyRound,
    Sliders,
    Package,
    Shield,
} from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/design-system/components/popover";
import { authStore } from "@/auth";
import { useLogout } from "@/modules/auth/features/auth/api";
import { useLanguage } from "@/shared/hooks";
import { cn } from "@/utils";

interface UserAvatarMenuProps {
    children?: React.ReactNode;
    align?: "start" | "center" | "end";
    side?: "top" | "bottom" | "left" | "right";
    className?: string;
}

export const UserAvatarMenu: React.FC<UserAvatarMenuProps> = ({
    children,
    align = "end",
    side = "bottom",
    className,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"profile" | "settings">("settings");

    const user = authStore((state) => state.user);
    const { mutate: logout } = useLogout();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { currentLanguage } = useLanguage();
    const isAr = currentLanguage === "ar";

    const userRole =
        (typeof user?.role === "string" ? user.role : (user?.role as any)?.name) ||
        "أدمن";

    const handleNavigate = (path: string) => {
        setIsOpen(false);
        navigate(path);
    };

    const handleLogout = () => {
        setIsOpen(false);
        logout();
    };

    const settingsItems = [
        {
            id: "personal",
            label: isAr ? "إعدادات الحساب" : "Account Settings",
            icon: User,
            path: "/dashboard/settings?tab=personal",
        },
        {
            id: "phone",
            label: isAr ? "تغيير رقم الهاتف" : "Change Phone Number",
            icon: Phone,
            path: "/dashboard/settings?tab=phone",
        },
        {
            id: "email",
            label: isAr ? "تغيير البريد الإلكتروني" : "Change Email",
            icon: Mail,
            path: "/dashboard/settings?tab=email",
        },
        {
            id: "password",
            label: isAr ? "تغيير كلمة المرور" : "Change Password",
            icon: KeyRound,
            path: "/dashboard/settings?tab=password",
        },
        {
            id: "settings",
            label: isAr ? "إعدادات التنبيهات" : "Setting Alerts",
            icon: Sliders,
            path: "/dashboard/settings?tab=settings",
        },
        {
            id: "subscriptions",
            label: isAr ? "معلومات الاشتراكات" : "subscriptions information",
            icon: Package,
            path: "/dashboard/settings?tab=subscriptions",
        },
    ];

    const currentTabParam = searchParams.get("tab") || "personal";

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger
                className={cn("outline-none cursor-pointer", className)}
                aria-label={isAr ? "قائمة الملف الشخصي" : "User profile menu"}
            >
                {children ? (
                    children
                ) : (
                    <div className="w-8.5 h-8.5 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] flex items-center justify-center text-sm overflow-hidden shrink-0 shadow-2xs hover:ring-2 hover:ring-dashboard-primary/25 transition-all">
                        👦
                    </div>
                )}
            </PopoverTrigger>

            <PopoverContent
                align={align}
                side={side}
                sideOffset={10}
                className="w-72 bg-white dark:bg-dashboard-card border border-[#E2E8F0] dark:border-dashboard-border rounded-2xl p-3 shadow-xl text-xs z-[100]"
            >
                {/* Header: Avatar + User Info + Logout Button */}
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#F1F5F9] dark:border-dashboard-border">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] flex items-center justify-center text-base shrink-0 shadow-2xs">
                            👦
                        </div>
                        <div className="flex flex-col text-start min-w-0 leading-tight">
                            <span className="text-xs font-bold text-[#0F172A] dark:text-dashboard-foreground truncate">
                                {user?.name || "فراس حافظ"}
                            </span>
                            <span className="text-[11px] text-[#94A3B8] font-medium truncate">
                                {userRole}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        title={isAr ? "تسجيل الخروج" : "Sign Out"}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer shrink-0"
                        aria-label={isAr ? "تسجيل الخروج" : "Sign Out"}
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>

                {/* Segmented Top Tabs: Profile vs Settings */}
                <div className="grid grid-cols-2 border-b border-[#F1F5F9] dark:border-dashboard-border mt-2.5 mb-1.5">
                    <button
                        type="button"
                        onClick={() => setActiveTab("profile")}
                        className={cn(
                            "flex items-center justify-center gap-2 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer",
                            activeTab === "profile"
                                ? "text-dashboard-primary border-dashboard-primary font-bold"
                                : "text-[#64748B] dark:text-[#94A3B8] border-transparent hover:text-[#0F172A] dark:hover:text-dashboard-foreground"
                        )}
                    >
                        <User className="w-3.5 h-3.5" />
                        <span>{isAr ? "الملف الشخصي" : "Profile"}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("settings")}
                        className={cn(
                            "flex items-center justify-center gap-2 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer",
                            activeTab === "settings"
                                ? "text-dashboard-primary border-dashboard-primary font-bold"
                                : "text-[#64748B] dark:text-[#94A3B8] border-transparent hover:text-[#0F172A] dark:hover:text-dashboard-foreground"
                        )}
                    >
                        <Settings className="w-3.5 h-3.5" />
                        <span>{isAr ? "الإعدادات" : "Settings"}</span>
                    </button>
                </div>

                {/* Tab 1: Settings Navigation Items */}
                {activeTab === "settings" && (
                    <div className="py-1 space-y-0.5">
                        {settingsItems.map((item) => {
                            const Icon = item.icon;
                            const isCurrent =
                                location.pathname.startsWith("/dashboard/settings") &&
                                currentTabParam === item.id;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleNavigate(item.path)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2 text-xs rounded-xl transition-colors cursor-pointer text-start",
                                        isCurrent
                                            ? "bg-dashboard-secondary font-semibold text-dashboard-primary"
                                            : "text-[#475569] dark:text-dashboard-foreground hover:bg-[#F8FAFC] dark:hover:bg-dashboard-secondary font-medium"
                                    )}
                                >
                                    <Icon
                                        className={cn(
                                            "w-4 h-4 shrink-0",
                                            isCurrent ? "text-dashboard-primary" : "text-[#94A3B8]"
                                        )}
                                    />
                                    <span className="truncate">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Tab 2: Profile Overview */}
                {activeTab === "profile" && (
                    <div className="py-2 space-y-2">
                        <div className="p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-dashboard-secondary space-y-1">
                            <div className="text-[11px] text-[#64748B] dark:text-dashboard-muted-foreground">
                                {isAr ? "البريد الإلكتروني" : "Email"}
                            </div>
                            <div className="text-xs font-semibold text-[#0F172A] dark:text-dashboard-foreground truncate">
                                {user?.email || "rmz.alemtithal@gmail.com"}
                            </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-dashboard-secondary space-y-1">
                            <div className="text-[11px] text-[#64748B] dark:text-dashboard-muted-foreground">
                                {isAr ? "الدور والصلاحيات" : "Role & Permissions"}
                            </div>
                            <div className="text-xs font-semibold text-[#0F172A] dark:text-dashboard-foreground flex items-center gap-1.5">
                                <Shield className="w-3.5 h-3.5 text-dashboard-primary" />
                                <span>{userRole}</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => handleNavigate("/dashboard/settings?tab=personal")}
                            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-white bg-dashboard-primary hover:opacity-90 rounded-xl transition-opacity cursor-pointer mt-2"
                        >
                            <User className="w-3.5 h-3.5" />
                            <span>{isAr ? "إدارة الملف الشخصي" : "Manage Profile"}</span>
                        </button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
};
