import type { CompanyClassification, CompanyClassificationCreatePayload, CompanyClassificationUpdatePayload } from "../types";
import { v4 as uuidv4 } from "uuid";

export let mockCompanyClassificationss: CompanyClassification[] = [
    {
        id: "1",
        name: "مطابخ الاعاشة",
        description: "مطابخ",
        isActive: true,
        createdAt: "2026/10/14",
        updatedAt: "2026/10/14",
    },
    {
        id: "2",
        name: "مصانع",
        description: "مصانع",
        isActive: true,
        createdAt: "2026/08/26",
        updatedAt: "2026/08/26",
    },
    {
        id: "3",
        name: "مطعم",
        description: "مطاعم",
        isActive: true,
        createdAt: "2026/08/26",
        updatedAt: "2026/08/26",
    },
];

export const mockCompanyClassificationsApi = {
    getList: async (params?: any, _signal?: AbortSignal): Promise<any> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, search, perPage = 10 } = (params || {}) as any;
                const filtered = mockCompanyClassificationss.filter(
                    (item) =>
                        !search ||
                        item.name.toLowerCase().includes(search.toLowerCase()) ||
                        (item.description &&
                            item.description.toLowerCase().includes(search.toLowerCase()))
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
            }, 200);
        });
    },

    getById: async (id: string, _signal?: AbortSignal): Promise<CompanyClassification | null> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const mock = mockCompanyClassificationss.find((s) => s.id === id);
                if (!mock) reject(new Error("Not found"));
                else resolve(mock);
            }, 200);
        });
    },

    create: async (payload: CompanyClassificationCreatePayload): Promise<CompanyClassification> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const now = new Date().toISOString().split("T")[0];
                const newItem: CompanyClassification = {
                    id: uuidv4(),
                    name: payload.name,
                    description: payload.description || "",
                    isActive: true,
                    createdAt: now,
                    updatedAt: now,
                };
                mockCompanyClassificationss = [newItem, ...mockCompanyClassificationss];
                resolve(newItem);
            }, 200);
        });
    },

    update: async (id: string, payload: CompanyClassificationUpdatePayload): Promise<CompanyClassification> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockCompanyClassificationss.findIndex((s) => s.id === id);
                if (index === -1) {
                    reject(new Error("Not found"));
                    return;
                }
                const existing = mockCompanyClassificationss[index];
                const updatedItem: CompanyClassification = {
                    ...existing,
                    name: payload.name !== undefined ? payload.name : existing.name,
                    description:
                        payload.description !== undefined ? payload.description : existing.description,
                    updatedAt: new Date().toISOString().split("T")[0],
                };
                mockCompanyClassificationss[index] = updatedItem;
                resolve(updatedItem);
            }, 200);
        });
    },

    delete: async (id: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                mockCompanyClassificationss = mockCompanyClassificationss.filter((s) => s.id !== id);
                resolve();
            }, 200);
        });
    },
};
