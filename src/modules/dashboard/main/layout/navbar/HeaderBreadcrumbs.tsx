import { useBreadcrumbs } from "@/navigation";
import { Link } from "react-router-dom";

export const HeaderBreadcrumbs = () => {
    const breadcrumbs = useBreadcrumbs();
    
    if (breadcrumbs.length <= 1) return null;
    
    const parentCrumbs = breadcrumbs.slice(0, -1);
    
    return (
        <div className="flex items-center gap-1.5 text-[11px] font-medium select-none mb-0.5 text-dashboard-muted-foreground/70">
            {parentCrumbs.map((crumb, idx) => (
                <div key={crumb.path} className="flex items-center gap-1.5">
                    {idx > 0 && (
                        <span className="text-dashboard-muted-foreground/30 select-none">/</span>
                    )}
                    <Link
                        to={crumb.path}
                        className="hover:text-dashboard-foreground hover:underline transition-colors"
                    >
                        {crumb.label}
                    </Link>
                </div>
            ))}
        </div>
    );
};
