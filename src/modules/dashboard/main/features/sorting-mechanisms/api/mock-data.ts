import type { SortingMechanismItem } from "../types";

export const mockSortingMechanisms: SortingMechanismItem[] = [
    {
        id: "1",
        title: "Required data complete",
        badgeText: "Applied automatically",
        badgeType: "automatic",
        description:
            "The system makes sure every required question shown in an inspection is answered before it is accepted.",
        secondaryDescription: "Applied by the system itself, with no setting.",
        iconType: "complete",
    },
    {
        id: "2",
        title: "Valid answer values",
        badgeText: "Applied automatically",
        badgeType: "automatic",
        description:
            "An answer must be one of the question's options and within its range.",
        secondaryDescription: "Applied by the system itself, with no setting.",
        iconType: "values",
    },
    {
        id: "3",
        title: "Measurement context match: keeping to the inspection time",
        badgeText: "Set ahead",
        badgeType: "ahead",
        description:
            "A start period and an end period for the task; when required, carrying it out outside them is refused, otherwise the task shows as late. A public link has an expiry date, after which nothing is taken.",
        secondaryDescription:
            "On a scheduled task when it is created, on an instant template in «Manage instant tasks» for every instant task created from it, and a public link's expiry date in «Channel links».",
        iconType: "time",
        actions: [
            {
                label: "Create A Scheduled Task",
                href: "/dashboard/inspection-tasks",
            },
            {
                label: "Manage Instant Tasks",
                href: "/dashboard/inspection-tasks",
            },
        ],
    },
    {
        id: "4",
        title: "Measurement context match: keeping to the inspection location",
        badgeText: "Set ahead",
        badgeType: "ahead",
        description:
            "Taken only within a range in metres around the company's location, or around a point set on the map for a public link.",
        secondaryDescription:
            "The company's location on a scheduled task and on an instant template, and a set point on a public link in «Channel links».",
        iconType: "location",
        actions: [
            {
                label: "Create A Scheduled Task",
                href: "/dashboard/inspection-tasks",
            },
            {
                label: "Manage Instant Tasks",
                href: "/dashboard/inspection-tasks",
            },
        ],
    },
];

export const mockSortingMechanismsApi = {
    getList: async (_params?: any, _signal?: AbortSignal): Promise<any> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    items: mockSortingMechanisms,
                    total: mockSortingMechanisms.length,
                });
            }, 150);
        });
    },

    getById: async (id: string, _signal?: AbortSignal): Promise<SortingMechanismItem | null> => {
        return new Promise((resolve) => {
            const found = mockSortingMechanisms.find((m) => m.id === id) || null;
            resolve(found);
        });
    },

    create: async (payload: any): Promise<any> => payload,
    update: async (_id: string, payload: any): Promise<any> => payload,
    delete: async (_id: string): Promise<void> => {},
};
