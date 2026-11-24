import React from "react";
import appMockupImg from "@/assets/images/Screenshot 2026-09-01 141149.png";
import { IconCheck, IconMapPin, IconShieldCheck } from "./Icons";

interface HeroProps {
    waitlistCount: number;
}

export const Hero: React.FC<HeroProps> = ({ waitlistCount }) => {
    return (
        <section
            className="pt-16 pb-14 sm:pt-20 sm:pb-20 relative overflow-hidden"
            style={{
                backgroundColor: "#F6F4EF",
                backgroundImage:
                    "radial-gradient(900px 480px at 82% -10%, rgba(184, 146, 61, 0.14), transparent 60%)",
            }}
            id="top"
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    {/* Hero Left Content Column */}
                    <div className="lg:col-span-7 flex flex-col items-start text-right">
                        {/* Eyebrow Pill */}
                        <div
                            className="inline-flex items-center gap-2 font-bold text-xs sm:text-[13px] px-4 py-1.5 rounded-full mb-5 border"
                            style={{
                                color: "#96742C",
                                backgroundColor: "rgba(184, 146, 61, 0.1)",
                                borderColor: "rgba(184, 146, 61, 0.25)",
                            }}
                        >
                            <span
                                className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse"
                                style={{ backgroundColor: "#B8923D" }}
                            />
                            <span>منصة المحامين الأولى من نوعها في مصر</span>
                        </div>

                        {/* Main Heading */}
                        <h1
                            className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl leading-[1.25] tracking-tight"
                            style={{ color: "#0F1B2D" }}
                        >
                            منصة لكل{" "}
                            <em
                                className="not-italic relative inline-block"
                                style={{ color: "#96742C" }}
                            >
                               المحامين
                            </em>
                        </h1>

                        {/* Lede Paragraph */}
                        <p
                            className="mt-5 text-base sm:text-lg leading-relaxed max-w-xl"
                            style={{ color: "#5B6474" }}
                        >
                            نوتة تجمع المحامين في مكان واحد: لتبادل الخبرات، و مساعدة الزملاء و اصدار و استلام النوتات , وبناء شبكة مهنية موثّقة — بسهولة وأمان،
                            من محافظتك أو من أي محافظة أخرى.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mt-8 w-full sm:w-auto">
                            <a
                                href="#download"
                                className="inline-flex items-center justify-center font-bold text-base px-7 py-3.5 rounded-xl shadow-[0_14px_26px_-10px_rgba(184,146,61,0.55)] transition-all hover:-translate-y-0.5 text-center"
                                style={{
                                    backgroundColor: "#B8923D",
                                    color: "#FFFFFF",
                                }}
                            >
                                حمّل التطبيق
                            </a>
                            <a
                                href="#waitlist"
                                className="inline-flex items-center justify-center font-bold text-base px-7 py-3.5 rounded-xl transition-all text-center border hover:bg-black/5"
                                style={{
                                    backgroundColor: "transparent",
                                    color: "#0F1B2D",
                                    borderColor: "rgba(15, 27, 45, 0.2)",
                                }}
                            >
                                انضم لقائمة الانتظار
                            </a>
                        </div>

                        {/* Trust Points */}
                        <ul className="mt-9 space-y-3.5 w-full list-none p-0">
                            <li
                                className="flex items-center gap-3 text-sm font-semibold"
                                style={{ color: "#17263D" }}
                            >
                                <span
                                    className="w-5 h-5 flex items-center justify-center shrink-0"
                                    style={{ color: "#96742C" }}
                                >
                                    <IconShieldCheck className="w-5 h-5" />
                                </span>
                                <span>توثيق برقم القيد بالنقابة</span>
                            </li>
                            <li
                                className="flex items-center gap-3 text-sm font-semibold"
                                style={{ color: "#17263D" }}
                            >
                                <span
                                    className="w-5 h-5 flex items-center justify-center shrink-0"
                                    style={{ color: "#96742C" }}
                                >
                                    <IconMapPin className="w-5 h-5" />
                                </span>
                                <span>تغطية 27 محافظة</span>
                            </li>
                            <li
                                className="flex items-center gap-3 text-sm font-semibold"
                                style={{ color: "#17263D" }}
                            >
                                <span
                                    className="w-5 h-5 flex items-center justify-center shrink-0"
                                    style={{ color: "#96742C" }}
                                >
                                    <IconCheck className="w-5 h-5" />
                                </span>
                                <span>
                                    {waitlistCount.toLocaleString("ar-EG")} محامٍ سجّلوا اهتمامهم
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Hero Right Visual Column - Compact iPhone Mockup */}
                    <div className="lg:col-span-5 relative flex justify-center lg:justify-end mt-6 lg:mt-0">
                        <div className="relative w-[230px] sm:w-[250px] transition-transform duration-500 ease-out hover:rotate-[-5deg] cursor-pointer">
                            {/* iPhone Hardware Side Buttons */}
                            <div className="absolute -left-[2.5px] top-18 w-[2.5px] h-5 bg-[#2E3748] rounded-l-xs" />
                            <div className="absolute -left-[2.5px] top-26 w-[2.5px] h-8 bg-[#2E3748] rounded-l-xs" />
                            <div className="absolute -left-[2.5px] top-38 w-[2.5px] h-8 bg-[#2E3748] rounded-l-xs" />
                            <div className="absolute -right-[2.5px] top-26 w-[2.5px] h-10 bg-[#2E3748] rounded-r-xs" />

                            {/* iPhone Outer Titanium Chassis */}
                            <div
                                className="rounded-[40px] p-2 shadow-[0_24px_50px_-12px_rgba(15,27,45,0.45),0_0_0_1px_rgba(255,255,255,0.12)] border-[1.5px]"
                                style={{
                                    backgroundColor: "#161D26",
                                    borderColor: "#283442",
                                }}
                            >
                                {/* iPhone Inner Screen Bezel with Safe Area */}
                                <div
                                    className="rounded-[32px] overflow-hidden relative shadow-inner pt-10"
                                    style={{ backgroundColor: "#F6F4EF" }}
                                >
                                    {/* iPhone Top Status Bar & Dynamic Island */}
                                    <div
                                        dir="ltr"
                                        className="absolute top-0 inset-x-0 h-9 z-20 flex items-center justify-between px-4 pt-1 text-[9px] font-bold text-[#0F1B2D]/70 pointer-events-none select-none"
                                    >
                                        <span>9:41</span>
                                        {/* Dynamic Island */}
                                        <div className="w-16 h-3.5 bg-black rounded-full flex items-center justify-end px-1.5 shadow-xs">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#1A222D] ring-[0.5px] ring-white/10" />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="w-2.5 h-1.5 border border-[#0F1B2D]/70 rounded-[2px] inline-block p-[0.5px]">
                                                <span className="bg-[#0F1B2D]/70 w-full h-full block rounded-[1px]" />
                                            </span>
                                        </div>
                                    </div>

                                    {/* App Screen Content */}
                                    <img
                                        src={appMockupImg}
                                        alt="تطبيق نوتة والتكليفات"
                                        className="w-full h-auto object-cover block"
                                    />

                                    {/* iPhone Home Indicator Bar */}
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 w-20 h-0.5 bg-black/40 backdrop-blur-xs rounded-full" />
                                </div>
                            </div>

                            {/* Rotating Floating Seal Badge (Double Ring) */}
                            <div
                                className="absolute -bottom-4 -left-4 sm:-left-6 w-24 h-24 sm:w-26 sm:h-26 rounded-full border-2 outline outline-1 outline-offset-3 shadow-lg flex flex-col items-center justify-center text-center -rotate-6 transition-transform hover:rotate-0"
                                style={{
                                    backgroundColor: "#F6F4EF",
                                    borderColor: "#0F1B2D",
                                    outlineColor: "#0F1B2D",
                                }}
                            >
                                <span
                                    className="font-serif font-black text-xl sm:text-2xl leading-none"
                                    style={{ color: "#0F1B2D" }}
                                >
                                    {waitlistCount.toLocaleString("ar-EG")}
                                </span>
                                <span
                                    className="text-[9px] font-bold mt-0.5 max-w-[75px] leading-tight"
                                    style={{ color: "#5B6474" }}
                                >
                                    محامٍ في قائمة الانتظار
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
