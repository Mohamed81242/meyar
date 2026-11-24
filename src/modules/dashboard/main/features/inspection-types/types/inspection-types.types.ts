import { z } from "zod";

export const inspectionTypeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    templatesCount: z.number().optional(),
});

export interface InspectionType {
    id: string;
    name: string;
    templatesCount?: number;
    createdAt?: string;
    updatedAt?: string;
}

export type InspectionTypeCreatePayload = z.infer<typeof inspectionTypeSchema>;
export type InspectionTypeUpdatePayload = Partial<InspectionTypeCreatePayload>;

// Backwards compatibility aliases
export type InspectionTypes = InspectionType;
export type InspectionTypesCreatePayload = InspectionTypeCreatePayload;
export type InspectionTypesUpdatePayload = InspectionTypeUpdatePayload;
