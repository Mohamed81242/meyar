import { useLocation, useMatches } from "react-router-dom";
import { useNavItems } from "./useNavItems";
import type { BreadcrumbItem } from "@/router/routes.types";
import { useLanguage } from "@/shared/hooks";
import { useQueryClient } from "@tanstack/react-query";

export function useBreadcrumbs(): BreadcrumbItem[] {
    const location = useLocation();
    const matches = useMatches();
    const { t } = useLanguage();
    const { flatItems, findByHref } = useNavItems();
    const queryClient = useQueryClient();

    const rawCrumbs: BreadcrumbItem[] = [];

    // Split path to build all breadcrumb levels (excluding "dashboard")
    const segments = location.pathname.split("/").filter(Boolean);
    const levels = segments
        .map((_, idx) => "/" + segments.slice(0, idx + 1).join("/"))
        .filter((path) => path !== "/dashboard");

    levels.forEach((levelPath) => {
        // Find matching route config in react-router matches
        const match = matches.find(
            (m) => m.pathname === levelPath || m.pathname.replace(/\/$/, "") === levelPath
        );
        const handle = match?.handle as any;

        let label = "";

        if (handle?.crumb) {
            label = typeof handle.crumb === "function"
                ? handle.crumb(match?.params, queryClient)
                : handle.crumb;
        } else if (handle?.meta) {
            const meta = handle.meta;
            if (meta.titleKey) {
                label = t(meta.titleKey) as string;
            } else if (meta.title) {
                label = meta.title;
            }
        }

        // Fallback to nav item label
        if (!label) {
            const navItem = findByHref(levelPath);
            if (navItem) {
                label = navItem.labelKey ? (t(navItem.labelKey) as string) : navItem.label;
            }
        }

        // Fallback to segment name capitalized
        if (!label) {
            const segment = levelPath.split("/").pop() || "";
            label = segment.charAt(0).toUpperCase() + segment.slice(1);
        }

        // If the path is a module root (e.g. "/dashboard/people"), redirect to first subitem
        let redirectPath = levelPath;
        const subItem = flatItems.find((item) => item.href.startsWith(`${levelPath}/`));
        if (subItem) {
            redirectPath = subItem.href;
        }

        rawCrumbs.push({
            path: redirectPath,
            label,
        });
    });

    // Clean up duplicates if any
    const uniqueCrumbs: BreadcrumbItem[] = [];
    rawCrumbs.forEach((crumb) => {
        if (!uniqueCrumbs.some((c) => c.path === crumb.path)) {
            uniqueCrumbs.push(crumb);
        }
    });

    // Always slice to include only the last two segments
    return uniqueCrumbs.slice(-2);
}
