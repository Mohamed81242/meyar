import type { Company, CompanyCreatePayload, CompanyUpdatePayload } from "../types";
import { v4 as uuidv4 } from "uuid";

export let mockCompaniess: Company[] = [
    {
        id: "1",
        name: "سيلفش - Sellfish",
        category: "مطعم",
        levelType: "Site",
        tag: "مطاعم متميزة",
        ownerName: "محمد الشهري",
        phone: "+966 550000001",
        licenseNumber: "LIC-10924",
        commercialRegNumber: "CR-920194",
        address: "الرياض، حي النرجس",
        idNumber: "1092837465",
        locationType: "map",
        isActive: true,
        createdAt: "2026/10/14",
        updatedAt: "2026/10/14",
    },
    {
        id: "2",
        name: "اثراء الجود",
        category: "مطابخ الاعاشة",
        levelType: "Area",
        tag: "اعاشة كبرى",
        ownerName: "عبدالله الدوسري",
        phone: "+966 550000002",
        licenseNumber: "LIC-88371",
        commercialRegNumber: "CR-883719",
        address: "مكة المكرمة، العزيزية",
        idNumber: "1083746592",
        locationType: "map",
        isActive: true,
        createdAt: "2026/08/26",
        updatedAt: "2026/08/26",
    },
    {
        id: "3",
        name: "مصنع حلويات حبيب الفاخرة",
        category: "مصانع",
        levelType: "Site",
        tag: "مصانع حلويات",
        ownerName: "حبيب الراجحي",
        phone: "+966 550000003",
        licenseNumber: "LIC-77492",
        commercialRegNumber: "CR-774921",
        address: "جدة، المدينة الصناعية",
        idNumber: "1074928163",
        locationType: "map",
        isActive: true,
        createdAt: "2026/08/26",
        updatedAt: "2026/08/26",
    },
    {
        id: "4",
        name: "شركة طيبات المدينة",
        category: "مطابخ الاعاشة",
        levelType: "Site",
        tag: "اعاشة المدينة",
        ownerName: "سالم الحربي",
        phone: "+966 550000004",
        licenseNumber: "LIC-66381",
        commercialRegNumber: "CR-663810",
        address: "المدينة المنورة، قباء",
        idNumber: "1063819274",
        locationType: "map",
        isActive: true,
        createdAt: "2026/08/26",
        updatedAt: "2026/08/26",
    },
];

export const mockCompaniesApi = {
    getList: async (params?: any, _signal?: AbortSignal): Promise<any> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, search, category, levelType, perPage = 10 } = (params || {}) as any;
                const filtered = mockCompaniess.filter((item) => {
                    const matchesSearch =
                        !search ||
                        item.name.toLowerCase().includes(search.toLowerCase()) ||
                        item.category.toLowerCase().includes(search.toLowerCase());

                    const matchesCategory =
                        !category || item.category === category;

                    const matchesLevel =
                        !levelType || levelType === "all" || item.levelType === levelType;

                    return matchesSearch && matchesCategory && matchesLevel;
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

    getById: async (id: string, _signal?: AbortSignal): Promise<Company | null> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const mock = mockCompaniess.find((s) => s.id === id);
                if (!mock) reject(new Error("Not found"));
                else resolve(mock);
            }, 200);
        });
    },

    create: async (payload: CompanyCreatePayload): Promise<Company> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const now = new Date().toISOString().split("T")[0];
                const newItem: Company = {
                    id: uuidv4(),
                    name: payload.name,
                    category: payload.category,
                    levelType: payload.levelType,
                    tag: payload.tag || null,
                    ownerName: payload.ownerName || null,
                    phone: payload.phone || null,
                    licenseNumber: payload.licenseNumber || null,
                    commercialRegNumber: payload.commercialRegNumber || null,
                    address: payload.address || null,
                    idNumber: payload.idNumber || null,
                    locationType: payload.locationType || "map",
                    latitude: payload.latitude || null,
                    longitude: payload.longitude || null,
                    locationLink: payload.locationLink || null,
                    logoUrl: payload.logoUrl || null,
                    isActive: true,
                    createdAt: now,
                    updatedAt: now,
                };
                mockCompaniess = [newItem, ...mockCompaniess];
                resolve(newItem);
            }, 250);
        });
    },

    update: async (id: string, payload: CompanyUpdatePayload): Promise<Company> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockCompaniess.findIndex((s) => s.id === id);
                if (index === -1) {
                    reject(new Error("Not found"));
                    return;
                }
                const existing = mockCompaniess[index];
                const updatedItem: Company = {
                    ...existing,
                    ...payload,
                    updatedAt: new Date().toISOString().split("T")[0],
                };
                mockCompaniess[index] = updatedItem;
                resolve(updatedItem);
            }, 250);
        });
    },

    delete: async (id: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                mockCompaniess = mockCompaniess.filter((s) => s.id !== id);
                resolve();
            }, 200);
        });
    },
};
