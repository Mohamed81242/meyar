import type { NavItem } from "@/navigation/nav.types";
import { Folder } from "lucide-react"; 

export const inspectionTemplatesNavItem: NavItem = {
    key: "inspection-templates",
    labelKey: "inspection-templates:title",
    label: "Inspection Templates",
    href: "/dashboard/inspection-templates",
    icon: Folder,
};

export default inspectionTemplatesNavItem;
