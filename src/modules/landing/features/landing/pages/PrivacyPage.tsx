import React, { useState, useEffect } from "react";
import { useLanguage } from "@/shared/hooks";
import {
    Shield,
    Lock,
    Scale,
    FileText,
    Share2,
    Eye,
    Clock,
    UserCheck,
    Cookie,
    RefreshCw,
    Mail,
    Phone,
    Printer,
    Globe,
    ChevronRight,
    CheckCircle2,
    ArrowUp,
    Building2,
    ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPage() {
    const { isRTL, toggleLanguage, currentLanguage } = useLanguage("landing");
    const isAr = currentLanguage === "ar";
    const [activeSection, setActiveSection] = useState<string>("intro");
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }

            const sections = document.querySelectorAll("section[id]");
            let current = "intro";
            sections.forEach((section) => {
                const sectionTop = (section as HTMLElement).offsetTop - 120;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute("id") || "intro";
                }
            });
            setActiveSection(current);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            const offset = 90;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = el.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const sections = [
        {
            id: "intro",
            icon: Shield,
            title: isAr ? "1. مقدمة ونطاق التطبيق" : "1. Introduction & Scope",
        },
        {
            id: "data-collected",
            icon: FileText,
            title: isAr ? "2. البيانات التي نقوم بجمعها" : "2. Information We Collect",
        },
        {
            id: "data-usage",
            icon: Eye,
            title: isAr ? "3. أغراض استخدام ومعالجة البيانات" : "3. Purposes of Data Processing",
        },
        {
            id: "legal-privilege",
            icon: Scale,
            title: isAr ? "4. السرية المهنية وحصانة ملفات القضايا" : "4. Legal Privilege & Case Immunity",
        },
        {
            id: "data-sharing",
            icon: Share2,
            title: isAr ? "5. مشاركة البيانات مع أطراف ثالثة" : "5. Third-Party Disclosures",
        },
        {
            id: "security",
            icon: Lock,
            title: isAr ? "6. أمان وتشفير وتخزين البيانات" : "6. Data Security & Storage",
        },
        {
            id: "retention",
            icon: Clock,
            title: isAr ? "7. مدة الاحتفاظ بالبيانات" : "7. Data Retention Period",
        },
        {
            id: "user-rights",
            icon: UserCheck,
            title: isAr ? "8. حقوق المستخدمين والمحامين" : "8. User & Lawyer Rights",
        },
        {
            id: "cookies",
            icon: Cookie,
            title: isAr ? "9. ملفات تعريف الارتباط والتحليلات" : "9. Cookies & Analytics",
        },
        {
            id: "modifications",
            icon: RefreshCw,
            title: isAr ? "10. التعديلات على هذه السياسة" : "10. Policy Amendments",
        },
        {
            id: "contact",
            icon: Mail,
            title: isAr ? "11. التواصل ومسؤول حماية البيانات" : "11. Contact & DPO",
        },
    ];

    return (
        <div
            className="min-h-screen bg-dashboard-background text-dashboard-foreground selection:bg-dashboard-primary/30 selection:text-dashboard-foreground font-sans relative"
            dir={isRTL ? "rtl" : "ltr"}
        >
            {/* Top Navigation Bar */}
            <header className="sticky top-0 inset-x-0 z-50 bg-dashboard-background/85 backdrop-blur-xl border-b border-dashboard-border px-6 md:px-12 py-3.5 flex items-center justify-between print:hidden">
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
                    {/* Language Switcher */}
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashboard-border bg-dashboard-card hover:bg-dashboard-secondary text-dashboard-foreground text-xs font-semibold transition-all cursor-pointer"
                        title={isAr ? "Switch to English" : "التحويل إلى العربية"}
                    >
                        <Globe className="w-3.5 h-3.5 text-dashboard-primary" />
                        <span>{isAr ? "English" : "العربية"}</span>
                    </button>

                    {/* Print Button */}
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashboard-border bg-dashboard-card hover:bg-dashboard-secondary text-dashboard-foreground text-xs font-semibold transition-all cursor-pointer"
                        title={isAr ? "طباعة السياسة" : "Print Policy"}
                    >
                        <Printer className="w-3.5 h-3.5 text-dashboard-muted-foreground" />
                        <span className="hidden sm:inline">
                            {isAr ? "طباعة" : "Print"}
                        </span>
                    </button>

                    {/* Login / Dashboard Link */}
                    <Link
                        to="/login"
                        className="text-xs font-bold bg-dashboard-primary hover:bg-dashboard-primary/90 text-white px-4 py-1.5 rounded-xl transition-all shadow-xs"
                    >
                        {isAr ? "تسجيل الدخول" : "Sign In"}
                    </Link>
                </div>
            </header>

            {/* Hero Section Header */}
            <div className="relative border-b border-dashboard-border/60 bg-dashboard-card/40 py-12 px-6 md:px-12 overflow-hidden">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-dashboard-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dashboard-primary/10 border border-dashboard-primary/20 text-dashboard-primary text-xs font-bold mb-4">
                        <Shield className="w-3.5 h-3.5" />
                        <span>
                            {isAr
                                ? "وثيقة قانونية معتمدة ومتوافقة مع المعايير الدولية"
                                : "Official Legal & Regulatory Compliance Document"}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black text-dashboard-foreground tracking-tight leading-tight mb-4">
                        {isAr
                            ? "سياسة الخصوصية وحماية البيانات"
                            : "Privacy & Data Protection Policy"}
                    </h1>

                    <p className="text-sm md:text-base text-dashboard-muted-foreground max-w-3xl leading-relaxed">
                        {isAr
                            ? "تلتزم منصة نوتة (NOTA) بأعلى معايير حماية البيانات وسرية العمل القضائي والمصرفي للمحامين والمستخدمين. توضح هذه الوثيقة التزامنا الصارم بحماية هويتك، بيانات قضاياك، ومستنداتك القانونية."
                            : "Nota Platform is committed to the highest standards of data protection and judicial confidentiality for lawyers and clients. This policy outlines our strict adherence to safeguarding your identity, case documents, and legal workflows."}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-dashboard-border text-xs text-dashboard-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-dashboard-primary" />
                            <span>
                                {isAr ? "آخر تحديث: 25 أغسطس 2026" : "Last Updated: August 25, 2026"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>
                                {isAr ? "الإصدار: 2.4 (ساري المفعول)" : "Version: 2.4 (Active)"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-dashboard-muted-foreground" />
                            <span>
                                {isAr ? "النطاق القضائي: جمهورية مصر العربية والشرق الأوسط" : "Jurisdiction: Egypt & Middle East Regulatory Framework"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="max-w-6xl mx-auto px-6 md:px-12 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Sticky Table of Contents (Desktop Sidebar) */}
                    <aside className="lg:col-span-4 sticky top-20 hidden lg:block bg-dashboard-card border border-dashboard-border rounded-2xl p-5 shadow-xs">
                        <h2 className="text-xs font-extrabold uppercase tracking-wider text-dashboard-muted-foreground mb-4">
                            {isAr ? "فهرس أقسام الوثيقة" : "Table of Contents"}
                        </h2>
                        <nav className="space-y-1">
                            {sections.map((sec) => {
                                const Icon = sec.icon;
                                const isCurrent = activeSection === sec.id;
                                return (
                                    <button
                                        key={sec.id}
                                        onClick={() => scrollToSection(sec.id)}
                                        className={`w-full text-start flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                            isCurrent
                                                ? "bg-dashboard-primary text-white shadow-xs"
                                                : "text-dashboard-muted-foreground hover:bg-dashboard-secondary hover:text-dashboard-foreground"
                                        }`}
                                    >
                                        <Icon className="w-3.5 h-3.5 shrink-0" />
                                        <span className="truncate">{sec.title}</span>
                                    </button>
                                );
                            })}
                        </nav>

                        <div className="mt-6 pt-4 border-t border-dashboard-border/60 bg-dashboard-background/50 p-3 rounded-xl">
                            <div className="flex items-center gap-2 text-xs font-bold text-dashboard-foreground mb-1">
                                <Lock className="w-3.5 h-3.5 text-dashboard-primary" />
                                <span>{isAr ? "تشفير تام 256-bit" : "256-bit AES Encryption"}</span>
                            </div>
                            <p className="text-[11px] text-dashboard-muted-foreground leading-relaxed">
                                {isAr
                                    ? "جميع المذكرات ومستندات القضايا مشفرة طرفياً ومخزنة في خوادم معتمدة."
                                    : "All legal briefs and courtroom documents are end-to-end encrypted at rest and in transit."}
                            </p>
                        </div>
                    </aside>

                    {/* Policy Body */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Section 1: Intro */}
                        <section id="intro" className="scroll-mt-24 space-y-4">
                            <div className="flex items-center gap-2.5 text-dashboard-primary">
                                <Shield className="w-5 h-5" />
                                <h2 className="text-xl font-bold text-dashboard-foreground">
                                    {isAr ? "1. مقدمة ونطاق التطبيق" : "1. Introduction & Scope"}
                                </h2>
                            </div>
                            <div className="prose prose-invert max-w-none text-xs md:text-sm text-dashboard-muted-foreground leading-relaxed space-y-3">
                                <p>
                                    {isAr
                                        ? "أهلاً بك في منصة نوتة («نوتة»، «المنصة»، «نحن»). نحن ندرك تماماً الحساسية البالغة للعمل القانوني والقضائي، ونضع حماية خصوصية المحامين، الموكلين، والزملاء في مقدمة أولوياتنا التشغيلية والتقنية."
                                        : "Welcome to Nota Platform ('Nota', 'Platform', 'we', 'our'). We recognize the sensitive nature of legal practice and judicial representation, placing the privacy of lawyers, law firms, and clients at the forefront of our engineering and operational standards."}
                                </p>
                                <p>
                                    {isAr
                                        ? "تسري سياسة الخصوصية هذه على جميع خدمات المنصة، بما يشمل لوحة تحكم المحامين، نظام إدارة الإنابات القضائية (Court Delegations)، مكتبة النماذج والصيغ القانونية، المحفظة المالية الرقمية، وتطبيق الهواتف الذكية."
                                        : "This Privacy Policy applies to all services offered across the platform, including the lawyer dashboard, judicial delegations management (Notas), legal templates repository, digital escrow wallet, and mobile applications."}
                                </p>
                            </div>
                        </section>

                        {/* Section 2: Data Collected */}
                        <section id="data-collected" className="scroll-mt-24 space-y-4">
                            <div className="flex items-center gap-2.5 text-dashboard-primary">
                                <FileText className="w-5 h-5" />
                                <h2 className="text-xl font-bold text-dashboard-foreground">
                                    {isAr ? "2. البيانات والمعلومات التي نجمعها" : "2. Information We Collect"}
                                </h2>
                            </div>
                            <div className="text-xs md:text-sm text-dashboard-muted-foreground leading-relaxed space-y-4">
                                <p>
                                    {isAr
                                        ? "نقوم بجمع البيانات الضرورية فقط لتقديم الخدمات القانونية الموثوقة والتحقق من الهوية المهنية وفقاً للتصنيفات الآتية:"
                                        : "We collect only data strictly necessary to deliver verified legal services, identity authentication, and workflow execution categorized as follows:"}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="p-4 rounded-xl bg-dashboard-card border border-dashboard-border space-y-2">
                                        <span className="font-bold text-dashboard-foreground text-xs block">
                                            {isAr ? "أ. بيانات الهوية والقيد النقابي" : "A. Identity & Bar Registration"}
                                        </span>
                                        <p className="text-xs text-dashboard-muted-foreground">
                                            {isAr
                                                ? "الاسم الكامل، رقم القيد بنقابة المحامين، الدرجة القضائية (ابتدائي، استئناف، نقض)، صورة كارنيه النقابة، وبطاقة الرقم القومي."
                                                : "Full name, Bar registration number, advocacy degree (Primary, Appeal, Cassation), Bar card copy, and national identification."}
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-dashboard-card border border-dashboard-border space-y-2">
                                        <span className="font-bold text-dashboard-foreground text-xs block">
                                            {isAr ? "ب. بيانات الإنابات القضائية والقضايا" : "B. Case & Delegation Data"}
                                        </span>
                                        <p className="text-xs text-dashboard-muted-foreground">
                                            {isAr
                                                ? "رقم القضية، المحكمة والدائرة المختصة، تاريخ الجلسة، الطلبات والمذكرات المرفقة، وبيانات المحامي المنيب والمناب."
                                                : "Case index number, competent court and circuit, hearing date, attached legal briefs, and delegating/receiving attorney details."}
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-dashboard-card border border-dashboard-border space-y-2">
                                        <span className="font-bold text-dashboard-foreground text-xs block">
                                            {isAr ? "ج. البيانات المالية والمحفظة" : "C. Financial & Wallet Data"}
                                        </span>
                                        <p className="text-xs text-dashboard-muted-foreground">
                                            {isAr
                                                ? "سجلات المعاملات، رصيد المحفظة، أتعاب الإنابات، والتحويلات البنكية. (لا نقوم بتخزين أرقام البطاقات الائتمانية الكاملة)."
                                                : "Transaction records, wallet balances, delegation escrow fees, and settlement payouts (Full credit card numbers are never stored)."}
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-dashboard-card border border-dashboard-border space-y-2">
                                        <span className="font-bold text-dashboard-foreground text-xs block">
                                            {isAr ? "د. البيانات الفنية والسجلات" : "D. Technical & Log Data"}
                                        </span>
                                        <p className="text-xs text-dashboard-muted-foreground">
                                            {isAr
                                                ? "عنوان بروتوكول الإنترنت (IP)، نوع المتصفح والجهاز، سجل تسجيل الدخول، والإشعارات لضمان أمان الجلسات."
                                                : "IP addresses, browser/device types, authentication audit logs, and push notification tokens for security audits."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Data Usage */}
                        <section id="data-usage" className="scroll-mt-24 space-y-4">
                            <div className="flex items-center gap-2.5 text-dashboard-primary">
                                <Eye className="w-5 h-5" />
                                <h2 className="text-xl font-bold text-dashboard-foreground">
                                    {isAr ? "3. أغراض استخدام ومعالجة البيانات" : "3. Purposes of Data Processing"}
                                </h2>
                            </div>
                            <div className="text-xs md:text-sm text-dashboard-muted-foreground leading-relaxed space-y-2">
                                <ul className="list-disc list-inside space-y-2 ltr:pl-2 rtl:pr-2">
                                    <li>
                                        <strong className="text-dashboard-foreground">
                                            {isAr ? "التحقق والتوثيق المهني:" : "Professional Verification:"}
                                        </strong>{" "}
                                        {isAr
                                            ? "التأكد من سريان القيد بنقابة المحامين وحماية المجتمع القانوني من انتحال الصفة."
                                            : "Verifying active Bar association standing and preventing unauthorized practice of law."}
                                    </li>
                                    <li>
                                        <strong className="text-dashboard-foreground">
                                            {isAr ? "تسهيل الإنابات القضائية:" : "Facilitating Judicial Delegations:"}
                                        </strong>{" "}
                                        {isAr
                                            ? "ربط المحامين الزملاء لحضور الجلسات في المحافظات المختلفة وتقديم التقارير الفورية."
                                            : "Connecting peer attorneys across geographic governorates for court appearances and instant reports."}
                                    </li>
                                    <li>
                                        <strong className="text-dashboard-foreground">
                                            {isAr ? "حماية المدفوعات والضمان المالي (Escrow):" : "Escrow & Payment Protection:"}
                                        </strong>{" "}
                                        {isAr
                                            ? "حفظ أتعاب الإنابة في حساب وسيط حتى إتمام الإجراء ورفع محضر الجلسة المعتمد."
                                            : "Holding delegation fees securely in escrow until judicial verification and hearing minutes submission."}
                                    </li>
                                    <li>
                                        <strong className="text-dashboard-foreground">
                                            {isAr ? "الأمان ومكافحة الاحتيال:" : "Security & Fraud Prevention:"}
                                        </strong>{" "}
                                        {isAr
                                            ? "مراقبة الأنشطة المشبوهة، حماية حسابات المشتركين، وإجراء التدقيق الدوري للأنظمة."
                                            : "Monitoring suspicious access attempts, auditing system access, and maintaining tenant isolation."}
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 4: Legal Privilege & Immunity */}
                        <section id="legal-privilege" className="scroll-mt-24 space-y-4">
                            <div className="flex items-center gap-2.5 text-dashboard-primary">
                                <Scale className="w-5 h-5" />
                                <h2 className="text-xl font-bold text-dashboard-foreground">
                                    {isAr ? "4. السرية المهنية وحصانة ملفات القضايا" : "4. Legal Privilege & Case Immunity"}
                                </h2>
                            </div>
                            <div className="p-5 rounded-2xl bg-dashboard-primary/10 border border-dashboard-primary/30 space-y-3">
                                <div className="flex items-center gap-2 font-bold text-dashboard-foreground text-sm">
                                    <Lock className="w-4 h-4 text-dashboard-primary" />
                                    <span>
                                        {isAr ? "ميثاق السرية المهنية للمحاماة" : "Strict Attorney-Client Privilege"}
                                    </span>
                                </div>
                                <p className="text-xs md:text-sm text-dashboard-foreground/90 leading-relaxed">
                                    {isAr
                                        ? "تعتبر منصة نوتة جميع مستندات القضايا والمذكرات والمعلومات المتبادلة بين المحامين مشمولة بحصانة السر المهني المنصوص عليها في قانون المحاماة والتشريعات المنظمة. لا يجوز لأي موظف في المنصة الاطلاع على محتوى المستندات القضائية دون إذن كتابي صريح من صاحب الحساب لغرض الدعم الفني."
                                        : "Nota treats all case briefs, evidence files, and communications exchanged between attorneys as privileged materials protected under national legal advocacy statutes. No platform staff member may inspect case contents without explicit written consent from the lawyer for designated technical support."}
                                </p>
                            </div>
                        </section>

                        {/* Section 5: Data Sharing */}
                        <section id="data-sharing" className="scroll-mt-24 space-y-4">
                            <div className="flex items-center gap-2.5 text-dashboard-primary">
                                <Share2 className="w-5 h-5" />
                                <h2 className="text-xl font-bold text-dashboard-foreground">
                                    {isAr ? "5. مشاركة البيانات مع أطراف ثالثة" : "5. Third-Party Disclosures"}
                                </h2>
                            </div>
                            <div className="text-xs md:text-sm text-dashboard-muted-foreground leading-relaxed space-y-3">
                                <p>
                                    {isAr
                                        ? "نحن لا نبيع أو نؤجر بياناتك الشخصية أو المهنية لأي جهة إعلانية أو تجارية. تقتصر مشاركة البيانات على الحالات التالية:"
                                        : "We do not sell, rent, or trade your personal or professional data with advertisers or brokers. Disclosures occur exclusively in the following scenarios:"}
                                </p>
                                <ul className="list-disc list-inside space-y-1.5 ltr:pl-2 rtl:pr-2">
                                    <li>
                                        <strong className="text-dashboard-foreground">
                                            {isAr ? "المحامي المناب في الجلسة:" : "The Appointed Court Delegate:"}
                                        </strong>{" "}
                                        {isAr
                                            ? "يتم مشاركة بيانات القضية والمحكمة اللازمة لحضور الجلسة فقط."
                                            : "Only the case facts and hearing requirements needed to fulfill the delegation."}
                                    </li>
                                    <li>
                                        <strong className="text-dashboard-foreground">
                                            {isAr ? "بوابات الدفع الإلكتروني المعتمدة:" : "Regulated Payment Gateways:"}
                                        </strong>{" "}
                                        {isAr
                                            ? "لمعالجة عمليات شحن الرصيد والتحويلات وفقاً لتعليمات البنك المركزي."
                                            : "Processing wallet top-ups and bank settlements under Central Bank regulatory oversight."}
                                    </li>
                                    <li>
                                        <strong className="text-dashboard-foreground">
                                            {isAr ? "الامتثال لأوامر قضائية ملزمة:" : "Binding Judicial Orders:"}
                                        </strong>{" "}
                                        {isAr
                                            ? "عند ورود أمر قضائي رسمي مسبب صادر من محكمة مختصة أو النيابة العامة."
                                            : "When responding to formal, valid subpoenas or judicial warrants issued by competent courts."}
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 6: Security & Storage */}
                        <section id="security" className="scroll-mt-24 space-y-4">
                            <div className="flex items-center gap-2.5 text-dashboard-primary">
                                <Lock className="w-5 h-5" />
                                <h2 className="text-xl font-bold text-dashboard-foreground">
                                    {isAr ? "6. أمان وتشفير وتخزين البيانات" : "6. Data Security & Storage"}
                                </h2>
                            </div>
                            <div className="text-xs md:text-sm text-dashboard-muted-foreground leading-relaxed space-y-3">
                                <p>
                                    {isAr
                                        ? "نعتمد بنية تحتية سحابية متطورة توفر عزل كامل للبيانات (Multi-Tenancy Isolation) مع تشفير TLS 1.3 أثناء النقل وتشفير AES-256 أثناء التخزين، بالإضافة إلى نسخ احتياطي مشفر دورياً في مراكز بيانات متوافقة مع معايير ISO 27001 و SOC 2."
                                        : "We utilize advanced multi-tenancy architecture with dedicated schema isolation, TLS 1.3 transmission encryption, AES-256 rest encryption, and regular encrypted backups within ISO 27001 and SOC 2 certified data centers."}
                                </p>
                            </div>
                        </section>

                        {/* Section 7: Retention */}
                        <section id="retention" className="scroll-mt-24 space-y-4">
                            <div className="flex items-center gap-2.5 text-dashboard-primary">
                                <Clock className="w-5 h-5" />
                                <h2 className="text-xl font-bold text-dashboard-foreground">
                                    {isAr ? "7. مدة الاحتفاظ بالبيانات" : "7. Data Retention Period"}
                                </h2>
                            </div>
                            <div className="text-xs md:text-sm text-dashboard-muted-foreground leading-relaxed space-y-2">
                                <p>
                                    {isAr
                                        ? "نحتفظ ببيانات حسابك وملفات الإنابات طوال فترة سريان حسابك لتمكينك من الرجوع إلى أرشيفك القضائي وسجلاتك المالية. يمكنك طلب حذف حسابك أو أرشفة قضايا معينة في أي وقت من خلال لوحة التحكم أو التواصل مع فريق الدعم."
                                        : "We retain account data and delegation archives throughout the lifespan of your active subscription to maintain your legal and accounting records. You may request account closure or data purging at any time via settings or support."}
                                </p>
                            </div>
                        </section>

                        {/* Section 8: User Rights */}
                        <section id="user-rights" className="scroll-mt-24 space-y-4">
                            <div className="flex items-center gap-2.5 text-dashboard-primary">
                                <UserCheck className="w-5 h-5" />
                                <h2 className="text-xl font-bold text-dashboard-foreground">
                                    {isAr ? "8. حقوق المستخدمين والمحامين" : "8. User & Lawyer Rights"}
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div className="p-3.5 rounded-xl bg-dashboard-card border border-dashboard-border space-y-1">
                                    <span className="font-bold text-dashboard-foreground block">
                                        {isAr ? "حق الوصول والاطلاع" : "Right of Access"}
                                    </span>
                                    <span className="text-dashboard-muted-foreground">
                                        {isAr ? "الاطلاع على جميع البيانات والتقارير المرتبطة بحسابك." : "Inspect all stored personal details, delegations, and logs."}
                                    </span>
                                </div>
                                <div className="p-3.5 rounded-xl bg-dashboard-card border border-dashboard-border space-y-1">
                                    <span className="font-bold text-dashboard-foreground block">
                                        {isAr ? "حق التصحيح والتعديل" : "Right to Rectification"}
                                    </span>
                                    <span className="text-dashboard-muted-foreground">
                                        {isAr ? "تحديث بيانات القيد، أرقام التواصل، والبيانات البنكية." : "Update your bar branch, phone numbers, and profile info."}
                                    </span>
                                </div>
                                <div className="p-3.5 rounded-xl bg-dashboard-card border border-dashboard-border space-y-1">
                                    <span className="font-bold text-dashboard-foreground block">
                                        {isAr ? "حق الحذف والنسيان" : "Right to Erasure"}
                                    </span>
                                    <span className="text-dashboard-muted-foreground">
                                        {isAr ? "طلب مسح بياناتك غير الملزم حفظها قانونياً أو ضريبياً." : "Request removal of non-regulatory records upon closure."}
                                    </span>
                                </div>
                                <div className="p-3.5 rounded-xl bg-dashboard-card border border-dashboard-border space-y-1">
                                    <span className="font-bold text-dashboard-foreground block">
                                        {isAr ? "حق تصدير البيانات" : "Data Portability"}
                                    </span>
                                    <span className="text-dashboard-muted-foreground">
                                        {isAr ? "تصدير كشف حسابك وسجلات قضاياك بصيغة PDF / Excel." : "Export case ledger and financial transactions to PDF/Excel."}
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* Section 9: Cookies */}
                        <section id="cookies" className="scroll-mt-24 space-y-4">
                            <div className="flex items-center gap-2.5 text-dashboard-primary">
                                <Cookie className="w-5 h-5" />
                                <h2 className="text-xl font-bold text-dashboard-foreground">
                                    {isAr ? "9. ملفات تعريف الارتباط والتحليلات" : "9. Cookies & Analytics"}
                                </h2>
                            </div>
                            <div className="text-xs md:text-sm text-dashboard-muted-foreground leading-relaxed space-y-2">
                                <p>
                                    {isAr
                                        ? "نستخدم ملفات تعريف الارتباط (Cookies) الضرورية فقط لإبقاء جلستك نشطة وآمنة، وتفضيلات اللغة والوضع الليلي. لا نستخدم أي ملفات تتبع لجهات إعلانية خارجية تخترق خصوصيتك."
                                        : "We utilize strictly necessary cookies to maintain secure authentication sessions, preferred language, and theme tokens. No intrusive third-party advertising tracking cookies are deployed."}
                                </p>
                            </div>
                        </section>

                        {/* Section 10: Modifications */}
                        <section id="modifications" className="scroll-mt-24 space-y-4">
                            <div className="flex items-center gap-2.5 text-dashboard-primary">
                                <RefreshCw className="w-5 h-5" />
                                <h2 className="text-xl font-bold text-dashboard-foreground">
                                    {isAr ? "10. التعديلات على هذه السياسة" : "10. Policy Amendments"}
                                </h2>
                            </div>
                            <div className="text-xs md:text-sm text-dashboard-muted-foreground leading-relaxed space-y-2">
                                <p>
                                    {isAr
                                        ? "قد نقوم بتحديث سياسة الخصوصية هذه دورياً لمواكبة التحديثات التشريعية وتطوير خدماتنا. سنقوم بإشعارك بأي تعديلات جوهرية عبر البريد الإلكتروني أو إشعار داخل لوحة التحكم قبل سريانها."
                                        : "We may update this privacy policy periodically to reflect statutory updates and new feature releases. Material changes will be communicated via email or in-app notification before taking effect."}
                                </p>
                            </div>
                        </section>

                        {/* Section 11: Contact */}
                        <section id="contact" className="scroll-mt-24 space-y-4">
                            <div className="flex items-center gap-2.5 text-dashboard-primary">
                                <Mail className="w-5 h-5" />
                                <h2 className="text-xl font-bold text-dashboard-foreground">
                                    {isAr ? "11. التواصل ومسؤول حماية البيانات" : "11. Contact Information & DPO"}
                                </h2>
                            </div>
                            <div className="p-5 rounded-2xl bg-dashboard-card border border-dashboard-border space-y-4">
                                <p className="text-xs md:text-sm text-dashboard-muted-foreground">
                                    {isAr
                                        ? "إذا كانت لديك أي استفسارات أو طلبات تتعلق ببياناتك الشخصية أو ممارسة حقوقك القانونية، يمكنك التواصل مباشرة مع مسؤول حماية البيانات (DPO):"
                                        : "If you have any questions or data access requests, contact our Data Protection Officer (DPO) directly:"}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                    <div className="flex items-center gap-2 p-3 rounded-xl bg-dashboard-background border border-dashboard-border">
                                        <Mail className="w-4 h-4 text-dashboard-primary shrink-0" />
                                        <div>
                                            <span className="text-[10px] text-dashboard-muted-foreground block">
                                                {isAr ? "البريد الإلكتروني للخصوصية" : "Privacy Email"}
                                            </span>
                                            <a
                                                href="mailto:privacy@nota.legal"
                                                className="font-bold text-dashboard-foreground hover:text-dashboard-primary transition-colors"
                                            >
                                                privacy@nota.legal
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 rounded-xl bg-dashboard-background border border-dashboard-border">
                                        <Phone className="w-4 h-4 text-dashboard-primary shrink-0" />
                                        <div>
                                            <span className="text-[10px] text-dashboard-muted-foreground block">
                                                {isAr ? "الدعم القانوني والامتثال" : "Legal Compliance"}
                                            </span>
                                            <span className="font-bold text-dashboard-foreground">
                                                +20 (100) 000-NOTA
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* Scroll to Top Floating Button */}
            {showScrollTop && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="fixed bottom-6 ltr:right-6 rtl:left-6 z-40 w-10 h-10 rounded-full bg-dashboard-primary text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all cursor-pointer print:hidden"
                    title={isAr ? "الرجوع للأعلى" : "Back to top"}
                >
                    <ArrowUp className="w-4 h-4" />
                </button>
            )}

            {/* Footer */}
            <footer className="border-t border-dashboard-border/60 py-10 px-6 md:px-12 text-center text-xs text-dashboard-muted-foreground bg-dashboard-card/20 print:hidden">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 font-extrabold text-dashboard-foreground text-sm">
                        <div className="w-6 h-6 rounded-md bg-dashboard-primary flex items-center justify-center font-bold text-xs text-white">
                            NO
                        </div>
                        <span>NOTA</span>
                    </div>
                    <p>
                        &copy; {new Date().getFullYear()} NOTA Legal Platform. {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}
                    </p>
                </div>
            </footer>
        </div>
    );
}
