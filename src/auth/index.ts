/**
 * Auth Module - Public Exports
 *
 * Centralized auth and permissions system.
 *
 * @example
 * ```tsx
 * import {
 *     ProtectedRoute,
 *     HasPermission,
 *     PermissionProvider,
 *     usePermissions,
 *     tokenService,
 *     PERMISSIONS,
 * } from '@/auth';
 *
 * // Route protection
 * <ProtectedRoute roles={['admin']} permissions={[PERMISSIONS.USERS.VIEW]}>
 *     <UsersPage />
 * </ProtectedRoute>
 *
 * // Conditional rendering
 * <HasPermission permission={PERMISSIONS.USERS.CREATE}>
 *     <CreateButton />
 * </HasPermission>
 *
 * // Hook usage
 * const { hasPermission } = usePermissions();
 * if (hasPermission(PERMISSIONS.USERS.UPDATE)) { ... }
 * ```
 */

// Types
export type {
    ApiPermission,
    AuthContextValue,
    HasPermissionProps,
    JwtPayload,
    Permission,
    PermissionActions,
    PermissionGroup,
    PermissionGroupApiResponse,
    PermissionState,
    ProtectedRouteProps,
    RolePermissions,
    TokenPair,
} from "./auth.types";

// Permission Constants
export {
    PERMISSION_ALIASES,
    PERMISSION_GROUPS,
    PERMISSIONS,
} from "./permissions.constants";
export type {
    PermissionGroupName,
    PermissionValue,
} from "./permissions.constants";

// Stores
export { authStore } from "./auth.store";

// Token & Device Services
export { tokenService } from "./tokenService";
export { getDeviceName, getOrCreateDeviceId } from "./deviceService";

// Hooks
export {
    useFilteredNavigation,
    useNavItemVisible,
} from "./useFilteredNavigation";
export { usePermissions } from "./usePermissions";

// Components
export { AuthSyncProvider } from "./AuthSyncProvider";
export { HasPermission } from "./HasPermission";
export {
    PermissionButton,
    PermissionLink,
    PermissionWrapper,
    useActionPermissions,
} from "./PermissionAction";
export { PermissionProvider } from "./PermissionProvider";
export { PermissionRoute } from "./PermissionRoute";
export { ProtectedRoute } from "./ProtectedRoute";

// Permission Config
export {
    bannerPermissions,
    bannersPermissions,
    billingPermissions,
    courtPermissions,
    courtsPermissions,
    createCrudPermissionConfig,
    createResourcePermissions,
    dashboardPermissions,
    faqPermissions,
    featurePermissions,
    groupPermissions,
    groupsPermissions,
    notaPermissions,
    notasPermissions,
    notificationPermissions,
    notificationsPermissions,
    overviewPermissions,
    rolePermissions,
    rolesPermissions,
    servicePermissions,
    servicesPermissions,
    settingPermissions,
    settingsPermissions,
    userPermissions,
    usersPermissions,
} from "./permission.config";
export type {
    ActionPermissionConfig,
    FeaturePermissionConfig,
    ResourcePermissions,
    RoutePermissionConfig,
} from "./permission.config";
