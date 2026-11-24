import { z } from "zod";

export const companyRegistrationSchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    category: z.string().min(1, "Category is required"),
    ownerName: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    commercialFileUrl: z.string().optional(),
    licenseFileUrl: z.string().optional(),
    identityFileUrl: z.string().optional(),
    addressFileUrl: z.string().optional(),
    certFileUrl: z.string().optional(),
    defenseLicenseFileUrl: z.string().optional(),
    qualityFileUrl: z.string().optional(),
    status: z.enum(["pending", "approved", "rejected"]).default("pending"),
});

export interface CompanyRegistration {
    id: string;
    companyName: string;
    category: string;
    ownerName?: string | null;
    email?: string | null;
    phone?: string | null;
    commercialFileUrl?: string | null;
    licenseFileUrl?: string | null;
    identityFileUrl?: string | null;
    addressFileUrl?: string | null;
    certFileUrl?: string | null;
    defenseLicenseFileUrl?: string | null;
    qualityFileUrl?: string | null;
    status: "pending" | "approved" | "rejected";
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export type CompanyRegistrationCreatePayload = z.infer<typeof companyRegistrationSchema>;
export type CompanyRegistrationUpdatePayload = Partial<CompanyRegistrationCreatePayload>;

// Backward compatibility aliases
export type RegistrationOfCompanies = CompanyRegistration;
export type RegistrationOfCompaniesCreatePayload = CompanyRegistrationCreatePayload;
export type RegistrationOfCompaniesUpdatePayload = CompanyRegistrationUpdatePayload;
