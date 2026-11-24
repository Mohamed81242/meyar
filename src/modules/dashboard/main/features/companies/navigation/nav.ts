import type { NavItem } from "@/navigation/nav.types";
import { Folder } from "lucide-react"; 

export const companiesNavItem: NavItem = {
    key: "companies",
    labelKey: "companies:title",
    label: "Companies",
    href: "/dashboard/companies",
    icon: Folder,
};

export default companiesNavItem;
