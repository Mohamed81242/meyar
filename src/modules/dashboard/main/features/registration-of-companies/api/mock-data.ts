import type { CompanyRegistration, CompanyRegistrationCreatePayload, CompanyRegistrationUpdatePayload } from "../types";
import { v4 as uuidv4 } from "uuid";

// Default empty list matching the live reference
export let mockRegistrationOfCompaniess: CompanyRegistration[] = [];

export const mockRegistrationOfCompaniesApi = {
    getList: async (params?: any, _signal?: AbortSignal): Promise<any> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, search, perPage = 10 } = (params || {}) as any;
                const filtered = mockRegistrationOfCompaniess.filter(
                    (item) =>
                        !search ||
                        item.companyName.toLowerCase().includes(search.toLowerCase()) ||
                        item.category.toLowerCase().includes(search.toLowerCase())
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

    getById: async (id: string, _signal?: AbortSignal): Promise<CompanyRegistration | null> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const mock = mockRegistrationOfCompaniess.find((s) => s.id === id);
                if (!mock) reject(new Error("Not found"));
                else resolve(mock);
            }, 200);
        });
    },

    create: async (payload: CompanyRegistrationCreatePayload): Promise<CompanyRegistration> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const now = new Date().toISOString().split("T")[0];
                const newItem: CompanyRegistration = {
                    id: uuidv4(),
                    companyName: payload.companyName,
                    category: payload.category,
                    ownerName: payload.ownerName || null,
                    email: payload.email || null,
                    phone: payload.phone || null,
                    commercialFileUrl: payload.commercialFileUrl || null,
                    licenseFileUrl: payload.licenseFileUrl || null,
                    identityFileUrl: payload.identityFileUrl || null,
                    addressFileUrl: payload.addressFileUrl || null,
                    certFileUrl: payload.certFileUrl || null,
                    defenseLicenseFileUrl: payload.defenseLicenseFileUrl || null,
                    qualityFileUrl: payload.qualityFileUrl || null,
                    status: payload.status || "pending",
                    isActive: true,
                    createdAt: now,
                    updatedAt: now,
                };
                mockRegistrationOfCompaniess = [newItem, ...mockRegistrationOfCompaniess];
                resolve(newItem);
            }, 250);
        });
    },

    update: async (id: string, payload: CompanyRegistrationUpdatePayload): Promise<CompanyRegistration> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockRegistrationOfCompaniess.findIndex((s) => s.id === id);
                if (index === -1) {
                    reject(new Error("Not found"));
                    return;
                }
                const existing = mockRegistrationOfCompaniess[index];
                const updatedItem: CompanyRegistration = {
                    ...existing,
                    ...payload,
                    updatedAt: new Date().toISOString().split("T")[0],
                };
                mockRegistrationOfCompaniess[index] = updatedItem;
                resolve(updatedItem);
            }, 250);
        });
    },

    delete: async (id: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                mockRegistrationOfCompaniess = mockRegistrationOfCompaniess.filter((s) => s.id !== id);
                resolve();
            }, 200);
        });
    },
};
