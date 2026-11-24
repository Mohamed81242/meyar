import React, { useState } from "react";
import { useLanguage } from "@/shared/hooks";
import { api } from "@/shared/api";
import { toast } from "sonner";
import {
    AlertTriangle,
    CheckCircle2,
    Globe,
    Loader2,
    Lock,
    Mail,
    Scale,
    ShieldAlert,
    Trash2,
    User,
    ArrowLeft,
    ArrowRight,
    FileText,
    HelpCircle,
    Info,
} from "lucide-react";
import { Link } from "react-router-dom";

interface DeleteAccountFormState {
    full_name: string;
    email: string;
    reason: string;
    custom_reason?: string;
    comments: string;
    confirm_owner: boolean;
    confirm_permanent: boolean;
}

export default function DeleteAccountPage() {
    const { isRTL, toggleLanguage, currentLanguage } = useLanguage("landing");
    const isAr = currentLanguage === "ar";

    const [formState, setFormState] = useState<DeleteAccountFormState>({
        full_name: "",
        email: "",
        reason: "I no longer need this service",
        custom_reason: "",
        comments: "",
        confirm_owner: false,
        confirm_permanent: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [serverMessage, setServerMessage] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const reasonOptions = [
        {
            value: "I no longer need this service",
            labelAr: "لم أعد بحاجة إلى خدمات المنصة",
            labelEn: "I no longer need this service",
        },
        {
            value: "Closing law firm or retired",
            labelAr: "إغلاق المكتب القانوني أو التقاعد عن الممارسة",
            labelEn: "Closing law firm or retired",
        },
        {
            value: "Switching to another platform",
            labelAr: "الانتقال إلى نظام أو برنامج آخر",
            labelEn: "Switching to another platform",
        },
        {
            value: "Privacy or data concerns",
            labelAr: "مخاوف تتعلق بالخصوصية أو أمان البيانات",
            labelEn: "Privacy or data concerns",
        },
        {
            value: "Temporary break from legal practice",
            labelAr: "توقف مؤقت عن العمل والترافع",
            labelEn: "Temporary break from legal practice",
        },
        {
            value: "Other reason",
            labelAr: "سبب آخر (يرجى التوضيح في الملاحظات)",
            labelEn: "Other reason (please describe below)",
        },
    ];

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formState.full_name.trim()) {
            newErrors.full_name = isAr
                ? "يرجى إدخال اسمك بالكامل"
                : "Please enter your full name";
        }
        if (!formState.email.trim()) {
            newErrors.email = isAr
                ? "يرجى إدخال البريد الإلكتروني"
                : "Please enter your registered email";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
            newErrors.email = isAr
                ? "صيغة البريد الإلكتروني غير صالحة"
                : "Please enter a valid email address";
        }
        if (!formState.confirm_owner) {
            newErrors.confirm_owner = isAr
                ? "يجب تأكيد ملكية الحساب"
                : "You must confirm account ownership";
        }
        if (!formState.confirm_permanent) {
            newErrors.confirm_permanent = isAr
                ? "يجب الموافقة على أن الإجراء نهائي ولا رجعة فيه"
                : "You must acknowledge permanent data deletion";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            toast.error(
                isAr
                    ? "يرجى استكمال جميع الحقول المطلوبة والتأكيدات"
                    : "Please fill all required fields and confirmations"
            );
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        const selectedReasonText =
            formState.reason === "Other reason" && formState.custom_reason
                ? formState.custom_reason
                : formState.reason;

        const payload = {
            full_name: formState.full_name.trim(),
            email: formState.email.trim(),
            reason: selectedReasonText,
            comments: formState.comments.trim(),
            confirm_permanent: formState.confirm_permanent,
            confirm_owner: formState.confirm_owner,
        };

        try {
            const response = await api.post<any>("/auth/delete-account", payload);

            if (response.error) {
                const message =
                    response.error.message ||
                    (isAr
                        ? "فشل إرسال طلب حذف الحساب، يرجى المحاولة لاحقاً"
                        : "Failed to submit delete request, please try again");
                toast.error(message);
                setServerMessage(message);
            } else {
                setIsSubmitted(true);
                setServerMessage(
                    response.data?.message ||
                        (isAr
                            ? "تم استلام طلب حذف حسابك بنجاح. سيتم معالجة الطلب ومسح البيانات وفقاً للسياسات القانونية."
                            : "Your account deletion request has been submitted successfully.")
                );
                toast.success(
                    isAr
                        ? "تم إرسال طلب حذف الحساب بنجاح"
                        : "Account deletion request submitted"
                );
            }
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                (isAr
                    ? "حدث خطأ غير متوقع أثناء معالجة الطلب"
                    : "An unexpected error occurred while processing the request");
            toast.error(message);
            setServerMessage(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-dashboard-background text-dashboard-foreground selection:bg-dashboard-primary/30 selection:text-dashboard-foreground font-sans relative"
            dir={isRTL ? "rtl" : "ltr"}
        >
            {/* Top Header */}
            <header className="sticky top-0 inset-x-0 z-50 bg-dashboard-background/85 backdrop-blur-xl border-b border-dashboard-border px-6 md:px-12 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 rounded-xl bg-dashboard-primary text-white flex items-center justify-center font-bold text-sm shadow-[0_0_20px_rgba(105,117,226,0.35)] group-hover:scale-105 transition-transform">
                            <Scale className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-base tracking-tight text-dashboard-foreground leading-none">
                                NOTA
                            </span>
                            <span className="text-[10px] text-dashboard-muted-foreground font-medium">
                                {isAr ? "منصة نوتة القانونية" : "Legal Platform"}
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashboard-border bg-dashboard-card hover:bg-dashboard-secondary text-dashboard-foreground text-xs font-semibold transition-all cursor-pointer"
                        title={isAr ? "Switch to English" : "التحويل إلى العربية"}
                    >
                        <Globe className="w-3.5 h-3.5 text-dashboard-primary" />
                        <span>{isAr ? "English" : "العربية"}</span>
                    </button>

                    <Link
                        to="/privacy"
                        className="text-xs font-semibold text-dashboard-muted-foreground hover:text-dashboard-foreground transition-colors hidden sm:inline"
                    >
                        {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
                    </Link>

                    <Link
                        to="/login"
                        className="text-xs font-bold bg-dashboard-primary hover:bg-dashboard-primary/90 text-white px-4 py-1.5 rounded-xl transition-all shadow-xs"
                    >
                        {isAr ? "تسجيل الدخول" : "Sign In"}
                    </Link>
                </div>
            </header>

            {/* Background Glow Accents */}
            <div className="absolute top-20 right-1/3 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-dashboard-primary/10 rounded-full blur-3xl pointer-events-none" />

            <main className="max-w-4xl mx-auto px-6 md:px-10 py-12 relative z-10">
                {/* Intro Title & Badges */}
                <div className="text-center space-y-3 mb-8">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold">
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>
                            {isAr
                                ? "طلب حذف الحساب ومسح البيانات الشخصية"
                                : "Account Deletion & Data Erasure Request"}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black text-dashboard-foreground tracking-tight">
                        {isAr ? "حذف الحساب من منصة نوتة" : "Delete Your Nota Account"}
                    </h1>

                    <p className="text-sm text-dashboard-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        {isAr
                            ? "نأسف لرؤيتك تغادر. تتيح لك هذه الصفحة تقديم طلب رسمي ومباشر لمسح حسابك وبياناتك المسجلة على خوادمنا وتطبيقاتنا وفقاً للائحة حماية البيانات والسرية القانونية."
                            : "We are sorry to see you go. This page allows you to formally request the permanent deletion of your account and personal records in accordance with regulatory data privacy compliance."}
                    </p>
                </div>

                {isSubmitted ? (
                    /* Success State Confirmation Card */
                    <div className="p-8 md:p-10 rounded-3xl bg-dashboard-card border border-dashboard-border text-center space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-dashboard-foreground">
                                {isAr ? "تم استلام طلب الحذف بنجاح" : "Deletion Request Received"}
                            </h2>
                            <p className="text-sm text-dashboard-muted-foreground max-w-lg mx-auto leading-relaxed">
                                {serverMessage ||
                                    (isAr
                                        ? `تم تسجيل طلب حذف الحساب المرتبط بالبريد الإلكتروني (${formState.email}). سيقوم فريق العمل بمراجعة الطلب واستكمال مسح البيانات وإرسال تأكيد نهائي على بريدك.`
                                        : `Your deletion request for (${formState.email}) has been submitted. Our compliance team will finalize data erasure and send a confirmation email.`)}
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-dashboard-background border border-dashboard-border text-xs text-dashboard-muted-foreground text-start max-w-md mx-auto space-y-2">
                            <div className="flex items-center gap-2 font-bold text-dashboard-foreground">
                                <Info className="w-4 h-4 text-dashboard-primary" />
                                <span>{isAr ? "ما الذي سيحدث بعد ذلك؟" : "What happens next?"}</span>
                            </div>
                            <ul className="list-disc list-inside space-y-1 text-[11px] ltr:pl-1 rtl:pr-1">
                                <li>{isAr ? "إلغاء الجلسات النشطة وتسجيل الخروج من كافة الأجهزة." : "Active login sessions will be terminated."}</li>
                                <li>{isAr ? "حذف بيانات القضايا غير المرتبطة بالتزامات قضائية قائمة." : "Non-regulatory legal records will be permanently erased."}</li>
                                <li>{isAr ? "تصفية رصيد المحفظة وإرسال كشف الحساب الختامي." : "Wallet settlements will be finalized."}</li>
                            </ul>
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                            <Link
                                to="/"
                                className="px-6 py-2.5 rounded-xl bg-dashboard-secondary hover:bg-dashboard-border text-dashboard-foreground text-xs font-bold transition-all"
                            >
                                {isAr ? "العودة للصفحة الرئيسية" : "Back to Home"}
                            </Link>
                            <Link
                                to="/privacy"
                                className="px-6 py-2.5 rounded-xl bg-dashboard-primary hover:bg-dashboard-primary/90 text-white text-xs font-bold transition-all shadow-xs"
                            >
                                {isAr ? "الاطلاع على سياسة الخصوصية" : "Read Privacy Policy"}
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* Main Form Card */
                    <div className="space-y-6">
                        {/* Important Warning Notice Box */}
                        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-4">
                            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <div className="space-y-1 text-xs">
                                <span className="font-bold text-amber-400 block text-sm">
                                    {isAr
                                        ? "تنبيه هام قبل تأكيد طلب الحذف"
                                        : "Important Warning Regarding Account Deletion"}
                                </span>
                                <p className="text-amber-200/80 leading-relaxed">
                                    {isAr
                                        ? "حذف الحساب هو إجراء نهائي ودائم. سيؤدي ذلك إلى تعطيل وصولك إلى ملفات القضايا والإنابات المسجلة، وفقدان النماذج القانونية المحفوظة، وإلغاء بطاقة العضوية الرقمية. يرجى التأكد من تسوية أي مبالغ أو أتعاب معلقة في محفظتك الإلكترونية قبل المتابعة."
                                        : "Account deletion is irreversible. This will remove your access to case files, court delegations (Notas), custom templates, and membership tokens. Please ensure any pending escrow balances in your wallet are resolved beforehand."}
                                </p>
                            </div>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="p-6 md:p-8 rounded-3xl bg-dashboard-card border border-dashboard-border shadow-xl space-y-6"
                        >
                            {/* Full Name & Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label
                                        htmlFor="full_name"
                                        className="text-xs font-bold text-dashboard-foreground flex items-center gap-1.5"
                                    >
                                        <User className="w-3.5 h-3.5 text-dashboard-primary" />
                                        <span>
                                            {isAr ? "الاسم الكامل" : "Full Name"}{" "}
                                            <span className="text-rose-500">*</span>
                                        </span>
                                    </label>
                                    <input
                                        id="full_name"
                                        type="text"
                                        value={formState.full_name}
                                        onChange={(e) =>
                                            setFormState((prev) => ({
                                                ...prev,
                                                full_name: e.target.value,
                                            }))
                                        }
                                        placeholder={
                                            isAr ? "أحمد منصور" : "e.g. Ahmed Mansour"
                                        }
                                        className={`w-full px-3.5 py-2.5 rounded-xl bg-dashboard-background border text-xs text-dashboard-foreground placeholder:text-dashboard-muted-foreground/40 outline-none transition-colors ${
                                            errors.full_name
                                                ? "border-rose-500 focus:ring-1 focus:ring-rose-500"
                                                : "border-dashboard-border focus:border-dashboard-primary"
                                        }`}
                                        required
                                    />
                                    {errors.full_name && (
                                        <p className="text-[11px] text-rose-500 font-medium">
                                            {errors.full_name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label
                                        htmlFor="email"
                                        className="text-xs font-bold text-dashboard-foreground flex items-center gap-1.5"
                                    >
                                        <Mail className="w-3.5 h-3.5 text-dashboard-primary" />
                                        <span>
                                            {isAr
                                                ? "البريد الإلكتروني المسجل بالحساب"
                                                : "Registered Account Email"}{" "}
                                            <span className="text-rose-500">*</span>
                                        </span>
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={formState.email}
                                        onChange={(e) =>
                                            setFormState((prev) => ({
                                                ...prev,
                                                email: e.target.value,
                                            }))
                                        }
                                        placeholder="lawyer@example.com"
                                        className={`w-full px-3.5 py-2.5 rounded-xl bg-dashboard-background border text-xs text-dashboard-foreground placeholder:text-dashboard-muted-foreground/40 outline-none transition-colors ${
                                            errors.email
                                                ? "border-rose-500 focus:ring-1 focus:ring-rose-500"
                                                : "border-dashboard-border focus:border-dashboard-primary"
                                        }`}
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-[11px] text-rose-500 font-medium">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Reason Dropdown */}
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="reason"
                                    className="text-xs font-bold text-dashboard-foreground flex items-center gap-1.5"
                                >
                                    <HelpCircle className="w-3.5 h-3.5 text-dashboard-primary" />
                                    <span>
                                        {isAr
                                            ? "سبب طلب حذف الحساب"
                                            : "Reason for Deletion"}
                                    </span>
                                </label>
                                <select
                                    id="reason"
                                    value={formState.reason}
                                    onChange={(e) =>
                                        setFormState((prev) => ({
                                            ...prev,
                                            reason: e.target.value,
                                        }))
                                    }
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-dashboard-background border border-dashboard-border text-xs text-dashboard-foreground outline-none focus:border-dashboard-primary transition-colors cursor-pointer"
                                >
                                    {reasonOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {isAr ? opt.labelAr : opt.labelEn}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {formState.reason === "Other reason" && (
                                <div className="space-y-1.5 animate-in fade-in duration-200">
                                    <label
                                        htmlFor="custom_reason"
                                        className="text-xs font-bold text-dashboard-foreground"
                                    >
                                        {isAr
                                            ? "وضح سبب الحذف بالتفصيل"
                                            : "Specify reason in detail"}
                                    </label>
                                    <input
                                        id="custom_reason"
                                        type="text"
                                        value={formState.custom_reason}
                                        onChange={(e) =>
                                            setFormState((prev) => ({
                                                ...prev,
                                                custom_reason: e.target.value,
                                            }))
                                        }
                                        placeholder={
                                            isAr
                                                ? "اكتب سبب طلب الحذف..."
                                                : "Describe your reason..."
                                        }
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-dashboard-background border border-dashboard-border text-xs text-dashboard-foreground outline-none focus:border-dashboard-primary"
                                    />
                                </div>
                            )}

                            {/* Additional Comments */}
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="comments"
                                    className="text-xs font-bold text-dashboard-foreground flex items-center gap-1.5"
                                >
                                    <FileText className="w-3.5 h-3.5 text-dashboard-primary" />
                                    <span>
                                        {isAr
                                            ? "ملاحظات إضافية أو طلبات مسح مخصصة (اختياري)"
                                            : "Additional Comments or Specific Erasure Requests (Optional)"}
                                    </span>
                                </label>
                                <textarea
                                    id="comments"
                                    rows={3}
                                    value={formState.comments}
                                    onChange={(e) =>
                                        setFormState((prev) => ({
                                            ...prev,
                                            comments: e.target.value,
                                        }))
                                    }
                                    placeholder={
                                        isAr
                                            ? "يرجى مسح كافة سجلات القضايا والبيانات المرتبطة بحسابي نهائياً..."
                                            : "Please delete all my case archives, documents, and account data permanently."
                                    }
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-dashboard-background border border-dashboard-border text-xs text-dashboard-foreground placeholder:text-dashboard-muted-foreground/40 outline-none focus:border-dashboard-primary transition-colors resize-y"
                                />
                            </div>

                            {/* Confirmations Checkboxes */}
                            <div className="p-4 rounded-2xl bg-dashboard-background border border-dashboard-border space-y-3.5">
                                <label className="flex items-start gap-3 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={formState.confirm_owner}
                                        onChange={(e) =>
                                            setFormState((prev) => ({
                                                ...prev,
                                                confirm_owner: e.target.checked,
                                            }))
                                        }
                                        className="mt-0.5 rounded border-dashboard-border text-dashboard-primary focus:ring-dashboard-primary w-4 h-4 cursor-pointer"
                                    />
                                    <span className="text-xs text-dashboard-foreground leading-snug">
                                        <strong>
                                            {isAr
                                                ? "أقر بأنني المالك القانوني والمصرح له"
                                                : "I confirm that I am the authorized owner"}
                                        </strong>{" "}
                                        {isAr
                                            ? "لهذا الحساب والبريد الإلكتروني المذكور أعلاه، وأتحمل كامل المسؤولية عن هذا الطلب."
                                            : "of this account and registered email address, submitting this request with full authority."}
                                    </span>
                                </label>
                                {errors.confirm_owner && (
                                    <p className="text-[11px] text-rose-500 font-medium ltr:pl-7 rtl:pr-7">
                                        {errors.confirm_owner}
                                    </p>
                                )}

                                <label className="flex items-start gap-3 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={formState.confirm_permanent}
                                        onChange={(e) =>
                                            setFormState((prev) => ({
                                                ...prev,
                                                confirm_permanent: e.target.checked,
                                            }))
                                        }
                                        className="mt-0.5 rounded border-dashboard-border text-rose-500 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                                    />
                                    <span className="text-xs text-dashboard-foreground leading-snug">
                                        <strong className="text-rose-400">
                                            {isAr
                                                ? "أدرك تماماً أن هذا الإجراء نهائي ولا يمكن التراجع عنه"
                                                : "I understand that this action is permanent and irreversible"}
                                        </strong>{" "}
                                        {isAr
                                            ? "وسيؤدي إلى مسح كافة البيانات وسجلات القضايا والحسابات بصورة دائمة."
                                            : "and will permanently erase all associated case files, credentials, and records."}
                                    </span>
                                </label>
                                {errors.confirm_permanent && (
                                    <p className="text-[11px] text-rose-500 font-medium ltr:pl-7 rtl:pr-7">
                                        {errors.confirm_permanent}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3 px-6 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>
                                                {isAr
                                                    ? "جاري إرسال طلب الحذف..."
                                                    : "Submitting Request..."}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4" />
                                            <span>
                                                {isAr
                                                    ? "تأكيد وإرسال طلب مسح الحساب نهائياً"
                                                    : "Confirm & Submit Permanent Deletion Request"}
                                            </span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-dashboard-border/60 py-8 px-6 md:px-12 text-center text-xs text-dashboard-muted-foreground bg-dashboard-card/20 mt-12">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 font-extrabold text-dashboard-foreground text-sm">
                        <div className="w-6 h-6 rounded-md bg-dashboard-primary flex items-center justify-center font-bold text-xs text-white">
                            NO
                        </div>
                        <span>NOTA</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                        <Link
                            to="/privacy"
                            className="hover:text-dashboard-foreground transition-colors"
                        >
                            {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
                        </Link>
                        <span>•</span>
                        <span>
                            &copy; {new Date().getFullYear()} NOTA Legal Platform
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
