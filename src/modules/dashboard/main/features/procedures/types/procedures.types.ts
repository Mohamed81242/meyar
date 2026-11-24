import { z } from "zod";

export type ProcedurePriority = "High" | "Medium" | "Low";
export type ProcedureStatus = "Completed" | "In Progress" | "Pending";

export const procedureSchema = z.object({
    taskTitle: z.string().min(1, "Task title is required"),
    companyName: z.string().min(1, "Company name is required"),
    status: z.enum(["Completed", "In Progress", "Pending"]).default("Completed"),
    delayDays: z.number().default(0),
    priority: z.enum(["High", "Medium", "Low"]).default("Medium"),
    notes: z.string().optional(),
});

export interface Procedure {
    id: string;
    taskTitle: string;
    companyName: string;
    status: ProcedureStatus;
    delayDays: number;
    priority: ProcedurePriority;
    createdAt: string;
    modifiedAt: string;
    notes?: string;
}

// Backwards compatibility alias
export type Procedures = Procedure;

export type ProcedureCreatePayload = z.infer<typeof procedureSchema>;
export type ProceduresCreatePayload = ProcedureCreatePayload;

export type ProcedureUpdatePayload = Partial<ProcedureCreatePayload>;
export type ProceduresUpdatePayload = ProcedureUpdatePayload;

export interface ProcedureFilterState {
    search: string;
    company: string;
    status: string;
    priority: string;
}
