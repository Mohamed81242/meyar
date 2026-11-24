import React, { useState } from "react";
import { Mail, PhoneCall, Bell } from "lucide-react";
import { toast } from "sonner";

export const SettingAlertsTab: React.FC = () => {
    const [emailNotification, setEmailNotification] = useState(false);
    const [smsNotification, setSmsNotification] = useState(true);
    const [pushNotification, setPushNotification] = useState(true);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Notification alert settings saved successfully");
    };

    const handleCancel = () => {
        setEmailNotification(false);
        setSmsNotification(true);
        setPushNotification(true);
        toast.info("Settings reverted");
    };

    return (
        <div className="dashboard-card p-6 space-y-6 select-none text-start">
            <h3 className="font-bold text-sm text-[#0F172A] dark:text-dashboard-foreground">
                Settings
            </h3>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="divide-y divide-[#F1F5F9] dark:divide-dashboard-border">
                    {/* Setup email notification */}
                    <div className="py-4 flex items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] dark:bg-blue-950/40 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                                <Mail className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="font-bold text-xs text-[#0F172A] dark:text-dashboard-foreground">
                                    Setup email notification
                                </h4>
                                <p className="text-xs text-[#64748B] dark:text-dashboard-muted-foreground">
                                    Turn on email notification to get updates through email
                                </p>
                            </div>
                        </div>

                        {/* Toggle Switch */}
                        <button
                            type="button"
                            role="switch"
                            aria-checked={emailNotification}
                            onClick={() => setEmailNotification(!emailNotification)}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                emailNotification ? "bg-[#2563EB]" : "bg-[#CBD5E1] dark:bg-slate-700"
                            }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                    emailNotification ? "translate-x-5" : "translate-x-0"
                                }`}
                            />
                        </button>
                    </div>

                    {/* Setup SMS notification */}
                    <div className="py-4 flex items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] dark:bg-blue-950/40 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                                <PhoneCall className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="font-bold text-xs text-[#0F172A] dark:text-dashboard-foreground">
                                    Setup SMS notification
                                </h4>
                                <p className="text-xs text-[#64748B] dark:text-dashboard-muted-foreground">
                                    Turn on SMS notification to get updates through SMS
                                </p>
                            </div>
                        </div>

                        {/* Toggle Switch */}
                        <button
                            type="button"
                            role="switch"
                            aria-checked={smsNotification}
                            onClick={() => setSmsNotification(!smsNotification)}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                smsNotification ? "bg-[#2563EB]" : "bg-[#CBD5E1] dark:bg-slate-700"
                            }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                    smsNotification ? "translate-x-5" : "translate-x-0"
                                }`}
                            />
                        </button>
                    </div>

                    {/* Setup push notification */}
                    <div className="py-4 flex items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] dark:bg-blue-950/40 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                                <Bell className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="font-bold text-xs text-[#0F172A] dark:text-dashboard-foreground">
                                    Setup push notification
                                </h4>
                                <p className="text-xs text-[#64748B] dark:text-dashboard-muted-foreground">
                                    Turn on push notification to get updates through the app
                                </p>
                            </div>
                        </div>

                        {/* Toggle Switch */}
                        <button
                            type="button"
                            role="switch"
                            aria-checked={pushNotification}
                            onClick={() => setPushNotification(!pushNotification)}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                pushNotification ? "bg-[#2563EB]" : "bg-[#CBD5E1] dark:bg-slate-700"
                            }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                    pushNotification ? "translate-x-5" : "translate-x-0"
                                }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Bottom Action Buttons matching Screenshot 5 */}
                <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="h-9 px-5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="h-9 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer transition-colors"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};
