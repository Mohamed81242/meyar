import { z } from "zod";

export const inspectionTemplatesSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    role: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
});

export interface InspectionTemplates {
    id: string;
    name: string;
    description?: string | null;
    role?: string | null;
    email?: string | null;
    phone?: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type InspectionTemplatesCreatePayload = z.infer<typeof inspectionTemplatesSchema>;
export type InspectionTemplatesUpdatePayload = Partial<InspectionTemplatesCreatePayload>;
