import { authStore } from "@/auth/auth.store";
import { Button } from "@/design-system";
import { Input } from "@/design-system/components/input";
import { Label } from "@/design-system/components/label";
import { useMutationHandler } from "@/shared/api";
import { useLanguage } from "@/shared/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import {
    useSendForgotPasswordVerificationCode,
    useVerifyForgotPasswordVerificationCode,
} from "../api/auth.mutations";
import { authPaths } from "../navigation/paths";

type FormFields = {
    code: string;
};

function ForgotPasswordVerifyPage() {
    const { t, isRTL } = useLanguage("auth");
    const navigate = useNavigate();
    const { execute } = useMutationHandler();
    const { resetEmail } = authStore();

    const { mutateAsync: verifyCodeMutation, isPending: isVerifyingCode } =
        useVerifyForgotPasswordVerificationCode();

    const { mutateAsync: sendCodeMutation, isPending: isSendingCode } =
        useSendForgotPasswordVerificationCode();

    const [countdown, setCountdown] = useState(60);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleResend = () => {
        if (!resetEmail || countdown > 0) return;
        execute(() => sendCodeMutation({ email: resetEmail }), {
            successMessage: t("auth.resetCodeSent", "Verification code sent"),
            onSuccess: () => {
                setCountdown(60);
            },
        });
    };

    const schema = z.object({
        code: z.string().min(1, t("auth.pleaseEnterToVerify")),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
        mode: "onSubmit",
        defaultValues: { code: "" },
    });

    const onSubmit = (data: FormFields) => {
        if (!resetEmail) {
            navigate(authPaths.forgotPassword());
            return;
        }
        execute(
            () =>
                verifyCodeMutation({
                    email: resetEmail,
                    code: data.code,
                }),
            {
                successMessage: t("auth.verificationSuccessful"),
                onSuccess: () => {
                    navigate(authPaths.resetPassword());
                },
            },
        );
    };

    const handleBack = () => {
        navigate(authPaths.forgotPassword());
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full flex flex-col font-sans"
        >
            {/* Back Button */}
            <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 hover:text-dashboard-secondary transition-colors self-start mb-6 cursor-pointer"
            >
                <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
                {isRTL ? "العودة" : "Back"}
            </button>

            {/* nota Media Branding Logo */}
            <div
                className="flex items-center gap-1.5 justify-center mb-2"
                dir="ltr"
            >
                <span className="font-black text-3xl tracking-tighter text-black flex items-center">
                    NOTA
                </span>
            </div>

            {/* Subtitle */}
            <p className="text-xs text-gray-400 text-center max-w-70 mx-auto mb-1 leading-relaxed font-semibold">
                {isRTL
                    ? "أدخل رمز التحقق المُرسل إلى بريدك الإلكتروني."
                    : "Enter the verification code sent to your email."}
            </p>

            {/* Show email hint */}
            {resetEmail && (
                <p className="text-[10px] text-gray-400 text-center mb-6 font-medium">
                    {resetEmail}
                </p>
            )}

            {!resetEmail && <div className="mb-6" />}

            {/* Form */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4.5"
            >
                {/* Code Field */}
                <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-gray-700  tracking-wide px-1">
                        {t("auth.emailVerification", "Verification Code")}
                    </Label>
                    <div className="relative">
                        <Input
                            {...register("code")}
                            type="text"
                            placeholder={
                                isRTL
                                    ? "أدخل رمز التحقق"
                                    : "Enter verification code"
                            }
                            className="bg-white border border-gray-250 h-11 rounded-lg font-medium px-4 text-xs focus:ring-1 focus:ring-dashboard-primary focus:border-dashboard-primary outline-none transition-colors w-full text-center tracking-[0.3em]"
                        />
                    </div>
                    {errors.code && (
                        <p className="text-red-500 text-[10px] font-medium px-1">
                            {errors.code.message}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={isVerifyingCode || isSendingCode}
                    className="w-full h-11 bg-dashboard-primary hover:bg-dashboard-primary/95 text-black font-bold rounded-lg text-xs tracking-wider transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer shadow-sm shadow-dashboard-primary/10 mt-2"
                >
                    {isVerifyingCode ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            {isRTL ? "جاري التحقق..." : "Verifying..."}
                        </span>
                    ) : isRTL ? (
                        "تأكيد"
                    ) : (
                        "Verify Code"
                    )}
                </Button>

                {/* Resend Button */}
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={countdown > 0 || isSendingCode}
                    className="text-[11px] font-bold text-dashboard-primary hover:text-dashboard-primary/80 transition-colors disabled:text-gray-400 disabled:cursor-not-allowed mt-2 cursor-pointer"
                >
                    {isSendingCode ? (
                        <span className="flex items-center justify-center gap-1.5">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            {isRTL ? "جاري الإرسال..." : "Sending..."}
                        </span>
                    ) : countdown > 0 ? (
                        isRTL ? (
                            `إعادة الإرسال بعد ${countdown} ثانية`
                        ) : (
                            `Resend code in ${countdown}s`
                        )
                    ) : isRTL ? (
                        "إعادة إرسال الرمز"
                    ) : (
                        "Resend Verification Code"
                    )}
                </button>
            </form>
        </motion.div>
    );
}

export default ForgotPasswordVerifyPage;
