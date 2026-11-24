import { cn } from "@/utils";
import { Check } from "lucide-react";
import * as React from "react";

export type StepState = "completed" | "active" | "pending";

export interface StepItem {
    id: string;
    label: string;
    state: StepState;
    subtitle?: string;
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
    steps: StepItem[];
}

export function Stepper({ steps, className, ...props }: StepperProps) {
    return (
        <div
            className={cn("flex items-center w-full my-6", className)}
            {...props}
        >
            {steps.map((step, index) => {
                const isLast = index === steps.length - 1;

                return (
                    <div key={step.id} className="flex items-center flex-1">
                        {/* Step Marker */}
                        <div className="relative flex flex-col items-center">
                            <div
                                className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors duration-300 z-10 bg-dashboard-card",
                                    step.state === "completed"
                                        ? "border-emerald-500 bg-emerald-500 text-white"
                                        : step.state === "active"
                                          ? "border-dashboard-primary text-dashboard-primary"
                                          : "border-dashboard-border text-dashboard-muted-foreground",
                                )}
                            >
                                {step.state === "completed" ? (
                                    <Check className="w-4 h-4" />
                                ) : step.state === "active" ? (
                                    <div className="w-2.5 h-2.5 rounded-full bg-dashboard-primary" />
                                ) : (
                                    <div className="w-2 h-2 rounded-full bg-dashboard-border" />
                                )}
                            </div>

                            {/* Label */}
                            <div className="absolute top-10 flex flex-col items-center w-max min-w-[80px]">
                                <span
                                    className={cn(
                                        "text-xs font-semibold  tracking-wider",
                                        step.state === "completed"
                                            ? "text-emerald-500"
                                            : step.state === "active"
                                              ? "text-dashboard-primary"
                                              : "text-dashboard-muted-foreground",
                                    )}
                                >
                                    {step.label}
                                </span>
                                {step.subtitle && (
                                    <span
                                        className={cn(
                                            "text-[10px] mt-0.5  tracking-wide",
                                            step.state === "active"
                                                ? "text-dashboard-primary font-bold"
                                                : "text-dashboard-muted-foreground",
                                        )}
                                    >
                                        {step.subtitle}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Connector Line */}
                        {!isLast && (
                            <div className="flex-1 px-2">
                                <div
                                    className={cn(
                                        "h-1 rounded-full transition-colors duration-300",
                                        step.state === "completed"
                                            ? "bg-emerald-500"
                                            : "bg-dashboard-border",
                                    )}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
