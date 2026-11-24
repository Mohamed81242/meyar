import type { NavItem } from "@/navigation/nav.types";
import { Folder } from "lucide-react"; 

export const myStatisticsNavItem: NavItem = {
    key: "my-statistics",
    labelKey: "my-statistics:title",
    label: "My Statistics",
    href: "/dashboard/my-statistics",
    icon: Folder,
};

export default myStatisticsNavItem;
