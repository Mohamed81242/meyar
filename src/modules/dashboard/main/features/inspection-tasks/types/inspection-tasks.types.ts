import { z } from "zod";

export type InspectionTaskStatus = "completed" | "in_progress" | "pending" | "cancelled";

export interface TaskScoreBreakdown {
    label: string;
    score: number;
}

export const inspectionTaskSchema = z.object({
    entityName: z.string().min(1, "Entity name is required"),
    templateName: z.string().min(1, "Template name is required"),
    status: z.enum(["completed", "in_progress", "pending", "cancelled"]).default("completed"),
    lastUpdate: z.string().optional(),
    startDate: z.string().optional(),
    completeDate: z.string().optional().nullable(),
    flaggedItemsCount: z.number().default(0),
    score: z.number().default(100),
});

export interface InspectionTask {
    id: string;
    entityName: string;
    templateName: string;
    status: InspectionTaskStatus;
    lastUpdate: string;
    startDate: string;
    completeDate?: string | null;
    flaggedItemsCount: number;
    score: number;
    scores?: TaskScoreBreakdown[];
    createdAt?: string;
    updatedAt?: string;
}

export type InspectionTaskCreatePayload = z.infer<typeof inspectionTaskSchema>;
export type InspectionTaskUpdatePayload = Partial<InspectionTaskCreatePayload>;

// Backwards compatibility aliases
export type InspectionTasks = InspectionTask;
export type InspectionTasksCreatePayload = InspectionTaskCreatePayload;
export type InspectionTasksUpdatePayload = InspectionTaskUpdatePayload;
