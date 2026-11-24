import type { User, UserCreatePayload, UserUpdatePayload } from "../types";
import { v4 as uuidv4 } from "uuid";

export let mockUserss: User[] = [
    {
        id: "1",
        name: "عبدالرحمن قاسم",
        role: "أدمن",
        email: "abuqasim1427@gmail.com",
        phone: "+966 552818590",
        isEmailActivated: true,
        isPhoneActivated: true,
        autoEmailRegister: "لا",
        autoPhoneActivate: "لا",
        isActive: true,
        createdAt: "2026/10/14 , 08:19:28 PM",
        updatedAt: "2026/10/14 , 09:02:52 PM",
    },
    {
        id: "2",
        name: "فراس حافظ",
        role: "أدمن",
        email: "rmz.alemtithal@gmail.com",
        phone: null,
        isEmailActivated: true,
        isPhoneActivated: false,
        autoEmailRegister: "لا",
        autoPhoneActivate: "لا",
        isActive: true,
        createdAt: "2026/08/26 , 02:35:26 AM",
        updatedAt: "2026/08/26 , 02:35:26 AM",
    },
];

export const mockUsersApi = {
    getList: async (params?: any, _signal?: AbortSignal): Promise<any> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, search, status, perPage = 10 } = (params || {}) as any;
                const filtered = mockUserss.filter((item) => {
                    const matchesSearch =
                        !search ||
                        item.name.toLowerCase().includes(search.toLowerCase()) ||
                        (item.email && item.email.toLowerCase().includes(search.toLowerCase())) ||
                        (item.phone && item.phone.includes(search));

                    const matchesStatus =
                        !status ||
                        status === "all" ||
                        (status === "active" && item.isActive) ||
                        (status === "inactive" && !item.isActive);

                    return matchesSearch && matchesStatus;
                });

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
            }, 200);
        });
    },

    getById: async (id: string, _signal?: AbortSignal): Promise<User | null> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const mock = mockUserss.find((s) => s.id === id);
                if (!mock) reject(new Error("Not found"));
                else resolve(mock);
            }, 200);
        });
    },

    create: async (payload: UserCreatePayload): Promise<User> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const now = new Date().toLocaleString("en-CA", { hour12: true });
                const newItem: User = {
                    id: uuidv4(),
                    name: payload.name,
                    role: payload.role || "أدمن",
                    email: payload.email || "",
                    phone: payload.phone || null,
                    isEmailActivated: true,
                    isPhoneActivated: Boolean(payload.phone),
                    autoEmailRegister: payload.autoEmailRegister || "لا",
                    autoPhoneActivate: payload.autoPhoneActivate || "لا",
                    isActive: true,
                    createdAt: now,
                    updatedAt: now,
                };
                mockUserss = [newItem, ...mockUserss];
                resolve(newItem);
            }, 250);
        });
    },

    update: async (id: string, payload: UserUpdatePayload): Promise<User> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockUserss.findIndex((s) => s.id === id);
                if (index === -1) {
                    reject(new Error("Not found"));
                    return;
                }
                const existing = mockUserss[index];
                const updatedItem: User = {
                    ...existing,
                    name: payload.name !== undefined ? payload.name : existing.name,
                    role: payload.role !== undefined ? payload.role : existing.role,
                    email: payload.email !== undefined ? payload.email : existing.email,
                    phone: payload.phone !== undefined ? payload.phone : existing.phone,
                    autoEmailRegister:
                        payload.autoEmailRegister !== undefined
                            ? payload.autoEmailRegister
                            : existing.autoEmailRegister,
                    autoPhoneActivate:
                        payload.autoPhoneActivate !== undefined
                            ? payload.autoPhoneActivate
                            : existing.autoPhoneActivate,
                    updatedAt: new Date().toLocaleString("en-CA", { hour12: true }),
                };
                mockUserss[index] = updatedItem;
                resolve(updatedItem);
            }, 250);
        });
    },

    delete: async (id: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                mockUserss = mockUserss.filter((s) => s.id !== id);
                resolve();
            }, 200);
        });
    },
};
