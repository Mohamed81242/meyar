import type { FeatureRouteModule, RouteConfig } from "@/router/routes.types";

const siteRoutes: RouteConfig[] = [
    {
        index: true,
        lazy: () => import("@/modules/landing/features/landing/pages/LandingPage"),
        meta: { titleKey: "landing:nav.home" },
    },
    {
        path: "privacy",
        lazy: () => import("@/modules/landing/features/landing/pages/PrivacyPage"),
        meta: { title: "Privacy Policy | سياسة الخصوصية" },
    },
    {
        path: "delete-account",
        lazy: () => import("@/modules/landing/features/landing/pages/DeleteAccountPage"),
        meta: { title: "Delete Account | حذف الحساب" },
    },
    {
        path: "support",
        lazy: () => import("@/modules/landing/features/landing/pages/SupportPage"),
        meta: { title: "Support & Help Center | الدعم الفني" },
    },
];

export const siteManagementRoutes: FeatureRouteModule= {
    id: "site",
    name: "Public Site",
    basePath: "",
    layout: "site",
    routes: {
        meta: {
            title: "Site",
            requiresAuth: false,
        },
        children: siteRoutes,
    },
};

export default siteManagementRoutes;
