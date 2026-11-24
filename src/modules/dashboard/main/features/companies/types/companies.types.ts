import { z } from "zod";

export const companySchema = z.object({
    name: z.string().min(1, "Name is required"),
    category: z.string().min(1, "Category is required"),
    levelType: z.enum(["State", "Region", "Area", "Site"]).default("Site"),
    tag: z.string().optional(),
    ownerName: z.string().optional(),
    phone: z.string().optional(),
    licenseNumber: z.string().optional(),
    commercialRegNumber: z.string().optional(),
    address: z.string().optional(),
    idNumber: z.string().optional(),
    locationType: z.enum(["map", "latlng", "link"]).default("map"),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    locationLink: z.string().optional(),
    logoUrl: z.string().optional(),
});

export interface Company {
    id: string;
    name: string;
    category: string;
    levelType: "State" | "Region" | "Area" | "Site";
    tag?: string | null;
    ownerName?: string | null;
    phone?: string | null;
    licenseNumber?: string | null;
    commercialRegNumber?: string | null;
    address?: string | null;
    idNumber?: string | null;
    locationType?: "map" | "latlng" | "link";
    latitude?: string | null;
    longitude?: string | null;
    locationLink?: string | null;
    logoUrl?: string | null;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export type CompanyCreatePayload = z.infer<typeof companySchema>;
export type CompanyUpdatePayload = Partial<CompanyCreatePayload>;

export interface CompanyFilterState {
    search: string;
    category: string;
    levelType: string;
    user: string;
    group: string;
    tag: string;
    showChildrenCount: boolean;
}

// Backward compatibility aliases
export type Companies = Company;
export type CompaniesCreatePayload = CompanyCreatePayload;
export type CompaniesUpdatePayload = CompanyUpdatePayload;
