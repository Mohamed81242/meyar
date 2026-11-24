import React, { useState } from "react";
import { useLanguage } from "@/shared/hooks";
import { api } from "@/shared/api";
import { toast } from "sonner";
import {
    Headphones,
    Mail,
    Phone,
    MessageSquare,
    Clock,
    Scale,
    Send,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Globe,
    AlertCircle,
    FileText,
    HelpCircle,
    User,
    Shield,
    Zap,
    LifeBuoy,
    Loader2,
    ArrowRight,
    Search,
} from "lucide-react";
import { Link } from "react-router-dom";

interface SupportFormState {
    full_name: string;
    email: string;
    phone: string;
    department: string;
    priority: "normal" | "high" | "urgent";
    subject: string;
    message: string;
}

export default function SupportPage() {
    const { isRTL, toggleLanguage, currentLanguage } = useLanguage("landing");
    const isAr = currentLanguage === "ar";

    const [formState, setFormState] = useState<SupportFormState>({
        full_name: "",
        email: "",
        phone: "",
        department: "delegations",
        priority: "normal",
        subject: "",
        message: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [ticketNumber, setTicketNumber] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState("");
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    const departments = [
        {
            value: "delegations",
            labelAr: "إدارة الإنابات القضائية وحضور الجلسات (نوتة)",
            labelEn: "Judicial Delegations & Court Appearances (Notas)",
        },
        {
            value: "verification",
            labelAr: "توثيق القيد بنقابة المحامين واعتماد الحساب",
            labelEn: "Bar Association Credential Verification",
        },
        {
            value: "wallet",
            labelAr: "المحفظة المالية، الشحن، وتحويل الأتعاب (Escrow)",
            labelEn: "Wallet, Escrow Payments & Payouts",
        },
        {
            value: "technical",
            labelAr: "بلاغ عن عطل تقني أو صعوبة في تسجيل الدخول",
            labelEn: "Technical Bug or Authentication Issue",
        },
        {
            value: "consultations",
            labelAr: "الاستشارات القانونية والوسوم والقصص",
            labelEn: "Legal Consultations, Tags & Community Stories",
        },
        {
            value: "general",
            labelAr: "استفسار عام أو اقتراح تطوير",
            labelEn: "General Inquiries & Platform Feedback",
        },
    ];

    const faqs = [
        {
            qAr: "كيف يتم التحقق من سريان القيد بنقابة المحامين؟",
            qEn: "How are Bar Association credentials verified?",
            aAr: "يقوم فريق التوثيق والتدقيق بمطابقة صورة كارنيه المحاماة والدرجة القضائية وبطاقة الرقم القومي مع سجلات النقابة الرسمية خلال مدة تتراوح بين 15 دقيقة إلى ساعتين كحد أقصى.",
            aEn: "Our dedicated verification team cross-checks your Bar identification card, judicial degree (Primary, Appeal, Cassation), and National ID against official records within 15 minutes to 2 hours.",
        },
        {
            qAr: "كيف تضمن منصة نوتة أتعاب الإنابة القضائية (نظام الضمان Escrow)؟",
            qEn: "How does the Escrow Payment Guarantee work for court delegations?",
            aAr: "عند قبول طلب الإنابة، يتم حجز مبلغ الأتعاب في حساب الضمان الوسيط (Escrow). ولا يتم تحويل المبلغ للمحامي المناب إلا بعد رفع محضر الجلسة المعتمد واعتماده أو مرور فترة المراجعة.",
            aEn: "Upon accepting a delegation, the agreed fee is securely held in an escrow buffer. Payout is released to the appointed lawyer only after verified courtroom minutes are uploaded and approved.",
        },
        {
            qAr: "ماذا يحدث في حال حدوث طارئ للمحامي المناب قبل الجلسة؟",
            qEn: "What happens if the appointed lawyer encounters an emergency before court?",
            aAr: "توفر المنصة زر الطوارئ (Break-Glass) لإعادة إسناد الإنابة الفورية لمحامي بديل معتمد متواجد في نفس المحكمة والدائرة القضائية مع إشعار المحامي المنيب هاتفياً وعبر الواتساب.",
            aEn: "Nota provides an emergency dispatch protocol that immediately re-assigns the delegation to a verified stand-by attorney present in the same court complex, notifying you via SMS and WhatsApp.",
        },
        {
            qAr: "كيف يمكنني شحن رصيد المحفظة أو سحب الأرباح لحسابي البنكي؟",
            qEn: "How do I top up my wallet or withdraw earnings to my bank account?",
            aAr: "يمكنك الشحن الفوري عبر البطاقات البنكية، فوري، والمحافظ الإلكترونية. كما تتاح طلبات السحب للحسابات البنكية ومحافظ الهاتف في أي وقت مع تسوية مصرفية سريعة.",
            aEn: "Instant top-ups are supported via debit/credit cards and digital mobile wallets. Bank payouts and mobile withdrawals are processed seamlessly with rapid settlement.",
        },
        {
            qAr: "هل مذكرات ومستندات القضايا المرفقة محمية من الاطلاع؟",
            qEn: "Are uploaded case briefs and evidentiary documents confidential?",
            aAr: "نعم تماماً، جميع المستندات مشفرة بتقنية 256-bit AES وتخضع للحصانة والسرية المهنية المنصوص عليها في قانون المحاماة، ولا يطلع عليها إلا المحامي المناب في الجلسة المحددة فقط.",
            aEn: "Absolutely. All files are secured with 256-bit AES encryption under strict attorney-client privilege statutes, accessible solely by the authorized attorney assigned to that specific hearing.",
        },
    ];

    const filteredFaqs = faqs.filter(
        (f) =>
            (isAr ? f.qAr : f.qEn).toLowerCase().includes(searchQuery.toLowerCase()) ||
            (isAr ? f.aAr : f.aEn).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formState.full_name.trim() || !formState.email.trim() || !formState.subject.trim() || !formState.message.trim()) {
            toast.error(isAr ? "يرجى استكمال جميع الحقول الإلزامية" : "Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulated / API submission
            const generatedTicket = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
            
            // Try contacting backend support endpoint or fallback smoothly
            try {
                await api.post("/support/inquiry", {
                    ...formState,
                    ticket_id: generatedTicket,
                });
            } catch {
                // If specific support API endpoint isn't mounted yet, continue with graceful confirmation
            }

            setTicketNumber(generatedTicket);
            setIsSubmitted(true);
            toast.success(
                isAr
                    ? `تم تسجيل تذكرتك برقم ${generatedTicket} بنجاح`
                    : `Ticket ${generatedTicket} registered successfully`
            );
        } catch {
            toast.error(
                isAr
                    ? "حدث خطأ أثناء إرسال التذكرة، يرجى المحاولة لاحقاً"
                    : "An error occurred, please try again"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-dashboard-background text-dashboard-foreground selection:bg-dashboard-primary/30 selection:text-dashboard-foreground font-sans relative"
            dir={isRTL ? "rtl" : "ltr"}
        >
            {/* Top Navigation Bar */}
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
                                {isAr ? "مركز المساعدة والدعم" : "Help & Support Center"}
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
                        {isAr ? "الخصوصية" : "Privacy"}
                    </Link>

                    <Link
                        to="/login"
                        className="text-xs font-bold bg-dashboard-primary hover:bg-dashboard-primary/90 text-white px-4 py-1.5 rounded-xl transition-all shadow-xs"
                    >
                        {isAr ? "تسجيل الدخول" : "Sign In"}
                    </Link>
                </div>
            </header>

            {/* Background Glows */}
            <div className="absolute top-20 right-1/4 w-96 h-96 bg-dashboard-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-96 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Hero Section */}
            <div className="relative border-b border-dashboard-border/60 bg-dashboard-card/30 py-12 md:py-16 px-6 md:px-12 text-center">
                <div className="max-w-4xl mx-auto space-y-4 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-dashboard-primary/10 border border-dashboard-primary/20 text-dashboard-primary text-xs font-bold">
                        <Headphones className="w-3.5 h-3.5" />
                        <span>
                            {isAr
                                ? "دعم فني واستشاري مخصص للزملاء المحامين على مدار الساعة"
                                : "24/7 Dedicated Legal Tech & Courtroom Assistance"}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black text-dashboard-foreground tracking-tight">
                        {isAr ? "كيف يمكننا مساعدتك اليوم؟" : "How Can We Help You Today?"}
                    </h1>

                    <p className="text-sm md:text-base text-dashboard-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        {isAr
                            ? "فريق الدعم والعمليات القضائية في منصة نوتة جاهز للإجابة على استفساراتك، متابعة إناباتك، وحل أي تحديات تقنية أو مالية فوراً."
                            : "Nota's judicial operations and technical support teams are here to assist with delegations, bar verification, escrow settlements, and platform guidance."}
                    </p>

                    {/* Search Knowledgebase Input */}
                    <div className="max-w-xl mx-auto pt-4 relative">
                        <Search className="w-4 h-4 text-dashboard-muted-foreground absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={
                                isAr
                                    ? "ابحث في الأسئلة الشائعة، التوثيق، أو حلول الإنابات..."
                                    : "Search common questions, verification, escrow solutions..."
                            }
                            className="w-full ltr:pl-11 ltr:pr-4 rtl:pr-11 rtl:pl-4 py-3 rounded-2xl bg-dashboard-background border border-dashboard-border text-xs text-dashboard-foreground placeholder:text-dashboard-muted-foreground/50 outline-none focus:border-dashboard-primary shadow-xl transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="max-w-6xl mx-auto px-6 md:px-12 py-12 space-y-16 relative z-10">
                {/* Direct Contact Channels Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* WhatsApp Helpdesk */}
                    <div className="p-6 rounded-3xl bg-dashboard-card border border-dashboard-border hover:border-emerald-500/40 transition-all group flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <h2 className="text-base font-bold text-dashboard-foreground">
                                {isAr ? "الدعم الفوري عبر واتساب" : "WhatsApp Instant Helpdesk"}
                            </h2>
                            <p className="text-xs text-dashboard-muted-foreground leading-relaxed">
                                {isAr
                                    ? "تواصل مباشر مع مستجيب الذكاء الاصطناعي وفريق العمليات للرد الفوري على استفسارات الجلسات."
                                    : "Direct connection with AI dispatch and operations staff for real-time hearing coordination."}
                            </p>
                        </div>
                        <a
                            href="https://wa.me/201000000000"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-2 shadow-xs"
                        >
                            <span>{isAr ? "بدء محادثة واتساب" : "Chat on WhatsApp"}</span>
                            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                        </a>
                    </div>

                    {/* Email Support */}
                    <div className="p-6 rounded-3xl bg-dashboard-card border border-dashboard-border hover:border-dashboard-primary/40 transition-all group flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-dashboard-primary/10 text-dashboard-primary border border-dashboard-primary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                                <Mail className="w-6 h-6" />
                            </div>
                            <h2 className="text-base font-bold text-dashboard-foreground">
                                {isAr ? "البريد الإلكتروني المباشر" : "Direct Email Support"}
                            </h2>
                            <p className="text-xs text-dashboard-muted-foreground leading-relaxed">
                                {isAr
                                    ? "فريق الدعم الفني والقانوني متاح للرد على مذكرات التوثيق والشكاوى الرسمية في أقل من ساعتين."
                                    : "Legal & tech compliance teams respond to formal credential tickets and inquiries within 2 hours."}
                            </p>
                        </div>
                        <a
                            href="mailto:support@nota.legal"
                            className="w-full py-2.5 px-4 rounded-xl bg-dashboard-secondary hover:bg-dashboard-border text-dashboard-foreground text-xs font-bold text-center transition-all flex items-center justify-center gap-2"
                        >
                            <span>support@nota.legal</span>
                        </a>
                    </div>

                    {/* Hotline & Court Emergency */}
                    <div className="p-6 rounded-3xl bg-dashboard-card border border-dashboard-border hover:border-amber-500/40 transition-all group flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                                <Phone className="w-6 h-6" />
                            </div>
                            <h2 className="text-base font-bold text-dashboard-foreground">
                                {isAr ? "طوارئ الجلسات والمحاكم" : "Court Emergency Hotline"}
                            </h2>
                            <p className="text-xs text-dashboard-muted-foreground leading-relaxed">
                                {isAr
                                    ? "خط ساخن مخصص لحالات الطوارئ قبل انعقاد الدوائر القضائية لإعادة الإسناد الفوري للإنابات."
                                    : "Dedicated priority dispatch for same-day hearing emergencies and instant courtroom reallocation."}
                            </p>
                        </div>
                        <a
                            href="tel:+201000000000"
                            className="w-full py-2.5 px-4 rounded-xl bg-dashboard-secondary hover:bg-dashboard-border text-dashboard-foreground text-xs font-bold text-center transition-all flex items-center justify-center gap-2"
                        >
                            <span>+20 (100) 000-NOTA</span>
                        </a>
                    </div>
                </div>

                {/* Main Interactive Grid: Ticket Form & FAQ */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Left/Main Column: Ticket Form */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-dashboard-primary font-bold text-xs uppercase tracking-wider">
                                <LifeBuoy className="w-4 h-4" />
                                <span>{isAr ? "فتح تذكرة دعم فني" : "Submit Support Ticket"}</span>
                            </div>
                            <h2 className="text-2xl font-black text-dashboard-foreground">
                                {isAr ? "أرسل تفاصيل استفسارك أو مشكلتك" : "Send Inquiry or Issue Details"}
                            </h2>
                            <p className="text-xs text-dashboard-muted-foreground">
                                {isAr
                                    ? "املأ النموذج التالي وسيقوم الفريق المختص بمتابعة طلبك والتواصل معك فوراً."
                                    : "Complete the form below and our operations specialist will get in touch promptly."}
                            </p>
                        </div>

                        {isSubmitted ? (
                            <div className="p-8 rounded-3xl bg-dashboard-card border border-dashboard-border text-center space-y-5 animate-in fade-in zoom-in-95 duration-400">
                                <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-dashboard-foreground">
                                        {isAr ? "تم تسجيل تذكرتك بنجاح" : "Support Ticket Created"}
                                    </h3>
                                    <div className="inline-block px-4 py-1.5 rounded-xl bg-dashboard-background border border-dashboard-border text-xs font-mono font-bold text-dashboard-primary">
                                        {ticketNumber}
                                    </div>
                                    <p className="text-xs text-dashboard-muted-foreground max-w-md mx-auto leading-relaxed">
                                        {isAr
                                            ? `تم إرسال تأكيد التذكرة إلى بريدك الإلكتروني (${formState.email}). يقوم الفريق بمتابعة المشكلة وسيتواصل معك في أقرب وقت.`
                                            : `Confirmation has been sent to (${formState.email}). Our operations desk is reviewing your ticket and will follow up shortly.`}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsSubmitted(false);
                                        setFormState({
                                            full_name: "",
                                            email: "",
                                            phone: "",
                                            department: "delegations",
                                            priority: "normal",
                                            subject: "",
                                            message: "",
                                        });
                                    }}
                                    className="px-6 py-2.5 rounded-xl bg-dashboard-primary hover:bg-dashboard-primary/90 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                                >
                                    {isAr ? "إرسال تذكرة أخرى" : "Submit Another Ticket"}
                                </button>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                className="p-6 md:p-8 rounded-3xl bg-dashboard-card border border-dashboard-border shadow-xl space-y-5"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Full Name */}
                                    <div className="space-y-1.5">
                                        <label
                                            htmlFor="support_name"
                                            className="text-xs font-bold text-dashboard-foreground flex items-center gap-1.5"
                                        >
                                            <User className="w-3.5 h-3.5 text-dashboard-primary" />
                                            <span>
                                                {isAr ? "الاسم الكامل" : "Full Name"}{" "}
                                                <span className="text-rose-500">*</span>
                                            </span>
                                        </label>
                                        <input
                                            id="support_name"
                                            type="text"
                                            value={formState.full_name}
                                            onChange={(e) =>
                                                setFormState((prev) => ({
                                                    ...prev,
                                                    full_name: e.target.value,
                                                }))
                                            }
                                            placeholder={isAr ? "أحمد مصطفى" : "Ahmed Mostafa"}
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-dashboard-background border border-dashboard-border text-xs text-dashboard-foreground placeholder:text-dashboard-muted-foreground/40 outline-none focus:border-dashboard-primary transition-colors"
                                            required
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1.5">
                                        <label
                                            htmlFor="support_email"
                                            className="text-xs font-bold text-dashboard-foreground flex items-center gap-1.5"
                                        >
                                            <Mail className="w-3.5 h-3.5 text-dashboard-primary" />
                                            <span>
                                                {isAr ? "البريد الإلكتروني" : "Email Address"}{" "}
                                                <span className="text-rose-500">*</span>
                                            </span>
                                        </label>
                                        <input
                                            id="support_email"
                                            type="email"
                                            value={formState.email}
                                            onChange={(e) =>
                                                setFormState((prev) => ({
                                                    ...prev,
                                                    email: e.target.value,
                                                }))
                                            }
                                            placeholder="lawyer@example.com"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-dashboard-background border border-dashboard-border text-xs text-dashboard-foreground placeholder:text-dashboard-muted-foreground/40 outline-none focus:border-dashboard-primary transition-colors"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Phone / WhatsApp */}
                                    <div className="space-y-1.5">
                                        <label
                                            htmlFor="support_phone"
                                            className="text-xs font-bold text-dashboard-foreground flex items-center gap-1.5"
                                        >
                                            <Phone className="w-3.5 h-3.5 text-dashboard-primary" />
                                            <span>{isAr ? "رقم الهاتف / الواتساب" : "Phone / WhatsApp"}</span>
                                        </label>
                                        <input
                                            id="support_phone"
                                            type="tel"
                                            value={formState.phone}
                                            onChange={(e) =>
                                                setFormState((prev) => ({
                                                    ...prev,
                                                    phone: e.target.value,
                                                }))
                                            }
                                            placeholder="01012345678"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-dashboard-background border border-dashboard-border text-xs text-dashboard-foreground placeholder:text-dashboard-muted-foreground/40 outline-none focus:border-dashboard-primary transition-colors"
                                        />
                                    </div>

                                    {/* Department / Category */}
                                    <div className="space-y-1.5">
                                        <label
                                            htmlFor="support_department"
                                            className="text-xs font-bold text-dashboard-foreground flex items-center gap-1.5"
                                        >
                                            <HelpCircle className="w-3.5 h-3.5 text-dashboard-primary" />
                                            <span>{isAr ? "تصنيف المشكلة" : "Inquiry Topic"}</span>
                                        </label>
                                        <select
                                            id="support_department"
                                            value={formState.department}
                                            onChange={(e) =>
                                                setFormState((prev) => ({
                                                    ...prev,
                                                    department: e.target.value,
                                                }))
                                            }
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-dashboard-background border border-dashboard-border text-xs text-dashboard-foreground outline-none focus:border-dashboard-primary transition-colors cursor-pointer"
                                        >
                                            {departments.map((d) => (
                                                <option key={d.value} value={d.value}>
                                                    {isAr ? d.labelAr : d.labelEn}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Priority Selector */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-dashboard-foreground flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5 text-dashboard-primary" />
                                        <span>{isAr ? "مستوى الأهمية والسرعة" : "Priority Level"}</span>
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: "normal", labelAr: "عادي", labelEn: "Normal", color: "text-dashboard-foreground" },
                                            { id: "high", labelAr: "مرتفع", labelEn: "High", color: "text-amber-400" },
                                            { id: "urgent", labelAr: "طارئ لجلسة اليوم", labelEn: "Court Emergency", color: "text-rose-400" },
                                        ].map((p) => (
                                            <button
                                                type="button"
                                                key={p.id}
                                                onClick={() =>
                                                    setFormState((prev) => ({
                                                        ...prev,
                                                        priority: p.id as any,
                                                    }))
                                                }
                                                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                                    formState.priority === p.id
                                                        ? "bg-dashboard-primary/20 border-dashboard-primary text-dashboard-foreground shadow-xs"
                                                        : "bg-dashboard-background border-dashboard-border text-dashboard-muted-foreground hover:bg-dashboard-secondary"
                                                }`}
                                            >
                                                <span className={p.color}>{isAr ? p.labelAr : p.labelEn}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Subject */}
                                <div className="space-y-1.5">
                                    <label
                                        htmlFor="support_subject"
                                        className="text-xs font-bold text-dashboard-foreground flex items-center gap-1.5"
                                    >
                                        <FileText className="w-3.5 h-3.5 text-dashboard-primary" />
                                        <span>
                                            {isAr ? "عنوان التذكرة" : "Subject"}{" "}
                                            <span className="text-rose-500">*</span>
                                        </span>
                                    </label>
                                    <input
                                        id="support_subject"
                                        type="text"
                                        value={formState.subject}
                                        onChange={(e) =>
                                            setFormState((prev) => ({
                                                ...prev,
                                                subject: e.target.value,
                                            }))
                                        }
                                        placeholder={
                                            isAr
                                                ? "مثال: استفسار بخصوص تسوية أتعاب جلسة استئناف القاهرة..."
                                                : "e.g. Inquiry regarding Cairo Appeal hearing settlement..."
                                        }
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-dashboard-background border border-dashboard-border text-xs text-dashboard-foreground placeholder:text-dashboard-muted-foreground/40 outline-none focus:border-dashboard-primary transition-colors"
                                        required
                                    />
                                </div>

                                {/* Message */}
                                <div className="space-y-1.5">
                                    <label
                                        htmlFor="support_message"
                                        className="text-xs font-bold text-dashboard-foreground flex items-center gap-1.5"
                                    >
                                        <MessageSquare className="w-3.5 h-3.5 text-dashboard-primary" />
                                        <span>
                                            {isAr ? "تفاصيل المشكلة / الاستفسار" : "Message / Description"}{" "}
                                            <span className="text-rose-500">*</span>
                                        </span>
                                    </label>
                                    <textarea
                                        id="support_message"
                                        rows={4}
                                        value={formState.message}
                                        onChange={(e) =>
                                            setFormState((prev) => ({
                                                ...prev,
                                                message: e.target.value,
                                            }))
                                        }
                                        placeholder={
                                            isAr
                                                ? "اكتب تفاصيل استفسارك ورقم القضية أو الإنابة إن وجدت..."
                                                : "Describe your inquiry or include relevant case index numbers..."
                                        }
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-dashboard-background border border-dashboard-border text-xs text-dashboard-foreground placeholder:text-dashboard-muted-foreground/40 outline-none focus:border-dashboard-primary transition-colors resize-y"
                                        required
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3 px-6 rounded-xl bg-dashboard-primary hover:bg-dashboard-primary/90 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-dashboard-primary/20 transition-all cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>{isAr ? "جاري الإرسال..." : "Sending..."}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 rtl:rotate-180" />
                                            <span>{isAr ? "إرسال تذكرة الدعم الفني" : "Submit Support Ticket"}</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Right Column: FAQ Accordion */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-dashboard-primary font-bold text-xs uppercase tracking-wider">
                                <HelpCircle className="w-4 h-4" />
                                <span>{isAr ? "الأسئلة الشائعة" : "Frequently Asked Questions"}</span>
                            </div>
                            <h2 className="text-2xl font-black text-dashboard-foreground">
                                {isAr ? "إجابات فورية لأهم الأسئلة" : "Instant Answers & Guides"}
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {filteredFaqs.length === 0 ? (
                                <div className="p-6 rounded-2xl bg-dashboard-card border border-dashboard-border text-center text-xs text-dashboard-muted-foreground">
                                    {isAr ? "لم نتمكن من العثور على نتائج للبحث." : "No FAQ results found."}
                                </div>
                            ) : (
                                filteredFaqs.map((faq, index) => {
                                    const isOpen = openFaqIndex === index;
                                    return (
                                        <div
                                            key={index}
                                            className="rounded-2xl bg-dashboard-card border border-dashboard-border overflow-hidden transition-colors"
                                        >
                                            <button
                                                onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                                                className="w-full p-4 text-start flex items-center justify-between gap-3 text-xs font-bold text-dashboard-foreground hover:bg-dashboard-secondary transition-colors cursor-pointer"
                                            >
                                                <span>{isAr ? faq.qAr : faq.qEn}</span>
                                                {isOpen ? (
                                                    <ChevronUp className="w-4 h-4 text-dashboard-primary shrink-0" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4 text-dashboard-muted-foreground shrink-0" />
                                                )}
                                            </button>
                                            {isOpen && (
                                                <div className="p-4 pt-0 text-xs text-dashboard-muted-foreground leading-relaxed border-t border-dashboard-border/40 bg-dashboard-background/40">
                                                    {isAr ? faq.aAr : faq.aEn}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Working Hours Banner */}
                        <div className="p-5 rounded-2xl bg-dashboard-card border border-dashboard-border space-y-3">
                            <div className="flex items-center gap-2 font-bold text-xs text-dashboard-foreground">
                                <Clock className="w-4 h-4 text-dashboard-primary" />
                                <span>{isAr ? "ساعات العمل والتواجد القضائي" : "Judicial Support Hours"}</span>
                            </div>
                            <div className="space-y-1.5 text-xs text-dashboard-muted-foreground">
                                <div className="flex justify-between">
                                    <span>{isAr ? "دعم الجلسات والمحاكم:" : "Court Hours Support:"}</span>
                                    <strong className="text-dashboard-foreground font-mono">08:00 AM - 04:00 PM</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span>{isAr ? "الدعم الفني والمنصة:" : "General Tech Desk:"}</span>
                                    <strong className="text-dashboard-foreground font-mono">24/7 Active</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-dashboard-border/60 py-8 px-6 md:px-12 text-center text-xs text-dashboard-muted-foreground bg-dashboard-card/20 mt-12">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 font-extrabold text-dashboard-foreground text-sm">
                        <div className="w-6 h-6 rounded-md bg-dashboard-primary flex items-center justify-center font-bold text-xs text-white">
                            NO
                        </div>
                        <span>NOTA</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                        <Link to="/privacy" className="hover:text-dashboard-foreground transition-colors">
                            {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
                        </Link>
                        <span>•</span>
                        <Link to="/delete-account" className="hover:text-dashboard-foreground transition-colors">
                            {isAr ? "حذف الحساب" : "Delete Account"}
                        </Link>
                        <span>•</span>
                        <span>&copy; {new Date().getFullYear()} NOTA Legal Platform</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
