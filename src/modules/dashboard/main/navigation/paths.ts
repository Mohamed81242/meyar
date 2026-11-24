
import { billingPaths } from "../features/billing/navigation";



export const dashboardPaths = {
     root: () => billingPaths.main,

    billing: billingPaths,

    
} as const;
