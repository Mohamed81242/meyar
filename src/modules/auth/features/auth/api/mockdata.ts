import {
    ApiPermission,
    PermissionGroupApiResponse,
    RoleWithPermissions,
    User,
} from "@/auth/auth.types";
import { PERMISSIONS } from "@/auth/permissions.constants";

export const mockUser: User = {
    id: "user-123",
    name: "Admin User",
    email: "admin@example.com",
    image: "https://i.pravatar.cc/150?u=user-123",
    isFirstTimeUser: false,
    role: {
        id: "role-1",
        name: "admin",
        caption: "Administrator",
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z",
    },
    emailVerified: true,
    phoneVerified: true,
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
    token: "mock-jwt-token-xyz-789",
    isActive: true,
    phoneNumber: "01011111111",
    phoneCode: "+20",
    permissions: [
        "*", // Super-admin wildcard access
        "overview.view",
        "users.viewAny",
        "users.view",
        "users.create",
        "users.update",
        "users.delete",
        "groups.viewAny",
        "groups.view",
        "groups.create",
        "groups.update",
        "groups.delete",
        "notas.viewAny",
        "notas.view",
        "notas.create",
        "notas.update",
        "notas.delete",
        "billing.viewAny",
        "billing.view",
        "billing.create",
        "billing.update",
        "billing.delete",
        "banners.viewAny",
        "banners.view",
        "banners.create",
        "banners.update",
        "banners.delete",
        "settings.viewAny",
        "settings.view",
        "settings.create",
        "settings.update",
        "settings.delete",
        "notifications.viewAny",
        "notifications.view",
        "notifications.create",
        "notifications.update",
        "notifications.delete",
        "roles.viewAny",
        "roles.view",
        "roles.create",
        "roles.update",
        "roles.delete",
        "services.viewAny",
        "services.view",
        "services.create",
        "services.update",
        "services.delete",
        "courts.viewAny",
        "courts.view",
        "courts.create",
        "courts.update",
        "courts.delete",
        "faq.viewAny",
        "faq.view",
        "faq.create",
        "faq.update",
        "faq.delete",
    ],
};

let permId = 1;
export const mockApiPermissions: ApiPermission[] = Object.entries(PERMISSIONS).flatMap(
    ([groupKey, actions]) =>
        Object.entries(actions).map(([actionKey, actionValue]) => ({
            id: permId++,
            group: groupKey.toLowerCase(),
            name: actionValue as string,
            caption: `${actionKey} ${groupKey}`,
            scope: "global",
            scopeLabel: "Global",
            createdAt: "2023-01-01T00:00:00.000Z",
            updatedAt: "2023-01-01T00:00:00.000Z",
        }))
);

export const mockPermissionGroups: PermissionGroupApiResponse[] = Object.entries(PERMISSIONS).map(
    ([groupKey, actions]) => ({
        name: groupKey.toLowerCase(),
        permissions: Object.values(actions).map((val) => {
            const found = mockApiPermissions.find((p) => p.name === val);
            return (
                found || {
                    id: permId++,
                    group: groupKey.toLowerCase(),
                    name: val as string,
                    caption: val as string,
                    scope: "global",
                    scopeLabel: "Global",
                    createdAt: "2023-01-01T00:00:00.000Z",
                    updatedAt: "2023-01-01T00:00:00.000Z",
                }
            );
        }),
    })
);

export const mockRolesWithPermissions: RoleWithPermissions[] = [
    {
        id: 1,
        name: "admin",
        caption: "Administrator",
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z",
        permissions: mockApiPermissions,
    },
];

export const mockSuccessMessage = {
    message: "Operation completed successfully.",
};

export const mockResetPasswordResponse = {
    verifyToken: "mock-verify-token",
    password: "mock-password",
};

// Export all mocks in a single object for convenience if needed
export const authMockData = {
    user: mockUser,
    permissions: mockApiPermissions,
    permissionGroups: mockPermissionGroups,
    rolesWithPermissions: mockRolesWithPermissions,
    success: mockSuccessMessage,
    resetPassword: mockResetPasswordResponse,
};