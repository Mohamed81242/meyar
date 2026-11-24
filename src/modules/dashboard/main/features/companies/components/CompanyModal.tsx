import React, { useState, useEffect } from "react";
import { X, ChevronDown, Image as ImageIcon, Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/design-system/components/dialog";
import type { Company, CompanyCreatePayload } from "../types";
import { useCreateCompanies, useUpdateCompanies } from "../api";
import { CompanyLocationPicker } from "./CompanyLocationPicker";
import { toast } from "sonner";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    company: Company | null;
}

export const CompanyModal: React.FC<Props> = ({ isOpen, onClose, company }) => {
    const isEditing = Boolean(company);

    const [name, setName] = useState("");
    const [category, setCategory] = useState("مطعم");
    const [levelType, setLevelType] = useState<"State" | "Region" | "Area" | "Site">("Site");
    const [tag, setTag] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [phone, setPhone] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const [commercialRegNumber, setCommercialRegNumber] = useState("");
    const [address, setAddress] = useState("");
    const [idNumber, setIdNumber] = useState("");
    const [locationType, setLocationType] = useState<"map" | "latlng" | "link">("map");
    const [latitude, setLatitude] = useState("24.7136");
    const [longitude, setLongitude] = useState("46.6753");
    const [locationLink, setLocationLink] = useState("");

    const createMutation = useCreateCompanies();
    const updateMutation = useUpdateCompanies();

    useEffect(() => {
        if (company) {
            setName(company.name || "");
            setCategory(company.category || "مطعم");
            setLevelType(company.levelType || "Site");
            setTag(company.tag || "");
            setOwnerName(company.ownerName || "");
            setPhone(company.phone || "");
            setLicenseNumber(company.licenseNumber || "");
            setCommercialRegNumber(company.commercialRegNumber || "");
            setAddress(company.address || "");
            setIdNumber(company.idNumber || "");
            setLocationType(company.locationType || "map");
            setLatitude(company.latitude || "24.7136");
            setLongitude(company.longitude || "46.6753");
            setLocationLink(company.locationLink || "");
        } else {
            setName("");
            setCategory("مطعم");
            setLevelType("Site");
            setTag("");
            setOwnerName("");
            setPhone("");
            setLicenseNumber("");
            setCommercialRegNumber("");
            setAddress("");
            setIdNumber("");
            setLocationType("map");
            setLatitude("24.7136");
            setLongitude("46.6753");
            setLocationLink("");
        }
    }, [company, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Name is required");
            return;
        }

        const payload: CompanyCreatePayload = {
            name: name.trim(),
            category,
            levelType,
            tag: tag.trim() || undefined,
            ownerName: ownerName.trim() || undefined,
            phone: phone.trim() || undefined,
            licenseNumber: licenseNumber.trim() || undefined,
            commercialRegNumber: commercialRegNumber.trim() || undefined,
            address: address.trim() || undefined,
            idNumber: idNumber.trim() || undefined,
            locationType,
            latitude: locationType === "latlng" ? latitude : undefined,
            longitude: locationType === "latlng" ? longitude : undefined,
            locationLink: locationType === "link" ? locationLink : undefined,
        };

        if (isEditing && company) {
            updateMutation.mutate(
                { id: company.id, data: payload },
                {
                    onSuccess: () => {
                        toast.success("Company updated successfully");
                        onClose();
                    },
                    onError: () => {
                        toast.error("Failed to update company");
                    },
                }
            );
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => {
                    toast.success("Company created successfully");
                    onClose();
                },
                onError: () => {
                    toast.error("Failed to create company");
                },
            });
        }
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl w-[94vw] bg-white p-0 rounded-2xl border border-[#E2E8F0] shadow-2xl overflow-hidden select-none">
                {/* Header */}
                <DialogHeader className="px-6 py-4 border-b border-[#F1F5F9] flex flex-row items-center justify-between">
                    <DialogTitle className="text-base font-bold text-[#0F172A]">
                        {isEditing ? "Edit Company" : "Add Company"}
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

                {/* Form Body (Scrollable) */}
                <form onSubmit={handleSubmit} className="p-6 max-h-[82vh] overflow-y-auto space-y-5">
                    {/* Top Row: Image Box on Left + Name & Selects on Right */}
                    <div className="flex flex-col sm:flex-row gap-5 items-start">
                        {/* Image Upload Box */}
                        <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] flex flex-col items-center justify-center relative group cursor-pointer shrink-0 hover:border-[#2563EB] transition-colors">
                            <div className="relative">
                                <ImageIcon className="w-12 h-12 text-[#93C5FD]" />
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-xs">
                                    <Plus className="w-3.5 h-3.5" />
                                </div>
                            </div>
                        </div>

                        {/* Right Inputs: Name, Category, Level, Tag */}
                        <div className="flex-1 w-full space-y-3">
                            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5">
                                <label className="text-[10px] font-medium text-[#2563EB] block">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter company name"
                                    className="w-full bg-transparent outline-none text-xs font-semibold text-[#0F172A] placeholder-[#94A3B8]"
                                />
                            </div>

                            {/* Category & Level Type Dropdowns */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 relative">
                                    <label className="text-[10px] font-medium text-[#64748B] block">
                                        Category
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-transparent outline-none text-xs font-medium text-[#0F172A] appearance-none cursor-pointer pr-4"
                                    >
                                        <option value="مطعم">مطعم</option>
                                        <option value="مطابخ الاعاشة">مطابخ الاعاشة</option>
                                        <option value="مصانع">مصانع</option>
                                    </select>
                                    <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>

                                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 relative">
                                    <label className="text-[10px] font-medium text-[#64748B] block">
                                        Level Type
                                    </label>
                                    <select
                                        value={levelType}
                                        onChange={(e) =>
                                            setLevelType(
                                                e.target.value as "State" | "Region" | "Area" | "Site"
                                            )
                                        }
                                        className="w-full bg-transparent outline-none text-xs font-medium text-[#0F172A] appearance-none cursor-pointer pr-4"
                                    >
                                        <option value="Site">Site</option>
                                        <option value="Area">Area</option>
                                        <option value="Region">Region</option>
                                        <option value="State">State</option>
                                    </select>
                                    <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>

                            {/* Company Tag */}
                            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 relative">
                                <label className="text-[10px] font-medium text-[#64748B] block">
                                    وسم الجهة
                                </label>
                                <select
                                    value={tag}
                                    onChange={(e) => setTag(e.target.value)}
                                    className="w-full bg-transparent outline-none text-xs font-medium text-[#0F172A] appearance-none cursor-pointer pr-4"
                                >
                                    <option value="">وسم الجهة</option>
                                    <option value="مطاعم متميزة">مطاعم متميزة</option>
                                    <option value="اعاشة كبرى">اعاشة كبرى</option>
                                    <option value="مصانع حلويات">مصانع حلويات</option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Middle Section: 6 Inputs in Rounded Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5">
                            <label className="text-[10px] font-medium text-[#64748B] block">
                                اسم المالك
                            </label>
                            <input
                                type="text"
                                value={ownerName}
                                onChange={(e) => setOwnerName(e.target.value)}
                                placeholder="اسم المالك"
                                className="w-full bg-transparent outline-none text-xs font-medium text-[#0F172A]"
                            />
                        </div>

                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5">
                            <label className="text-[10px] font-medium text-[#64748B] block">
                                الجوال
                            </label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="الجوال"
                                className="w-full bg-transparent outline-none text-xs font-medium text-[#0F172A]"
                            />
                        </div>

                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5">
                            <label className="text-[10px] font-medium text-[#64748B] block">
                                رقم الرخصة
                            </label>
                            <input
                                type="text"
                                value={licenseNumber}
                                onChange={(e) => setLicenseNumber(e.target.value)}
                                placeholder="رقم الرخصة"
                                className="w-full bg-transparent outline-none text-xs font-medium text-[#0F172A]"
                            />
                        </div>

                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5">
                            <label className="text-[10px] font-medium text-[#64748B] block">
                                رقم السجل التجاري
                            </label>
                            <input
                                type="text"
                                value={commercialRegNumber}
                                onChange={(e) => setCommercialRegNumber(e.target.value)}
                                placeholder="رقم السجل التجاري"
                                className="w-full bg-transparent outline-none text-xs font-medium text-[#0F172A]"
                            />
                        </div>

                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5">
                            <label className="text-[10px] font-medium text-[#64748B] block">
                                عنوان الجهة
                            </label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="عنوان الجهة"
                                className="w-full bg-transparent outline-none text-xs font-medium text-[#0F172A]"
                            />
                        </div>

                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5">
                            <label className="text-[10px] font-medium text-[#64748B] block">
                                رقم الهوية
                            </label>
                            <input
                                type="text"
                                value={idNumber}
                                onChange={(e) => setIdNumber(e.target.value)}
                                placeholder="رقم الهوية"
                                className="w-full bg-transparent outline-none text-xs font-medium text-[#0F172A]"
                            />
                        </div>
                    </div>

                    {/* Location Section */}
                    <CompanyLocationPicker
                        locationType={locationType}
                        onChangeType={setLocationType}
                        latitude={latitude}
                        longitude={longitude}
                        locationLink={locationLink}
                        onChangeLatitude={setLatitude}
                        onChangeLongitude={setLongitude}
                        onChangeLocationLink={setLocationLink}
                    />

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
