import React from "react";
import {
    IconBriefcase,
    IconGavel,
    IconShieldCheck,
    IconUsers,
    IconBell,
    IconDocument,
    IconChat,
    IconStar,
} from "./Icons";
import { FEATURES } from "../data/features";
import type { Feature } from "../types/landing.types";

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
    briefcase: IconBriefcase,
    gavel: IconGavel,
    shieldCheck: IconShieldCheck,
    users: IconUsers,
    bell: IconBell,
    document: IconDocument,
    chat: IconChat,
    star: IconStar,
};

const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => {
    const Icon = ICON_MAP[feature.icon] ?? IconDocument;
    return (
        <article
            className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-20px_rgba(15,27,45,0.25)] flex flex-col items-start text-right group border"
            style={{
                backgroundColor: "#FFFFFF",
                borderColor: "rgba(15, 27, 45, 0.1)",
                color: "#0F1B2D",
            }}
        >
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:!bg-[#B8923D] group-hover:!text-white"
                style={{
                    backgroundColor: "rgba(184, 146, 61, 0.12)",
                    color: "#96742C",
                }}
            >
                <Icon className="w-5 h-5" />
            </div>
            <h3
                className="font-bold text-base leading-snug"
                style={{ color: "#0F1B2D" }}
            >
                {feature.title}
            </h3>
            <p
                className="mt-2.5 text-sm leading-relaxed"
                style={{ color: "#5B6474" }}
            >
                {feature.description}
            </p>
        </article>
    );
};

export const Features: React.FC = () => {
    return (
        <section
            className="py-20 sm:py-24"
            style={{ backgroundColor: "#F6F4EF" }}
            id="features"
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="max-w-2xl mx-auto text-center mb-14 sm:mb-16">
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
                        <span>كل ما يحتاجه المحامي</span>
                    </div>
                    <h2
                        className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl leading-snug"
                        style={{ color: "#0F1B2D" }}
                    >
                        مميزات مصممة خصيصًا لعمل المحاماة اليومي
                    </h2>
                    <p
                        className="mt-4 text-base leading-relaxed"
                        style={{ color: "#5B6474" }}
                    >
                        من أول طلب نوتة إلى بناء سمعتك المهنية — كل أداة في نوتة
                        مبنية حول احتياج حقيقي لمحامٍ يمارس المهنة كل يوم.
                    </p>
                </div>

                {/* Features 4x2 Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                    {FEATURES.map((feature) => (
                        <FeatureCard key={feature.id} feature={feature} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
