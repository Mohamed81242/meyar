export interface FilterValue<TKey extends string = string> {
    column: TKey;
    operator: string;
    value: any;
}

export interface FilterField<TKey extends string = string> {
    column: TKey;
    label: string;
    type: string; // e.g. "text", "number", "date", "select"
    operators: string[];
    searchable?: boolean;
    options?: Array<{ label: string; value: any }>;
}

export interface FilterMetadata<TKey extends string = string> {
    filters: FilterField<TKey>[];
    operators: Record<string, string>;
    fieldTypes?: Record<
        string,
        {
            label: string;
            component: string;
            validation: string;
        }
    >;
}

export interface FilterProps<TKey extends string = string> {
    metadata?: FilterMetadata<TKey>;
    activeFilters: FilterValue<TKey>[];
    onChange: (filters: FilterValue<TKey>[]) => void;
    mode?: "both" | "normal" | "advanced"; // Default is "both"
    isAr?: boolean; // Controls language translation
}

