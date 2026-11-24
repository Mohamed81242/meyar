import React from "react";
import { Link } from "react-router-dom";
import logoIcon from "@/assets/images/icon.png";

const FOOTER_LINKS = [
    {
        title: "المنصة",
        links: [
            { label: "المميزات", href: "#features", isExternal: false },
            { label: "طريقة العمل", href: "#how-it-works", isExternal: false },
            { label: "حمّل التطبيق", href: "#download", isExternal: false },
        ],
    },
    {
        title: "للمحامين",
        links: [
            { label: "قائمة الانتظار", href: "#waitlist", isExternal: false },

        ],
    },
    {
        title: "تواصل معنا",
        links: [
            { label: "info@tinaroun.com", href: "mailto:info@tinaroun.com", isExternal: true },
            { label: "01000019689", href: "tel:01000019689", isExternal: true },
        ],
    },
];

export const Footer: React.FC = () => {
    return (
        <footer
            className="pt-16 pb-8 border-t text-right"
            style={{
                backgroundColor: "#0F1B2D",
                color: "rgba(255, 255, 255, 0.6)",
                borderColor: "rgba(255, 255, 255, 0.1)",
            }}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b"
                    style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
                >
                    {/* Brand Column */}
                    <div className="lg:col-span-2 flex flex-col items-start text-right">
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src={logoIcon}
                                alt="Nota Logo"
                                className="w-14 h-14 object-contain rounded-2xl"
                            />
                            <div className="flex flex-col">
                                <span
                                    className="font-serif font-black text-xl leading-tight"
                                    style={{ color: "#FFFFFF" }}
                                >
                                    نوتة
                                </span>
                                <span
                                    className="text-[11px] font-medium"
                                    style={{ color: "rgba(255, 255, 255, 0.5)" }}
                                >
                                    منصة المحامين
                                </span>
                            </div>
                        </div>
                        <p
                            className="text-sm leading-relaxed max-w-sm"
                            style={{ color: "rgba(255, 255, 255, 0.5)" }}
                        >
                            أول منصة تجمع المحامين في مكان واحد لتبادل النوتات وحضور الجلسات
                            وبناء شبكة مهنية موثّقة.
                        </p>
                    </div>

                    {/* Navigation Columns */}
                    {FOOTER_LINKS.map((col) => (
                        <div key={col.title} className="flex flex-col items-start">
                            <h4
                                className="font-bold text-sm mb-4"
                                style={{ color: "#FFFFFF" }}
                            >
                                {col.title}
                            </h4>
                            <ul className="space-y-2.5 list-none p-0 m-0">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        {link.href.startsWith("#") || link.isExternal ? (
                                            <a
                                                href={link.href}
                                                className="text-xs transition-colors hover:text-white"
                                                style={{ color: "rgba(255, 255, 255, 0.6)" }}
                                            >
                                                {link.label}
                                            </a>
                                        ) : (
                                            <Link
                                                to={link.href}
                                                className="text-xs transition-colors hover:text-white"
                                                style={{ color: "rgba(255, 255, 255, 0.6)" }}
                                            >
                                                {link.label}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div
                    className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
                    style={{ color: "rgba(255, 255, 255, 0.4)" }}
                >
                    <span>© {new Date().getFullYear()} نوتة. جميع الحقوق محفوظة.</span>
                    <span>Powered by تينارون للأنظمة الرقمية</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
