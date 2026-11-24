import type { NavItem } from "@/navigation/nav.types";
import { Folder } from "lucide-react"; 

export const evaluationOptionsNavItem: NavItem = {
    key: "evaluation-options",
    labelKey: "evaluation-options:title",
    label: "Evaluation Options",
    href: "/dashboard/evaluation-options",
    icon: Folder,
};

export default evaluationOptionsNavItem;
