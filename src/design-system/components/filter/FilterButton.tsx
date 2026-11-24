import React from "react";
import { Filter as FilterIcon } from "lucide-react";
import { Button } from "../button";

interface FilterButtonProps {
    isOpen: boolean;
    activeCount: number;
    label: string;
    onClick: () => void;
    isAr?: boolean;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
    isOpen,
    activeCount,
    label,
    onClick,
    isAr = false,
}) => {
    return (
        <Button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 h-10 rounded-full border text-xs font-semibold transition cursor-pointer shrink-0 ${
                isOpen || activeCount > 0
                    ? "bg-dashboard-primary/10 border-dashboard-primary/30 text-dashboard-primary hover:bg-dashboard-primary/15 font-semibold text-xs py-2 px-4 shadow-sm"
                    : "bg-dashboard-card border-dashboard-border text-dashboard-muted-foreground hover:bg-dashboard-secondary hover:text-dashboard-foreground font-semibold text-xs py-2 px-4 shadow-sm"
            }`}
        >
            <FilterIcon size={14} />
            <span>
                {isAr ? "الفلترة: " : "Filter: "}
                <span className="font-bold text-dashboard-foreground">{label}</span>
            </span>
        </Button>
    );
};
