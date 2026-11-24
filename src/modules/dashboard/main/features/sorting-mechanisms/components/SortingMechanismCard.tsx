import React from "react";
import { Link } from "react-router-dom";
import { ClipboardCheck, Sliders, Clock, MapPin } from "lucide-react";
import type { SortingMechanismItem } from "../types";

interface SortingMechanismCardProps {
    mechanism: SortingMechanismItem;
}

export const SortingMechanismCard: React.FC<SortingMechanismCardProps> = ({
    mechanism,
}) => {
    const renderIcon = () => {
        switch (mechanism.iconType) {
            case "complete":
                return (
                    <div className="w-10 h-10 rounded-xl bg-[#D1FAE5] dark:bg-emerald-950/40 text-[#059669] flex items-center justify-center shrink-0">
                        <ClipboardCheck className="w-5 h-5" />
                    </div>
                );
            case "values":
                return (
                    <div className="w-10 h-10 rounded-xl bg-[#D1FAE5] dark:bg-emerald-950/40 text-[#059669] flex items-center justify-center shrink-0">
                        <Sliders className="w-5 h-5" />
                    </div>
                );
            case "time":
                return (
                    <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] dark:bg-amber-950/40 text-[#D97706] flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5" />
                    </div>
                );
            case "location":
                return (
                    <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] dark:bg-amber-950/40 text-[#D97706] flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5" />
                    </div>
                );
            default:
                return null;
        }
    };

    const renderBadge = () => {
        if (mechanism.badgeType === "automatic") {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#DCFCE7] dark:bg-emerald-950/40 text-[#16A34A] text-[11px] font-semibold w-fit">
                    {mechanism.badgeText}
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#FFEDD5] dark:bg-amber-950/40 text-[#EA580C] text-[11px] font-semibold w-fit">
                {mechanism.badgeText}
            </span>
        );
    };

    return (
        <div className="dashboard-card p-6 flex flex-col justify-between gap-5 transition-all hover:shadow-md">
            <div className="flex flex-col gap-4">
                {/* Header: Icon + Title + Badge */}
                <div className="flex items-start gap-3.5">
                    {renderIcon()}
                    <div className="flex flex-col gap-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-sm text-[#0F172A] dark:text-dashboard-foreground leading-snug">
                                {mechanism.title}
                            </h3>
                            {renderBadge()}
                        </div>
                    </div>
                </div>

                {/* Paragraphs matching Screenshot 1 */}
                <div className="space-y-2 text-xs text-[#334155] dark:text-dashboard-muted-foreground leading-relaxed">
                    <p className="font-medium text-[#0F172A] dark:text-dashboard-foreground">
                        {mechanism.description}
                    </p>
                    <p className="text-[#64748B] text-[11px]">
                        {mechanism.secondaryDescription}
                    </p>
                </div>
            </div>

            {/* Action Buttons if present (Cards 3 and 4) */}
            {mechanism.actions && mechanism.actions.length > 0 && (
                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                    {mechanism.actions.map((act, index) => (
                        <Link
                            key={index}
                            to={act.href || "/dashboard/inspection-tasks"}
                            className="h-8 px-3.5 rounded-lg border border-[#2563EB] text-[#2563EB] hover:bg-[#EFF6FF] dark:hover:bg-blue-950/30 text-xs font-semibold transition-colors inline-flex items-center justify-center cursor-pointer shadow-2xs"
                        >
                            {act.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};
