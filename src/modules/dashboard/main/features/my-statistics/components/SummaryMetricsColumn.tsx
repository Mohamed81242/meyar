import React from "react";
import { Layers, CheckCircle2, CircleDot } from "lucide-react";

interface Props {
    inProgressTasks: number;
    completedTasks: number;
    openActions: number;
}

export const SummaryMetricsColumn: React.FC<Props> = ({
    inProgressTasks,
    completedTasks,
    openActions,
}) => {
    return (
        <div className="flex flex-col gap-3.5 h-full justify-between">
            {/* Card 1: In Progress Tasks */}
            <div className="dashboard-card p-4 px-5 flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-[#0F172A] dark:text-dashboard-foreground tracking-tight">
                        {inProgressTasks} +
                    </h3>
                    <p className="text-xs text-[#64748B] dark:text-dashboard-muted-foreground font-medium mt-1">
                        In Progress Tasks
                    </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#8B5CF6] text-white flex items-center justify-center shadow-xs shrink-0">
                    <Layers className="w-6 h-6 text-white" />
                </div>
            </div>

            {/* Card 2: Completed Tasks */}
            <div className="dashboard-card p-4 px-5 flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-[#0F172A] dark:text-dashboard-foreground tracking-tight">
                        {completedTasks} +
                    </h3>
                    <p className="text-xs text-[#64748B] dark:text-dashboard-muted-foreground font-medium mt-1">
                        Completed Tasks
                    </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#84CC16] text-white flex items-center justify-center shadow-xs shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
            </div>

            {/* Card 3: Open Actions */}
            <div className="dashboard-card p-4 px-5 flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-[#0F172A] dark:text-dashboard-foreground tracking-tight">
                        {openActions} +
                    </h3>
                    <p className="text-xs text-[#64748B] dark:text-dashboard-muted-foreground font-medium mt-1">
                        Open Actions
                    </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#F97316] text-white flex items-center justify-center shadow-xs shrink-0">
                    <CircleDot className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
};
