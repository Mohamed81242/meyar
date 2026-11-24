import { authStore } from "@/auth/auth.store";
import { Button } from "@/design-system";
import { Input } from "@/design-system/components/input";
import { Label } from "@/design-system/components/label";
import { useMutationHandler } from "@/shared/api";
import { useLanguage } from "@/shared/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useSendForgotPasswordVerificationCode } from "../api/auth.mutations";
import { authPaths } from "../navigation/paths";

type FormFields = {
    email: string;
};

function ForgotPasswordPage() {
    const { t, isRTL } = useLanguage("auth");
    const navigate = useNavigate();
    const { execute } = useMutationHandler();
    const { setResetEmail } = authStore();

    const { mutateAsync: sendCodeMutation, isPending: isSendingCode } =
        useSendForgotPasswordVerificationCode();

    const schema = z.object({
        email: z.string().email(t("auth.validation.pleaseEnterValidEmail")),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
        mode: "onSubmit",
        defaultValues: { email: "" },
    });

    const onSubmit = (data: FormFields) => {
        setResetEmail(data.email);
        execute(() => sendCodeMutation({ email: data.email }), {
            successMessage: t("auth.resetCodeSent"),
            onSuccess: () => {
                navigate(authPaths.forgotPasswordVerify());
            },
        });
    };

    const handleBackToLogin = () => {
        navigate(authPaths.login());
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full flex flex-col font-sans"
        >
            {/* Back to Login */}
            <button
                type="button"
                onClick={handleBackToLogin}
                className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 hover:text-dashboard-secondary transition-colors self-start mb-6 cursor-pointer"
            >
                <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
                {isRTL ? "العودة لتسجيل الدخول" : "Back to Login"}
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
            <p className="text-xs text-gray-400 text-center max-w-[280px] mx-auto mb-6 leading-relaxed font-semibold">
                {isRTL
                    ? "أدخل بريدك الإلكتروني وسنرسل لك رمز التحقق لإعادة تعيين كلمة المرور."
                    : "Enter your email address and we'll send you a verification code to reset your password."}
            </p>

            {/* Form */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4.5"
            >
                {/* Email Field */}
                <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-gray-700  tracking-wide px-1">
                        {t("auth.emailAddress", "Email address")}
                    </Label>
                    <div className="relative">
                        <Input
                            {...register("email")}
                            type="email"
                            placeholder={
                                isRTL
                                    ? "أدخل عنوان بريدك الإلكتروني"
                                    : "Enter your email address"
                            }
                            className="bg-white border border-gray-250 h-11 rounded-lg font-medium px-4 text-xs focus:ring-1 focus:ring-dashboard-primary focus:border-dashboard-primary outline-none transition-colors w-full"
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-500 text-[10px] font-medium px-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={isSendingCode}
                    className="w-full h-11 bg-dashboard-primary hover:bg-dashboard-primary/95 text-black font-bold rounded-lg text-xs tracking-wider transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer shadow-sm shadow-dashboard-primary/10 mt-2"
                >
                    {isSendingCode ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            {isRTL ? "جاري الإرسال..." : "Sending..."}
                        </span>
                    ) : isRTL ? (
                        "إرسال رمز التحقق"
                    ) : (
                        "Send Verification Code"
                    )}
                </Button>
            </form>
        </motion.div>
    );
}

export default ForgotPasswordPage;
