import { Button } from "@/design-system";
import { ArrowLeft } from "lucide-react";

interface Props {
    title?: string;
    subTitle?: string;
    back?: boolean;
    action?: {
        onAction?: () => void;
        Icon?: any;
        label?: string;
    };
      children?: React.ReactNode;
}

export const DashHeader = ({ title, subTitle, back, action, children }: Props) => {
    return (
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex gap-2">
                {back && (
                    <button onClick={() => window.history.back()}>
                        <ArrowLeft className="rtl:rotate-180" />
                    </button>
                )}
                <div>
                    {title && (
                        <h1 className="text-2xl font-bold text-dashboard-foreground tracking-tight">
                            {title}
                        </h1>
                    )}
                    {subTitle && (
                        <p className="text-dashboard-muted-foreground text-sm mt-1">
                            {subTitle}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3">
                {children}
                {action && (
                    <Button
                        onClick={action.onAction}
                        className="rounded-dashboard-radius h-10 px-4 bg-dashboard-primary text-white shadow-sm hover:bg-dashboard-primary/90 transition-all font-medium text-sm gap-2"
                    >
                        {action.Icon && <action.Icon className="h-4 w-4" />}
                        {action.label}
                    </Button>
                )}
            </div>
        </div>
    );
};
