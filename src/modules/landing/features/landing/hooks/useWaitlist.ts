import { useCallback, useState } from "react";
import { useCreateLead, useLeadsCount } from "../api";
import type { FormErrors, WaitlistEntry, WaitlistFormValues } from "../types/landing.types";

function normalizePhone(value: string): string {
    return value.replace(/[^0-9]/g, "");
}

function isValidEgyptianPhone(value: string): boolean {
    return /^01[0125][0-9]{8}$/.test(value);
}

function isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateWaitlistForm(values: WaitlistFormValues): FormErrors {
    const errors: FormErrors = {};

    if (!values.name || values.name.trim().length < 3) {
        errors.name = "من فضلك أدخل اسمك الكامل.";
    }

    const phone = normalizePhone(values.phone || "");
    if (!isValidEgyptianPhone(phone)) {
        errors.phone = "رقم الهاتف غير صحيح، تأكد أنه رقم مصري من 11 رقمًا.";
    }

    if (values.email && values.email.trim() && !isValidEmail(values.email.trim())) {
        errors.email = "من فضلك أدخل بريد إلكتروني صحيح.";
    }

    if (!values.governorate) {
        errors.governorate = "من فضلك اختر المحافظة.";
    }

    return errors;
}

interface UseWaitlistResult {
    count: number;
    isLoadingCount: boolean;
    submittedEntry: WaitlistEntry | null;
    submit: (values: WaitlistFormValues) => Promise<WaitlistEntry>;
    isSubmitting: boolean;
}

export function useWaitlist(): UseWaitlistResult {
    const { data: countData, isLoading: isLoadingCount } = useLeadsCount();
    const createLeadMutation = useCreateLead();
    const [submittedEntry, setSubmittedEntry] = useState<WaitlistEntry | null>(null);

    const count = countData?.count ?? countData?.total ?? 0;

    const submit = useCallback(
        async (values: WaitlistFormValues): Promise<WaitlistEntry> => {
            const phone = normalizePhone(values.phone);

            // Call the React Query mutation against /leads
            const response = await createLeadMutation.mutateAsync({
                name: values.name.trim(),
                phone,
                email: values.email?.trim() || null,
                bar_number: values.barNumber.trim() || null,
                governorate: values.governorate,
            });

            const entry: WaitlistEntry = {
                id: response.id,
                name: response.name,
                phone: response.phone,
                email: response.email || null,
                barNumber: response.bar_number || response.barNumber || null,
                governorate: response.governorate,
                number: response.number || count + 1,
                submittedAt: response.created_at || response.createdAt || new Date().toISOString(),
            };

            setSubmittedEntry(entry);
            return entry;
        },
        [createLeadMutation, count],
    );

    return {
        count,
        isLoadingCount,
        submittedEntry,
        submit,
        isSubmitting: createLeadMutation.isPending,
    };
}
