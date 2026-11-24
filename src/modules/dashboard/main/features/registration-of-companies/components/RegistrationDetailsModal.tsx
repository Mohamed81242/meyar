import React from "react";
import { X, FileText, ExternalLink } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/design-system/components/dialog";
import type { CompanyRegistration } from "../types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    registration: CompanyRegistration | null;
}

export const RegistrationDetailsModal: React.FC<Props> = ({
    isOpen,
    onClose,
    registration,
}) => {
    if (!registration) return null;

    const files = [
        { label: "COMMERCIAL FILE", url: registration.commercialFileUrl },
        { label: "LICENSE FILE", url: registration.licenseFileUrl },
        { label: "IDENTITY FILE", url: registration.identityFileUrl },
        { label: "ADDRESS FILE", url: registration.addressFileUrl },
        { label: "CERT FILE", url: registration.certFileUrl },
        { label: "DEFENSE LICENSE FILE", url: registration.defenseLicenseFileUrl },
        { label: "QUALITY FILE", url: registration.qualityFileUrl },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl w-[92vw] bg-white p-0 rounded-2xl border border-[#E2E8F0] shadow-2xl overflow-hidden select-none">
                <DialogHeader className="px-6 py-4 border-b border-[#F1F5F9] flex flex-row items-center justify-between">
                    <DialogTitle className="text-base font-bold text-[#0F172A]">
                        {registration.companyName}
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

                <div className="p-6 space-y-5">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3">
                            <span className="text-[10px] font-medium text-[#64748B] block">
                                CATEGORY
                            </span>
                            <span className="text-xs font-bold text-[#0F172A] mt-0.5 block">
                                {registration.category}
                            </span>
                        </div>
                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3">
                            <span className="text-[10px] font-medium text-[#64748B] block">
                                OWNER NAME
                            </span>
                            <span className="text-xs font-bold text-[#0F172A] mt-0.5 block">
                                {registration.ownerName || "—"}
                            </span>
                        </div>
                    </div>

                    {/* Files List */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold text-[#0F172A]">
                            Attached Registration Documents
                        </h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {files.map((file) => (
                                <div
                                    key={file.label}
                                    className="flex items-center justify-between p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <FileText className="w-4 h-4 text-[#2563EB]" />
                                        <span className="text-xs font-medium text-[#334155]">
                                            {file.label}
                                        </span>
                                    </div>
                                    {file.url ? (
                                        <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-xs text-[#2563EB] font-semibold hover:underline"
                                        >
                                            <span>View</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    ) : (
                                        <span className="text-[11px] text-[#94A3B8]">
                                            Not provided
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
