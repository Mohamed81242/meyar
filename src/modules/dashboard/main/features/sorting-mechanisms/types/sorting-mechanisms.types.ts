export type MechanismBadgeType = "automatic" | "ahead";

export interface MechanismAction {
    label: string;
    href?: string;
    onClick?: () => void;
}

export interface SortingMechanismItem {
    id: string;
    title: string;
    badgeText: string;
    badgeType: MechanismBadgeType;
    description: string;
    secondaryDescription: string;
    iconType: "complete" | "values" | "time" | "location";
    actions?: MechanismAction[];
}

// Backwards compatibility
export interface SortingMechanisms {
    id: string;
    name: string;
}
export type SortingMechanismsCreatePayload = any;
export type SortingMechanismsUpdatePayload = any;
