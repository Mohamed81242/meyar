import type { Role, RoleCreatePayload, RoleUpdatePayload } from "../types";
import { v4 as uuidv4 } from "uuid";

export let mockRoles: Role[] = [
    {
        id: "1",
        name: "أدمن",
        numberOfUsers: 2,
        isFinalEvaluator: false,
        permissions: [
            "sys_login_dashboard",
            "sys_login_app",
            "statistics_live",
            "roles_view",
            "roles_add",
            "roles_edit",
            "roles_delete",
            "users_view",
            "users_add",
            "users_edit",
            "users_delete",
            "inspection_tasks_view",
            "inspection_tasks_add",
            "reports_view",
            "actions_view",
        ],
        createdAt: "2026/10/14",
        updatedAt: "2026/10/14",
    },
    {
        id: "2",
        name: "مراقب",
        numberOfUsers: 1,
        isFinalEvaluator: true,
        permissions: [
            "sys_login_dashboard",
            "inspection_tasks_view",
            "inspection_tasks_conduct",
            "reports_view",
        ],
        createdAt: "2026/08/26",
        updatedAt: "2026/08/26",
    },
];

export const mockRolesAndPermissionsApi = {
    getList: async (params?: any, _signal?: AbortSignal): Promise<any> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, search, perPage = 10 } = (params || {}) as any;
                const filtered = mockRoles.filter(
                    (item) =>
                        !search ||
                        item.name.toLowerCase().includes(search.toLowerCase())
                );
                const p = Number(page);
                const limit = Number(perPage);
                const start = (p - 1) * limit;
                resolve({
                    items: filtered.slice(start, start + limit),
                    perPage: limit,
                    currentPage: p,
                    lastPage: Math.ceil(filtered.length / limit) || 1,
                    nextPageUrl: null,
                    total: filtered.length,
                });
            }, 250);
        });
    },

    getById: async (id: string, _signal?: AbortSignal): Promise<Role | null> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const mock = mockRoles.find((s) => s.id === id);
                if (!mock) reject(new Error("Not found"));
                else resolve(mock);
            }, 200);
        });
    },

    create: async (payload: RoleCreatePayload): Promise<Role> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const now = new Date().toISOString().split("T")[0];
                const newItem: Role = {
                    id: uuidv4(),
                    name: payload.name,
                    numberOfUsers: 0,
                    isFinalEvaluator: payload.isFinalEvaluator || false,
                    permissions: payload.permissions || [],
                    createdAt: now,
                    updatedAt: now,
                };
                mockRoles = [newItem, ...mockRoles];
                resolve(newItem);
            }, 250);
        });
    },

    update: async (id: string, payload: RoleUpdatePayload): Promise<Role> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockRoles.findIndex((s) => s.id === id);
                if (index === -1) {
                    reject(new Error("Not found"));
                    return;
                }
                const existing = mockRoles[index];
                const updatedItem: Role = {
                    ...existing,
                    name: payload.name !== undefined ? payload.name : existing.name,
                    isFinalEvaluator:
                        payload.isFinalEvaluator !== undefined
                            ? payload.isFinalEvaluator
                            : existing.isFinalEvaluator,
                    permissions:
                        payload.permissions !== undefined
                            ? payload.permissions
                            : existing.permissions,
                    updatedAt: new Date().toISOString().split("T")[0],
                };
                mockRoles[index] = updatedItem;
                resolve(updatedItem);
            }, 250);
        });
    },

    delete: async (id: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                mockRoles = mockRoles.filter((s) => s.id !== id);
                resolve();
            }, 200);
        });
    },
};
