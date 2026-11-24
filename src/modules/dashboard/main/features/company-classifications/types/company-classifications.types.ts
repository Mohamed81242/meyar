import { z } from "zod";

export const companyClassificationSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
});

export interface CompanyClassification {
    id: string;
    name: string;
    description?: string | null;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export type CompanyClassificationCreatePayload = z.infer<typeof companyClassificationSchema>;
export type CompanyClassificationUpdatePayload = Partial<CompanyClassificationCreatePayload>;

// Backward compatibility aliases
export type CompanyClassifications = CompanyClassification;
export type CompanyClassificationsCreatePayload = CompanyClassificationCreatePayload;
export type CompanyClassificationsUpdatePayload = CompanyClassificationUpdatePayload;
