import { LucidIconRender } from "./LucidIconRender";

interface StatusCardsProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
}
export default function StatusCards({
    icon,   
    title,
    value,
}:StatusCardsProps){
    return(
        <div className="bg-dashboard-card border border-dashboard-border rounded-dashboard p-6 flex flex-col gap-4   justify-between">
            
            <div className="flex items-center gap-3">
                <span className="w-10  h-10 bg-dashboard-primary/10 text-dashboard-primary rounded-dashboard-radius flex items-center justify-center">
                    <LucidIconRender iconName={icon} />
                </span>
                <h5 className="text-dashboard-foreground text-sm font-bold">
                    {title}
                </h5>
            </div>
            <p className="text-dashboard-foreground pl-14 text-sm font-bold">
                {value}
            </p>
        </div>
    )
}
