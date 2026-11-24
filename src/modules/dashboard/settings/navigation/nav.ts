import type { FeatureNavModule } from "@/navigation/nav.types";


import { notificationsNavItem } from "../features/notifications/navigation/nav";






export const notificationsNav: FeatureNavModule = {
    featureId: "notifications",
    section: "Settings",
    module: "dashboard-settings",
    order: 4,
    items: [notificationsNavItem],
};











export const settingsNavModule: FeatureNavModule = {
    featureId: "settings-workspace",
    section: "Settings",
    order: 1,
    module: "dashboard-settings",
    items: [
        notificationsNavItem,
      
    ],
};

export default settingsNavModule;
