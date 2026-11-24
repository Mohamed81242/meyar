/**
 * Auth TanStack Query Mutations
 *
 * Mutation hooks for authentication operations.
 */

import { tokenService } from "@/auth";
import { authStore } from "@/auth/auth.store";
import type {
    LoginData,
    LoginMagicLinkData,
    PhoneVerifyData,
    ResetPasswordData,
    User,
} from "@/auth/auth.types";
import type { ApiError, SingleResponse } from "@/shared/api";
import {
    useMutation,
    useQueryClient,
    type UseMutationOptions,
} from "@tanstack/react-query";
import { authApi } from "./auth.api";
import { authQueryKeys } from "./auth.queries";

/**
 * Hook to login with email and password
 */
export function useLogin(
    options?: Omit<
        UseMutationOptions<any, ApiError, LoginData>,
        "mutationFn"
    >,
) {
    const queryClient = useQueryClient();
    const { setUser, setIsAuthenticated, setIsFirstTimeUser } = authStore();

    return useMutation({
        mutationFn: (data: LoginData) => authApi.login(data),
        onSuccess: async (res: any) => {
            setIsAuthenticated(true);

            const token = res?.data?.token || (typeof res?.data === "string" ? res.data : "");
            const userObj = res?.data?.user || res?.data;

            if (token) {
                tokenService.setTokens({
                    accessToken: token,
                });
            }

            if (userObj) {
                setUser(userObj);
                if (userObj.isFirstTimeUser !== undefined) {
                    setIsFirstTimeUser(userObj.isFirstTimeUser);
                }
            }

            queryClient.invalidateQueries({
                queryKey: authQueryKeys.profile(),
            });
        },
        ...options,
    });
}

/**
 * Hook to request magic link login
 */
export function useLoginWithMagicLink(
    options?: Omit<
        UseMutationOptions<SingleResponse<User>, ApiError, LoginMagicLinkData>,
        "mutationFn"
    >,
) {
    return useMutation({
        mutationFn: (data: LoginMagicLinkData) =>
            authApi.loginWithMagicLink(data),
        ...options,
    });
}

/**
 * Hook to logout
 * Always clears local storage and auth state, even if API call fails
 */
export function useLogout(
    options?: Omit<UseMutationOptions<any, ApiError, void>, "mutationFn">,
) {
    const queryClient = useQueryClient();

    const clearAuthState = () => {
        authStore.getState().setIsAuthenticated(false);
        authStore.getState().setUser(null);
        tokenService.clearTokens();
        queryClient.removeQueries({
            queryKey: authQueryKeys.all,
        });
    };

    return useMutation({
        mutationFn: () => authApi.logout(),
        onSuccess: () => {
            clearAuthState();
        },
        onError: () => {
            // Always clear auth state even if logout API fails
            // (e.g., token already expired, network error, etc.)
            clearAuthState();
        },
        ...options,
    });
}

/**
 * Hook to send sign up verification code
 */
export function useSendSignUpVerificationCode(
    options?: Omit<UseMutationOptions<any, ApiError, string>, "mutationFn">,
) {
    return useMutation({
        mutationFn: (email: string) =>
            authApi.sendSignUpVerificationCode(email),
        ...options,
    });
}

/**
 * Hook to verify sign up
 */
export function useVerifySignUp(
    options?: Omit<
        UseMutationOptions<
            SingleResponse<{ message: string }>,
            ApiError,
            { email: string; code: string }
        >,
        "mutationFn"
    >,
) {
    return useMutation({
        mutationFn: (data) => authApi.verifySignUp(data),
        ...options,
    });
}

/**
 * Hook to send phone verification code
 */
export function useSendPhoneVerificationCode(
    options?: Omit<
        UseMutationOptions<
            SingleResponse<{ message: string }>,
            ApiError,
            PhoneVerifyData
        >,
        "mutationFn"
    >,
) {
    return useMutation({
        mutationFn: (data) => authApi.sendPhoneVerificationCode(data),
        ...options,
    });
}

/**
 * Hook to verify phone
 */
export function useVerifyPhone(
    options?: Omit<
        UseMutationOptions<
            SingleResponse<{ message: string }>,
            ApiError,
            PhoneVerifyData & { code: string }
        >,
        "mutationFn"
    >,
) {
    return useMutation({
        mutationFn: (data) => authApi.verifyPhone(data),
        ...options,
    });
}

/**
 * Hook to update profile
 */
export function useUpdateProfile(
    options?: Omit<
        UseMutationOptions<SingleResponse<User>, ApiError, FormData>,
        "mutationFn"
    >,
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: FormData) => authApi.updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: authQueryKeys.profile(),
            });
        },
        ...options,
    });
}

/**
 * Hook to send forgot password verification code
 */
export function useSendForgotPasswordVerificationCode(
    options?: Omit<
        UseMutationOptions<
            SingleResponse<{ message: string }>,
            ApiError,
            { email: string }
        >,
        "mutationFn"
    >,
) {
    return useMutation({
        mutationFn: (data) => authApi.sendForgotPasswordVerificationCode(data),
        ...options,
    });
}

/**
 * Hook to verify forgot password code
 */
export function useVerifyForgotPasswordVerificationCode(
    options?: Omit<
        UseMutationOptions<
            SingleResponse<{ message: string }>,
            ApiError,
            { email: string; code: string }
        >,
        "mutationFn"
    >,
) {
    return useMutation({
        mutationFn: (data) =>
            authApi.verifyForgotPasswordVerificationCode(data),
        ...options,
    });
}

/**
 * Hook to reset password
 */
export function useResetPassword(
    options?: Omit<
        UseMutationOptions<
            SingleResponse<ResetPasswordData>,
            ApiError,
            ResetPasswordData
        >,
        "mutationFn"
    >,
) {
    return useMutation({
        mutationFn: (data) => authApi.resetPassword(data),
        ...options,
    });
}

/**
 * Hook to update role permissions
 */
export function useUpdateRolePermissions(
    options?: Omit<
        UseMutationOptions<
            SingleResponse<{ message: string }>,
            ApiError,
            { roleId: string | number; add: number[]; remove: number[] }
        >,
        "mutationFn"
    >,
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ roleId, add, remove }) =>
            authApi.updateRolePermissions({ roleId, add, remove }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: authQueryKeys.rolePermissions(variables.roleId),
            });
        },
        ...options,
    });
}

/**
 * Hook to change password
 */
export function useChangePassword(
    options?: Omit<
        UseMutationOptions<
            SingleResponse<{ message: string }>,
            ApiError,
            {
                currentPassword: string;
                newPassword: string;
                newPasswordConfirmation: string;
            }
        >,
        "mutationFn"
    >,
) {
    return useMutation({
        mutationFn: (data) => authApi.changePassword(data),
        ...options,
    });
}
