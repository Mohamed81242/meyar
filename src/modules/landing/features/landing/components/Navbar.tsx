import React, { useEffect, useState } from "react";
import logoIcon from "@/assets/images/icon.png";
import { IconMenu, IconX } from "./Icons";

const NAV_LINKS = [
    { href: "#features", label: "المميزات" },
    { href: "#how-it-works", label: "طريقة العمل" },
    { href: "#download", label: "حمّل التطبيق" },
    { href: "#waitlist", label: "قائمة الانتظار" },
];

export const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 8);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const closeMobileMenu = () => setMobileOpen(false);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${scrolled
                    ? "backdrop-blur-md border-b shadow-xs"
                    : "backdrop-blur-sm border-b"
                }`}
            style={{
                backgroundColor: scrolled
                    ? "rgba(246, 244, 239, 0.95)"
                    : "rgba(246, 244, 239, 0.85)",
                borderColor: scrolled ? "rgba(15, 27, 45, 0.1)" : "transparent",
            }}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-18">
                    {/* Brand Logo */}
                    <a href="#top" className="flex items-center gap-3 group">
                        <img
                            src={logoIcon}
                            alt="Nota Logo"
                            className="w-14 h-14 object-contain rounded-2xl transition-transform group-hover:scale-105"
                        />
                        <div className="flex flex-col text-right">
                            <span
                                className="font-serif font-black text-xl leading-tight"
                                style={{ color: "#0F1B2D" }}
                            >
                                نوتة
                            </span>
                            <span
                                className="text-[11px] font-semibold tracking-tight"
                                style={{ color: "#5B6474" }}
                            >
                                منصة المحامين
                            </span>
                        </div>
                    </a>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-8" aria-label="روابط رئيسية">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-sm font-semibold transition-colors relative py-1 hover:!text-[#B8923D] after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-0 after:h-0.5 after:bg-[#B8923D] hover:after:w-full after:transition-all after:duration-250"
                                style={{ color: "#17263D" }}
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Right CTA Action (Default Gold Button) */}
                    <div className="flex items-center gap-3">
                        <a
                            href="#waitlist"
                            className="inline-flex items-center justify-center font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-[0_10px_20px_-8px_rgba(184,146,61,0.5)] transition-all hover:-translate-y-0.5"
                            style={{
                                backgroundColor: "#B8923D",
                                color: "#FFFFFF",
                            }}
                        >
                            انضم للقائمة
                        </a>

                        {/* Mobile Menu Toggle */}
                        <button
                            type="button"
                            className="md:hidden p-2 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
                            style={{ color: "#0F1B2D" }}
                            aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"}
                            onClick={() => setMobileOpen((prev) => !prev)}
                        >
                            {mobileOpen ? <IconX className="w-6 h-6" /> : <IconMenu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer Menu */}
            {mobileOpen && (
                <div
                    className="md:hidden border-t px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200"
                    style={{
                        backgroundColor: "#F6F4EF",
                        borderColor: "rgba(15, 27, 45, 0.1)",
                    }}
                >
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={closeMobileMenu}
                            className="block py-3 px-2 font-semibold text-sm border-b hover:!text-[#B8923D] transition-colors text-right"
                            style={{
                                color: "#17263D",
                                borderColor: "rgba(15, 27, 45, 0.05)",
                            }}
                        >
                            {link.label}
                        </a>
                    ))}
                    <div className="pt-3">
                        <a
                            href="#waitlist"
                            onClick={closeMobileMenu}
                            className="block w-full text-center py-3 font-bold text-sm rounded-xl shadow-md"
                            style={{
                                backgroundColor: "#B8923D",
                                color: "#FFFFFF",
                            }}
                        >
                            انضم للقائمة
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
