import { Button } from "@/design-system";
import { Input } from "@/design-system/components/input";
import { Label } from "@/design-system/components/label";
import { dashboardPaths } from "@/modules/dashboard/main/navigation";
import { useDashboardTheme } from "@/modules/hooks/useDashboardTheme";
import { useMutationHandler } from "@/shared/api";
import { useLanguage } from "@/shared/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useLogin } from "../api/auth.mutations";
import { authPaths } from "../navigation";

type FormFields = {
    identifier: string;
    password: string;
};

function LoginPage() {
    const { t, isRTL } = useLanguage("auth");
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const loginSchema = z.object({
        identifier: z
            .string()
            .min(3, isRTL ? "يرجى إدخال البريد الإلكتروني أو رقم الهاتف" : "Please enter your email or phone number"),
        password: z.string().min(6, t("auth.validation.passwordMinLength", "Password must be at least 6 characters")),
    });

    const { darkMode } = useDashboardTheme();
    const { execute } = useMutationHandler();
    const { mutateAsync: loginMutation, isPending: isLoginPending } = useLogin();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormFields>({
        resolver: zodResolver(loginSchema),
        mode: "onSubmit",
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    const onSubmit = (data: FormFields) => {
        execute(() => loginMutation({ identifier: data.identifier.trim(), password: data.password }), {
            successMessage: t("auth.loginSuccessful", "Signed in successfully"),
            onSuccess: (res) => {
                if (res?.data?.isFirstTimeUser) {
                    navigate("/welcome");
                } else {
                    navigate(dashboardPaths.billing.main);
                }
                reset();
            },
        });
    };

    const handleForgotPassword = () => {
        navigate(authPaths.forgotPassword());
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full flex flex-col font-sans"
        >
            {/* Branding Logo */}
            <div
                className="flex items-center gap-1.5 justify-center mb-2"
                dir="ltr"
            >
                <span
                    className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                    NOTA
                </span>
            </div>

            {/* Subtitle */}
            <p className="text-xs text-gray-400 text-center max-w-[280px] mx-auto mb-6 leading-relaxed font-semibold">
                {isRTL
                    ? "مرحباً بعودتك! ادخل إلى مساحة العمل القانونية والتوثيق الرقمي."
                    : "Welcome back! Access your legal & notary digital workspace."}
            </p>

            {/* Form */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4.5"
            >
                {/* Identifier (Email or Phone) Field */}
                <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-gray-700 tracking-wide px-1">
                        {isRTL ? "البريد الإلكتروني أو رقم الهاتف" : "Email or Phone number"}
                    </Label>
                    <div className="relative">
                        <Input
                            {...register("identifier")}
                            type="text"
                            placeholder={
                                isRTL
                                    ? "أدخل البريد الإلكتروني أو رقم الهاتف"
                                    : "Enter email or phone number"
                            }
                            className="bg-white border border-gray-250 h-11 rounded-lg font-medium px-4 text-xs focus:ring-1 focus:ring-dashboard-primary focus:border-dashboard-primary outline-none transition-colors w-full"
                            dir="auto"
                        />
                    </div>
                    {errors.identifier && (
                        <p className="text-red-500 text-[10px] font-medium px-1">
                            {errors.identifier.message}
                        </p>
                    )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                        <Label className="text-[10px] font-bold text-gray-700 tracking-wide">
                            {t("auth.password", "Password")}
                        </Label>
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-[10px] font-bold text-gray-400 hover:text-dashboard-primary transition-colors cursor-pointer"
                        >
                            {isRTL
                                ? "هل نسيت كلمة المرور؟"
                                : "Forgot Your Password?"}
                        </button>
                    </div>
                    <div className="relative">
                        <Input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder={
                                isRTL
                                    ? "أدخل كلمة المرور"
                                    : "Enter your password"
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

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={isLoginPending}
                    className="w-full h-11 bg-dashboard-primary hover:bg-dashboard-primary/95 text-black font-bold rounded-lg text-xs tracking-wider transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer shadow-sm shadow-dashboard-primary/10 mt-2"
                >
                    {isLoginPending ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            {isRTL ? "جاري تسجيل الدخول..." : "Signing in..."}
                        </span>
                    ) : isRTL ? (
                        "تسجيل الدخول"
                    ) : (
                        "Sign In"
                    )}
                </Button>
            </form>

            {/* Legal / Policy Disclaimer */}
            <p className="text-[9px] text-gray-400 text-center leading-normal mt-5 px-4 select-none">
                {isRTL
                    ? "من خلال النقر على متابعة، فإنك توافق على شروط الخدمة وسياسة الخصوصية الخاصة بنا"
                    : "By clicking continue, you agree to our Terms of Service and Privacy Policy"}
            </p>
        </motion.div>
    );
}

export default LoginPage;
