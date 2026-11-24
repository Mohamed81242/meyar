import { z } from "zod";

export const companyTagSchema = z.object({
    name: z.string().min(1, "Name is required"),
});

export interface CompanyTag {
    id: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
}

export type CompanyTagCreatePayload = z.infer<typeof companyTagSchema>;
export type CompanyTagUpdatePayload = Partial<CompanyTagCreatePayload>;

// Backwards compatibility aliases
export type CompanyTags = CompanyTag;
export type CompanyTagsCreatePayload = CompanyTagCreatePayload;
export type CompanyTagsUpdatePayload = CompanyTagUpdatePayload;
