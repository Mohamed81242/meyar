import fs from 'fs';
import path from 'path';

// Utility to convert kebab-case to PascalCase
const toPascalCase = (str) =>
    str
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');

// Utility to convert kebab-case to camelCase
const toCamelCase = (str) => {
    const pascal = toPascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

const args = process.argv.slice(2);

if (args.length < 1) {
    console.error('Usage: node scripts/scaffold-dashboard-feature.js <feature-name>');
    console.error('Example: node scripts/scaffold-dashboard-feature.js inspection-tasks');
    process.exit(1);
}

const featureKebab = args[0]; // e.g., inspection-tasks
const featurePascal = toPascalCase(featureKebab); // e.g., InspectionTasks
const featureCamel = toCamelCase(featureKebab); // e.g., inspectionTasks
const featureTitle = featurePascal.replace(/([A-Z])/g, ' $1').trim();

const BASE_DIR = path.join(import.meta.dirname, '..', 'src', 'modules', 'dashboard', 'main', 'features', featureKebab);

const directories = [
    'api',
    'components',
    'navigation',
    'pages',
    'types',
    'locales',
];

const files = {
    // 1. Root Export
    'index.ts': `export * from "./types";\nexport * from "./api";\nexport * from "./components";\n`,

    // 2. Types
    [`types/${featureKebab}.types.ts`]: `import { z } from "zod";

export const ${featureCamel}Schema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    role: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
});

export interface ${featurePascal} {
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

export type ${featurePascal}CreatePayload = z.infer<typeof ${featureCamel}Schema>;
export type ${featurePascal}UpdatePayload = Partial<${featurePascal}CreatePayload>;
`,
    'types/index.ts': `export * from "./${featureKebab}.types";\n`,

    // 3. Navigation
    'navigation/routes.ts': `import type { RouteConfig } from "@/router";

export const ${featureCamel}Routes: RouteConfig[] = [
    {
        path: "${featureKebab}",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "${featureKebab}:title",
            requiresAuth: true,
        },
        requireAllPermissions: true,
    },
];
`,
    'navigation/paths.ts': `export const ${featureCamel}Paths = {
    main: "/dashboard/${featureKebab}",
} as const;
`,
    'navigation/nav.ts': `import type { NavItem } from "@/navigation/nav.types";
import { Folder } from "lucide-react"; 

export const ${featureCamel}NavItem: NavItem = {
    key: "${featureKebab}",
    labelKey: "${featureKebab}:title",
    label: "${featureTitle}",
    href: "/dashboard/${featureKebab}",
    icon: Folder,
};

export default ${featureCamel}NavItem;
`,
    'navigation/index.ts': `export * from "./nav";
export * from "./paths";
export * from "./routes";
`,

    // 4. Locales
    'locales/en.json': `{
    "title": "${featureTitle}",
    "main": {
        "title": "${featureTitle}"
    }
}`,
    'locales/ar.json': `{
    "title": "${featureTitle}",
    "main": {
        "title": "${featureTitle}"
    }
}`,

    // 5. API Layer
    'api/mock-data.ts': `import type { ${featurePascal}, ${featurePascal}CreatePayload, ${featurePascal}UpdatePayload } from "../types";
import { v4 as uuidv4 } from "uuid";

export let mock${featurePascal}s: ${featurePascal}[] = [
    {
        id: "1",
        name: "عبدالرحمن قاسم",
        description: "Standard account item",
        role: "أدمن",
        email: "abuqasim1427@gmail.com",
        phone: "+966 552818590",
        isActive: true,
        createdAt: "2026/10/14 , 08:19:28 PM",
        updatedAt: "2026/10/14 , 09:02:52 PM",
    },
    {
        id: "2",
        name: "فراس حافظ",
        description: "Administrative account",
        role: "أدمن",
        email: "rmz.alemtithal@gmail.com",
        phone: "+966 500000000",
        isActive: true,
        createdAt: "2026/08/26 , 02:35:26 AM",
        updatedAt: "2026/08/26 , 02:35:26 AM",
    }
];

export const mock${featurePascal}Api = {
    getList: async (params?: any, signal?: AbortSignal): Promise<any> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, search, perPage = 10 } = (params || {}) as any;
                const filtered = mock${featurePascal}s.filter(item => 
                    !search || 
                    item.name.toLowerCase().includes(search.toLowerCase()) ||
                    (item.email && item.email.toLowerCase().includes(search.toLowerCase()))
                );
                const p = Number(page);
                const limit = Number(perPage);
                const start = (p - 1) * limit;
                resolve({
                    items: filtered.slice(start, start + limit),
                    perPage: limit,
                    currentPage: p,
                    lastPage: Math.ceil(filtered.length / limit) || 1,
                    nextPageUrl: null,
                    total: filtered.length,
                });
            }, 300);
        });
    },

    getById: async (id: string, signal?: AbortSignal): Promise<${featurePascal} | null> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const mock = mock${featurePascal}s.find((s) => s.id === id);
                if (!mock) reject(new Error("Not found"));
                else resolve(mock);
            }, 300);
        });
    },
    
    create: async (payload: ${featurePascal}CreatePayload): Promise<${featurePascal}> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const now = new Date().toLocaleDateString();
                const newItem: ${featurePascal} = {
                    id: uuidv4(),
                    ...payload,
                    isActive: true,
                    createdAt: now,
                    updatedAt: now,
                };
                mock${featurePascal}s = [newItem, ...mock${featurePascal}s];
                resolve(newItem);
            }, 300);
        });
    },

    update: async (id: string, payload: ${featurePascal}UpdatePayload): Promise<${featurePascal}> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mock${featurePascal}s.findIndex((s) => s.id === id);
                if (index === -1) {
                    reject(new Error("Not found"));
                    return;
                }
                const existing = mock${featurePascal}s[index];
                const updatedItem = {
                    ...existing,
                    ...payload,
                    updatedAt: new Date().toLocaleDateString(),
                };
                mock${featurePascal}s[index] = updatedItem;
                resolve(updatedItem);
            }, 300);
        });
    },

    delete: async (id: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mock${featurePascal}s.findIndex((s) => s.id === id);
                if (index === -1) {
                    reject(new Error("Not found"));
                    return;
                }
                mock${featurePascal}s = mock${featurePascal}s.filter((s) => s.id !== id);
                resolve();
            }, 300);
        });
    }
};
`,
    [`api/${featureKebab}.api.ts`]: `import { api } from "@/shared/api/client";
import type { ApiResponse, ListQueryParams, PaginatedData } from "@/shared/api";
import { API_CONFIG } from "@/shared/api/config/env";
import type { ${featurePascal}, ${featurePascal}CreatePayload, ${featurePascal}UpdatePayload } from "../types";
import { mock${featurePascal}Api } from "./mock-data";

const BASE_URL = "/${featureKebab}";
const IS_MOCKDATA = true;

export const ${featureCamel}Api = {
    getList: async (params?: ListQueryParams, signal?: AbortSignal): Promise<PaginatedData<${featurePascal}>> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mock${featurePascal}Api.getList(params, signal);
        }

        const response = await api.get<ApiResponse<PaginatedData<${featurePascal}>>>(BASE_URL, {
            params,
            signal,
        });

        if (response.error) throw response.error;
        return response.data?.data as PaginatedData<${featurePascal}>;
    },

    getById: async (id: string, signal?: AbortSignal): Promise<${featurePascal}> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mock${featurePascal}Api.getById(id, signal) as Promise<${featurePascal}>;
        }

        const response = await api.get<ApiResponse<${featurePascal}>>(\`\${BASE_URL}/\${id}\`, { signal });
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Not found");
        return response.data.data;
    },
    
    create: async (payload: ${featurePascal}CreatePayload): Promise<${featurePascal}> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mock${featurePascal}Api.create(payload);
        const response = await api.post<ApiResponse<${featurePascal}>>(BASE_URL, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    update: async (id: string, payload: ${featurePascal}UpdatePayload): Promise<${featurePascal}> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mock${featurePascal}Api.update(id, payload);
        const response = await api.put<ApiResponse<${featurePascal}>>(\`\${BASE_URL}/\${id}\`, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mock${featurePascal}Api.delete(id);
        const response = await api.delete(\`\${BASE_URL}/\${id}\`);
        if (response.error) throw new Error(response.error.message || "Failed");
    }
};
`,
    [`api/${featureKebab}.keys.ts`]: `export const ${featureCamel}Keys = {
    all: ["${featureKebab}"] as const,
    lists: () => [...${featureCamel}Keys.all, "list"] as const,
    list: (params?: any) => (params ? [...${featureCamel}Keys.lists(), params] as const : ${featureCamel}Keys.lists()),
    detail: (id: string) => [...${featureCamel}Keys.all, "detail", id] as const,
};
`,
    [`api/${featureKebab}.queries.ts`]: `import { useQuery } from "@tanstack/react-query";
import { ${featureCamel}Api } from "./${featureKebab}.api";
import { ${featureCamel}Keys } from "./${featureKebab}.keys";
import type { ListQueryParams } from "@/shared/api";

export function use${featurePascal}sList(params?: ListQueryParams) {
    return useQuery({
        queryKey: ${featureCamel}Keys.list(params),
        queryFn: ({ signal }) => ${featureCamel}Api.getList(params, signal),
    });
}

export function use${featurePascal}(id: string) {
    return useQuery({
        queryKey: ${featureCamel}Keys.detail(id),
        queryFn: ({ signal }) => ${featureCamel}Api.getById(id, signal),
        enabled: !!id,
    });
}
`,
    [`api/${featureKebab}.mutations.ts`]: `import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ${featureCamel}Api } from "./${featureKebab}.api";
import { ${featureCamel}Keys } from "./${featureKebab}.keys";

export function useCreate${featurePascal}() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ${featureCamel}Api.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ${featureCamel}Keys.lists() });
        },
    });
}

export function useUpdate${featurePascal}() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => ${featureCamel}Api.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ${featureCamel}Keys.lists() });
            queryClient.invalidateQueries({ queryKey: ${featureCamel}Keys.detail(id) });
        },
    });
}

export function useDelete${featurePascal}() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ${featureCamel}Api.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ${featureCamel}Keys.lists() });
        },
    });
}
`,
    'api/index.ts': `export * from "./${featureKebab}.api";
export * from "./${featureKebab}.keys";
export * from "./${featureKebab}.mutations";
export * from "./${featureKebab}.queries";
export * from "./mock-data";
`,

    // 6. Components (Modals)
    [`components/Create${featurePascal}Modal.tsx`]: `import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/design-system/components/dialog";
import { useCreate${featurePascal} } from "../api";
import { toast } from "sonner";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const Create${featurePascal}Modal: React.FC<Props> = ({ isOpen, onClose }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("أدمن");

    const createMutation = useCreate${featurePascal}();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Name is required");
            return;
        }

        createMutation.mutate(
            { name, email: email || undefined, role },
            {
                onSuccess: () => {
                    toast.success("${featureTitle} created successfully");
                    setName("");
                    setEmail("");
                    onClose();
                },
                onError: () => {
                    toast.error("Failed to create ${featureTitle}");
                },
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-white dark:bg-dashboard-card p-6 rounded-2xl border border-dashboard-border shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold text-dashboard-foreground">
                        Add New ${featureTitle}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter name"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-dashboard-border bg-gray-50/50 dark:bg-dashboard-background outline-none text-dashboard-foreground"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-dashboard-border bg-gray-50/50 dark:bg-dashboard-background outline-none text-dashboard-foreground"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                            Role
                        </label>
                        <input
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-dashboard-border bg-gray-50/50 dark:bg-dashboard-background outline-none text-dashboard-foreground"
                        />
                    </div>

                    <DialogFooter className="gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold rounded-xl border border-gray-200 dark:border-dashboard-border text-gray-600 dark:text-gray-300 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={createMutation.isPending}
                            className="px-4 py-2 text-xs font-semibold rounded-xl bg-dashboard-primary hover:opacity-90 text-white transition-colors cursor-pointer disabled:opacity-50"
                        >
                            {createMutation.isPending ? "Creating..." : "Save"}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
`,
    [`components/Edit${featurePascal}Modal.tsx`]: `import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/design-system/components/dialog";
import { useUpdate${featurePascal} } from "../api";
import type { ${featurePascal} } from "../types";
import { toast } from "sonner";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    item: ${featurePascal} | null;
}

export const Edit${featurePascal}Modal: React.FC<Props> = ({ isOpen, onClose, item }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {
        if (item) {
            setName(item.name || "");
            setEmail(item.email || "");
            setRole(item.role || "أدمن");
        }
    }, [item]);

    const updateMutation = useUpdate${featurePascal}();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!item || !name.trim()) return;

        updateMutation.mutate(
            { id: item.id, data: { name, email, role } },
            {
                onSuccess: () => {
                    toast.success("Updated successfully");
                    onClose();
                },
                onError: () => {
                    toast.error("Failed to update");
                },
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-white dark:bg-dashboard-card p-6 rounded-2xl border border-dashboard-border shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold text-dashboard-foreground">
                        Edit ${featureTitle}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-dashboard-border bg-gray-50/50 dark:bg-dashboard-background outline-none text-dashboard-foreground"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-dashboard-border bg-gray-50/50 dark:bg-dashboard-background outline-none text-dashboard-foreground"
                        />
                    </div>

                    <DialogFooter className="gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold rounded-xl border border-gray-200 dark:border-dashboard-border text-gray-600 dark:text-gray-300 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={updateMutation.isPending}
                            className="px-4 py-2 text-xs font-semibold rounded-xl bg-dashboard-primary hover:opacity-90 text-white transition-colors cursor-pointer disabled:opacity-50"
                        >
                            {updateMutation.isPending ? "Saving..." : "Save"}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
`,
    [`components/Delete${featurePascal}Modal.tsx`]: `import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/design-system/components/dialog";
import { useDelete${featurePascal} } from "../api";
import type { ${featurePascal} } from "../types";
import { toast } from "sonner";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    item: ${featurePascal} | null;
}

export const Delete${featurePascal}Modal: React.FC<Props> = ({ isOpen, onClose, item }) => {
    const deleteMutation = useDelete${featurePascal}();

    const handleConfirm = () => {
        if (!item) return;

        deleteMutation.mutate(item.id, {
            onSuccess: () => {
                toast.success("Deleted successfully");
                onClose();
            },
            onError: () => {
                toast.error("Failed to delete");
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-sm bg-white dark:bg-dashboard-card p-6 rounded-2xl border border-dashboard-border shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold text-dashboard-foreground">
                        Confirm Deletion
                    </DialogTitle>
                    <DialogDescription className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Are you sure you want to delete <strong className="text-dashboard-foreground">{item?.name}</strong>? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-semibold rounded-xl border border-gray-200 dark:border-dashboard-border text-gray-600 dark:text-gray-300 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={deleteMutation.isPending}
                        className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
`,
    'components/index.ts': `export * from "./Create${featurePascal}Modal";
export * from "./Edit${featurePascal}Modal";
export * from "./Delete${featurePascal}Modal";
`,

    // 7. Full Page matching MEAYAR UI
    'pages/main.tsx': `import React, { useState } from "react";
import { useLanguage } from "@/shared/hooks";
import { useDebounce } from "@/shared/observability";
import {
    ChevronRight,
    Search,
    Plus,
    MoreVertical,
    CheckCircle2,
    Edit2,
    Trash2,
    RotateCcw,
    ChevronLeft,
    ChevronsLeft,
    ChevronsRight,
    Send,
} from "lucide-react";
import { use${featurePascal}sList } from "../api";
import {
    Create${featurePascal}Modal,
    Edit${featurePascal}Modal,
    Delete${featurePascal}Modal,
} from "../components";
import type { ${featurePascal} } from "../types";
import { exportToExcel } from "@/utils/fileUtils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/design-system/components/dropdown-menu";

export default function ${featurePascal}Page() {
    const { t } = useLanguage("${featureKebab}");

    // Filter states
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);
    const [statusFilter, setStatusFilter] = useState("all");

    // Pagination
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    // Selected rows
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Modals
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<${featurePascal} | null>(null);
    const [deletingItem, setDeletingItem] = useState<${featurePascal} | null>(null);

    // Query Data
    const { data, isLoading } = use${featurePascal}sList({
        page,
        perPage,
        search: debouncedSearch || undefined,
    });

    const items: ${featurePascal}[] = (data as any)?.items || [];
    const totalItems: number = (data as any)?.total ?? items.length;
    const totalPages: number = (data as any)?.lastPage ?? (Math.ceil(totalItems / perPage) || 1);

    // Filtered items (client status filter if applicable)
    const displayedItems = items.filter((item) => {
        if (statusFilter === "active") return item.isActive;
        if (statusFilter === "inactive") return !item.isActive;
        return true;
    });

    // Checkbox selection
    const isAllSelected = displayedItems.length > 0 && selectedIds.length === displayedItems.length;
    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(displayedItems.map((i) => i.id));
        }
    };

    const handleSelectRow = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleExportExcel = () => {
        exportToExcel(
            displayedItems,
            [
                { header: "ID", accessor: (row) => row.id },
                { header: "Name", accessor: (row) => row.name },
                { header: "Role", accessor: (row) => row.role || "—" },
                { header: "Email", accessor: (row) => row.email || "—" },
                { header: "Phone", accessor: (row) => row.phone || "—" },
                { header: "Status", accessor: (row) => (row.isActive ? "Active" : "Inactive") },
                { header: "Created At", accessor: (row) => row.createdAt },
            ],
            "${featureKebab}-export.xlsx"
        );
    };

    return (
        <div className="flex flex-col gap-4 w-full select-none text-[#1E293B]">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium">
                <span>Home</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span className="text-[#334155] font-semibold">
                    ${featureTitle}
                </span>
            </div>

            {/* Page Title */}
            <div>
                <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                    ${featureTitle}
                </h1>
            </div>

            {/* Collapsible Filter Card */}
            <div className="dashboard-card p-3.5 px-5 transition-all">
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 text-sm font-semibold text-dashboard-primary hover:opacity-80 transition-colors cursor-pointer select-none"
                >
                    <ChevronRight
                        className={\`w-4 h-4 text-dashboard-primary transition-transform duration-200 \${
                            isFilterOpen ? "rotate-90" : ""
                        }\`}
                    />
                    <span>Filter</span>
                </button>

                {isFilterOpen && (
                    <div className="mt-3 pt-3 border-t border-[#F1F5F9] grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-150">
                        {/* Search Input */}
                        <div className="flex items-center gap-2 px-3 h-9 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-xs focus-within:border-dashboard-primary transition-colors">
                            <Search className="w-4 h-4 text-[#94A3B8] shrink-0" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-transparent border-none outline-none w-full text-xs text-[#0F172A] placeholder:text-[#94A3B8]"
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                            className="px-3 h-9 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-xs text-[#0F172A] outline-none cursor-pointer"
                        >
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        {/* Reset Button */}
                        <button
                            onClick={() => {
                                setSearch("");
                                setStatusFilter("all");
                                setPage(1);
                            }}
                            className="px-3 h-9 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-[#475569] hover:bg-[#F1F5F9] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                            <RotateCcw className="w-4 h-4" />
                            <span>Reset Filters</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Table Card */}
            <div className="dashboard-card overflow-hidden flex flex-col">
                {/* Table Header Toolbar */}
                <div className="p-4 px-6 border-b border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    {/* Left: Total Items */}
                    <div className="text-sm font-medium text-[#64748B]">
                        Total Items: <span className="font-bold text-[#0F172A]">{totalItems}</span>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                        {/* Export Excel Button */}
                        <button
                            onClick={handleExportExcel}
                            className="h-9 px-4 text-xs font-semibold rounded-lg border border-dashboard-primary/30 bg-dashboard-secondary text-dashboard-primary hover:bg-dashboard-secondary/80 transition-colors cursor-pointer"
                        >
                            تصدير اكسل
                        </button>

                        {/* Send Notification Button */}
                        <button
                            onClick={() => alert("Send notification")}
                            className="h-9 px-4 text-xs font-semibold rounded-lg border border-dashboard-primary/30 bg-white text-dashboard-primary hover:bg-dashboard-secondary flex items-center gap-2 transition-colors cursor-pointer"
                        >
                            <Send className="w-4 h-4 text-dashboard-primary" />
                            <span>Send Notification</span>
                        </button>

                        {/* Primary Add Button */}
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="h-9 px-4.5 text-xs font-semibold rounded-lg bg-dashboard-primary hover:opacity-90 text-white flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>+ Add New ${featureTitle}</span>
                        </button>
                    </div>
                </div>

                {/* Table Viewport */}
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-start text-xs border-collapse">
                        {/* Columns */}
                        <thead>
                            <tr className="border-b border-[#E2E8F0] bg-white text-xs font-bold text-[#475569] uppercase tracking-wider select-none">
                                <th className="px-4 py-3 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                                    />
                                </th>
                                <th className="px-4 py-3 text-start font-bold">NAME</th>
                                <th className="px-4 py-3 text-start font-bold">ROLE</th>
                                <th className="px-4 py-3 text-start font-bold">ACCOUNT DETAILS</th>
                                <th className="px-4 py-3 text-start font-bold">CREATION DATE</th>
                                <th className="px-4 py-3 text-start font-bold">MODIFICATION DATE</th>
                                <th className="px-4 py-3 text-start font-bold">STATUS</th>
                                <th className="px-4 py-3 text-center font-bold">ACTION</th>
                            </tr>
                        </thead>

                        {/* Rows */}
                        <tbody className="divide-y divide-[#F1F5F9]">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-[#94A3B8]">
                                        Loading records...
                                    </td>
                                </tr>
                            ) : displayedItems.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-[#94A3B8]">
                                        No records found.
                                    </td>
                                </tr>
                            ) : (
                                displayedItems.map((item) => {
                                    const isRowSelected = selectedIds.includes(item.id);
                                    return (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-[#F8FAFC] transition-colors"
                                        >
                                            {/* Checkbox */}
                                            <td className="px-4 py-3.5 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isRowSelected}
                                                    onChange={() => handleSelectRow(item.id)}
                                                    className="w-4 h-4 rounded border-[#CBD5E1] text-dashboard-primary focus:ring-dashboard-primary cursor-pointer"
                                                />
                                            </td>

                                            {/* Name & Avatar */}
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-lg bg-[#E2E8F0] text-[#64748B] font-bold flex items-center justify-center text-xs shrink-0">
                                                        {item.name ? item.name.charAt(0) : "N/A"}
                                                    </div>
                                                    <span className="font-bold text-[#0F172A] text-sm truncate">
                                                        {item.name}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Role */}
                                            <td className="px-4 py-3.5 text-[#334155] font-medium text-xs">
                                                {item.role || "أدمن"}
                                            </td>

                                            {/* Account Details with Activated pill */}
                                            <td className="px-4 py-3.5">
                                                <div className="flex flex-col gap-1 text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[#334155] font-medium">
                                                            {item.email || "rmz.alemtithal@gmail.com"}
                                                        </span>
                                                        <span className="px-2 py-0.5 rounded-full bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6] text-[10px] font-semibold">
                                                            Activated
                                                        </span>
                                                    </div>
                                                    {item.phone && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[#64748B]">
                                                                {item.phone}
                                                            </span>
                                                            <span className="px-2 py-0.5 rounded-full bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6] text-[10px] font-semibold">
                                                                Activated
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Creation Date */}
                                            <td className="px-4 py-3.5 text-[#475569] font-medium whitespace-nowrap text-xs">
                                                {item.createdAt}
                                            </td>

                                            {/* Modification Date */}
                                            <td className="px-4 py-3.5 text-[#475569] font-medium whitespace-nowrap text-xs">
                                                {item.updatedAt}
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#10B981] bg-[#ECFDF5] text-[#059669] text-xs font-semibold">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                                                    Active
                                                </span>
                                            </td>

                                            {/* Action Menu (3 dots) */}
                                            <td className="px-4 py-3.5 text-center">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer outline-none mx-auto"
                                                        aria-label="Actions"
                                                    >
                                                        <MoreVertical className="w-4 h-4" />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="w-36 bg-white border border-[#E2E8F0] rounded-xl p-1 shadow-lg text-xs"
                                                    >
                                                        <DropdownMenuItem
                                                            onClick={() => setEditingItem(item)}
                                                            className="flex items-center gap-2 px-3 py-2 text-xs text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg cursor-pointer"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5 text-dashboard-primary" />
                                                            <span>Edit</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => setDeletingItem(item)}
                                                            className="flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                                            <span>Delete</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-4 px-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B] select-none">
                    {/* Rows per page */}
                    <div className="flex items-center gap-2">
                        <span>Rows per page</span>
                        <select
                            value={perPage}
                            onChange={(e) => {
                                setPerPage(Number(e.target.value));
                                setPage(1);
                            }}
                            className="h-8 px-2.5 rounded-md border border-[#E2E8F0] bg-white text-xs text-[#0F172A] outline-none cursor-pointer"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    {/* Page Navigation Controls */}
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setPage(1)}
                            disabled={page <= 1}
                            className="p-1 text-[#94A3B8] hover:text-[#0F172A] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            aria-label="First page"
                        >
                            <ChevronsLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={page <= 1}
                            className="p-1 text-[#94A3B8] hover:text-[#0F172A] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <span className="w-7 h-7 rounded-lg bg-dashboard-primary text-white font-bold flex items-center justify-center text-xs shadow-sm">
                            {page}
                        </span>

                        <button
                            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                            disabled={page >= totalPages}
                            className="p-1 text-[#94A3B8] hover:text-[#0F172A] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            aria-label="Next page"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setPage(totalPages)}
                            disabled={page >= totalPages}
                            className="p-1 text-[#94A3B8] hover:text-[#0F172A] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            aria-label="Last page"
                        >
                            <ChevronsRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Create${featurePascal}Modal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />

            <Edit${featurePascal}Modal
                isOpen={!!editingItem}
                onClose={() => setEditingItem(null)}
                item={editingItem}
            />

            <Delete${featurePascal}Modal
                isOpen={!!deletingItem}
                onClose={() => setDeletingItem(null)}
                item={deletingItem}
            />
        </div>
    );
}
`
};

// Execution
console.log(`Scaffolding ${featurePascal} feature...`);

if (!fs.existsSync(BASE_DIR)) {
    fs.mkdirSync(BASE_DIR, { recursive: true });
}

directories.forEach((dir) => {
    const dirPath = path.join(BASE_DIR, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
});

const isForce = process.argv.includes('--force') || process.argv.includes('-f');

Object.entries(files).forEach(([filePath, content]) => {
    const fullPath = path.join(BASE_DIR, filePath);
    if (!fs.existsSync(fullPath) || isForce) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ ${fs.existsSync(fullPath) ? 'Overwrote' : 'Created'} ${filePath}`);
    } else {
        console.log(`⚠️ Skipped ${filePath} (already exists)`);
    }
});

console.log(`\n🎉 Scaffolding complete for ${featurePascal}!\n`);
