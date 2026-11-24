import { z } from "zod";

export interface RolePermission {
    id: string;
    label: string;
}

export interface PermissionGroup {
    id: string;
    label: string;
    permissions: RolePermission[];
}

export const AVAILABLE_PERMISSIONS_CATALOG: PermissionGroup[] = [
    {
        id: "system_login",
        label: "System Login",
        permissions: [
            { id: "sys_login_dashboard", label: "Login from Dashboard" },
            { id: "sys_login_app", label: "Login from APP" },
        ],
    },
    {
        id: "statistics",
        label: "Statistics",
        permissions: [
            { id: "statistics_live", label: "Live Statistics" },
        ],
    },
    {
        id: "roles_permissions",
        label: "Roles & Permissions",
        permissions: [
            { id: "roles_view", label: "View Roles" },
            { id: "roles_add", label: "Add Roles" },
            { id: "roles_edit", label: "Edit Roles" },
            { id: "roles_delete", label: "Delete Roles" },
        ],
    },
    {
        id: "users",
        label: "Users",
        permissions: [
            { id: "users_view", label: "View Users" },
            { id: "users_add", label: "Add Users" },
            { id: "users_edit", label: "Edit Users" },
            { id: "users_delete", label: "Delete Users" },
        ],
    },
    {
        id: "company_management",
        label: "Company Management",
        permissions: [
            { id: "company_view", label: "View" },
            { id: "company_add", label: "Add" },
            { id: "company_edit", label: "Edit" },
            { id: "company_delete", label: "Delete" },
        ],
    },
    {
        id: "inspection_settings",
        label: "Inspection Settings",
        permissions: [
            { id: "inspection_settings_view", label: "View" },
            { id: "inspection_settings_add", label: "Add" },
            { id: "inspection_settings_edit", label: "Edit" },
            { id: "inspection_settings_delete", label: "Delete" },
        ],
    },
    {
        id: "inspection_templates",
        label: "Inspection Templates",
        permissions: [
            { id: "inspection_templates_view", label: "View" },
            { id: "inspection_templates_add", label: "Add" },
            { id: "inspection_templates_edit", label: "Edit" },
            { id: "inspection_templates_delete", label: "Delete" },
        ],
    },
    {
        id: "inspection_tasks",
        label: "Inspection Tasks",
        permissions: [
            { id: "inspection_tasks_view", label: "View" },
            { id: "inspection_tasks_add", label: "Add" },
            { id: "inspection_tasks_duplicate", label: "Duplicate" },
            { id: "inspection_tasks_edit_settings", label: "Edit Task Settings" },
            { id: "inspection_tasks_instant_create", label: "Instant Create" },
            { id: "inspection_tasks_conduct", label: "Conduct" },
            { id: "inspection_tasks_delete", label: "Delete" },
            { id: "inspection_tasks_archive", label: "Archive Task" },
            { id: "inspection_tasks_manage_access", label: "Manage Tasks Permission Access" },
            { id: "inspection_tasks_approve", label: "Approve tasks" },
            { id: "inspection_tasks_track_location", label: "Track Inspector Location" },
        ],
    },
    {
        id: "reports",
        label: "Reports",
        permissions: [
            { id: "reports_view", label: "View" },
            { id: "reports_edit", label: "Edit" },
            { id: "reports_share", label: "Share" },
        ],
    },
    {
        id: "actions",
        label: "Actions",
        permissions: [
            { id: "actions_view", label: "View" },
            { id: "actions_add", label: "Add" },
            { id: "actions_edit", label: "Edit" },
            { id: "actions_delete", label: "Delete" },
            { id: "actions_manage_access", label: "Manage Actions Permission Access" },
        ],
    },
];

export const roleSchema = z.object({
    name: z.string().min(1, "Name is required"),
    isFinalEvaluator: z.boolean().optional(),
    permissions: z.array(z.string()).default([]),
});

export interface Role {
    id: string;
    name: string;
    numberOfUsers: number;
    isFinalEvaluator?: boolean;
    permissions: string[];
    createdAt?: string;
    updatedAt?: string;
}

export type RoleCreatePayload = z.infer<typeof roleSchema>;
export type RoleUpdatePayload = Partial<RoleCreatePayload>;

// Backward compatibility aliases
export type RolesAndPermissions = Role;
export type RolesAndPermissionsCreatePayload = RoleCreatePayload;
export type RolesAndPermissionsUpdatePayload = RoleUpdatePayload;
