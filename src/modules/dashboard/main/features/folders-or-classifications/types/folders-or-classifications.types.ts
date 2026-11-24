import { z } from "zod";

export const templateFolderSchema = z.object({
    name: z.string().min(1, "Name is required"),
    selectedTemplateIds: z.array(z.string()).optional(),
});

export interface TemplateFolder {
    id: string;
    name: string;
    numberOfTemplates: number;
    selectedTemplateIds?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export type TemplateFolderCreatePayload = {
    name: string;
    selectedTemplateIds?: string[];
};

export type TemplateFolderUpdatePayload = Partial<TemplateFolderCreatePayload>;

// Backwards compatibility aliases
export type FoldersOrClassifications = TemplateFolder;
export type FoldersOrClassificationsCreatePayload = TemplateFolderCreatePayload;
export type FoldersOrClassificationsUpdatePayload = TemplateFolderUpdatePayload;
