import type { NavItem } from "@/navigation/nav.types";
import { Folder } from "lucide-react"; 

export const usersNavItem: NavItem = {
    key: "users",
    labelKey: "users:title",
    label: "Users",
    href: "/dashboard/users",
    icon: Folder,
};

export default usersNavItem;
