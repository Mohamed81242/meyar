import React, { useState } from "react";
import {
    Calendar,
    BarChart3,
    Users,
    ClipboardList,
    Sparkles,
    FileText,
    Eye,
    X,
} from "lucide-react";
import { toast } from "sonner";

export const SubscriptionsTab: React.FC = () => {
    const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

    const invoices = [
        {
            id: "inv-1",
            date: "2026/08/26",
            due: "2026/09/09 (14 Day)",
            plan: "Professional Plan",
            total: "0 SAR",
            note: "Free trial period",
            status: "Success",
        },
    ];

    const handleExtend = () => {
        toast.info("Subscription extension gateway opened");
    };

    return (
        <div className="space-y-6 select-none text-start">
            {/* Top Plan Summary Banner matching Screenshot 6 */}
            <div className="dashboard-card p-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-bold text-base text-[#0F172A] dark:text-dashboard-foreground">
                            Basic Plan
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#ECFDF5] dark:bg-emerald-950/40 text-[#10B981] text-xs font-bold">
                            Active
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border border-[#E2E8F0] dark:border-dashboard-border text-[#64748B] text-xs font-semibold">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Monthly</span>
                        </span>
                    </div>

                    <div className="text-xs font-semibold text-[#64748B] dark:text-dashboard-muted-foreground flex items-center gap-1.5">
                        <span>تاريخ الاستحقاق : 2026/12/22 , 06:13:00 AM (27 Days)</span>
                    </div>
                </div>

                <div>
                    <button
                        type="button"
                        onClick={handleExtend}
                        className="h-9 px-5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer transition-colors inline-flex items-center"
                    >
                        Extend Subscription
                    </button>
                </div>
            </div>

            {/* Usage Limits Section (حدود الاستخدام) matching Screenshot 6 & 7 */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <BarChart3 className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-base text-[#0F172A] dark:text-dashboard-foreground">
                        حدود الاستخدام
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* Limit Card 1: Maximum Team Members */}
                    <div className="dashboard-card p-5 flex flex-col justify-between gap-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-[#2563EB]">
                                <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] dark:bg-blue-950/40 flex items-center justify-center">
                                    <Users className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-xs text-[#0F172A] dark:text-dashboard-foreground">
                                    Maximum Team Members
                                </span>
                            </div>

                            <div className="space-y-1">
                                <div className="text-2xl font-black text-[#2563EB]">
                                    2<span className="text-sm font-semibold text-[#94A3B8]">/5</span>
                                </div>
                                <p className="text-[11px] text-[#64748B] dark:text-dashboard-muted-foreground leading-relaxed">
                                    Maximum number of team members that can be added to the workspace
                                </p>
                            </div>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-[#F1F5F9] dark:border-dashboard-border">
                            <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>خلال فترة الاشتراك</span>
                                </span>
                                <span className="font-bold text-[#2563EB]">40%</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-[#F1F5F9] dark:bg-slate-700 overflow-hidden">
                                <div className="h-full bg-[#2563EB] rounded-full" style={{ width: "40%" }} />
                            </div>
                        </div>
                    </div>

                    {/* Limit Card 2: Maximum Tasks */}
                    <div className="dashboard-card p-5 flex flex-col justify-between gap-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 text-[#10B981]">
                                    <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] dark:bg-emerald-950/40 flex items-center justify-center">
                                        <ClipboardList className="w-4 h-4" />
                                    </div>
                                    <span className="font-bold text-xs text-[#0F172A] dark:text-dashboard-foreground">
                                        Maximum Tasks
                                    </span>
                                </div>
                                <span className="px-2 py-0.5 rounded-md border border-[#E2E8F0] dark:border-dashboard-border text-[10px] text-[#64748B] font-semibold">
                                    Monthly
                                </span>
                            </div>

                            <div className="space-y-1">
                                <div className="text-2xl font-black text-[#2563EB]">
                                    2<span className="text-sm font-semibold text-[#94A3B8]">/250</span>
                                </div>
                                <p className="text-[11px] text-[#64748B] dark:text-dashboard-muted-foreground leading-relaxed">
                                    Maximum number of active tasks that can be created
                                </p>
                            </div>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-[#F1F5F9] dark:border-dashboard-border">
                            <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>2026-11-16 - 2026-12-15</span>
                                </span>
                                <span className="font-bold text-[#2563EB]">1%</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-[#F1F5F9] dark:bg-slate-700 overflow-hidden">
                                <div className="h-full bg-[#2563EB] rounded-full" style={{ width: "1%" }} />
                            </div>
                        </div>
                    </div>

                    {/* Limit Card 3: Concurrent Sessions */}
                    <div className="dashboard-card p-5 flex flex-col justify-between gap-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-[#F59E0B]">
                                <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] dark:bg-amber-950/40 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-xs text-[#0F172A] dark:text-dashboard-foreground">
                                    Concurrent Sessions
                                </span>
                            </div>

                            <div className="space-y-1">
                                <div className="text-2xl font-black text-[#2563EB]">
                                    1
                                </div>
                                <p className="text-[11px] text-[#64748B] dark:text-dashboard-muted-foreground leading-relaxed">
                                    Maximum number of simultaneous active sessions allowed per logged in user
                                </p>
                            </div>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-[#F1F5F9] dark:border-dashboard-border">
                            <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>خلال فترة الاشتراك</span>
                                </span>
                                <span className="font-bold text-[#10B981]">Active</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-[#F1F5F9] dark:bg-slate-700 overflow-hidden">
                                <div className="h-full bg-[#10B981] rounded-full" style={{ width: "100%" }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoices Section matching Screenshot 7 & 8 */}
            <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <FileText className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-base text-[#0F172A] dark:text-dashboard-foreground">
                        Invoices
                    </h3>
                </div>

                <div className="dashboard-card overflow-hidden">
                    <div className="overflow-x-auto hide-scrollbar">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-[#F1F5F9] dark:border-dashboard-border bg-[#F8FAFC]/50 dark:bg-dashboard-secondary/30 text-[#64748B] dark:text-dashboard-muted-foreground text-[11px] font-bold uppercase tracking-wider">
                                    <th className="py-3.5 px-6 font-bold text-start">DATE</th>
                                    <th className="py-3.5 px-6 font-bold text-start">DUE</th>
                                    <th className="py-3.5 px-6 font-bold text-start">PLAN</th>
                                    <th className="py-3.5 px-6 font-bold text-start">TOTAL</th>
                                    <th className="py-3.5 px-6 font-bold text-start">STATUS</th>
                                    <th className="py-3.5 px-6 font-bold text-end">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F1F5F9] dark:divide-dashboard-border">
                                {invoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-[#F8FAFC] dark:hover:bg-dashboard-secondary/40 transition-colors">
                                        <td className="py-4 px-6 text-start font-medium text-[#0F172A] dark:text-dashboard-foreground">
                                            {inv.date}
                                        </td>
                                        <td className="py-4 px-6 text-start text-[#64748B] dark:text-dashboard-muted-foreground font-medium">
                                            {inv.due}
                                        </td>
                                        <td className="py-4 px-6 text-start font-bold text-[#0F172A] dark:text-dashboard-foreground">
                                            {inv.plan}
                                        </td>
                                        <td className="py-4 px-6 text-start">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-[#0F172A] dark:text-dashboard-foreground">
                                                    {inv.total}
                                                </span>
                                                <span className="text-[10px] text-[#94A3B8]">
                                                    {inv.note}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-start">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#ECFDF5] dark:bg-emerald-950/40 text-[#10B981] text-xs font-semibold">
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-end">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedInvoice(inv)}
                                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] hover:underline cursor-pointer"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                <span>View</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Invoice Detail Modal */}
            {selectedInvoice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-dashboard-card rounded-2xl shadow-xl w-full max-w-md border border-[#E2E8F0] dark:border-dashboard-border overflow-hidden p-6 text-start">
                        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9] dark:border-dashboard-border">
                            <h4 className="font-bold text-sm text-[#0F172A] dark:text-dashboard-foreground">
                                Invoice Details ({selectedInvoice.id})
                            </h4>
                            <button
                                type="button"
                                onClick={() => setSelectedInvoice(null)}
                                className="p-1 rounded-lg text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-3 py-4 text-xs">
                            <div className="flex justify-between">
                                <span className="text-[#64748B]">Date:</span>
                                <span className="font-bold text-[#0F172A] dark:text-dashboard-foreground">{selectedInvoice.date}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#64748B]">Due Date:</span>
                                <span className="font-bold text-[#0F172A] dark:text-dashboard-foreground">{selectedInvoice.due}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#64748B]">Plan:</span>
                                <span className="font-bold text-[#0F172A] dark:text-dashboard-foreground">{selectedInvoice.plan}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#64748B]">Total Amount:</span>
                                <span className="font-bold text-[#10B981]">{selectedInvoice.total}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#64748B]">Status:</span>
                                <span className="px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#10B981] font-semibold">{selectedInvoice.status}</span>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-[#F1F5F9] dark:border-dashboard-border flex justify-end">
                            <button
                                type="button"
                                onClick={() => setSelectedInvoice(null)}
                                className="h-8 px-4 rounded-xl border border-[#E2E8F0] text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
