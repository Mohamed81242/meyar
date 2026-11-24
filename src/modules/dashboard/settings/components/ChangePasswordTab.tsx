import React, { useState } from "react";
import { Eye, EyeOff, Check, Smartphone, Mail } from "lucide-react";
import { toast } from "sonner";

export const ChangePasswordTab: React.FC = () => {
    const [step, setStep] = useState<1 | 2>(1);
    const [method, setMethod] = useState<"phone" | "email">("phone");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (!oldPassword.trim()) {
            toast.error("Please enter your current password");
            return;
        }
        setStep(2);
        toast.info(
            `Verification code sent to your ${
                method === "phone" ? "phone number" : "email address"
            }`
        );
    };

    const handleOtpChange = (index: number, val: string) => {
        if (val.length > 1) val = val[val.length - 1];
        const next = [...otpCode];
        next[index] = val;
        setOtpCode(next);
        if (val && index < 5) {
            const nextInput = document.getElementById(`pwd-otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        const code = otpCode.join("");
        if (code.length < 6) {
            toast.error("Please enter the complete 6-digit code");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        toast.success("Password changed successfully");
        setStep(1);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setOtpCode(["", "", "", "", "", ""]);
    };

    return (
        <div className="dashboard-card p-6 space-y-6 select-none text-start">
            <h3 className="font-bold text-sm text-[#0F172A] dark:text-dashboard-foreground">
                Change Password
            </h3>

            {/* Stepper matching Screenshot 4 */}
            <div className="flex items-center gap-3 max-w-md mx-auto py-2">
                <div className="flex items-center gap-2">
                    <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            step >= 1
                                ? "bg-[#2563EB] text-white"
                                : "bg-[#F1F5F9] text-[#64748B]"
                        }`}
                    >
                        {step > 1 ? <Check className="w-3.5 h-3.5 stroke-3" /> : 1}
                    </span>
                    <span className="text-xs font-semibold text-[#0F172A] dark:text-dashboard-foreground">
                        Change Password
                    </span>
                </div>

                <div className="flex-1 h-0.5 bg-[#E2E8F0] dark:bg-dashboard-border mx-2" />

                <div className="flex items-center gap-2">
                    <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            step === 2
                                ? "bg-[#2563EB] text-white"
                                : "bg-[#F1F5F9] dark:bg-slate-800 text-[#94A3B8]"
                        }`}
                    >
                        2
                    </span>
                    <span className="text-xs font-medium text-[#94A3B8]">OTP</span>
                </div>
            </div>

            {/* Step 1 Form matching Screenshot 4 */}
            {step === 1 && (
                <form onSubmit={handleNext} className="space-y-6 pt-2">
                    {/* Method Selector */}
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-[#334155] dark:text-dashboard-foreground">
                            سيتم ارسال الكود الي :
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setMethod("phone")}
                                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                                    method === "phone"
                                        ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] shadow-2xs"
                                        : "border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background text-[#64748B] hover:bg-[#F8FAFC]"
                                }`}
                                title="Send via Phone SMS"
                            >
                                <Smartphone className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setMethod("email")}
                                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                                    method === "email"
                                        ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] shadow-2xs"
                                        : "border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background text-[#64748B] hover:bg-[#F8FAFC]"
                                }`}
                                title="Send via Email"
                            >
                                <Mail className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Old Password */}
                    <div className="space-y-1.5 max-w-lg">
                        <label className="text-xs font-semibold text-[#64748B] dark:text-dashboard-muted-foreground">
                            Old Password
                        </label>
                        <div className="relative flex items-center">
                            <input
                                type={showOldPassword ? "text" : "password"}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder="Enter old password"
                                className="w-full h-10 px-3.5 pe-10 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background text-xs font-medium text-[#0F172A] dark:text-dashboard-foreground outline-none focus:border-dashboard-primary transition-colors"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                                className="absolute end-3 p-1 text-[#94A3B8] hover:text-[#0F172A] transition-colors cursor-pointer"
                                aria-label="Toggle password visibility"
                            >
                                {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            className="h-9 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </form>
            )}

            {/* Step 2 Form */}
            {step === 2 && (
                <form onSubmit={handleVerify} className="space-y-5 pt-2 max-w-lg mx-auto">
                    <p className="text-xs text-[#64748B] dark:text-dashboard-muted-foreground text-center">
                        Please enter the 6-digit verification code sent to your{" "}
                        <span className="font-bold text-[#0F172A] dark:text-dashboard-foreground">
                            {method === "phone" ? "phone number" : "email"}
                        </span>
                    </p>

                    <div className="flex items-center justify-center gap-2.5 my-3" dir="ltr">
                        {otpCode.map((digit, idx) => (
                            <input
                                key={idx}
                                id={`pwd-otp-${idx}`}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(idx, e.target.value)}
                                className="w-10 h-12 rounded-xl text-center text-sm font-bold border border-[#CBD5E1] dark:border-dashboard-border bg-white dark:bg-dashboard-background focus:border-dashboard-primary outline-none"
                            />
                        ))}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#64748B] dark:text-dashboard-muted-foreground">
                            New Password
                        </label>
                        <div className="relative flex items-center">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="w-full h-10 px-3.5 pe-10 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background text-xs font-medium text-[#0F172A] dark:text-dashboard-foreground outline-none focus:border-dashboard-primary transition-colors"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute end-3 p-1 text-[#94A3B8] hover:text-[#0F172A] transition-colors cursor-pointer"
                                aria-label="Toggle password visibility"
                            >
                                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#64748B] dark:text-dashboard-muted-foreground">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="w-full h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background text-xs font-medium text-[#0F172A] dark:text-dashboard-foreground outline-none focus:border-dashboard-primary transition-colors"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="h-9 px-4 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            className="h-9 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer transition-colors"
                        >
                            Update Password
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};
