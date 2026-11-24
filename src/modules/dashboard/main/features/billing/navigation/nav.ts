import { PERMISSIONS } from "@/auth";
import type { NavItem } from "@/navigation/nav.types";
import { Receipt } from "lucide-react"; 

export const billingNavItem: NavItem = {
    key: "billing",
    labelKey: "billing:title",
    label: "Billing",
    href: "/dashboard/billing",
    icon: Receipt,
    permissions: [PERMISSIONS.BILLING.VIEW_ANY, PERMISSIONS.BILLING.VIEW],
};

export default billingNavItem;
