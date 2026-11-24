import type { CompanyTag, CompanyTagCreatePayload, CompanyTagUpdatePayload } from "../types";
import { v4 as uuidv4 } from "uuid";

// Default empty array matching reference Screenshot 1
export let mockCompanyTags: CompanyTag[] = [];

export const mockCompanyTagsApi = {
    getList: async (params?: any, signal?: AbortSignal): Promise<any> => {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                const { page = 1, search, perPage = 10 } = (params || {}) as any;
                const filtered = mockCompanyTags.filter((item) =>
                    !search || item.name.toLowerCase().includes(search.toLowerCase())
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

            if (signal) {
                signal.addEventListener("abort", () => {
                    clearTimeout(timeoutId);
                    reject(new DOMException("Aborted", "AbortError"));
                });
            }
        });
    },

    getById: async (id: string, signal?: AbortSignal): Promise<CompanyTag | null> => {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                const mock = mockCompanyTags.find((s) => s.id === id);
                if (!mock) reject(new Error("Not found"));
                else resolve(mock);
            }, 250);

            if (signal) {
                signal.addEventListener("abort", () => {
                    clearTimeout(timeoutId);
                    reject(new DOMException("Aborted", "AbortError"));
                });
            }
        });
    },

    create: async (payload: CompanyTagCreatePayload): Promise<CompanyTag> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const now = new Date().toISOString().replace("T", " ").substring(0, 19);
                const newItem: CompanyTag = {
                    id: uuidv4(),
                    name: payload.name,
                    createdAt: now,
                    updatedAt: now,
                };
                mockCompanyTags = [newItem, ...mockCompanyTags];
                resolve(newItem);
            }, 250);
        });
    },

    update: async (id: string, payload: CompanyTagUpdatePayload): Promise<CompanyTag> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockCompanyTags.findIndex((s) => s.id === id);
                if (index === -1) {
                    reject(new Error("Not found"));
                    return;
                }
                const existing = mockCompanyTags[index];
                const updatedItem: CompanyTag = {
                    ...existing,
                    ...payload,
                    updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
                };
                mockCompanyTags[index] = updatedItem;
                resolve(updatedItem);
            }, 250);
        });
    },

    delete: async (id: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                mockCompanyTags = mockCompanyTags.filter((s) => s.id !== id);
                resolve();
            }, 250);
        });
    },
};
