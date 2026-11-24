import type { NavItem } from "@/navigation/nav.types";
import { ArrowUpDown } from "lucide-react"; 

export const sortingMechanismsNavItem: NavItem = {
    key: "sorting-mechanisms",
    labelKey: "sorting-mechanisms:title",
    label: "Sorting Mechanisms",
    href: "/dashboard/sorting-mechanisms",
    icon: ArrowUpDown,
};

export default sortingMechanismsNavItem;
