import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/design-system/components/dialog";
import type { User, UserCreatePayload } from "../types";
import { useCreateUsers, useUpdateUsers } from "../api";
import { toast } from "sonner";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

export const UserModal: React.FC<Props> = ({ isOpen, onClose, user }) => {
    const isEditing = Boolean(user);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [autoEmailRegister, setAutoEmailRegister] = useState("لا");
    const [phone, setPhone] = useState("");
    const [autoPhoneActivate, setAutoPhoneActivate] = useState("لا");
    const [role, setRole] = useState("أدمن");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const createMutation = useCreateUsers();
    const updateMutation = useUpdateUsers();

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
            setAutoEmailRegister(user.autoEmailRegister || "لا");
            setPhone(user.phone || "");
            setAutoPhoneActivate(user.autoPhoneActivate || "لا");
            setRole(user.role || "أدمن");
            setPassword("");
            setConfirmPassword("");
        } else {
            setName("");
            setEmail("");
            setAutoEmailRegister("لا");
            setPhone("");
            setAutoPhoneActivate("لا");
            setRole("أدمن");
            setPassword("");
            setConfirmPassword("");
        }
    }, [user, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("الاسم مطلوب");
            return;
        }

        if (password && password !== confirmPassword) {
            toast.error("كلمتا المرور غير متطابقتين");
            return;
        }

        const payload: UserCreatePayload = {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim() || undefined,
            role,
            autoEmailRegister,
            autoPhoneActivate,
            isEmailActivated: true,
            isPhoneActivated: Boolean(phone.trim()),
        };

        if (isEditing && user) {
            updateMutation.mutate(
                { id: user.id, data: payload },
                {
                    onSuccess: () => {
                        toast.success("تم تعديل المستخدم بنجاح");
                        onClose();
                    },
                    onError: () => {
                        toast.error("حدث خطأ أثناء تعديل المستخدم");
                    },
                }
            );
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => {
                    toast.success("تمت إضافة المستخدم بنجاح");
                    onClose();
                },
                onError: () => {
                    toast.error("حدث خطأ أثناء إضافة المستخدم");
                },
            });
        }
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl w-[92vw] bg-white p-0 rounded-2xl border border-[#E2E8F0] shadow-2xl overflow-hidden select-none">
                {/* Header */}
                <DialogHeader className="px-6 py-4 border-b border-[#F1F5F9] flex flex-row items-center justify-between">
                    <DialogTitle className="text-base font-bold text-[#0F172A]">
                        {isEditing ? "Edit user" : "Add user"}
                    </DialogTitle>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-7 h-7 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors flex items-center justify-center cursor-pointer"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </DialogHeader>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Full Width Name Field in gray box */}
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="الاسم"
                            className="w-full bg-transparent outline-none text-xs font-semibold text-[#0F172A] placeholder-[#94A3B8]"
                        />
                    </div>

                    {/* Section: Account Details */}
                    <div className="pt-2">
                        <h3 className="text-xs font-bold text-[#0F172A] mb-3">
                            بيانات الحساب
                        </h3>

                        {/* Grid: Email & Auto-register email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Email */}
                            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2 space-y-0.5">
                                <label className="text-[10px] font-medium text-[#64748B] block">
                                    البريد الإلكتروني
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="email@example.com"
                                    className="w-full bg-transparent outline-none text-xs font-medium text-[#0F172A]"
                                />
                            </div>

                            {/* Auto-register Email */}
                            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2 space-y-0.5 relative">
                                <label className="text-[10px] font-medium text-[#64748B] block">
                                    تسجيل تلقائي للبريد الإلكتروني
                                </label>
                                <select
                                    value={autoEmailRegister}
                                    onChange={(e) => setAutoEmailRegister(e.target.value)}
                                    className="w-full bg-transparent outline-none text-xs font-medium text-[#0F172A] appearance-none cursor-pointer pr-4"
                                >
                                    <option value="لا">لا</option>
                                    <option value="نعم">نعم</option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        {/* Grid: Phone & Auto-activate phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                            {/* Phone with Country Prefix */}
                            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2 flex items-center gap-2">
                                <span className="text-xs shrink-0 select-none">🇸🇦 +966</span>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="5xxxxxxxx"
                                    className="w-full bg-transparent outline-none text-xs font-medium text-[#0F172A]"
                                />
                            </div>

                            {/* Auto-activate Phone */}
                            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2 space-y-0.5 relative">
                                <label className="text-[10px] font-medium text-[#64748B] block">
                                    تفعيل تلقائي للهاتف
                                </label>
                                <select
                                    value={autoPhoneActivate}
                                    onChange={(e) => setAutoPhoneActivate(e.target.value)}
                                    className="w-full bg-transparent outline-none text-xs font-medium text-[#0F172A] appearance-none cursor-pointer pr-4"
                                >
                                    <option value="لا">لا</option>
                                    <option value="نعم">نعم</option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        {/* Role Select */}
                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 mt-3 relative">
                            <label className="text-[10px] font-medium text-[#64748B] block">
                                اختيار الدور
                            </label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full bg-transparent outline-none text-xs font-medium text-[#0F172A] appearance-none cursor-pointer pr-4 mt-0.5"
                            >
                                <option value="أدمن">أدمن</option>
                                <option value="مراقب">مراقب</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* Password */}
                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 mt-3 space-y-0.5">
                            <label className="text-[10px] font-medium text-[#64748B] block">
                                كلمة المرور
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••••"
                                className="w-full bg-transparent outline-none text-xs font-medium text-[#0F172A]"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 mt-3 space-y-0.5">
                            <label className="text-[10px] font-medium text-[#64748B] block">
                                تأكيد كلمة المرور
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••••••••"
                                className="w-full bg-transparent outline-none text-xs font-medium text-[#0F172A]"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                        >
                            {isSubmitting
                                ? "Saving..."
                                : isEditing
                                ? "Edit"
                                : "Add"}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
