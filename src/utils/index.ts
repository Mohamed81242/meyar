import Cookies from "js-cookie";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { FieldValues, FormState } from "react-hook-form";
import type { TableData } from "@/shared/types";
import type { NavigateFunction, To } from "react-router-dom";
import { API_CONFIG } from "@/shared/api/config/env";
import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";

// Tailwind
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Cookies
const getToken = () => Cookies.get(API_CONFIG.AUTH_COOKIE_NAME);
const removeToken = () => Cookies.remove(API_CONFIG.AUTH_COOKIE_NAME);
const setCookie = (key: string, value: string) =>
    Cookies.set(key, value, {
        expires: Number(API_CONFIG.AUTH_COOKIE_EXPIRES_DAYS),
        secure: API_CONFIG.ENV_MODE === "production",
        sameSite: "strict",
        path: "/",
    });
const setToken = (token: string) =>
    Cookies.set(API_CONFIG.AUTH_COOKIE_NAME, token);

export const formatPhone = (phoneNumber: string) => {
    return phoneNumber.startsWith("20")
        ? phoneNumber
        : phoneNumber.startsWith("0")
            ? `2${phoneNumber}`
            : `20${phoneNumber}`;
};

// FormData
const logFormData = (apiFormData: FormData, message?: string) => {
    console.log(message + ":" || "FormData contents:");
    for (const pair of apiFormData.entries()) {
        console.log(
            pair[0] +
            ": " +
            (pair[1] instanceof File
                ? `File: ${(pair[1] as File).name}, ${(pair[1] as File).size
                } bytes`
                : pair[1]),
        );
    }
};

// React Hook Form
const dirtyFields = <T extends FieldValues>(formState: FormState<T>) =>
    Object.keys(formState.dirtyFields || {});

const transformPaginatedDataToTableData = <T extends { id: string | number }>(
    paginatedData: { pages: Array<{ items: T[] }> } | undefined,
    columnMapping: (item: T) => Record<string, any>,
    avatarMapping?: (item: T) => string | undefined,
): TableData[] => {
    if (!paginatedData) return [];

    return paginatedData.pages.flatMap((page) =>
        page.items.map((item) => ({
            id: item?.id?.toString() || "",
            original: item,
            columns: columnMapping(item),
            avatar: avatarMapping ? avatarMapping(item) : undefined,
        })),
    );
};

function safeNavigate(
    navigate: NavigateFunction,
    to?: To,
    options?: { replace?: boolean },
) {
    if (!to) return; // gracefully skip if undefined
    navigate(to, options);
}

type Props = {
    dateString: string;
    options?: Intl.DateTimeFormatOptions;
};

const formatDate = ({ dateString, options }: Props) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
};

const formatTimeForApi = (timeStr: string): string => {
    if (!timeStr) return "";
    // Remove seconds if present (e.g., "10:00:00" -> "10:00")
    const parts = timeStr.split(":");
    return `${parts[0]}:${parts[1]}`;
};

const lucid_icons = Object.keys(LucideIcons).reduce(
    (acc, key) => {
        const icon = LucideIcons[key as keyof typeof LucideIcons];
        if (
            typeof icon === "function" ||
            (icon && typeof icon === "object" && "displayName" in icon)
        ) {
            acc[key] = icon as LucideIcon;
        }
        return acc;
    },
    {} as Record<string, LucideIcon>,
);

const toExternalHref = (url?: string): string => {
    if (!url || url === "#") return "#";
    if (/^(https?:|mailto:|tel:)/i.test(url)) return url;
    return `https://${url}`;
}

export {
    getToken,
    removeToken,
    setCookie,
    setToken,
    logFormData,
    dirtyFields,
    transformPaginatedDataToTableData,
    safeNavigate,
    formatDate,
    formatTimeForApi,
    lucid_icons,
    toExternalHref
};

export * from "./metadataUtils";
export * from "./fileUtils";
export * from "./toFormData";
export * from "./normalizeTime";
