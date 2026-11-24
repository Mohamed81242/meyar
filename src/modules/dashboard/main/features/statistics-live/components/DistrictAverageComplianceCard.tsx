import React from "react";
import { MoreHorizontal, ChevronUp, MapPin } from "lucide-react";
import { EmptyIllustration } from "./EmptyIllustration";

interface Props {
    districtComplianceAverage: any | null;
}

export const DistrictAverageComplianceCard: React.FC<Props> = () => {
    return (
        <div className="dashboard-card p-5 select-none">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#2563EB]">
                        <MapPin className="w-4 h-4" />
                    </div>
                    <h2 className="text-sm font-bold text-[#0F172A]">
                        متوسط امتثال مواقع المنطقة/الحي بناء على كل المهام المنفذة
                    </h2>
                </div>
                <div className="flex items-center gap-1 text-[#94A3B8]">
                    <button
                        className="w-6 h-6 rounded flex items-center justify-center hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                        aria-label="خيارات"
                    >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                    <button
                        className="w-6 h-6 rounded flex items-center justify-center hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                        aria-label="طي / توسيع"
                    >
                        <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-center py-12">
                <EmptyIllustration />
            </div>
        </div>
    );
};
