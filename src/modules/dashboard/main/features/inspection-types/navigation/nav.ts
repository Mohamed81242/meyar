import type { NavItem } from "@/navigation/nav.types";
import { Folder } from "lucide-react"; 

export const inspectionTypesNavItem: NavItem = {
    key: "inspection-types",
    labelKey: "inspection-types:title",
    label: "Inspection Types",
    href: "/dashboard/inspection-types",
    icon: Folder,
};

export default inspectionTypesNavItem;
