import React from "react";
import { IconApple, IconGooglePlay } from "./Icons";
import type { StoreLink } from "../types/landing.types";

const STORE_LINKS: StoreLink[] = [
    {
        id: "appStore",
        label: "App Store",
        subLabel: "حمّله من",
        href: "#",
    },
    {
        id: "googlePlay",
        label: "Google Play",
        subLabel: "احصل عليه من",
        href: "#",
    },
];

export const AppDownload: React.FC = () => {
    return (
        <section
            className="py-20 sm:py-24"
            style={{ backgroundColor: "#F6F4EF" }}
            id="download"
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className="border rounded-3xl p-8 sm:p-12 lg:p-14 shadow-[0_24px_48px_-24px_rgba(15,27,45,0.15)] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
                    style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "rgba(15, 27, 45, 0.1)",
                        color: "#0F1B2D",
                    }}
                >
                    {/* Copy & Store Buttons */}
                    <div className="lg:col-span-7 text-right">
                        <div
                            className="inline-flex items-center gap-2 font-bold text-xs px-4 py-1.5 rounded-full mb-4 border"
                            style={{
                                color: "#96742C",
                                backgroundColor: "rgba(184, 146, 61, 0.1)",
                                borderColor: "rgba(184, 146, 61, 0.25)",
                            }}
                        >
                            <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: "#B8923D" }}
                            />
                            <span>التطبيق قيد الإطلاق التدريجي</span>
                        </div>
                        <h2
                            className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl leading-snug"
                            style={{ color: "#0F1B2D" }}
                        >
                            حمّل نوتة وابدأ التعامل مع شبكة المحامين اليوم
                        </h2>
                        <p
                            className="mt-4 text-base leading-relaxed"
                            style={{ color: "#5B6474" }}
                        >
                            التطبيق متاح تدريجيًا في المحافظات، ويُفتح الوصول الكامل أولًا
                            لمن سجّل في قائمة الانتظار. حمّله الآن أو احجز مكانك بالأسفل.
                        </p>

                        {/* Store Buttons */}
                        <div className="flex flex-wrap items-center gap-4 mt-8">
                            {STORE_LINKS.map((store) => {
                                const Icon = store.id === "appStore" ? IconApple : IconGooglePlay;
                                return (
                                    <a
                                        key={store.id}
                                        href={store.href}
                                        className="inline-flex items-center gap-3 px-5 py-3 rounded-xl transition-all hover:-translate-y-0.5 shadow-md"
                                        style={{
                                            backgroundColor: "#0F1B2D",
                                            color: "#FFFFFF",
                                        }}
                                        aria-label={`${store.subLabel} ${store.label}`}
                                    >
                                        <Icon className="w-6 h-6 shrink-0" />
                                        <span className="flex flex-col text-right">
                                            <small className="text-[10.5px] font-medium leading-none mb-1 text-white/60">
                                                {store.subLabel}
                                            </small>
                                            <span className="text-sm font-bold leading-none text-white">
                                                {store.label}
                                            </span>
                                        </span>
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Side Info Box */}
                    <div
                        className="lg:col-span-5 border border-dashed rounded-2xl p-6 sm:p-8 text-right"
                        style={{
                            backgroundColor: "#F6F4EF",
                            borderColor: "rgba(15, 27, 45, 0.15)",
                        }}
                    >
                        <p
                            className="text-sm leading-relaxed mb-6"
                            style={{ color: "#5B6474" }}
                        >
                            لسه مش موجود على المتجرين رسميًا؟ سجّل في قائمة الانتظار وهنبعتلك
                            رابط التحميل أول ما يبقى متاح في محافظتك.
                        </p>
                        <a
                            href="#waitlist"
                            className="inline-flex items-center justify-center w-full font-bold text-sm px-6 py-3 rounded-xl border hover:bg-black/5 transition-all"
                            style={{
                                backgroundColor: "transparent",
                                color: "#0F1B2D",
                                borderColor: "rgba(15, 27, 45, 0.25)",
                            }}
                        >
                            سجّل في قائمة الانتظار
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AppDownload;
