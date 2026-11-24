import type { FeatureRouteModule } from "@/router/routes.types";

import { billingRoutes } from "../features/billing/navigation";
import { myStatisticsRoutes } from "../features/my-statistics/navigation";
import { statisticsLiveRoutes } from "../features/statistics-live/navigation";
import { rolesAndPermissionsRoutes } from "../features/roles-and-permissions/navigation";
import { usersRoutes } from "../features/users/navigation";
import { companyClassificationsRoutes } from "../features/company-classifications/navigation";
import { companiesRoutes } from "../features/companies/navigation";
import { registrationOfCompaniesRoutes } from "../features/registration-of-companies/navigation";
import { companyTagsRoutes } from "../features/company-tags/navigation";
import { inspectionTypesRoutes } from "../features/inspection-types/navigation";
import { foldersOrClassificationsRoutes } from "../features/folders-or-classifications/navigation";
import { inspectionTemplatesRoutes } from "../features/inspection-templates/navigation";
import { evaluationOptionsRoutes } from "../features/evaluation-options/navigation";
import { inspectionTasksRoutes } from "../features/inspection-tasks/navigation";
import { proceduresRoutes } from "../features/procedures/navigation";
import { sortingMechanismsRoutes } from "../features/sorting-mechanisms/navigation";

export const dashboardRouteModule: FeatureRouteModule = {
    id: "dashboard",
    name: "Dashboard",
    basePath: "/dashboard",
    layout: "dashboard-main",
    routes: {
        children: [
            ...billingRoutes,
            ...myStatisticsRoutes,
            ...statisticsLiveRoutes,
            ...rolesAndPermissionsRoutes,
            ...usersRoutes,
            ...companyClassificationsRoutes,
            ...companiesRoutes,
            ...registrationOfCompaniesRoutes,
            ...companyTagsRoutes,
            ...inspectionTypesRoutes,
            ...foldersOrClassificationsRoutes,
            ...inspectionTemplatesRoutes,
            ...evaluationOptionsRoutes,
            ...inspectionTasksRoutes,
            ...proceduresRoutes,
            ...sortingMechanismsRoutes,
        ],
    },
};

export default dashboardRouteModule;
