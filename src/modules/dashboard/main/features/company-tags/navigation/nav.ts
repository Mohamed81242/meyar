import type { NavItem } from "@/navigation/nav.types";
import { Folder } from "lucide-react"; 

export const companyTagsNavItem: NavItem = {
    key: "company-tags",
    labelKey: "company-tags:title",
    label: "Company Tags",
    href: "/dashboard/company-tags",
    icon: Folder,
};

export default companyTagsNavItem;
