import type { CompanyTags, CompanyTagsCreatePayload, CompanyTagsUpdatePayload } from "../types";
import { v4 as uuidv4 } from "uuid";

export let mockCompanyTagss: CompanyTags[] = [
    {
        id: "1",
        name: "عبدالرحمن قاسم",
        description: "Standard account item",
        role: "أدمن",
        email: "abuqasim1427@gmail.com",
        phone: "+966 552818590",
        isActive: true,
        createdAt: "2026/10/14 , 08:19:28 PM",
        updatedAt: "2026/10/14 , 09:02:52 PM",
    },
    {
        id: "2",
        name: "فراس حافظ",
        description: "Administrative account",
        role: "أدمن",
        email: "rmz.alemtithal@gmail.com",
        phone: "+966 500000000",
        isActive: true,
        createdAt: "2026/08/26 , 02:35:26 AM",
        updatedAt: "2026/08/26 , 02:35:26 AM",
    }
];

export const mockCompanyTagsApi = {
    getList: async (params?: any, signal?: AbortSignal): Promise<any> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, search, perPage = 10 } = (params || {}) as any;
                const filtered = mockCompanyTagss.filter(item => 
                    !search || 
                    item.name.toLowerCase().includes(search.toLowerCase()) ||
                    (item.email && item.email.toLowerCase().includes(search.toLowerCase()))
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
            }, 300);
        });
    },

    getById: async (id: string, signal?: AbortSignal): Promise<CompanyTags | null> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const mock = mockCompanyTagss.find((s) => s.id === id);
                if (!mock) reject(new Error("Not found"));
                else resolve(mock);
            }, 300);
        });
    },
    
    create: async (payload: CompanyTagsCreatePayload): Promise<CompanyTags> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const now = new Date().toLocaleDateString();
                const newItem: CompanyTags = {
                    id: uuidv4(),
                    ...payload,
                    isActive: true,
                    createdAt: now,
                    updatedAt: now,
                };
                mockCompanyTagss = [newItem, ...mockCompanyTagss];
                resolve(newItem);
            }, 300);
        });
    },

    update: async (id: string, payload: CompanyTagsUpdatePayload): Promise<CompanyTags> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockCompanyTagss.findIndex((s) => s.id === id);
                if (index === -1) {
                    reject(new Error("Not found"));
                    return;
                }
                const existing = mockCompanyTagss[index];
                const updatedItem = {
                    ...existing,
                    ...payload,
                    updatedAt: new Date().toLocaleDateString(),
                };
                mockCompanyTagss[index] = updatedItem;
                resolve(updatedItem);
            }, 300);
        });
    },

    delete: async (id: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockCompanyTagss.findIndex((s) => s.id === id);
                if (index === -1) {
                    reject(new Error("Not found"));
                    return;
                }
                mockCompanyTagss = mockCompanyTagss.filter((s) => s.id !== id);
                resolve();
            }, 300);
        });
    }
};
