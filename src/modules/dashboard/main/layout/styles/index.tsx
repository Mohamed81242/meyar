import { ReactNode } from "react";

export const TemplateStyles = ({
    themeName,
    children,
}: {
    themeName: string;
    children: ReactNode;
}) => {
    const colorDefs = [
        { key: "primary", value: "var(--color-dashboard-primary)" },
        { key: "secondary", value: "var(--color-dashboard-secondary)" },
        { key: "accent", value: "var(--color-dashboard-accent)" },
        { key: "bg", value: "var(--color-dashboard-background)" },
        { key: "fg", value: "var(--color-dashboard-foreground)" },
        { key: "card", value: "var(--color-dashboard-card)" },
        {
            key: "card-foreground",
            value: "var(--color-dashboard-card-foreground)",
        },
        { key: "popover", value: "var(--color-dashboard-popover)" },
        {
            key: "popover-foreground",
            value: "var(--color-dashboard-popover-foreground)",
        },
        {
            key: "primary-foreground",
            value: "var(--color-dashboard-primary-foreground)",
        },
        {
            key: "secondary-foreground",
            value: "var(--color-dashboard-secondary-foreground)",
        },
        { key: "muted", value: "var(--color-dashboard-muted)" },
        {
            key: "muted-foreground",
            value: "var(--color-dashboard-muted-foreground)",
        },
        {
            key: "accent-foreground",
            value: "var(--color-dashboard-accent-foreground)",
        },
        { key: "destructive", value: "var(--color-dashboard-destructive)" },
        {
            key: "destructive-foreground",
            value: "var(--color-dashboard-destructive-foreground)",
        },
        { key: "border", value: "var(--color-dashboard-border)" },
        { key: "input", value: "var(--color-dashboard-input)" },
        { key: "ring", value: "var(--color-dashboard-ring)" },
        { key: "chart-1", value: "var(--color-dashboard-chart-1)" },
        { key: "chart-2", value: "var(--color-dashboard-chart-2)" },
        { key: "chart-3", value: "var(--color-dashboard-chart-3)" },
        { key: "chart-4", value: "var(--color-dashboard-chart-4)" },
        { key: "chart-5", value: "var(--color-dashboard-chart-5)" },
        { key: "sidebar", value: "var(--color-dashboard-sidebar)" },
        {
            key: "sidebar-foreground",
            value: "var(--color-dashboard-sidebar-foreground)",
        },
        {
            key: "sidebar-primary",
            value: "var(--color-dashboard-sidebar-primary)",
        },
        {
            key: "sidebar-primary-foreground",
            value: "var(--color-dashboard-sidebar-primary-foreground)",
        },
        {
            key: "sidebar-accent",
            value: "var(--color-dashboard-sidebar-accent)",
        },
        {
            key: "sidebar-accent-foreground",
            value: "var(--color-dashboard-sidebar-accent-foreground)",
        },
        {
            key: "sidebar-border",
            value: "var(--color-dashboard-sidebar-border)",
        },
        { key: "sidebar-ring", value: "var(--color-dashboard-sidebar-ring)" },
    ] as const;

    const opacities = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95] as const;

    const generateRules = () => {
        let css = "";

        for (const { key, value } of colorDefs) {
            const prefix = `${themeName}-${key}`;
            const mix = (op: number) =>
                `color-mix(in srgb, ${value} ${op}%, transparent)`;

            /* ─── Base utilities ─── */
            css += `.bg-${prefix} { background-color: ${value}; }\n`;
            css += `.text-${prefix} { color: ${value}; }\n`;
            css += `.border-${prefix} { border-color: ${value}; }\n`;
            css += `.ring-${prefix} { --tw-ring-color: ${value}; }\n`;
            css += `.outline-${prefix} { outline-color: ${value}; }\n`;
            css += `.caret-${prefix} { caret-color: ${value}; }\n`;
            css += `.fill-${prefix} { fill: ${value}; }\n`;
            css += `.stroke-${prefix} { stroke: ${value}; }\n`;
            css += `.decoration-${prefix} { text-decoration-color: ${value}; }\n`;
            css += `.placeholder-${prefix}::placeholder { color: ${value}; }\n`;
            css += `.divide-${prefix} > :not([hidden]) ~ :not([hidden]) { border-color: ${value}; }\n`;
            css += `.accent-${prefix} { accent-color: ${value}; }\n`;

            /* ─── Opacity variants ─── */
            for (const op of opacities) {
                const m = mix(op);
                css += `.bg-${prefix}\\/${op} { background-color: ${m}; }\n`;
                css += `.text-${prefix}\\/${op} { color: ${m}; }\n`;
                css += `.border-${prefix}\\/${op} { border-color: ${m}; }\n`;
                css += `.ring-${prefix}\\/${op} { --tw-ring-color: ${m}; }\n`;
                css += `.outline-${prefix}\\/${op} { outline-color: ${m}; }\n`;
                css += `.fill-${prefix}\\/${op} { fill: ${m}; }\n`;
                css += `.stroke-${prefix}\\/${op} { stroke: ${m}; }\n`;
                css += `.decoration-${prefix}\\/${op} { text-decoration-color: ${m}; }\n`;
                css += `.placeholder-${prefix}\\/${op}::placeholder { color: ${m}; }\n`;
                css += `.divide-${prefix}\\/${op} > :not([hidden]) ~ :not([hidden]) { border-color: ${m}; }\n`;
                css += `.accent-${prefix}\\/${op} { accent-color: ${m}; }\n`;
            }

            /* ─── Selection ─── */
            css += `.selection\\:bg-${prefix}::selection { background-color: ${value}; }\n`;
            css += `.selection\\:text-${prefix}::selection { color: ${value}; }\n`;
            css += `.selection\\:accent-${prefix}::selection { accent-color: ${value}; }\n`;
            for (const op of opacities) {
                const m = mix(op);
                css += `.selection\\:bg-${prefix}\\/${op}::selection { background-color: ${m}; }\n`;
                css += `.selection\\:text-${prefix}\\/${op}::selection { color: ${m}; }\n`;
                css += `.selection\\:accent-${prefix}\\/${op}::selection { accent-color: ${m}; }\n`;
            }

            /* ─── Gradient stops ─── */
            css += `.from-${prefix} { --tw-gradient-from: ${value}; --tw-gradient-to: color-mix(in srgb, ${value} 0%, transparent); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }\n`;
            css += `.via-${prefix} { --tw-gradient-to: color-mix(in srgb, ${value} 0%, transparent); --tw-gradient-stops: var(--tw-gradient-from), ${value}, var(--tw-gradient-to); }\n`;
            css += `.to-${prefix} { --tw-gradient-to: ${value}; }\n`;

            /* ─── Hover ─── */
            css += `.hover\\:bg-${prefix}:hover { background-color: ${value}; }\n`;
            css += `.hover\\:text-${prefix}:hover { color: ${value}; }\n`;
            css += `.hover\\:border-${prefix}:hover { border-color: ${value}; }\n`;
            css += `.hover\\:ring-${prefix}:hover { --tw-ring-color: ${value}; }\n`;
            css += `.hover\\:outline-${prefix}:hover { outline-color: ${value}; }\n`;
            css += `.hover\\:fill-${prefix}:hover { fill: ${value}; }\n`;
            css += `.hover\\:stroke-${prefix}:hover { stroke: ${value}; }\n`;
            css += `.hover\\:decoration-${prefix}:hover { text-decoration-color: ${value}; }\n`;
            css += `.hover\\:accent-${prefix}:hover { accent-color: ${value}; }\n`;
            for (const op of opacities) {
                const m = mix(op);
                css += `.hover\\:bg-${prefix}\\/${op}:hover { background-color: ${m}; }\n`;
                css += `.hover\\:text-${prefix}\\/${op}:hover { color: ${m}; }\n`;
                css += `.hover\\:border-${prefix}\\/${op}:hover { border-color: ${m}; }\n`;
                css += `.hover\\:ring-${prefix}\\/${op}:hover { --tw-ring-color: ${m}; }\n`;
                css += `.hover\\:outline-${prefix}\\/${op}:hover { outline-color: ${m}; }\n`;
                css += `.hover\\:accent-${prefix}\\/${op}:hover { accent-color: ${m}; }\n`;
            }

            /* ─── Focus ─── */
            css += `.focus\\:bg-${prefix}:focus { background-color: ${value}; }\n`;
            css += `.focus\\:text-${prefix}:focus { color: ${value}; }\n`;
            css += `.focus\\:border-${prefix}:focus { border-color: ${value}; }\n`;
            css += `.focus\\:ring-${prefix}:focus { --tw-ring-color: ${value}; }\n`;
            css += `.focus\\:outline-${prefix}:focus { outline-color: ${value}; }\n`;
            css += `.focus\\:caret-${prefix}:focus { caret-color: ${value}; }\n`;
            css += `.focus\\:fill-${prefix}:focus { fill: ${value}; }\n`;
            css += `.focus\\:stroke-${prefix}:focus { stroke: ${value}; }\n`;
            css += `.focus\\:accent-${prefix}:focus { accent-color: ${value}; }\n`;
            for (const op of opacities) {
                const m = mix(op);
                css += `.focus\\:bg-${prefix}\\/${op}:focus { background-color: ${m}; }\n`;
                css += `.focus\\:text-${prefix}\\/${op}:focus { color: ${m}; }\n`;
                css += `.focus\\:border-${prefix}\\/${op}:focus { border-color: ${m}; }\n`;
                css += `.focus\\:ring-${prefix}\\/${op}:focus { --tw-ring-color: ${m}; }\n`;
                css += `.focus\\:outline-${prefix}\\/${op}:focus { outline-color: ${m}; }\n`;
                css += `.focus\\:accent-${prefix}\\/${op}:focus { accent-color: ${m}; }\n`;
            }

            /* ─── Active ─── */
            css += `.active\\:bg-${prefix}:active { background-color: ${value}; }\n`;
            css += `.active\\:text-${prefix}:active { color: ${value}; }\n`;
            css += `.active\\:border-${prefix}:active { border-color: ${value}; }\n`;
            css += `.active\\:ring-${prefix}:active { --tw-ring-color: ${value}; }\n`;
            css += `.active\\:accent-${prefix}:active { accent-color: ${value}; }\n`;
            for (const op of opacities) {
                const m = mix(op);
                css += `.active\\:bg-${prefix}\\/${op}:active { background-color: ${m}; }\n`;
                css += `.active\\:text-${prefix}\\/${op}:active { color: ${m}; }\n`;
                css += `.active\\:border-${prefix}\\/${op}:active { border-color: ${m}; }\n`;
                css += `.active\\:ring-${prefix}\\/${op}:active { --tw-ring-color: ${m}; }\n`;
                css += `.active\\:accent-${prefix}\\/${op}:active { accent-color: ${m}; }\n`;
            }

            /* ─── Disabled ─── */
            css += `.disabled\\:bg-${prefix}:disabled { background-color: ${value}; }\n`;
            css += `.disabled\\:text-${prefix}:disabled { color: ${value}; }\n`;
            css += `.disabled\\:border-${prefix}:disabled { border-color: ${value}; }\n`;
            css += `.disabled\\:accent-${prefix}:disabled { accent-color: ${value}; }\n`;

            /* ─── Legacy hover-to (backward compatibility) ─── */
            css += `.bg-${themeName}-hover-to-${key}:hover { background-color: ${value}; }\n`;
            css += `.text-${themeName}-hover-to-${key}:hover { color: ${value}; }\n`;
            css += `.border-${themeName}-hover-to-${key}:hover { border-color: ${value}; }\n`;
        }

        css += `::selection { background-color: var(--color-dashboard-accent); color: var(--color-dashboard-primary); }\n`;

        // Dark mode variables and utility overrides
        css += `
            .dark .bg-white, 
            .dark .bg-dashboard-card,
            .dark [class*="bg-white"],
            .dark .bg-white\\/40,
            .dark .bg-white\\/10 {
                background-color: var(--color-dashboard-card) !important;
            }
            .dark .bg-\\[\\#f4f7fe\\], 
            .dark .bg-\\[\\#F5F7FA\\],
            .dark .bg-dashboard-background,
            .dark body {
                background-color: var(--color-dashboard-background) !important;
            }
            .dark .text-slate-900, 
            .dark .text-gray-900, 
            .dark .text-black,
            .dark .text-dashboard-foreground,
            .dark .text-primary {
                color: var(--color-dashboard-foreground) !important;
            }
            .dark .text-slate-600, 
            .dark .text-gray-600, 
            .dark .text-slate-500, 
            .dark .text-gray-500,
            .dark .text-dashboard-muted-foreground {
                color: var(--color-dashboard-muted-foreground) !important;
            }
            .dark .border-slate-200, 
            .dark .border-gray-200, 
            .dark .border-dashboard-border,
            .dark .border-white\\/20,
            .dark .border-white\\/10 {
                border-color: var(--color-dashboard-border) !important;
            }
            .dark input, 
            .dark select, 
            .dark textarea {
                background-color: var(--color-dashboard-input) !important;
                color: var(--color-dashboard-foreground) !important;
                border-color: var(--color-dashboard-border) !important;
            }

            /* Global contrast overrides to force correct text/foreground colors inside primary and secondary background elements */
            .bg-dashboard-primary,
            .bg-dashboard-sidebar-primary,
            .hover\\:bg-dashboard-primary:hover {
                color: var(--color-dashboard-primary-foreground) !important;
            }
            .bg-dashboard-primary *,
            .bg-dashboard-sidebar-primary *,
            .hover\\:bg-dashboard-primary:hover * {
                color: inherit !important;
            }

            .bg-dashboard-secondary,
            .bg-dashboard-sidebar-accent,
            .hover\\:bg-dashboard-secondary:hover {
                color: var(--color-dashboard-secondary-foreground) !important;
            }
        `;

        return css;
    };

    return (
        <>
            <style>{generateRules()}</style>
            {children}
        </>
    );
};
