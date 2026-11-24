import type { FeatureNavModule } from "@/navigation/nav.types";

import { billingNavItem } from "../features/billing/navigation";
import { myStatisticsNavItem } from "../features/my-statistics/navigation";
import { statisticsLiveNavItem } from "../features/statistics-live/navigation";
import { rolesAndPermissionsNavItem } from "../features/roles-and-permissions/navigation";
import { usersNavItem } from "../features/users/navigation";
import { companyClassificationsNavItem } from "../features/company-classifications/navigation";
import { companiesNavItem } from "../features/companies/navigation";
import { registrationOfCompaniesNavItem } from "../features/registration-of-companies/navigation";
import { companyTagsNavItem } from "../features/company-tags/navigation";
import { inspectionTypesNavItem } from "../features/inspection-types/navigation";
import { foldersOrClassificationsNavItem } from "../features/folders-or-classifications/navigation";
import { inspectionTemplatesNavItem } from "../features/inspection-templates/navigation";
import { evaluationOptionsNavItem } from "../features/evaluation-options/navigation";
import { inspectionTasksNavItem } from "../features/inspection-tasks/navigation";
import { proceduresNavItem } from "../features/procedures/navigation";
import { sortingMechanismsNavItem } from "../features/sorting-mechanisms/navigation";

export const myStatisticsNav: FeatureNavModule = {
    featureId: "my-statistics",
    section: "STATISTICS",
    module: "dashboard-main",
    items: [myStatisticsNavItem],
};

export const statisticsLiveNav: FeatureNavModule = {
    featureId: "statistics-live",
    section: "STATISTICS",
    module: "dashboard-main",
    items: [statisticsLiveNavItem],
};

export const rolesAndPermissionsNav: FeatureNavModule = {
    featureId: "roles-and-permissions",
    section: "USER MANAGEMENT",
    module: "dashboard-main",
    items: [rolesAndPermissionsNavItem],
};

export const usersNav: FeatureNavModule = {
    featureId: "users",
    section: "USER MANAGEMENT",
    module: "dashboard-main",
    items: [usersNavItem],
};

export const companyClassificationsNav: FeatureNavModule = {
    featureId: "company-classifications",
    section: "COMPANY MANAGEMENT",
    module: "dashboard-main",
    items: [companyClassificationsNavItem],
};

export const companiesNav: FeatureNavModule = {
    featureId: "companies",
    section: "COMPANY MANAGEMENT",
    module: "dashboard-main",
    items: [companiesNavItem],
};

export const registrationOfCompaniesNav: FeatureNavModule = {
    featureId: "registration-of-companies",
    section: "COMPANY MANAGEMENT",
    module: "dashboard-main",
    items: [registrationOfCompaniesNavItem],
};

export const companyTagsNav: FeatureNavModule = {
    featureId: "company-tags",
    section: "COMPANY MANAGEMENT",
    module: "dashboard-main",
    items: [companyTagsNavItem],
};

export const inspectionTypesNav: FeatureNavModule = {
    featureId: "inspection-types",
    section: "INSPECTION MANAGEMENT",
    module: "dashboard-main",
    items: [inspectionTypesNavItem],
};

export const foldersOrClassificationsNav: FeatureNavModule = {
    featureId: "folders-or-classifications",
    section: "INSPECTION MANAGEMENT",
    module: "dashboard-main",
    items: [foldersOrClassificationsNavItem],
};

export const inspectionTemplatesNav: FeatureNavModule = {
    featureId: "inspection-templates",
    section: "INSPECTION MANAGEMENT",
    module: "dashboard-main",
    items: [inspectionTemplatesNavItem],
};

export const evaluationOptionsNav: FeatureNavModule = {
    featureId: "evaluation-options",
    section: "INSPECTION MANAGEMENT",
    module: "dashboard-main",
    items: [evaluationOptionsNavItem],
};

export const inspectionTasksNav: FeatureNavModule = {
    featureId: "inspection-tasks",
    section: "INSPECTION MANAGEMENT",
    module: "dashboard-main",
    items: [inspectionTasksNavItem],
};

export const proceduresNav: FeatureNavModule = {
    featureId: "procedures",
    section: "INSPECTION MANAGEMENT",
    module: "dashboard-main",
    items: [proceduresNavItem],
};

export const sortingMechanismsNav: FeatureNavModule = {
    featureId: "sorting-mechanisms",
    section: "REVIEW CRITERIA",
    module: "dashboard-main",
    items: [sortingMechanismsNavItem],
};

export const billingNav: FeatureNavModule = {
    featureId: "billing",
    section: "Billing",
    module: "dashboard-main",
    items: [billingNavItem],
};
