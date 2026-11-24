import { z } from "zod";

export const proceduresSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    role: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
});

export interface Procedures {
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

export type ProceduresCreatePayload = z.infer<typeof proceduresSchema>;
export type ProceduresUpdatePayload = Partial<ProceduresCreatePayload>;
