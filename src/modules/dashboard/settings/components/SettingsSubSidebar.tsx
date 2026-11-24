import React from "react";
import {
    User,
    Mail,
    Phone,
    KeyRound,
    Bell,
    Package,
} from "lucide-react";
import { cn } from "@/utils";
import { authStore } from "@/auth";

export type SettingsTabId =
    | "personal"
    | "email"
    | "phone"
    | "password"
    | "settings"
    | "subscriptions";

interface SettingsSubSidebarProps {
    activeTab: SettingsTabId;
    onSelectTab: (tab: SettingsTabId) => void;
}

export const SettingsSubSidebar: React.FC<SettingsSubSidebarProps> = ({
    activeTab,
    onSelectTab,
}) => {
    const user = authStore((state) => state.user);

    const menuItems = [
        { id: "personal" as SettingsTabId, label: "Personal Information", icon: User },
        { id: "email" as SettingsTabId, label: "Change Email", icon: Mail },
        { id: "phone" as SettingsTabId, label: "Change Phone Number", icon: Phone },
        { id: "password" as SettingsTabId, label: "Change Password", icon: KeyRound },
        { id: "settings" as SettingsTabId, label: "Setting Alerts", icon: Bell },
        { id: "subscriptions" as SettingsTabId, label: "subscriptions information", icon: Package },
    ];

    return (
        <aside className="dashboard-card p-6 w-full lg:w-72 shrink-0 flex flex-col items-center select-none text-start">
            {/* User Avatar Circle matching Screenshot 1 */}
            <div className="w-24 h-24 rounded-full bg-[#E0F2FE] border-2 border-[#BAE6FD] flex items-center justify-center text-5xl shadow-2xs overflow-hidden">
                👦
            </div>

            {/* User Name & Role */}
            <h2 className="font-bold text-sm text-[#0F172A] dark:text-dashboard-foreground mt-3 text-center">
                {user?.name || "فراس حافظ"}
            </h2>
            <p className="text-xs text-[#64748B] dark:text-dashboard-muted-foreground mt-0.5 text-center font-medium">
                {(typeof user?.role === "string" ? user.role : (user?.role as any)?.name) || "أدمن"}
            </p>

            {/* Navigation Tabs List matching Screenshot 1 */}
            <nav className="w-full mt-6 space-y-1">
                {menuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => onSelectTab(item.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-start",
                                isActive
                                    ? "bg-[#EFF6FF] dark:bg-dashboard-secondary text-[#2563EB] font-bold shadow-2xs"
                                    : "text-[#334155] dark:text-dashboard-foreground hover:bg-[#F8FAFC] dark:hover:bg-dashboard-secondary/40"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "w-4 h-4 shrink-0",
                                    isActive ? "text-[#2563EB]" : "text-[#64748B]"
                                )}
                            />
                            <span className="truncate">{item.label}</span>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
};
