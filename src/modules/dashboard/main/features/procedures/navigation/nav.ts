import type { NavItem } from "@/navigation/nav.types";
import { Folder } from "lucide-react"; 

export const proceduresNavItem: NavItem = {
    key: "procedures",
    labelKey: "procedures:title",
    label: "Procedures",
    href: "/dashboard/procedures",
    icon: Folder,
};

export default proceduresNavItem;
