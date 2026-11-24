import React, { useState } from "react";
import { useLanguage } from "@/shared/hooks";
import { ChevronRight, FileText, ExternalLink } from "lucide-react";
import { useRegistrationOfCompaniessList } from "../api";
import { RegistrationEmptyState, RegistrationDetailsModal } from "../components";
import type { CompanyRegistration } from "../types";

export default function RegistrationOfCompaniesPage() {
    const { t } = useLanguage("registration-of-companies");

    // Modal state
    const [selectedRegistration, setSelectedRegistration] = useState<CompanyRegistration | null>(null);

    // Checkbox selection
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Query Data
    const { data, isLoading } = useRegistrationOfCompaniessList();
    const items: CompanyRegistration[] = (data as any)?.items || [];

    const isAllSelected = items.length > 0 && selectedIds.length === items.length;
    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(items.map((r) => r.id));
        }
    };

    const handleSelectRow = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    return (
        <div className="space-y-6 pb-12 select-none text-[#1E293B]">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <span>Home</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span className="text-[#334155] font-semibold">
                    Registration Of Companies
                </span>
            </div>

            {/* Page Title */}
            <div>
                <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                    Registration Of Companies
                </h1>
            </div>

            {/* Table Card */}
            <div className="dashboard-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-start border-collapse text-xs">
                        <thead>
                            <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC]/50 text-[11px] font-bold text-[#64748B] uppercase tracking-wider select-none whitespace-nowrap">
                                <th className="py-4 px-4 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                                        aria-label="Select all"
                                    />
                                </th>
                                <th className="py-4 px-4 text-start font-bold">BASIC INFORMATION</th>
                                <th className="py-4 px-4 text-start font-bold">CATEGORY</th>
                                <th className="py-4 px-4 text-start font-bold">COMMERCIAL FILE</th>
                                <th className="py-4 px-4 text-start font-bold">LICENSE FILE</th>
                                <th className="py-4 px-4 text-start font-bold">IDENTITY FILE</th>
                                <th className="py-4 px-4 text-start font-bold">ADDRESS FILE</th>
                                <th className="py-4 px-4 text-start font-bold">CERT FILE</th>
                                <th className="py-4 px-4 text-start font-bold">DEFENSE LICENSE FILE</th>
                                <th className="py-4 px-4 text-start font-bold">QUALITY FILE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={10} className="py-16 text-center text-[#94A3B8]">
                                        Loading registration records...
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan={10}>
                                        <RegistrationEmptyState />
                                    </td>
                                </tr>
                            ) : (
                                items.map((reg) => {
                                    const isRowSelected = selectedIds.includes(reg.id);
                                    return (
                                        <tr
                                            key={reg.id}
                                            onClick={() => setSelectedRegistration(reg)}
                                            className={`hover:bg-[#F8FAFC] transition-colors cursor-pointer border-b border-[#F1F5F9] ${
                                                isRowSelected ? "bg-[#EFF6FF]/40" : ""
                                            }`}
                                        >
                                            <td
                                                className="py-4 px-4 text-center"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isRowSelected}
                                                    onChange={() => handleSelectRow(reg.id)}
                                                    className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                                                    aria-label={`Select ${reg.companyName}`}
                                                />
                                            </td>
                                            <td className="py-4 px-4 font-bold text-xs text-[#0F172A]">
                                                {reg.companyName}
                                            </td>
                                            <td className="py-4 px-4 font-medium text-xs text-[#334155]">
                                                {reg.category}
                                            </td>
                                            {[
                                                reg.commercialFileUrl,
                                                reg.licenseFileUrl,
                                                reg.identityFileUrl,
                                                reg.addressFileUrl,
                                                reg.certFileUrl,
                                                reg.defenseLicenseFileUrl,
                                                reg.qualityFileUrl,
                                            ].map((fileUrl, idx) => (
                                                <td key={idx} className="py-4 px-4">
                                                    {fileUrl ? (
                                                        <span className="inline-flex items-center gap-1 text-[11px] text-[#2563EB] font-semibold hover:underline">
                                                            <FileText className="w-3.5 h-3.5" />
                                                            <span>File</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-[#94A3B8]">—</span>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Registration Details Modal */}
            <RegistrationDetailsModal
                isOpen={Boolean(selectedRegistration)}
                onClose={() => setSelectedRegistration(null)}
                registration={selectedRegistration}
            />
        </div>
    );
}
