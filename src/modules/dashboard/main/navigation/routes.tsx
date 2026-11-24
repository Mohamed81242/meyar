import type { FeatureRouteModule } from "@/router/routes.types";


import { billingRoutes } from "../features/billing/navigation";


export const dashboardRouteModule: FeatureRouteModule = {
    id: "dashboard",
    name: "Dashboard",
    basePath: "/dashboard",
    layout: "dashboard-main",
    routes: {
        children: [
     
            ...billingRoutes,
           
        ],
    },
};

export default dashboardRouteModule;
