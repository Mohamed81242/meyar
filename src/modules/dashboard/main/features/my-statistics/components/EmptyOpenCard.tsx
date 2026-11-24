import React from "react";
import { MoreHorizontal } from "lucide-react";
import { EmptyDocumentIllustration } from "./EmptyDocumentIllustration";

interface Props {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    emptyMessage: string;
}

export const EmptyOpenCard: React.FC<Props> = ({
    title,
    icon: HeaderIcon,
    emptyMessage,
}) => {
    return (
        <div className="dashboard-card p-5 flex flex-col justify-between min-h-[260px] select-none">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <HeaderIcon className="w-4 h-4 text-[#0F172A] dark:text-dashboard-foreground" />
                    <h2 className="text-sm font-bold text-[#0F172A] dark:text-dashboard-foreground">{title}</h2>
                </div>
                <button
                    className="w-7 h-7 rounded-lg text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-dashboard-foreground hover:bg-[#F1F5F9] dark:hover:bg-dashboard-secondary flex items-center justify-center transition-colors cursor-pointer"
                    aria-label={`Options for ${title}`}
                >
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            {/* Empty State Viewport */}
            <div className="flex-1 flex flex-col items-center justify-center py-6 gap-3">
                <EmptyDocumentIllustration className="w-16 h-20 opacity-90 transition-transform hover:scale-105" />
                <p className="text-xs font-semibold text-[#64748B] dark:text-dashboard-muted-foreground tracking-tight">
                    {emptyMessage}
                </p>
            </div>
        </div>
    );
};
