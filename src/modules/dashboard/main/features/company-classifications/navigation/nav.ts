import type { NavItem } from "@/navigation/nav.types";
import { Folder } from "lucide-react"; 

export const companyClassificationsNavItem: NavItem = {
    key: "company-classifications",
    labelKey: "company-classifications:title",
    label: "Company Classifications",
    href: "/dashboard/company-classifications",
    icon: Folder,
};

export default companyClassificationsNavItem;
