import type { FeatureNavModule } from "@/navigation/nav.types";


import { billingNavItem } from "../features/billing/navigation";











export const billingNav: FeatureNavModule = {
    featureId: "billing",
    section: "Billing",
    module: "dashboard-main",
    items: [billingNavItem],
};


