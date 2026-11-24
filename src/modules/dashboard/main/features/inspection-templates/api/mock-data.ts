import type {
    InspectionTemplate,
    InspectionTemplateCreatePayload,
    InspectionTemplateUpdatePayload,
} from "../types";
import { v4 as uuidv4 } from "uuid";

// Initial mock data matching Screenshot 1 (Total Items: 5)
export let mockInspectionTemplates: InspectionTemplate[] = [
    {
        id: "1",
        title: "قالب جديد",
        description: "قالب جديد قيد الإعداد",
        status: "unpublished",
        pagesCount: 0,
        sectionsCount: 0,
        questionsCount: 0,
        evaluationType: "compliance",
        successPercentage: 100,
        createdAt: "2026/11/24 , 03:37:07 PM",
        modifiedAt: "2026/11/24 , 03:37:45 PM",
        publishedAt: null,
    },
    {
        id: "2",
        title: "بنود تفتيش المطاعم",
        description: "فحص وتفتيش المطاعم ومحلات الأغذية",
        status: "published",
        pagesCount: 1,
        sectionsCount: 9,
        questionsCount: 99,
        evaluationType: "compliance",
        successPercentage: 80,
        createdAt: "2026/11/22 , 03:54:38 PM",
        modifiedAt: "2026/11/22 , 04:35:14 PM",
        publishedAt: "2026/11/22 , 04:35:24 PM",
    },
    {
        id: "3",
        title: "بنود تفتيش سلامة الغذاء للمصانع",
        description: "تفتيش المصانع وخطوط الإنتاج",
        status: "published",
        pagesCount: 1,
        sectionsCount: 10,
        questionsCount: 67,
        evaluationType: "compliance",
        successPercentage: 85,
        createdAt: "2026/11/12 , 11:45:32 PM",
        modifiedAt: "2026/11/12 , 11:49:35 PM",
        publishedAt: "2026/11/12 , 11:49:52 PM",
    },
    {
        id: "4",
        title: "بنود تأهيل نظام HACCAP",
        description: "متطلبات تأهيل شهادة الهاسب",
        status: "published",
        pagesCount: 1,
        sectionsCount: 8,
        questionsCount: 52,
        evaluationType: "compliance",
        successPercentage: 90,
        createdAt: "2026/09/04 , 01:06:01 AM",
        modifiedAt: "2026/09/04 , 01:10:15 AM",
        publishedAt: "2026/09/04 , 01:10:30 AM",
    },
    {
        id: "5",
        title: "بنود تفتيش الإعاشة",
        description: "تفتيش مطابخ الإعاشة والإعاشة الميدانية",
        status: "published",
        pagesCount: 1,
        sectionsCount: 12,
        questionsCount: 110,
        evaluationType: "compliance",
        successPercentage: 85,
        createdAt: "2026/08/18 , 10:20:10 AM",
        modifiedAt: "2026/08/18 , 10:45:00 AM",
        publishedAt: "2026/08/18 , 10:45:20 AM",
    },
];

export const mockInspectionTemplatesApi = {
    getList: async (params?: any, signal?: AbortSignal): Promise<any> => {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                const { page = 1, search, status, perPage = 10 } = (params || {}) as any;
                let filtered = [...mockInspectionTemplates];

                if (search) {
                    filtered = filtered.filter(
                        (item) =>
                            item.title.toLowerCase().includes(search.toLowerCase()) ||
                            (item.description &&
                                item.description.toLowerCase().includes(search.toLowerCase()))
                    );
                }

                if (status && status !== "all") {
                    filtered = filtered.filter((item) => item.status === status);
                }

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

    getById: async (id: string, signal?: AbortSignal): Promise<InspectionTemplate | null> => {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                const mock = mockInspectionTemplates.find((s) => s.id === id);
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

    create: async (payload: InspectionTemplateCreatePayload): Promise<InspectionTemplate> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const now = new Date().toISOString().replace("T", " ").substring(0, 19);
                const newItem: InspectionTemplate = {
                    id: uuidv4(),
                    title: payload.title,
                    description: payload.description,
                    status: payload.status || "unpublished",
                    pagesCount: payload.pagesCount || 1,
                    sectionsCount: payload.sectionsCount || 0,
                    questionsCount: payload.questionsCount || 0,
                    evaluationType: payload.evaluationType || "compliance",
                    successPercentage: payload.successPercentage ?? 100,
                    formType: payload.formType,
                    folderId: payload.folderId,
                    createdAt: now,
                    modifiedAt: now,
                    publishedAt: payload.status === "published" ? now : null,
                };
                mockInspectionTemplates = [newItem, ...mockInspectionTemplates];
                resolve(newItem);
            }, 250);
        });
    },

    update: async (
        id: string,
        payload: InspectionTemplateUpdatePayload
    ): Promise<InspectionTemplate> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockInspectionTemplates.findIndex((s) => s.id === id);
                if (index === -1) {
                    reject(new Error("Not found"));
                    return;
                }
                const existing = mockInspectionTemplates[index];
                const now = new Date().toISOString().replace("T", " ").substring(0, 19);
                const updatedItem: InspectionTemplate = {
                    ...existing,
                    ...payload,
                    modifiedAt: now,
                    publishedAt:
                        payload.status === "published" && !existing.publishedAt
                            ? now
                            : payload.status === "unpublished"
                            ? null
                            : existing.publishedAt,
                };
                mockInspectionTemplates[index] = updatedItem;
                resolve(updatedItem);
            }, 250);
        });
    },

    delete: async (id: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                mockInspectionTemplates = mockInspectionTemplates.filter((s) => s.id !== id);
                resolve();
            }, 250);
        });
    },
};
