import { Button } from "@/design-system";
import { useLanguage } from "@/shared/hooks";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authPaths } from "../navigation/paths";

function ResetPasswordSuccessPage() {
    const { isRTL } = useLanguage("auth");
    const navigate = useNavigate();

    const handleBackToLogin = () => {
        navigate(authPaths.login());
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full flex flex-col font-sans items-center"
        >
            {/* Success Icon */}
            <div className="h-14 w-14 bg-dashboard-primary/15 rounded-full flex items-center justify-center mb-5">
                <CheckCircle2 className="h-7 w-7 text-dashboard-primary" />
            </div>

            {/* nota Media Branding Logo */}
            <div
                className="flex items-center gap-1.5 justify-center mb-2"
                dir="ltr"
            >
                <span className="font-black text-3xl tracking-tighter text-black flex items-center">
                    NOTA
                </span>
            </div>

            {/* Title */}
            <p className="text-sm font-bold text-gray-800 text-center mb-1">
                {isRTL
                    ? "تم إعادة تعيين كلمة المرور بنجاح!"
                    : "Password Reset Successfully!"}
            </p>

            {/* Subtitle */}
            <p className="text-xs text-gray-400 text-center max-w-[280px] mx-auto mb-8 leading-relaxed font-semibold">
                {isRTL
                    ? "يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة."
                    : "You can now sign in with your new password."}
            </p>

            {/* Back to Login Button */}
            <Button
                onClick={handleBackToLogin}
                className="w-full h-11 bg-dashboard-primary hover:bg-dashboard-primary/95 text-black font-bold rounded-lg text-xs tracking-wider transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center cursor-pointer shadow-sm shadow-dashboard-primary/10"
            >
                {isRTL ? "العودة لتسجيل الدخول" : "Back to Login"}
            </Button>
        </motion.div>
    );
}

export default ResetPasswordSuccessPage;
