import React, { useState } from "react";
import { Eye, EyeOff, Check } from "lucide-react";
import { toast } from "sonner";

export const ChangePhoneTab: React.FC = () => {
    const [step, setStep] = useState<1 | 2>(1);
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone.trim() || !password.trim()) {
            toast.error("Please enter your phone number and password");
            return;
        }
        setStep(2);
        toast.info(`Verification code sent to +966 ${phone}`);
    };

    const handleOtpChange = (index: number, val: string) => {
        if (val.length > 1) val = val[val.length - 1];
        const next = [...otpCode];
        next[index] = val;
        setOtpCode(next);
        if (val && index < 5) {
            const nextInput = document.getElementById(`phone-otp-${index + 1}`);
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
        toast.success("Phone number updated successfully");
        setStep(1);
        setPhone("");
        setPassword("");
        setOtpCode(["", "", "", "", "", ""]);
    };

    return (
        <div className="dashboard-card p-6 space-y-6 select-none text-start">
            <h3 className="font-bold text-sm text-[#0F172A] dark:text-dashboard-foreground">
                Change Phone Number
            </h3>

            {/* Stepper matching Screenshot 3 */}
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
                        Change Phone Number
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

            {/* Step 1 Form matching Screenshot 3 */}
            {step === 1 && (
                <form onSubmit={handleNext} className="space-y-6 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Phone Number with Saudi Code +966 */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[#64748B] dark:text-dashboard-muted-foreground">
                                Phone Number
                            </label>
                            <div className="flex items-center h-10 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background focus-within:border-dashboard-primary transition-colors overflow-hidden">
                                <div className="flex items-center gap-1.5 px-3 bg-[#F8FAFC] dark:bg-slate-800 border-r border-[#E2E8F0] dark:border-dashboard-border text-xs font-semibold text-[#334155] dark:text-dashboard-foreground shrink-0 select-none">
                                    <span>🇸🇦</span>
                                    <span>+966</span>
                                </div>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="500000000"
                                    className="w-full h-full px-3 bg-transparent border-none outline-none text-xs font-medium text-[#0F172A] dark:text-dashboard-foreground"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[#64748B] dark:text-dashboard-muted-foreground">
                                Password
                            </label>
                            <div className="relative flex items-center">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full h-10 px-3.5 pe-10 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background text-xs font-medium text-[#0F172A] dark:text-dashboard-foreground outline-none focus:border-dashboard-primary transition-colors"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute end-3 p-1 text-[#94A3B8] hover:text-[#0F172A] transition-colors cursor-pointer"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
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
                <form onSubmit={handleVerify} className="space-y-6 pt-2 max-w-md mx-auto text-center">
                    <p className="text-xs text-[#64748B] dark:text-dashboard-muted-foreground">
                        Please enter the 6-digit verification code sent to{" "}
                        <span className="font-bold text-[#0F172A] dark:text-dashboard-foreground">+966 {phone}</span>
                    </p>

                    <div className="flex items-center justify-center gap-2.5 my-4" dir="ltr">
                        {otpCode.map((digit, idx) => (
                            <input
                                key={idx}
                                id={`phone-otp-${idx}`}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(idx, e.target.value)}
                                className="w-10 h-12 rounded-xl text-center text-sm font-bold border border-[#CBD5E1] dark:border-dashboard-border bg-white dark:bg-dashboard-background focus:border-dashboard-primary outline-none"
                            />
                        ))}
                    </div>

                    <div className="flex items-center justify-center gap-3 pt-2">
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
                            Verify & Update
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};
