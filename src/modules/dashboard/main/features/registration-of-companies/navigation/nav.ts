import type { NavItem } from "@/navigation/nav.types";
import { Folder } from "lucide-react"; 

export const registrationOfCompaniesNavItem: NavItem = {
    key: "registration-of-companies",
    labelKey: "registration-of-companies:title",
    label: "Registration Of Companies",
    href: "/dashboard/registration-of-companies",
    icon: Folder,
};

export default registrationOfCompaniesNavItem;
