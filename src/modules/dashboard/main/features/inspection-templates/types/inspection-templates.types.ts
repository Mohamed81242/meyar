import { z } from "zod";

export type TemplateStatus = "published" | "unpublished";
export type EvaluationType = "compliance" | "quality";

export const inspectionTemplateSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    status: z.enum(["published", "unpublished"]).default("unpublished"),
    pagesCount: z.number().default(1),
    sectionsCount: z.number().default(0),
    questionsCount: z.number().default(0),
    evaluationType: z.enum(["compliance", "quality"]).default("compliance"),
    successPercentage: z.number().default(100),
    formType: z.string().optional(),
    folderId: z.string().optional(),
});

export interface InspectionTemplate {
    id: string;
    title: string;
    description?: string;
    status: TemplateStatus;
    pagesCount: number;
    sectionsCount: number;
    questionsCount: number;
    evaluationType: EvaluationType;
    successPercentage: number;
    formType?: string;
    folderId?: string;
    createdAt: string;
    modifiedAt: string;
    publishedAt?: string | null;
}

export type InspectionTemplateCreatePayload = {
    title: string;
    description?: string;
    status?: TemplateStatus;
    pagesCount?: number;
    sectionsCount?: number;
    questionsCount?: number;
    evaluationType?: EvaluationType;
    successPercentage?: number;
    formType?: string;
    folderId?: string;
};
export type InspectionTemplateUpdatePayload = Partial<InspectionTemplateCreatePayload>;

// Backwards compatibility aliases
export type InspectionTemplates = InspectionTemplate;
export type InspectionTemplatesCreatePayload = InspectionTemplateCreatePayload;
export type InspectionTemplatesUpdatePayload = InspectionTemplateUpdatePayload;
