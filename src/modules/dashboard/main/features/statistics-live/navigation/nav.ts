import type { NavItem } from "@/navigation/nav.types";
import { Folder } from "lucide-react"; 

export const statisticsLiveNavItem: NavItem = {
    key: "statistics-live",
    labelKey: "statistics-live:title",
    label: "Statistics Live",
    href: "/dashboard/statistics-live",
    icon: Folder,
};

export default statisticsLiveNavItem;
