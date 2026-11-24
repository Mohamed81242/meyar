import React, { useState } from "react";
import { toast } from "sonner";
import { authStore } from "@/auth";
import { useLanguage } from "@/shared/hooks";

export const PersonalInformationTab: React.FC = () => {
    const user = authStore((state) => state.user);
    const { currentLanguage, changeLanguage } = useLanguage();

    const [name, setName] = useState(user?.name || "فراس حافظ");
    const [preferredLanguage, setPreferredLanguage] = useState(
        currentLanguage === "ar" ? "Arabic" : "English"
    );

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (preferredLanguage === "Arabic" && currentLanguage !== "ar") {
            changeLanguage("ar");
        } else if (preferredLanguage === "English" && currentLanguage !== "en") {
            changeLanguage("en");
        }
        toast.success("Personal information updated successfully");
    };

    return (
        <div className="space-y-5 select-none text-start">
            {/* Main Form Card matching Screenshot 1 */}
            <div className="dashboard-card p-6 space-y-5">
                <h3 className="font-bold text-sm text-[#0F172A] dark:text-dashboard-foreground">
                    Personal Information
                </h3>

                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[#64748B] dark:text-dashboard-muted-foreground">
                                Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background text-xs font-medium text-[#0F172A] dark:text-dashboard-foreground outline-none focus:border-dashboard-primary transition-colors"
                                required
                            />
                        </div>

                        {/* Preferred Language Select */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[#64748B] dark:text-dashboard-muted-foreground">
                                Preferred Language
                            </label>
                            <select
                                value={preferredLanguage}
                                onChange={(e) => setPreferredLanguage(e.target.value)}
                                className="w-full h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background text-xs font-medium text-[#0F172A] dark:text-dashboard-foreground outline-none cursor-pointer"
                            >
                                <option value="English">English</option>
                                <option value="Arabic">العربية</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            className="h-9 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>

            {/* Contact Information Card matching Screenshot 1 */}
            <div className="dashboard-card p-6 space-y-4">
                <h3 className="font-bold text-sm text-[#0F172A] dark:text-dashboard-foreground">
                    Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1">
                        <span className="text-xs font-semibold text-[#64748B] dark:text-dashboard-muted-foreground block">
                            Phone
                        </span>
                        <span className="text-xs font-bold text-[#0F172A] dark:text-dashboard-foreground">
                            {user?.phone || "--"}
                        </span>
                    </div>

                    <div className="space-y-1">
                        <span className="text-xs font-semibold text-[#64748B] dark:text-dashboard-muted-foreground block">
                            Email
                        </span>
                        <span className="text-xs font-bold text-[#0F172A] dark:text-dashboard-foreground">
                            {user?.email || "rmz.alemtithal@gmail.com"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Seat and Permissions Card matching Screenshot 1 */}
            <div className="dashboard-card p-6 space-y-4">
                <h3 className="font-bold text-sm text-[#0F172A] dark:text-dashboard-foreground">
                    Seat and Permissions
                </h3>

                <div className="space-y-1 pt-1">
                    <span className="text-xs font-semibold text-[#64748B] dark:text-dashboard-muted-foreground block">
                        Permission
                    </span>
                    <span className="text-xs font-bold text-[#0F172A] dark:text-dashboard-foreground">
                        {(typeof user?.role === "string" ? user.role : (user?.role as any)?.name) || "أدمن"}
                    </span>
                </div>
            </div>
        </div>
    );
};
