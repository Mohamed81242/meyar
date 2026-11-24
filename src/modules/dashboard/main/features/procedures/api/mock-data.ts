import type { Procedure, ProcedureCreatePayload, ProcedureUpdatePayload } from "../types";
import { v4 as uuidv4 } from "uuid";

export let mockProceduress: Procedure[] = [
    {
        id: "1",
        taskTitle: "يجب فصل غرف تحضير الدواجن عن الاسماك",
        companyName: "شركة سامي سليمان سندي",
        status: "Completed",
        delayDays: 70,
        priority: "High",
        createdAt: "2026/09/08 , 12:56:09 AM",
        modifiedAt: "2026/10/14 , 09:46:20 PM",
    },
    {
        id: "2",
        taskTitle: "طفيات الحريق منتهية الصلاحية",
        companyName: "شركة سامي سليمان سندي",
        status: "Completed",
        delayDays: 70,
        priority: "Low",
        createdAt: "2026/09/07 , 11:53:50 PM",
        modifiedAt: "2026/10/14 , 09:46:30 PM",
    },
    {
        id: "3",
        taskTitle: "يجب تغيير محابس المياه بسبب وجود صدأ",
        companyName: "شركة سامي سليمان سندي",
        status: "Completed",
        delayDays: 70,
        priority: "Low",
        createdAt: "2026/09/07 , 11:52:18 PM",
        modifiedAt: "2026/10/14 , 09:46:41 PM",
    },
    {
        id: "4",
        taskTitle: "توفير أجهزة مراقبة درجات حرارة الثلاجات والمستودعات",
        companyName: "سيلفش - Sellfish",
        status: "Completed",
        delayDays: 35,
        priority: "Medium",
        createdAt: "2026/10/01 , 10:20:15 AM",
        modifiedAt: "2026/10/14 , 09:45:10 PM",
    },
    {
        id: "5",
        taskTitle: "تحديث بطاقات البيانات للمنتجات المصنعة",
        companyName: "مصنع حلويات حبيب الفاخرة",
        status: "Completed",
        delayDays: 12,
        priority: "High",
        createdAt: "2026/10/05 , 02:15:30 PM",
        modifiedAt: "2026/10/14 , 09:40:00 PM",
    },
    {
        id: "6",
        taskTitle: "فحص دوري لنظام تصريف المياه في مناطق الإعداد",
        companyName: "شركة طيبات المدينة",
        status: "Completed",
        delayDays: 20,
        priority: "Low",
        createdAt: "2026/10/10 , 09:00:00 AM",
        modifiedAt: "2026/10/14 , 09:35:00 PM",
    },
];

export const mockProceduresApi = {
    getList: async (params?: any, _signal?: AbortSignal): Promise<any> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, search, status, priority, perPage = 10 } = (params || {}) as any;
                const filtered = mockProceduress.filter((item) => {
                    const matchesSearch =
                        !search ||
                        item.taskTitle.toLowerCase().includes(search.toLowerCase()) ||
                        item.companyName.toLowerCase().includes(search.toLowerCase());

                    const matchesStatus =
                        !status || status === "all" || item.status.toLowerCase() === status.toLowerCase();

                    const matchesPriority =
                        !priority || priority === "all" || item.priority.toLowerCase() === priority.toLowerCase();

                    return matchesSearch && matchesStatus && matchesPriority;
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
            }, 250);
        });
    },

    getById: async (id: string, _signal?: AbortSignal): Promise<Procedure | null> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const mock = mockProceduress.find((s) => s.id === id);
                if (!mock) reject(new Error("Not found"));
                else resolve(mock);
            }, 200);
        });
    },

    create: async (payload: ProcedureCreatePayload): Promise<Procedure> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const now = new Date().toISOString().replace("T", " ").substring(0, 19);
                const newItem: Procedure = {
                    id: uuidv4(),
                    taskTitle: payload.taskTitle,
                    companyName: payload.companyName,
                    status: payload.status || "Completed",
                    delayDays: payload.delayDays || 0,
                    priority: payload.priority || "Medium",
                    notes: payload.notes,
                    createdAt: now,
                    modifiedAt: now,
                };
                mockProceduress = [newItem, ...mockProceduress];
                resolve(newItem);
            }, 250);
        });
    },

    update: async (id: string, payload: ProcedureUpdatePayload): Promise<Procedure> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockProceduress.findIndex((s) => s.id === id);
                if (index === -1) {
                    reject(new Error("Not found"));
                    return;
                }
                const existing = mockProceduress[index];
                const updatedItem: Procedure = {
                    ...existing,
                    ...payload,
                    modifiedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
                };
                mockProceduress[index] = updatedItem;
                resolve(updatedItem);
            }, 250);
        });
    },

    delete: async (id: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                mockProceduress = mockProceduress.filter((s) => s.id !== id);
                resolve();
            }, 200);
        });
    },
};
