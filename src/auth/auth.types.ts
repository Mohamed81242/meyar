/**
 * Auth Module - Type Definitions
 *
 * Types for authentication and authorization.
 */

import { Governorate, Grade } from "@/shared/types";
import { UseMutationResult } from "@tanstack/react-query";
import * as React from "react";
import { NavigateFunction } from "react-router-dom";
// import { AcceptanceExamStatus } from "@/modules/dashboard/main/features/classroom/acceptanceTest/types";

// ============================================================================
// Auth Types
// ============================================================================

export type CommonFormProps<T> = {
    StarICon?: () => React.JSX.Element;
    mutationFn: () => UseMutationResult<any, any, T, unknown>;
    navigate?: NavigateFunction;
};

export type CommonLoginFormProps<T> = {
    mutationFn: () => UseMutationResult<any, any, T, unknown>;
    navigate?: NavigateFunction;
    isPopup?: boolean;
};

export enum AuthSteps {
    Login = "login",
    LoginMagicLink = "loginMagicLink",

    SignUp = "signUp",
    SignUpVerify = "signUpVerify",
    SignUpComplete = "signUpComplete",

    PhoneVerify = "phoneVerify",
    PhoneVerifyComplete = "phoneVerifyComplete",

    EmailReset = "emailReset",
    EmailResetVerify = "emailResetVerify",
    PasswordReset = "passwordReset",
    PasswordResetComplete = "passwordResetComplete",
}

export type AuthState = {
    user: User | null;
    isAuthenticated: boolean;
    authStep: AuthSteps | null;
    signupEmail: string | null;
    resetEmail: string | null;
    error: string | null;
    isLoading: boolean;
    isFirstTimeUser: boolean;
    setIsFirstTimeUser: (isFirstTimeUser: boolean) => void;
    setIsLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    setAuthStep: (authStep: AuthSteps | null) => void;
    setUser: (user: User | null) => void;
    setSignupEmail: (email: string | null) => void;
    setResetEmail: (email: string | null) => void;
};

export type LoginData = {
    identifier?: string;
    email?: string;
    phone?: string;
    password: string;
    deviceName?: string;
};

export type LoginMagicLinkData = {
    email: string;
};

export type RegisterData = {
    name?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
    password: string;
    passwordConfirmation?: string;
    deviceName?: string;
};

export type AuthResponseData = {
    token: string;
    user: User;
};

export type ResetEmailData = {
    email: string;
};

export type ResetVerifyData = {
    email: string;
    code: string;
};

export type ResetPasswordData = {
    verifyToken: string;
    password: string;
};
export type PhoneVerifyData = {
    phone_code: string;
    phone_number: string;
};

// ============================================================================
// User Types
// ============================================================================

export type Roles = "admin" | "counselor" | "client" | "staff" | string;

export type Role = {
    id?: string | number;
    name: string;
    caption?: string;
    createdAt?: string;
    updatedAt?: string;
};

export type UserInformation = {
    id?: string | number;
    phoneCode?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    gender?: string;
    grade?: Grade;
    governorate?: Governorate;
    nationality?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    bio?: string;
    socialLinks?: string;
    isVerified?: boolean;
    verifiedAt?: string;
    createdAt?: string;
    updatedAt?: string;
};

export type Team = {
    id: string | number;
    name: string;
};

export type User = {
    id: string | number;
    name: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
    title?: string | null;
    role?: string | Role;
    isActive?: boolean;
    barRegistrationNumber?: string | null;
    barBranch?: string | null;
    verificationStatus?: string;
    isVerified?: boolean;
    avatarUrl?: string | null;
    image?: string;
    locale?: string;
    darkMode?: boolean;
    notificationsEnabled?: boolean;
    walletBalance?: string | number;
    lastSeenAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
    userInformation?: UserInformation;
    userServices?: any[];
    permissions?: string[];
    emailVerified?: boolean;
    phoneVerified?: boolean;
    isFirstTimeUser?: boolean;
    token?: string | Record<string, any> | null;
    // Additional fields from API response
    managerId?: string | number | null;
    managerName?: string | null;
    teams?: Team[];
    directReports?: number;
    squad?: any;
    scope?: any;
    // Convenience properties
    phoneCode?: string;
    phoneNumber?: string;
    gender?: string;
    grade?: Grade;
    bio?: string;
    specialization?: string;
};


// ============================================================================
// Permission Types
// ============================================================================

/**
 * API Permission entity (flat)
 */
export interface ApiPermission {
    id: number;
    group: string;
    name: string;
    caption: string;
    scope: string | null;
    scopeLabel: string | null;
    createdAt: string;
    updatedAt: string;
}

/**
 * Role with its associated permissions
 */
export interface RoleWithPermissions {
    id: number;
    name: string;
    caption: string;
    createdAt: string;
    updatedAt: string;
    permissions: ApiPermission[];
}

/**
 * Grouped permission response
 */
export interface PermissionGroupApiResponse {
    name: string;
    permissions: ApiPermission[];
}

/**
 * Grouped permissions for UI display (simplified)
 */
export interface PermissionGroup {
    group: string;
    permissions: ApiPermission[];
}

/**
 * User Auth Permissions Response Data
 */
export interface UserAuthPermissionsData {
    permissions: string[];
    role?: string;
    adminRole?: string;
    areas?: Record<string, string>;
}

/**
 * Permission string format: "resource.action"
 */
export type Permission = string;

/**
 * Role with permissions - supports any role name
 */
export type RolePermissions = Record<string, Permission[]>;

/**
 * Permission state for the auth store
 */
export interface PermissionState {
    permissions: Permission[];
    permissionEntities: ApiPermission[];
    permissionGroups: PermissionGroup[];
    isPermissionsLoaded: boolean;
    isPermissionsLoading: boolean;
    permissionsError: string | null;
}

/**
 * Permission state actions
 */
export interface PermissionActions {
    setPermissions: (permissions: Permission[]) => void;
    setPermissionEntities: (entities: ApiPermission[]) => void;
    setIsPermissionsLoaded: (loaded: boolean) => void;
    setIsPermissionsLoading: (loading: boolean) => void;
    setPermissionsError: (error: string | null) => void;
    clearPermissions: () => void;
}

// ============================================================================
// Token Types
// ============================================================================

/**
 * Token pair from auth response
 */
export interface TokenPair {
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
}

/**
 * Decoded JWT payload
 */
export interface JwtPayload {
    sub: string;
    exp: number;
    iat: number;
    permissions?: Permission[];
}

// ============================================================================
// Auth State Types
// ============================================================================

/**
 * Auth context value
 */
export interface AuthContextValue {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    permissions: Permission[];
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshAuth: () => Promise<void>;
}

/**
 * Protected route props
 */
export interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    roles?: string[];
    permissions?: Permission[];
    /** Require all permissions (true) or any permission (false) */
    requireAllPermissions?: boolean;
    fallback?: React.ReactNode;
    redirectTo?: string;
    /** Loading component while auth state is being determined */
    loadingFallback?: React.ReactNode;
}

/**
 * Has permission props
 */
export interface HasPermissionProps {
    permission: Permission | Permission[];
    requireAll?: boolean;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}
