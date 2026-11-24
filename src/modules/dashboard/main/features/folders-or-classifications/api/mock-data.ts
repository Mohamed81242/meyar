import type { TemplateFolder, TemplateFolderCreatePayload, TemplateFolderUpdatePayload } from "../types";
import { v4 as uuidv4 } from "uuid";

export const AVAILABLE_TEMPLATES = [
    { id: "template-1", name: "قالب جديد" },
    { id: "template-2", name: "بنود تفتيش المطاعم" },
    { id: "template-3", name: "بنود تفتيش سلامة الغذاء للمصانع" },
    { id: "template-4", name: "بنود تأهيل نظام HACCAP" },
    { id: "template-5", name: "بنود تفتيش الإعاشة" },
];

// Initial mock data matching Screenshot 1: "بنود الإعاشة" (1) and "بنود المطاعم" (1)
export let mockTemplateFolders: TemplateFolder[] = [
    {
        id: "1",
        name: "بنود الإعاشة",
        numberOfTemplates: 1,
        selectedTemplateIds: ["template-5"],
        createdAt: "2026/10/14 , 08:19:28 PM",
        updatedAt: "2026/10/14 , 09:02:52 PM",
    },
    {
        id: "2",
        name: "بنود المطاعم",
        numberOfTemplates: 1,
        selectedTemplateIds: ["template-2"],
        createdAt: "2026/08/26 , 02:35:26 AM",
        updatedAt: "2026/08/26 , 02:35:26 AM",
    },
];

export const mockFoldersOrClassificationsApi = {
    getList: async (params?: any, signal?: AbortSignal): Promise<any> => {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                const { page = 1, search, perPage = 10 } = (params || {}) as any;
                const filtered = mockTemplateFolders.filter((item) =>
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

    getById: async (id: string, signal?: AbortSignal): Promise<TemplateFolder | null> => {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                const mock = mockTemplateFolders.find((s) => s.id === id);
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

    create: async (payload: TemplateFolderCreatePayload): Promise<TemplateFolder> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const now = new Date().toISOString().replace("T", " ").substring(0, 19);
                const selected = payload.selectedTemplateIds || [];
                const newItem: TemplateFolder = {
                    id: uuidv4(),
                    name: payload.name,
                    numberOfTemplates: selected.length,
                    selectedTemplateIds: selected,
                    createdAt: now,
                    updatedAt: now,
                };
                mockTemplateFolders = [newItem, ...mockTemplateFolders];
                resolve(newItem);
            }, 250);
        });
    },

    update: async (id: string, payload: TemplateFolderUpdatePayload): Promise<TemplateFolder> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockTemplateFolders.findIndex((s) => s.id === id);
                if (index === -1) {
                    reject(new Error("Not found"));
                    return;
                }
                const existing = mockTemplateFolders[index];
                const selected = payload.selectedTemplateIds !== undefined ? payload.selectedTemplateIds : existing.selectedTemplateIds || [];
                const updatedItem: TemplateFolder = {
                    ...existing,
                    ...payload,
                    numberOfTemplates: selected.length,
                    selectedTemplateIds: selected,
                    updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
                };
                mockTemplateFolders[index] = updatedItem;
                resolve(updatedItem);
            }, 250);
        });
    },

    delete: async (id: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                mockTemplateFolders = mockTemplateFolders.filter((s) => s.id !== id);
                resolve();
            }, 250);
        });
    },
};
