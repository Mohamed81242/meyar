import type { NavItem } from "@/navigation/nav.types";
import { Folder } from "lucide-react"; 

export const foldersOrClassificationsNavItem: NavItem = {
    key: "folders-or-classifications",
    labelKey: "folders-or-classifications:title",
    label: "Folders Or Classifications",
    href: "/dashboard/folders-or-classifications",
    icon: Folder,
};

export default foldersOrClassificationsNavItem;
