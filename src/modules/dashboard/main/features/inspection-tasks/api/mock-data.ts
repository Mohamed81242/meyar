import type {
    InspectionTask,
    InspectionTaskCreatePayload,
    InspectionTaskUpdatePayload,
} from "../types";
import { v4 as uuidv4 } from "uuid";

// Initial mock data matching Screenshot 2 & 3 (Total Items: 9)
export let mockInspectionTasks: InspectionTask[] = [
    {
        id: "1",
        entityName: "سيلفش - Sellfish",
        templateName: "بنود تفتيش المطاعم",
        status: "completed",
        lastUpdate: "2026/11/24 , 01:14:46 PM",
        startDate: "2026/11/24 , 01:01:45 PM",
        completeDate: "2026/11/24 , 01:14:46 PM",
        flaggedItemsCount: 14,
        score: 85.42,
        scores: [{ label: "النتيجة النهائية", score: 85.42 }],
        createdAt: "2026/11/24",
    },
    {
        id: "2",
        entityName: "مصنع حلويات دبيب الفاخرة",
        templateName: "بنود تفتيش سلامة الغذاء للمصانع",
        status: "completed",
        lastUpdate: "2026/11/13 , 03:56:31 AM",
        startDate: "2026/11/13 , 03:47:02 AM",
        completeDate: "2026/11/13 , 03:56:31 AM",
        flaggedItemsCount: 17,
        score: 70.0,
        scores: [
            { label: "العامة", score: 70.0 },
            { label: "الأسئلة الحساسة", score: 70.0 },
        ],
        createdAt: "2026/11/13",
    },
    {
        id: "3",
        entityName: "شركة طيبات المدينة",
        templateName: "بنود تفتيش الإعاشة",
        status: "completed",
        lastUpdate: "2026/11/10 , 11:20:15 AM",
        startDate: "2026/11/10 , 10:45:00 AM",
        completeDate: "2026/11/10 , 11:20:15 AM",
        flaggedItemsCount: 8,
        score: 79.66,
        scores: [{ label: "العامة", score: 79.66 }],
        createdAt: "2026/11/10",
    },
    {
        id: "4",
        entityName: "مطابخ الإعاشة الحديثة",
        templateName: "بنود تفتيش الإعاشة",
        status: "completed",
        lastUpdate: "2026/11/08 , 02:15:20 PM",
        startDate: "2026/11/08 , 01:30:00 PM",
        completeDate: "2026/11/08 , 02:15:20 PM",
        flaggedItemsCount: 4,
        score: 92.15,
        scores: [{ label: "العامة", score: 92.15 }],
        createdAt: "2026/11/08",
    },
    {
        id: "5",
        entityName: "مطعم الساحل الشرقي",
        templateName: "بنود تفتيش المطاعم",
        status: "completed",
        lastUpdate: "2026/11/05 , 05:40:10 PM",
        startDate: "2026/11/05 , 04:55:00 PM",
        completeDate: "2026/11/05 , 05:40:10 PM",
        flaggedItemsCount: 6,
        score: 88.5,
        scores: [{ label: "النتيجة النهائية", score: 88.5 }],
        createdAt: "2026/11/05",
    },
    {
        id: "6",
        entityName: "مصنع التمور الوطنية",
        templateName: "بنود تفتيش سلامة الغذاء للمصانع",
        status: "completed",
        lastUpdate: "2026/11/02 , 09:30:45 AM",
        startDate: "2026/11/02 , 08:50:00 AM",
        completeDate: "2026/11/02 , 09:30:45 AM",
        flaggedItemsCount: 2,
        score: 94.0,
        scores: [{ label: "العامة", score: 94.0 }],
        createdAt: "2026/11/02",
    },
    {
        id: "7",
        entityName: "مخابز وحلويات الورد",
        templateName: "بنود تفتيش المطاعم",
        status: "completed",
        lastUpdate: "2026/10/28 , 04:12:30 PM",
        startDate: "2026/10/28 , 03:25:00 PM",
        completeDate: "2026/10/28 , 04:12:30 PM",
        flaggedItemsCount: 11,
        score: 81.3,
        scores: [{ label: "النتيجة النهائية", score: 81.3 }],
        createdAt: "2026/10/28",
    },
    {
        id: "8",
        entityName: "مؤسسة الضيافة الكبرى",
        templateName: "بنود تفتيش الإعاشة",
        status: "completed",
        lastUpdate: "2026/10/25 , 01:50:12 PM",
        startDate: "2026/10/25 , 01:05:00 PM",
        completeDate: "2026/10/25 , 01:50:12 PM",
        flaggedItemsCount: 15,
        score: 76.4,
        scores: [{ label: "العامة", score: 76.4 }],
        createdAt: "2026/10/25",
    },
    {
        id: "9",
        entityName: "سوبرماركت النخبة",
        templateName: "بنود تفتيش سلامة الغذاء للمصانع",
        status: "completed",
        lastUpdate: "2026/10/20 , 12:10:00 PM",
        startDate: "2026/10/20 , 11:20:00 AM",
        completeDate: "2026/10/20 , 12:10:00 PM",
        flaggedItemsCount: 5,
        score: 89.9,
        scores: [{ label: "العامة", score: 89.9 }],
        createdAt: "2026/10/20",
    },
];

export const mockInspectionTasksApi = {
    getList: async (params?: any, signal?: AbortSignal): Promise<any> => {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                const { page = 1, search, status, perPage = 10 } = (params || {}) as any;
                let filtered = [...mockInspectionTasks];

                if (search) {
                    filtered = filtered.filter(
                        (item) =>
                            item.entityName.toLowerCase().includes(search.toLowerCase()) ||
                            item.templateName.toLowerCase().includes(search.toLowerCase())
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

    getById: async (id: string, signal?: AbortSignal): Promise<InspectionTask | null> => {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                const mock = mockInspectionTasks.find((s) => s.id === id);
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

    create: async (payload: InspectionTaskCreatePayload): Promise<InspectionTask> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const now = new Date().toISOString().replace("T", " ").substring(0, 19);
                const newItem: InspectionTask = {
                    id: uuidv4(),
                    entityName: payload.entityName,
                    templateName: payload.templateName,
                    status: payload.status || "completed",
                    lastUpdate: payload.lastUpdate || now,
                    startDate: payload.startDate || now,
                    completeDate: payload.completeDate || now,
                    flaggedItemsCount: payload.flaggedItemsCount || 0,
                    score: payload.score || 100,
                    scores: [{ label: "النتيجة النهائية", score: payload.score || 100 }],
                    createdAt: now,
                };
                mockInspectionTasks = [newItem, ...mockInspectionTasks];
                resolve(newItem);
            }, 250);
        });
    },

    update: async (
        id: string,
        payload: InspectionTaskUpdatePayload
    ): Promise<InspectionTask> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockInspectionTasks.findIndex((s) => s.id === id);
                if (index === -1) {
                    reject(new Error("Not found"));
                    return;
                }
                const existing = mockInspectionTasks[index];
                const now = new Date().toISOString().replace("T", " ").substring(0, 19);
                const updatedItem: InspectionTask = {
                    ...existing,
                    ...payload,
                    lastUpdate: now,
                };
                mockInspectionTasks[index] = updatedItem;
                resolve(updatedItem);
            }, 250);
        });
    },

    delete: async (id: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                mockInspectionTasks = mockInspectionTasks.filter((s) => s.id !== id);
                resolve();
            }, 250);
        });
    },
};
