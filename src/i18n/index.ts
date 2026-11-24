import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

// ============================================================================
// Auto-discover locale files using Vite glob import
// ============================================================================

type LocaleModule = Record<string, unknown>;

// Global locales: src/i18n/locales/{lang}/{namespace}.json
const globalLocales = import.meta.glob<LocaleModule>("./locales/*/*.json", {
    eager: true,
});

// Module locales: src/modules/**/locales/{lang}.json
const moduleLocales = import.meta.glob<LocaleModule>(
    "../modules/**/locales/*.json",
    { eager: true },
);

// Shared component locales: src/shared/components/**/{component}/locales/{lang}.json
const sharedLocales = import.meta.glob<LocaleModule>(
    "../shared/components/**/*/locales/*.json",
    { eager: true },
);

// Design System locales: src/design-system/locales/{lang}.json
const designSystemLocales = import.meta.glob<LocaleModule>(
    "../design-system/locales/*.json",
    { eager: true },
);

// Shared root locales: src/shared/locales/{lang}.json
const sharedRootLocales = import.meta.glob<LocaleModule>(
    "../shared/locales/*.json",
    { eager: true },
);

// Search module locales: src/search/locales/{lang}.json
const searchLocales = import.meta.glob<LocaleModule>(
    "../search/locales/*.json",
    { eager: true },
);

// Builder locales: src/shared/builder/**/locales/{lang}.json
const builderLocales = import.meta.glob<LocaleModule>(
    "../shared/builder/**/locales/*.json",
    { eager: true },
);

// ============================================================================
// Build resources dynamically
// ============================================================================

type Resources = Record<string, Record<string, LocaleModule>>;

const resources: Resources = {
    en: {},
    ar: {},
};

// Process global locales: ./locales/en/dashboard.json → resources.en.dashboard
Object.entries(globalLocales).forEach(([path, module]) => {
    // Extract: ./locales/{lang}/{namespace}.json
    const match = path.match(/\.\/locales\/(\w+)\/(\w+)\.json$/);
    if (match) {
        const [, lang, namespace] = match;
        if (resources[lang]) {
            resources[lang][namespace] =
                (module as { default?: LocaleModule }).default || module;
        }
    }
});

// Process module locales with namespace collision handling
Object.entries(moduleLocales).forEach(([path, module]) => {
    // Handle module structure collisions if needed
    // E.g. projects changes vs main changes
    const isProjectPage = path.includes("/dashboard/projects/");
    
    // Default: extract feature name (folder before /locales/) and language
    const match = path.match(/\/([^/]+)\/locales\/(\w+)\.json$/);
    if (!match) return;
    
    let feature = match[1];
    const lang = match[2];
    
    // Disambiguate project namespaces
    if (isProjectPage && feature === "changes") {
        feature = "projectChanges";
    }
    
    // Map /features/locales to "dashboard" namespace
    if (feature === "features") {
        feature = "dashboard";
    }

    if (resources[lang]) {
        resources[lang][feature] =
            (module as { default?: LocaleModule }).default || module;
    }
});

// Process shared component locales: ../shared/components/**/{component}/locales/{lang}.json → resources.{lang}.{component}
Object.entries(sharedLocales).forEach(([path, module]) => {
    // Extract: component name (folder before /locales/) and language
    const match = path.match(/\/([^/]+)\/locales\/(\w+)\.json$/);
    if (match) {
        const [, component, lang] = match;
        if (resources[lang]) {
            resources[lang][component] =
                (module as { default?: LocaleModule }).default || module;
        }
    }
});

// Process design system locales: ../design-system/locales/{lang}.json → resources.{lang}.designSystem
Object.entries(designSystemLocales).forEach(([path, module]) => {
    // Extract language from path: ../design-system/locales/{lang}.json
    const match = path.match(/\/design-system\/locales\/(\w+)\.json$/);
    if (match) {
        const [, lang] = match;
        if (resources[lang]) {
            // Use "designSystem" as namespace (camelCase to match usage in components)
            resources[lang]["designSystem"] =
                (module as { default?: LocaleModule }).default || module;
        }
    }
});

// Process shared root locales: ../shared/locales/{lang}.json → resources.{lang}.shared
Object.entries(sharedRootLocales).forEach(([path, module]) => {
    // Extract language from path: ../shared/locales/{lang}.json
    const match = path.match(/\/shared\/locales\/(\w+)\.json$/);
    if (match) {
        const [, lang] = match;
        if (resources[lang]) {
            // Use "shared" as namespace to match usage in components
            resources[lang]["shared"] =
                (module as { default?: LocaleModule }).default || module;
        }
    }
});

// Process search locales: ../search/locales/{lang}.json → resources.{lang}.search
Object.entries(searchLocales).forEach(([path, module]) => {
    // Extract language from path: ../search/locales/{lang}.json
    const match = path.match(/\/search\/locales\/(\w+)\.json$/);
    if (match) {
        const [, lang] = match;
        if (resources[lang]) {
            resources[lang]["search"] =
                (module as { default?: LocaleModule }).default || module;
        }
    }
});

// Process builder locales: ../shared/builder/**/{component}/locales/{lang}.json → resources.{lang}.{component}
Object.entries(builderLocales).forEach(([path, module]) => {
    const match = path.match(/\/([^/]+)\/locales\/(\w+)\.json$/);
    if (match) {
        const [, namespace, lang] = match;
        if (resources[lang]) {
            resources[lang][namespace] =
                (module as { default?: LocaleModule }).default || module;
        }
    }
});

// Extract all namespace keys for i18n config
const namespaces = [
    ...new Set([
        ...Object.keys(resources.en || {}),
        ...Object.keys(resources.ar || {}),
    ]),
];

const applyDocumentLanguage = (lng?: string) => {
    const language = lng || i18n.resolvedLanguage || i18n.language || "ar";
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem("i18nextLng") || "ar",
        fallbackLng: "ar",
        defaultNS: "landing",
        ns: namespaces,
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ["localStorage"],
            caches: ["localStorage"],
        },
    })
    .then(() => {
        applyDocumentLanguage();
    });

i18n.on("languageChanged", (lng) => {
    applyDocumentLanguage(lng);
});

export default i18n;
