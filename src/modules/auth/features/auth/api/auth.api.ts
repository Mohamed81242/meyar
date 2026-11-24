/**
 * Auth API
 *
 * Raw API calls for the auth feature.
 */

import {
    ApiPermission,
    LoginData,
    LoginMagicLinkData,
    PermissionGroupApiResponse,
    PhoneVerifyData,
    ResetPasswordData,
    RoleWithPermissions,
    User,
    UserAuthPermissionsData,
} from "@/auth/auth.types";
import { getDeviceName } from "@/auth/deviceService";
import { api, ListQueryParams, SingleResponse } from "@/shared/api";
import {
    mockUser,
    mockApiPermissions,
    mockPermissionGroups,
    mockRolesWithPermissions,
    mockSuccessMessage,
    mockResetPasswordResponse,
} from "./mockdata";
import { API_CONFIG } from "@/shared/api/config/env";

const USE_MOCK = API_CONFIG.USE_MOCK_DATA || false;

/**
 * Get all permissions (system-managements/permissions)
 */
function getAllPermissions(
    params?: ListQueryParams & { group?: false },
    signal?: AbortSignal,
): Promise<SingleResponse<ApiPermission[]>>;
function getAllPermissions(
    params: ListQueryParams & { group: true },
    signal?: AbortSignal,
): Promise<SingleResponse<PermissionGroupApiResponse[]>>;
async function getAllPermissions(
    params?: ListQueryParams & { group?: boolean },
    signal?: AbortSignal,
): Promise<SingleResponse<ApiPermission[] | PermissionGroupApiResponse[]>> {
    const { group = false, ...queryParams } = params || {};
    if (USE_MOCK) {
        return {
            data: group
                ? (mockPermissionGroups as PermissionGroupApiResponse[])
                : (mockApiPermissions as ApiPermission[]),
        };
    }

    const response = await api.get<
        SingleResponse<ApiPermission[] | PermissionGroupApiResponse[]>
    >("/system-managements/permissions", {
        params: {
            ...(group !== undefined && { group: String(group) }),
            ...queryParams,
        },
        signal,
    });
    if (response.error) {
        throw new Error(
            response.error.message || "Failed to fetch permissions",
        );
    }
    return response.data!;
}

/**
 * Get user's assigned permissions (auth/permissions)
 */
function getAuthPermissions(
    params?: { group?: false },
    signal?: AbortSignal,
): Promise<SingleResponse<UserAuthPermissionsData | ApiPermission[] | string[]>>;
function getAuthPermissions(
    params: { group: true },
    signal?: AbortSignal,
): Promise<SingleResponse<PermissionGroupApiResponse[]>>;
async function getAuthPermissions(
    params?: { group?: boolean },
    signal?: AbortSignal,
): Promise<SingleResponse<UserAuthPermissionsData | ApiPermission[] | string[] | PermissionGroupApiResponse[]>> {
    const { group = false } = params || {};
    if (USE_MOCK) {
        return {
            data: group
                ? (mockPermissionGroups as PermissionGroupApiResponse[])
                : (mockApiPermissions as ApiPermission[]),
        };
    }

    const response = await api.get<
        SingleResponse<UserAuthPermissionsData | ApiPermission[] | string[] | PermissionGroupApiResponse[]>
    >("/auth/permissions", {
        params: { ...(group !== undefined && { group: String(group) }) },
        signal,
    });
    if (response.error) {
        throw new Error(
            response.error.message || "Failed to fetch user permissions",
        );
    }
    return response.data!;
}

/**
 * Get permissions by role ID (system-managements/role-permissions/role/{roleId})
 */
async function getPermissionsByRoleId(
    roleId: string | number,
    signal?: AbortSignal,
): Promise<SingleResponse<RoleWithPermissions[]>> {
    if (USE_MOCK) {
        return {
            data: mockRolesWithPermissions,
        };
    }

    try {
        const response = await api.get<SingleResponse<RoleWithPermissions[]>>(
            `/system-managements/role-permissions/role/${roleId}`,
            { signal },
        );
        if (response.error) {
            throw new Error(
                response.error.message || "Failed to fetch role permissions",
            );
        }
        return response.data!;
    } catch (err) {
        console.warn("[Auth API] Fallback to local role permissions dataset:", err);
        return {
            data: mockRolesWithPermissions,
        };
    }
}

