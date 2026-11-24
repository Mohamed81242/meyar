import {
    useDashboardTheme,
    useThemeCustomizer,
} from "@/modules/hooks/useDashboardTheme";
import { useBreadcrumbs } from "@/navigation";
import { useLanguage } from "@/shared/hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
    isSidebarCollapsed: boolean;
    setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Navbar = ({
    isSidebarCollapsed,
    setIsSidebarCollapsed,
}: Props) => {
    const navigate = useNavigate();
    const { currentLanguage, changeLanguage } = useLanguage();

    const { draftPrimary, setDraftPrimary, save, reset, cancel, darkMode } =
        useThemeCustomizer();

    const { setDarkMode } = useDashboardTheme();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleOpenChange = (open: boolean) => {
        setIsDropdownOpen(open);
        if (!open) {
            cancel();
        }
    };
    const breadcrumbs = useBreadcrumbs();
    const handleSave = () => {
        save();
        setIsDropdownOpen(false);
    };

    const handleReset = () => {
        reset();
        setIsDropdownOpen(false);
    };

    return (
        <header className="h-10 shrink-0 flex items-center justify-between px-6  border mx-[.7rem] border-dashboard-chart-5/15 m bg-dashboard-accent z-40 rounded-tr-dashboard rounded-tl-dashboard mt-[.7rem] ">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-dashboard-foreground hover:bg-dashboard-secondary hover:text-dashboard-muted-foreground transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M9 3v18" />
                    </svg>
                </button>
                {breadcrumbs.length > 1 && (
                    <>
                        {/* <span className="text-dashboard-muted-foreground mx-1 text-sm font-medium">/</span> */}
                        <span className="font-medium text-[13px] text-dashboard-foreground px-1.5 py-1">
                            {breadcrumbs[breadcrumbs.length - 1].label}
                        </span>
                    </>
                )}
            </div>
        </header>
    );
};
