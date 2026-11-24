import React, { useState } from "react";
import { ChevronDown, Printer, LayoutGrid, Check } from "lucide-react";

interface Props {
    isRealtime: boolean;
    onToggleRealtime: (enabled: boolean) => void;
    advancedFilter: boolean;
    onToggleAdvancedFilter: (enabled: boolean) => void;
    onExportExcel: () => void;
    onExportPdf: () => void;
    onPrint: () => void;
}

export const LiveToolbar: React.FC<Props> = ({
    isRealtime,
    onToggleRealtime,
    advancedFilter,
    onToggleAdvancedFilter,
    onExportExcel,
    onExportPdf,
    onPrint,
}) => {
    const [isExportOpen, setIsExportOpen] = useState(false);

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 py-1 select-none">
            {/* Right Side: Realtime Toggle */}
            <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs font-medium text-[#334155] cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isRealtime}
                        onChange={(e) => onToggleRealtime(e.target.checked)}
                        className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                        aria-label="عرض التحديثات لحظة بلحظة"
                    />
                    <span>عرض التحديثات لحظة بلحظة</span>
                </label>
            </div>

            {/* Left Side Controls: Export, Layout, Print, Advanced Filter */}
            <div className="flex items-center gap-2.5">
                {/* Advanced Filter Switch */}
                <div className="flex items-center gap-2 border-r border-[#E2E8F0] pr-2.5 ml-1">
                    <span className="text-xs text-[#64748B]">تصفية متقدمة</span>
                    <button
                        type="button"
                        onClick={() => onToggleAdvancedFilter(!advancedFilter)}
                        className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer ${
                            advancedFilter ? "bg-[#2563EB]" : "bg-[#CBD5E1]"
                        }`}
                        aria-label="تبديل التصفية المتقدمة"
                    >
                        <div
                            className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${
                                advancedFilter ? "translate-x-4" : "translate-x-0"
                            }`}
                        />
                    </button>
                </div>

                {/* Print Button (Blue Solid Primary) */}
                <button
                    onClick={onPrint}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                    aria-label="طباعة التقرير"
                >
                    <Printer className="w-3.5 h-3.5" />
                    <span>طباعة</span>
                </button>

                {/* Layout Button */}
                <button
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#334155] text-xs font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
                    aria-label="تخطيط"
                >
                    <LayoutGrid className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>تخطيط</span>
                </button>

                {/* Export Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsExportOpen(!isExportOpen)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#334155] text-xs font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
                        aria-label="خيارات التصدير"
                        aria-expanded={isExportOpen}
                    >
                        <span>تصدير</span>
                        <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
                    </button>

                    {isExportOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsExportOpen(false)}
                            />
                            <div className="absolute left-0 mt-1 w-32 bg-white border border-[#E2E8F0] rounded-lg shadow-lg z-50 py-1 text-xs">
                                <button
                                    onClick={() => {
                                        onExportExcel();
                                        setIsExportOpen(false);
                                    }}
                                    className="w-full text-right px-3 py-1.5 hover:bg-[#F1F5F9] text-[#334155] transition-colors cursor-pointer"
                                >
                                    ملف Excel
                                </button>
                                <button
                                    onClick={() => {
                                        onExportPdf();
                                        setIsExportOpen(false);
                                    }}
                                    className="w-full text-right px-3 py-1.5 hover:bg-[#F1F5F9] text-[#334155] transition-colors cursor-pointer"
                                >
                                    ملف PDF
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
