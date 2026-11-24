import type { NavItem } from "@/navigation/nav.types";
import { Folder } from "lucide-react"; 

export const rolesAndPermissionsNavItem: NavItem = {
    key: "roles-and-permissions",
    labelKey: "roles-and-permissions:title",
    label: "Roles And Permissions",
    href: "/dashboard/roles-and-permissions",
    icon: Folder,
};

export default rolesAndPermissionsNavItem;