export const authApi = {
    /**
     * Login
     */
    login: async (credentials?: LoginData): Promise<any> => {
        const identifier = credentials?.identifier || credentials?.email || credentials?.phone || "";
        const payload = {
            identifier,
            password: credentials?.password || "",
            deviceName: credentials?.deviceName || getDeviceName(),
        };

        if (USE_MOCK) {
            // Simulate simple credential validation
            if (
                identifier !== "admin@example.com" ||
                credentials?.password !== "password"
            ) {
                throw new Error("Invalid credentials");
            }
            return {
                data: {
                    token: "5|mock_token_12345",
                    user: mockUser,
                },
            };
        }

        const response = await api.post<SingleResponse<{ token: string; user: User }>>(
            "/auth/login",
            payload,
        );
        if (response.error) {
            throw new Error(response.error.message || "Failed to login");
        }
        return response.data!;
    },

    /**
     * Login with magic link
     */
    loginWithMagicLink: async (data: LoginMagicLinkData) => {
        if (USE_MOCK) {
            return {
                data: mockUser,
            };
        }
        const response = await api.post<SingleResponse<User>>(
            "/auth/magic/request",
            data,
        );
        if (response.error) {
            throw new Error(
                response.error.message || "Failed to login with magic link",
            );
        }
        return response.data!;
    },

    /**
     * Verify magic link
     */
    verifyMagicLink: async (magicToken: string) => {
        if (USE_MOCK) {
            return {
                data: mockUser,
            };
        }
        const response = await api.get<SingleResponse<User>>(
            `/auth/login/magic/${magicToken}/verify`,
        );
        if (response.error) {
            throw new Error(
                response.error.message || "Failed to verify magic link",
            );
        }
        return response.data!;
    },

    /**
     * Logout
     */
    logout: async () => {
        if (USE_MOCK) {
            return {
                data: mockSuccessMessage,
            };
        }
        const response = await api.post("/auth/logout");
        if (response.error) {
            throw new Error(response.error.message || "Failed to logout");
        }
        return response.data!;
    },

    /**
     * Send sign up verification code
     */
    sendSignUpVerificationCode: async (email: string) => {
        if (USE_MOCK) {
            return {
                data: mockSuccessMessage,
            };
        }
        const response = await api.post("/auth/verify/email/send-otp", { email });
        if (response.error) {
            throw new Error(
                response.error.message || "Failed to send verification code",
            );
        }
        return response.data!;
    },

    /**
     * Verify sign up
     */
    verifySignUp: async (data: { email: string; code: string }) => {
        if (USE_MOCK) {
            return {
                data: mockSuccessMessage,
            };
        }
        const response = await api.post<SingleResponse<{ message: string }>>(
            "/auth/verify/email",
            data,
        );
        if (response.error) {
            throw new Error(
                response.error.message || "Failed to verify sign up",
            );
        }
        return response.data!;
    },

    /**
     * Send phone verification code
     */
    sendPhoneVerificationCode: async (data: PhoneVerifyData) => {
        if (USE_MOCK) {
            return {
                data: mockSuccessMessage,
            };
        }
        const response = await api.post<SingleResponse<{ message: string }>>(
            "/auth/verify/phone/send-otp",
            data,
        );
        if (response.error) {
            throw new Error(
                response.error.message || "Failed to send verification code",
            );
        }
        return response.data!;
    },

    /**
     * Verify phone
     */
    verifyPhone: async (data: PhoneVerifyData & { code: string }) => {
        if (USE_MOCK) {
            return {
                data: mockSuccessMessage,
            };
        }
        const response = await api.post<SingleResponse<{ message: string }>>(
            "/auth/verify/phone",
            data,
        );
        if (response.error) {
            throw new Error(response.error.message || "Failed to verify phone");
        }
        return response.data!;
    },

    /**
     * Get profile
     */
    profile: async () => {
        if (USE_MOCK) {
            return {
                data: mockUser,
            };
        }
        const response = await api.get<SingleResponse<User>>("/auth/profile");
        if (response.error) {
            throw new Error(response.error.message || "Failed to get profile");
        }
        return response.data!;
    },

    /**
     * Update profile
     */
    updateProfile: async (data: FormData) => {
        if (USE_MOCK) {
            return {
                data: mockUser,
            };
        }
        const response = await api.post<SingleResponse<User>>(
            "/auth/profile",
            data,
        );
        if (response.error) {
            throw new Error(
                response.error.message || "Failed to update profile",
            );
        }
        return response.data!;
    },

    /**
     * Send forgot password verification code
     */
    sendForgotPasswordVerificationCode: async (data: { email: string }) => {
        if (USE_MOCK) {
            return {
                data: mockSuccessMessage,
            };
        }
        const response = await api.post<SingleResponse<{ message: string }>>(
            "/auth/forgot-password",
            data,
        );
        if (response.error) {
            throw new Error(
                response.error.message ||
                "Failed to send forgot password verification code",
            );
        }
        return response.data!;
    },

    /**
     * Resend forgot password verification code
     */
    resendForgotPasswordVerificationCode: async (data: { email: string }) => {
        if (USE_MOCK) {
            return {
                data: mockSuccessMessage,
            };
        }
        const response = await api.post<SingleResponse<{ message: string }>>(
            "/auth/forgot-password/resend",
            data,
        );
        if (response.error) {
            throw new Error(
                response.error.message ||
                "Failed to resend forgot password verification code",
            );
        }
        return response.data!;
    },

    /**
     * Verify forgot password verification code
     */
    verifyForgotPasswordVerificationCode: async (data: {
        email: string;
        code: string;
    }) => {
        if (USE_MOCK) {
            return {
                data: { ...mockSuccessMessage, verify_token: "mock_token" },
            };
        }
        const response = await api.post<SingleResponse<{ message: string; verify_token?: string }>>(
            "/auth/forgot-verify-code",
            data,
        );
        if (response.error) {
            throw new Error(
                response.error.message || "Failed to verify forgot password",
            );
        }
        return response.data!;
    },

    /**
     * Reset password
     */
    resetPassword: async (data: ResetPasswordData) => {
        if (USE_MOCK) {
            return {
                data: mockResetPasswordResponse,
            };
        }
        const response = await api.post<SingleResponse<ResetPasswordData>>(
            "/auth/reset-password",
            {
                verify_token: data.verifyToken,
                password: data.password,
            },
        );
        if (response.error) {
            throw new Error(
                response.error.message || "Failed to reset password",
            );
        }
        return response.data!;
    },

    /**
     * Change password
     */
    changePassword: async (data: {
        currentPassword: string;
        newPassword: string;
        newPasswordConfirmation: string;
    }) => {
        if (USE_MOCK) {
            return {
                data: mockSuccessMessage,
            };
        }
        const response = await api.put<SingleResponse<{ message: string }>>(
            "/auth/change-password",
            data,
        );
        if (response.error) {
            throw new Error(
                response.error.message || "Failed to change password",
            );
        }
        return response.data!;
    },

    /**
     * Update role permissions
     */
    updateRolePermissions: async ({
        roleId,
        add,
        remove,
    }: {
        roleId: string | number;
        add: number[];
        remove: number[];
    }) => {
        if (USE_MOCK) {
            return {
                data: mockSuccessMessage,
            };
        }
        const response = await api.put<SingleResponse<{ message: string }>>(
            `/system-managements/role-permissions/role/${roleId}`,
            { add, remove },
        );
        if (response.error) {
            throw new Error(
                response.error.message || "Failed to update role permissions",
            );
        }
        return response.data!;
    },

    /**
     * Get all permissions
     */
    getAllPermissions,
    getAuthPermissions,
    getPermissionsByRoleId,
} as const;
