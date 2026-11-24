import React from "react";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/shared/hooks";
import { useSortingMechanismssList } from "../api";
import { SortingMechanismCard } from "../components";
import type { SortingMechanismItem } from "../types";

export default function SortingMechanismsPage() {
    const { t } = useLanguage("sorting-mechanisms");
    const { data, isLoading } = useSortingMechanismssList();

    const items: SortingMechanismItem[] = (data as any)?.items || [];

    return (
        <div className="space-y-4 pb-12 select-none text-[#1E293B]">
            {/* Breadcrumb Navigation matching Screenshot 1 */}
            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <span>{t("home", "Home")}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span className="text-[#334155] font-semibold">
                    {t("title", "Sorting mechanisms")}
                </span>
            </div>

            {/* Page Title & Description matching Screenshot 1 */}
            <div className="space-y-1.5">
                <h1 className="text-2xl font-bold text-[#0F172A] dark:text-dashboard-foreground tracking-tight">
                    {t("title", "Sorting mechanisms")}
                </h1>
                <p className="text-xs text-[#64748B] dark:text-dashboard-muted-foreground leading-relaxed max-w-4xl">
                    {t(
                        "description",
                        "The mechanisms the system uses to sort inspections and keep their data sound: what each means, what kind it is, and where it is set."
                    )}
                </p>
            </div>

            {/* 2x2 Grid of Mechanism Cards matching Screenshot 1 */}
            {isLoading ? (
                <div className="py-20 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-dashboard-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    {items.map((mechanism) => (
                        <SortingMechanismCard
                            key={mechanism.id}
                            mechanism={mechanism}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
