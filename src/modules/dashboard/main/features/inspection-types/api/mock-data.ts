import type { InspectionType, InspectionTypeCreatePayload, InspectionTypeUpdatePayload } from "../types";
import { v4 as uuidv4 } from "uuid";

// Initial mock data exactly matching Screenshot 1: "بنود الإعاشة" with "عدد القوالب 1"
export let mockInspectionTypes: InspectionType[] = [
    {
        id: "1",
        name: "بنود الإعاشة",
        templatesCount: 1,
        createdAt: "2026/10/14 , 08:19:28 PM",
        updatedAt: "2026/10/14 , 09:02:52 PM",
    },
];

export const mockInspectionTypesApi = {
    getList: async (params?: any, signal?: AbortSignal): Promise<any> => {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                const { page = 1, search, perPage = 10 } = (params || {}) as any;
                const filtered = mockInspectionTypes.filter((item) =>
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

    getById: async (id: string, signal?: AbortSignal): Promise<InspectionType | null> => {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                const mock = mockInspectionTypes.find((s) => s.id === id);
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

    create: async (payload: InspectionTypeCreatePayload): Promise<InspectionType> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const now = new Date().toISOString().replace("T", " ").substring(0, 19);
                const newItem: InspectionType = {
                    id: uuidv4(),
                    name: payload.name,
                    templatesCount: payload.templatesCount ?? 0,
                    createdAt: now,
                    updatedAt: now,
                };
                mockInspectionTypes = [newItem, ...mockInspectionTypes];
                resolve(newItem);
            }, 250);
        });
    },

    update: async (id: string, payload: InspectionTypeUpdatePayload): Promise<InspectionType> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockInspectionTypes.findIndex((s) => s.id === id);
                if (index === -1) {
                    reject(new Error("Not found"));
                    return;
                }
                const existing = mockInspectionTypes[index];
                const updatedItem: InspectionType = {
                    ...existing,
                    ...payload,
                    updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
                };
                mockInspectionTypes[index] = updatedItem;
                resolve(updatedItem);
            }, 250);
        });
    },

    delete: async (id: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                mockInspectionTypes = mockInspectionTypes.filter((s) => s.id !== id);
                resolve();
            }, 250);
        });
    },
};
