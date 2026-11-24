import type { FeatureRouteModule } from "@/router/routes.types";

import { notificationsRoutes } from "../features/notifications/navigation/routes";


export const settingsRouteModule: FeatureRouteModule = {
    id: "settings",
    name: "Settings",
    basePath: "/dashboard/settings",
    layout: "dashboard-settings",
    routes: {
        children: [
      
      
            ...notificationsRoutes,
      
        ],
    },
};

export default settingsRouteModule;
