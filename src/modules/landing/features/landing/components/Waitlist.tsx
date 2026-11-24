import React, { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { GOVERNORATES } from "../data/features";
import { useWaitlist, validateWaitlistForm } from "../hooks/useWaitlist";
import type { FormErrors, WaitlistFormValues } from "../types/landing.types";
import { IconCheck } from "./Icons";

const EMPTY_FORM: WaitlistFormValues = {
    name: "",
    phone: "",
    email: "",
    barNumber: "",
    governorate: "",
};

interface WaitlistProps {
    onCountChange?: (count: number) => void;
}

export const Waitlist: React.FC<WaitlistProps> = ({ onCountChange }) => {
    const { count, submittedEntry, submit, isSubmitting } = useWaitlist();
    const [values, setValues] = useState<WaitlistFormValues>(EMPTY_FORM);
    const [errors, setErrors] = useState<FormErrors>({});

    const update =
        (field: keyof WaitlistFormValues) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
            setValues((prev) => ({ ...prev, [field]: e.target.value }));
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        const validationErrors = validateWaitlistForm(values);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const entry = await submit(values);
            toast.success("تم تسجيل اهتمامك بنجاح في نوتة!");
            onCountChange?.(entry.number);
        } catch (err: any) {
            toast.error(err?.message || "حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.");
        }
    };

    return (
        <section
            className="py-20 sm:py-24 relative overflow-hidden"
            style={{
                backgroundColor: "#F6F4EF",
                backgroundImage:
                    "radial-gradient(700px 380px at 15% 10%, rgba(184, 146, 61, 0.1), transparent 60%)",
            }}
            id="waitlist"
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-14">
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
                        <span>احجز مكانك</span>
                    </div>
                    <h2
                        className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl leading-snug"
                        style={{ color: "#0F1B2D" }}
                    >
                        سجّل الآن وكن من أول المحامين على نوتة
                    </h2>
                    <p
                        className="mt-4 text-base leading-relaxed"
                        style={{ color: "#5B6474" }}
                    >
                        التسجيل مجاني ولا يستغرق دقيقة. هنبلغك فور ما يبقى التطبيق
                        متاحًا بالكامل في محافظتك.
                    </p>
                </div>

                {/* Form / Ticket Card */}
                <div
                    className="max-w-lg mx-auto rounded-2xl p-6 sm:p-9 shadow-[0_24px_48px_-24px_rgba(15,27,45,0.3)] border"
                    style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "rgba(15, 27, 45, 0.1)",
                    }}
                >
                    {submittedEntry ? (
                        <div className="text-center py-4">
                            <div
                                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                                style={{
                                    backgroundColor: "rgba(184, 146, 61, 0.15)",
                                    color: "#96742C",
                                }}
                            >
                                <IconCheck className="w-7 h-7" />
                            </div>
                            <p
                                className="text-sm font-semibold"
                                style={{ color: "#5B6474" }}
                            >
                                تم تسجيلك في نوتة برقم
                            </p>
                            <p
                                className="font-serif font-black text-4xl sm:text-5xl my-2"
                                style={{ color: "#96742C" }}
                            >
                                #{(submittedEntry.number ?? submittedEntry.id ?? 1).toLocaleString("ar-EG")}
                            </p>
                            <p
                                className="text-sm leading-relaxed mt-4"
                                style={{ color: "#5B6474" }}
                            >
                                هنبعتلك رسالة على رقم{" "}
                                <strong
                                    className="font-mono"
                                    style={{ color: "#0F1B2D" }}
                                >
                                    {submittedEntry.phone}
                                </strong>{" "}
                                فور ما يبقى التطبيق جاهزًا للاستخدام في محافظتك.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} noValidate className="space-y-4 text-right">
                            {/* Name */}
                            <div>
                                <label
                                    htmlFor="waitlist-name"
                                    className="block text-xs font-bold mb-1.5"
                                    style={{ color: "#0F1B2D" }}
                                >
                                    الاسم الكامل <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    id="waitlist-name"
                                    type="text"
                                    placeholder="مثال: محمد أحمد السيد"
                                    value={values.name}
                                    onChange={update("name")}
                                    aria-invalid={Boolean(errors.name)}
                                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border outline-none transition-colors"
                                    style={{
                                        backgroundColor: "#FFFFFF",
                                        color: "#1C2536",
                                        borderColor: errors.name
                                            ? "#EF4444"
                                            : "rgba(15, 27, 45, 0.15)",
                                    }}
                                />
                                {errors.name && (
                                    <span className="block text-xs text-rose-500 mt-1">
                                        {errors.name}
                                    </span>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label
                                    htmlFor="waitlist-phone"
                                    className="block text-xs font-bold mb-1.5"
                                    style={{ color: "#0F1B2D" }}
                                >
                                    رقم الهاتف <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    id="waitlist-phone"
                                    type="tel"
                                    dir="ltr"
                                    placeholder="01xxxxxxxxx"
                                    value={values.phone}
                                    onChange={update("phone")}
                                    aria-invalid={Boolean(errors.phone)}
                                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border text-right outline-none transition-colors"
                                    style={{
                                        backgroundColor: "#FFFFFF",
                                        color: "#1C2536",
                                        borderColor: errors.phone
                                            ? "#EF4444"
                                            : "rgba(15, 27, 45, 0.15)",
                                    }}
                                />
                                {errors.phone && (
                                    <span className="block text-xs text-rose-500 mt-1">
                                        {errors.phone}
                                    </span>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="waitlist-email"
                                    className="block text-xs font-bold mb-1.5"
                                    style={{ color: "#0F1B2D" }}
                                >
                                    البريد الإلكتروني{" "}
                                    <span
                                        className="font-normal"
                                        style={{ color: "#5B6474" }}
                                    >
                                        (اختياري)
                                    </span>
                                </label>
                                <input
                                    id="waitlist-email"
                                    type="email"
                                    dir="ltr"
                                    placeholder="example@domain.com"
                                    value={values.email}
                                    onChange={update("email")}
                                    aria-invalid={Boolean(errors.email)}
                                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border text-right outline-none transition-colors"
                                    style={{
                                        backgroundColor: "#FFFFFF",
                                        color: "#1C2536",
                                        borderColor: errors.email
                                            ? "#EF4444"
                                            : "rgba(15, 27, 45, 0.15)",
                                    }}
                                />
                                {errors.email && (
                                    <span className="block text-xs text-rose-500 mt-1">
                                        {errors.email}
                                    </span>
                                )}
                            </div>

                            {/* Bar Association Number */}
                            <div>
                                <label
                                    htmlFor="waitlist-barNumber"
                                    className="block text-xs font-bold mb-1.5"
                                    style={{ color: "#0F1B2D" }}
                                >
                                    رقم القيد بنقابة المحامين{" "}
                                    <span
                                        className="font-normal"
                                        style={{ color: "#5B6474" }}
                                    >
                                        (اختياري)
                                    </span>
                                </label>
                                <input
                                    id="waitlist-barNumber"
                                    type="text"
                                    placeholder="مثال: 123456"
                                    value={values.barNumber}
                                    onChange={update("barNumber")}
                                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border outline-none transition-colors"
                                    style={{
                                        backgroundColor: "#FFFFFF",
                                        color: "#1C2536",
                                        borderColor: "rgba(15, 27, 45, 0.15)",
                                    }}
                                />
                            </div>

                            {/* Governorate */}
                            <div>
                                <label
                                    htmlFor="waitlist-governorate"
                                    className="block text-xs font-bold mb-1.5"
                                    style={{ color: "#0F1B2D" }}
                                >
                                    المحافظة <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    id="waitlist-governorate"
                                    value={values.governorate}
                                    onChange={update("governorate")}
                                    aria-invalid={Boolean(errors.governorate)}
                                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border outline-none transition-colors"
                                    style={{
                                        backgroundColor: "#FFFFFF",
                                        color: "#1C2536",
                                        borderColor: errors.governorate
                                            ? "#EF4444"
                                            : "rgba(15, 27, 45, 0.15)",
                                    }}
                                >
                                    <option value="">اختر المحافظة</option>
                                    {GOVERNORATES.map((gov) => (
                                        <option key={gov} value={gov}>
                                            {gov}
                                        </option>
                                    ))}
                                </select>
                                {errors.governorate && (
                                    <span className="block text-xs text-rose-500 mt-1">
                                        {errors.governorate}
                                    </span>
                                )}
                            </div>

                            {/* Submit Button (Gold) */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full font-bold text-sm py-3.5 px-6 rounded-xl shadow-[0_12px_24px_-10px_rgba(184,146,61,0.55)] transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed mt-2 cursor-pointer"
                                style={{
                                    backgroundColor: "#B8923D",
                                    color: "#FFFFFF",
                                }}
                            >
                                {isSubmitting ? "جاري التسجيل..." : "سجّل الآن"}
                            </button>
                        </form>
                    )}
                </div>

                {/* Subtitle count */}
                <p
                    className="text-center mt-6 text-sm font-semibold"
                    style={{ color: "#5B6474" }}
                >
                    {count.toLocaleString("ar-EG")} محامٍ سجّلوا اهتمامهم حتى الآن
                </p>
            </div>
        </section>
    );
};

export default Waitlist;
