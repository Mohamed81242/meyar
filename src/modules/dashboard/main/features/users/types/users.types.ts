import { z } from "zod";

export const userSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    phone: z.string().optional(),
    role: z.string().default("أدمن"),
    autoEmailRegister: z.string().default("لا"),
    autoPhoneActivate: z.string().default("لا"),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    isEmailActivated: z.boolean().default(true),
    isPhoneActivated: z.boolean().default(true),
});

export interface User {
    id: string;
    name: string;
    role: string;
    email: string;
    phone?: string | null;
    isEmailActivated: boolean;
    isPhoneActivated: boolean;
    autoEmailRegister?: string;
    autoPhoneActivate?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type UserCreatePayload = z.infer<typeof userSchema>;
export type UserUpdatePayload = Partial<UserCreatePayload>;

export interface UserFilterState {
    search: string;
    role: string;
    template: string;
    entity: string;
    task: string;
    action: string;
    permission: string;
    status: string;
    group: string;
    typePermission: string;
    showGroups: boolean;
}

// Backward compatibility aliases
export type Users = User;
export type UsersCreatePayload = UserCreatePayload;
export type UsersUpdatePayload = UserUpdatePayload;
