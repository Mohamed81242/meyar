import React from "react";

interface Step {
    number: string;
    title: string;
    description: string;
}

const STEPS: Step[] = [
    {
        number: "01",
        title: "سجّل بياناتك وتحقق برقم القيد",
        description:
            "أنشئ حسابك وأدخل رقم قيدك في نقابة المحامين. فريق نوتة يتحقق من الرقم قبل تفعيل الحساب بالكامل.",
    },
    {
        number: "02",
        title: "انشر طلبك أو تصفح الطلبات القريبة",
        description:
            "اطلب من ينوب عنك في جلسة أو نوتة، أو تصفح طلبات الزملاء القريبين من محافظتك واختر ما يناسب وقتك.",
    },
    {
        number: "03",
        title: "اتفق وتابع من داخل التطبيق",
        description:
            "حدد الأجر والتفاصيل عبر المحادثة الآمنة، وتابع تنفيذ النوتة وتقرير الجلسة والتقييم في مكان واحد.",
    },
];

export const HowItWorks: React.FC = () => {
    return (
        <section
            className="py-20 sm:py-24"
            style={{
                backgroundColor: "#0F1B2D",
                color: "#FFFFFF",
            }}
            id="how-it-works"
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="max-w-2xl mx-auto text-center mb-14 sm:mb-16">
                    <div
                        className="inline-flex items-center gap-2 font-bold text-xs px-4 py-1.5 rounded-full mb-4 border"
                        style={{
                            color: "#F0DFAE",
                            backgroundColor: "rgba(240, 223, 174, 0.12)",
                            borderColor: "rgba(240, 223, 174, 0.28)",
                        }}
                    >
                        <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: "#F0DFAE" }}
                        />
                        <span>طريقة العمل</span>
                    </div>
                    <h2
                        className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl leading-snug"
                        style={{ color: "#FFFFFF" }}
                    >
                        ثلاث خطوات، من التسجيل إلى إنجاز أول نوتة
                    </h2>
                    <p
                        className="mt-4 text-base leading-relaxed"
                        style={{ color: "rgba(255, 255, 255, 0.6)" }}
                    >
                        لا تعقيد ولا خطوات غامضة — رحلتك داخل نوتة واضحة من أول لحظة.
                    </p>
                </div>

                {/* Steps 3-Column List */}
                <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 list-none p-0 m-0">
                    {STEPS.map((step) => (
                        <li
                            key={step.number}
                            className="border rounded-2xl p-7 flex flex-col items-start text-right transition-colors"
                            style={{
                                backgroundColor: "rgba(255, 255, 255, 0.04)",
                                borderColor: "rgba(255, 255, 255, 0.1)",
                                color: "#FFFFFF",
                            }}
                        >
                            <span
                                className="font-serif font-black text-3xl sm:text-4xl"
                                style={{ color: "#B8923D" }}
                            >
                                {step.number}
                            </span>
                            <h3
                                className="font-bold text-lg mt-4 leading-snug"
                                style={{ color: "#FFFFFF" }}
                            >
                                {step.title}
                            </h3>
                            <p
                                className="mt-3 text-sm leading-relaxed"
                                style={{ color: "rgba(255, 255, 255, 0.6)" }}
                            >
                                {step.description}
                            </p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
};

export default HowItWorks;
