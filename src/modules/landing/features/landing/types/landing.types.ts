export type Governorate =
    | "القاهرة"
    | "الجيزة"
    | "الإسكندرية"
    | "الدقهلية"
    | "البحر الأحمر"
    | "البحيرة"
    | "الفيوم"
    | "الغربية"
    | "الإسماعيلية"
    | "المنوفية"
    | "المنيا"
    | "القليوبية"
    | "الوادي الجديد"
    | "السويس"
    | "أسوان"
    | "أسيوط"
    | "بني سويف"
    | "بورسعيد"
    | "دمياط"
    | "الشرقية"
    | "جنوب سيناء"
    | "كفر الشيخ"
    | "مطروح"
    | "الأقصر"
    | "قنا"
    | "شمال سيناء"
    | "سوهاج";

export interface WaitlistEntry {
    id: string|number;
    name: string;
    phone: string;
    email?: string | null;
    barNumber: string | null;
    bar_number?: string | null;
    governorate: Governorate | string;
    number: number;
    submittedAt: string;
}

export interface WaitlistFormValues {
    name: string;
    phone: string;
    email: string;
    barNumber: string;
    governorate: Governorate | "";
}

export interface FormErrors {
    name?: string;
    phone?: string;
    email?: string;
    governorate?: string;
}

export interface Feature {
    id: string;
    icon: string;
    title: string;
    description: string;
}

export interface StoreLink {
    id: "appStore" | "googlePlay";
    label: string;
    subLabel: string;
    href: string;
}

export interface Lead {
    id: string | number;
    name: string;
    phone: string;
    email?: string | null;
    barNumber?: string | null;
    bar_number?: string | null;
    governorate: string;
    number?: number;
    created_at?: string;
    createdAt?: string;
    updated_at?: string;
    updatedAt?: string;
}

export interface CreateLeadPayload {
    name: string;
    phone: string;
    email?: string | null;
    bar_number?: string | null;
    barNumber?: string | null;
    governorate: string;
}

export interface LeadsCountResponse {
    count: number;
    total?: number;
}

export interface LeadsQueryParams {
    page?: number;
    per_page?: number;
    search?: string;
    governorate?: string;
    [key: string]: unknown;
}


