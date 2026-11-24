import type { NavItem } from "@/navigation/nav.types";
import { GitBranch } from "lucide-react"; 

export const proceduresNavItem: NavItem = {
    key: "procedures",
    labelKey: "procedures:title",
    label: "Procedures",
    href: "/dashboard/procedures",
    icon: GitBranch,
};

export default proceduresNavItem;
