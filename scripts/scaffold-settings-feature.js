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
    console.error('Usage: node scripts/scaffold-settings-feature.js <feature-name>');
    console.error('Example: node scripts/scaffold-settings-feature.js users');
    process.exit(1);
}

const featureKebab = args[0]; 
const featurePascal = toPascalCase(featureKebab); 
const featureCamel = toCamelCase(featureKebab); 

const BASE_DIR = path.join(import.meta.dirname, '..', 'src', 'modules', 'dashboard', 'settings', 'features', featureKebab);

const directories = [
    'api',
    'navigation',
    'pages',
    'types',
    'locales',
];

const files = {
    // 1. Root Export
    'index.ts': `export * from "./types";\nexport * from "./api";\n`,

    // 2. Types
    [`types/${featureKebab}.types.ts`]: `import { z } from "zod";

export const ${featureCamel}Schema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
});

export interface ${featurePascal} {
    id: string;
    name: string;
    description?: string | null;
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
    main: "/dashboard/settings/${featureKebab}",
} as const;
`,
    'navigation/nav.ts': `import type { NavItem } from "@/navigation/nav.types";
import { Settings } from "lucide-react"; 

export const ${featureCamel}NavItem: NavItem = {
    key: "${featureKebab}",
    labelKey: "${featureKebab}:title",
    label: "${featurePascal.replace(/([A-Z])/g, ' $1').trim()}",
    href: "/dashboard/settings/${featureKebab}",
    icon: Settings,
};

export default ${featureCamel}NavItem;
`,
    'navigation/index.ts': `export * from "./nav";
export * from "./paths";
export * from "./routes";
`,

    // 4. Locales
    'locales/en.json': `{
    "title": "${featurePascal.replace(/([A-Z])/g, ' $1').trim()}",
    "main": {
        "title": "${featurePascal.replace(/([A-Z])/g, ' $1').trim()}"
    }
}`,
    'locales/ar.json': `{
    "title": "${featurePascal.replace(/([A-Z])/g, ' $1').trim()}",
    "main": {
        "title": "${featurePascal.replace(/([A-Z])/g, ' $1').trim()}"
    }
}`,

    // 5. API
    'api/mock-data.ts': `import type { ${featurePascal}, ${featurePascal}CreatePayload, ${featurePascal}UpdatePayload } from "../types";
import { v4 as uuidv4 } from "uuid";

export let mock${featurePascal}s: ${featurePascal}[] = [
    {
        id: "1",
        name: "Example ${featurePascal} 1",
        description: "This is a mock description.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "2",
        name: "Example ${featurePascal} 2",
        description: "This is another mock description.",
        isActive: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];

export const mock${featurePascal}Api = {
    getList: async (params?: any, signal?: AbortSignal): Promise<any> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, search, perPage = 25 } = (params || {}) as any;
                const filtered = mock${featurePascal}s.filter(item => 
                    !search || item.name.toLowerCase().includes(search.toLowerCase())
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
            }, 500);
        });
    },

    getById: async (id: string, signal?: AbortSignal): Promise<${featurePascal} | null> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const mock = mock${featurePascal}s.find((s) => s.id === id);
                if (!mock) reject(new Error("Not found"));
                else resolve(mock);
            }, 500);
        });
    },
    
    create: async (payload: ${featurePascal}CreatePayload): Promise<${featurePascal}> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newItem: ${featurePascal} = {
                    id: uuidv4(),
                    ...payload,
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                mock${featurePascal}s = [newItem, ...mock${featurePascal}s];
                resolve(newItem);
            }, 500);
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
                    updatedAt: new Date().toISOString(),
                };
                mock${featurePascal}s[index] = updatedItem;
                resolve(updatedItem);
            }, 500);
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
            }, 500);
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

    // 6. UI Page
    'pages/main.tsx': `import { useLanguage } from "@/shared/hooks";

export default function ${featurePascal}Page() {
    const { t } = useLanguage("${featureKebab}");

    return (
        <div className="flex flex-col h-full w-full text-dashboard-foreground animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex-1 overflow-auto hide-scrollbar max-w-5xl mx-auto px-6 py-10 pb-20 w-full">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-dashboard-border">
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-12">
                    <section className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/3">
                            <h2 className="text-sm font-semibold mb-1">Details</h2>
                            <p className="text-[13px] text-dashboard-muted-foreground">Manage settings.</p>
                        </div>
                        <div className="md:w-2/3 flex flex-col gap-6">
                            {/* Inputs here */}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
`
};

// Execution
console.log(`Scaffolding ${featurePascal} feature in settings...`);

if (!fs.existsSync(BASE_DIR)) {
    fs.mkdirSync(BASE_DIR, { recursive: true });
}

directories.forEach((dir) => {
    const dirPath = path.join(BASE_DIR, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
});

Object.entries(files).forEach(([filePath, content]) => {
    const fullPath = path.join(BASE_DIR, filePath);
    if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ Created ${filePath}`);
    } else {
        console.log(`⚠️ Skipped ${filePath} (already exists)`);
    }
});

console.log(`\n🎉 Scaffolding complete for ${featurePascal}!\n`);
