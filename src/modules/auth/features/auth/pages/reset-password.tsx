import { authStore } from "@/auth/auth.store";
import { Button } from "@/design-system";
import { Input } from "@/design-system/components/input";
import { Label } from "@/design-system/components/label";
import { useMutationHandler } from "@/shared/api";
import { useLanguage } from "@/shared/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useResetPassword } from "../api/auth.mutations";
import { authPaths } from "../navigation/paths";

type FormFields = {
    password: string;
    passwordConfirmation: string;
};

function ResetPasswordPage() {
    const { t, isRTL } = useLanguage("auth");
    const navigate = useNavigate();
    const { execute } = useMutationHandler();
    const { setResetEmail } = authStore();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        mutateAsync: resetPasswordMutation,
        isPending: isResettingPassword,
    } = useResetPassword();

    const schema = z
        .object({
            password: z.string().min(6, t("auth.validation.passwordMinLength")),
            passwordConfirmation: z.string(),
        })
        .refine((data) => data.password === data.passwordConfirmation, {
            message: t("auth.validation.passwordsDoNotMatch"),
            path: ["passwordConfirmation"],
        });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
        mode: "onSubmit",
        defaultValues: { password: "", passwordConfirmation: "" },
    });

    const onSubmit = (data: FormFields) => {
        execute(
            () =>
                resetPasswordMutation({
                    verifyToken: "", // Token will be handled by backend session
                    password: data.password,
                }),
            {
                successMessage: t("auth.passwordResetSuccessfully"),
                onSuccess: () => {
                    setResetEmail(null);
                    navigate(authPaths.resetPasswordSuccess());
                },
            },
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full flex flex-col font-sans"
        >
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
            <p className="text-xs text-gray-400 text-center max-w-70 mx-auto mb-6 leading-relaxed font-semibold">
                {isRTL
                    ? "أنشئ كلمة مرور جديدة قوية لحماية حسابك."
                    : "Create a new strong password to secure your account."}
            </p>

            {/* Form */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4.5"
            >
                {/* Password Field */}
                <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-gray-700  tracking-wide px-1">
                        {t("auth.newPassword", "New Password")}
                    </Label>
                    <div className="relative">
                        <Input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder={
                                isRTL
                                    ? "أدخل كلمة المرور الجديدة"
                                    : "Enter new password"
                            }
                            className="bg-white border border-gray-250 h-11 rounded-lg font-medium px-4 text-xs focus:ring-1 focus:ring-dashboard-primary focus:border-dashboard-primary outline-none transition-colors w-full"
                        />
                        <button
                            type="button"
                            tabIndex={-1}
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                            onClick={() =>
                                setShowPassword((prev: boolean) => !prev)
                            }
                            className={`absolute top-1/2 -translate-y-1/2 focus:outline-none hover:text-gray-600 text-gray-400 cursor-pointer ${
                                isRTL ? "left-4" : "right-4"
                            }`}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-[10px] font-medium px-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-gray-700  tracking-wide px-1">
                        {t("auth.passwordConfirmation", "Confirm Password")}
                    </Label>
                    <div className="relative">
                        <Input
                            {...register("passwordConfirmation")}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder={
                                isRTL
                                    ? "أعد إدخال كلمة المرور"
                                    : "Confirm your password"
                            }
                            className="bg-white border border-gray-250 h-11 rounded-lg font-medium px-4 text-xs focus:ring-1 focus:ring-dashboard-primary focus:border-dashboard-primary outline-none transition-colors w-full"
                        />
                        <button
                            type="button"
                            tabIndex={-1}
                            aria-label={
                                showConfirmPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                            onClick={() =>
                                setShowConfirmPassword((prev: boolean) => !prev)
                            }
                            className={`absolute top-1/2 -translate-y-1/2 focus:outline-none hover:text-gray-600 text-gray-400 cursor-pointer ${
                                isRTL ? "left-4" : "right-4"
                            }`}
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    {errors.passwordConfirmation && (
                        <p className="text-red-500 text-[10px] font-medium px-1">
                            {errors.passwordConfirmation.message}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={isResettingPassword}
                    className="w-full h-11 bg-dashboard-primary hover:bg-dashboard-primary/95 text-black font-bold rounded-lg text-xs tracking-wider transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer shadow-sm shadow-dashboard-primary/10 mt-2"
                >
                    {isResettingPassword ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            {isRTL ? "جاري إعادة التعيين..." : "Resetting..."}
                        </span>
                    ) : isRTL ? (
                        "إعادة تعيين كلمة المرور"
                    ) : (
                        "Reset Password"
                    )}
                </Button>
            </form>
        </motion.div>
    );
}

export default ResetPasswordPage;
