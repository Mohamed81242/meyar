import { PERMISSIONS } from "@/auth";
import type { NavItem } from "@/navigation/nav.types";
import { Bell } from "lucide-react";
import { notificationsPaths } from "./paths";

export const notificationsNavItem: NavItem = {
    key: "notifications",
    labelKey: "notifications:title",
    label: "Notifications",
    href: notificationsPaths.main,
    icon: Bell,
    hidden:true,
    permissions: [PERMISSIONS.NOTIFICATIONS.VIEW_ANY, PERMISSIONS.NOTIFICATIONS.VIEW],
};

export default notificationsNavItem;
