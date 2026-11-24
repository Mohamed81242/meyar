import type { NavItem } from "@/navigation/nav.types";
import { Folder } from "lucide-react"; 

export const inspectionTasksNavItem: NavItem = {
    key: "inspection-tasks",
    labelKey: "inspection-tasks:title",
    label: "Inspection Tasks",
    href: "/dashboard/inspection-tasks",
    icon: Folder,
};

export default inspectionTasksNavItem;
