/**
 * Navigation Types
 *
 * Types for sidebar navigation, separate from routing.
 * Navigation is derived from feature metadata, not route config.
 */

import type { Roles } from "@/router/routes.types";
import type { ComponentType } from "react";

// ============================================================================
// Navigation Sections
// ============================================================================

/**
 * Navigation sections for grouping items in sidebar
 */
export type NavSection =
    | "STATISTICS"
    | "USER MANAGEMENT"
    | "COMPANY MANAGEMENT"
    | "INSPECTION MANAGEMENT"
    | "REVIEW CRITERIA"
    | "Organization"
    | "Overview"
    | "Users"
    | "Groups"
    | "Notas"
    | "Billing"
    | "Faq"
    | "Banners"
    | "Story Tags"
    | "Settings"
    | (string & {});


// ============================================================================
// Navigation Item
// ============================================================================

/**
 * Single navigation item
 */
export interface NavItem {
    /**
     * Unique key for React rendering
     */
    key: string;

    /**
     * i18n translation key for label
     */
    labelKey: string;

    /**
     * Fallback label (English)
     */
    label: string;

    /**
     * Navigation path (href)
     */
    href: string;

    /**
     * Icon component
     */
    icon?: ComponentType<{ className?: string }>;

    /**
     * Roles that can see this item
     */
    roles?: Roles[];

    /**
     * Required permissions (any of these)
     */
    permissions?: string[];

    /**
     * Nested navigation items
     */
    children?: NavItem[];

    /**
     * Badge count (e.g., unread notifications)
     */
    badge?: number | (() => number);

    /**
     * Hide from navigation but keep route accessible
     */
    hidden?: boolean;

    /**
     * Sort order within parent (lower = higher)
     */
    order?: number;

    /**
     * Whether this item is disabled
     */
    disabled?: boolean;

    /**
     * External link (opens in new tab)
     */
    external?: boolean;
}

// ============================================================================
// Navigation Modules
// ============================================================================

/**
 * Known Module Keys for IntelliSense
 */
export type NavModuleKey =
    | "dashboard-main"
    | "dashboard-settings"
    | "auth"
    | "landing"
    | "not-found";

/**
 * Feature Navigation Module
 *
 * Each feature exports its navigation metadata using this interface.
 * The navigation registry collects and composes these into the sidebar.
 */
export interface FeatureNavModule {
    /**
     * Feature identifier (should match route module id)
     */
    featureId: string;

    /**
     * Layout Module this navigation belongs to (e.g. 'dashboard-main')
     */
    module?: NavModuleKey;

    /**
     * Navigation section for grouping
     */
    section: NavSection;

    /**
     * Navigation items for this feature
     */
    items: NavItem[];

    /**
     * Sort order within section (lower = higher)
     */
    order?: number;
}

// ============================================================================
// Navigation Registry Types
// ============================================================================

/**
 * Grouped navigation items by section
 */
export type GroupedNavItems = Record<NavSection, NavItem[]>;

/**
 * Filter options for navigation
 */
export interface NavFilterOptions {
    role?: Roles;
    permissions?: string[];
    includeHidden?: boolean;
    module?: NavModuleKey;
}

// ============================================================================
// Section Metadata
// ============================================================================

/**
 * Section display configuration
 */
export interface NavSectionConfig {
    /**
     * Section identifier
     */
    id: NavSection;

    /**
     * i18n translation key
     */
    labelKey: string;

    /**
     * Fallback label
     */
    label: string;

    /**
     * Sort order (lower = higher)
     */
    order: number;

    /**
     * Whether to show section header
     */
    showHeader?: boolean;

    /**
     * Divider before this section
     */
    dividerBefore?: boolean;

    /**
     * Whether this section can be expanded/collapsed by the user
     */
    collapsible?: boolean;
}

/**
 * Default section configuration
 */
export const NAV_SECTIONS: NavSectionConfig[] = [
  
    {
        id: "Organization",
        labelKey: "shared:sidebar.sections.organization",
        label: "Organization",
        order: 7,
        showHeader: true,
        dividerBefore: true,
        collapsible: true,
    },
    {
        id: "Overview",
        labelKey: "overview:title",
        label: "Overview",
        order: 17,
        showHeader: true,
        dividerBefore: true,
        collapsible: true,
    },
    {
        id: "Users",
        labelKey: "users:title",
        label: "Users",
        order: 18,
        showHeader: true,
        dividerBefore: true,
        collapsible: true,
    },
    {
        id: "Groups",
        labelKey: "groups:title",
        label: "Groups",
        order: 19,
        showHeader: true,
        dividerBefore: true,
        collapsible: true,
    },
    {
        id: "Notas",
        labelKey: "notas:title",
        label: "Notas",
        order: 20,
        showHeader: true,
        dividerBefore: true,
        collapsible: true,
    },
    {
        id: "Billing",
        labelKey: "billing:title",
        label: "Billing",
        order: 21,
        showHeader: true,
        dividerBefore: true,
        collapsible: true,
    },
    {
        id: "Faq",
        labelKey: "faq:title",
        label: "Faq",
        order: 22,
        showHeader: true,
        dividerBefore: true,
        collapsible: true,
    },
    {
        id: "Story Tags",
        labelKey: "story-tags:title",
        label: "Story Tags",
        order: 23,
        showHeader: true,
        dividerBefore: true,
        collapsible: true,
    },
    {
        id: "Banners",
        labelKey: "banners:title",
        label: "Banners",
        order: 23,
        showHeader: true,
        dividerBefore: true,
        collapsible: true,
    },
    {
        id: "Settings",
        labelKey: "settings:title",
        label: "Settings",
        order: 24,
        showHeader: true,
        dividerBefore: true,
        collapsible: true,
    }
];
