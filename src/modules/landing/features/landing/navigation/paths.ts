/** Build public site paths under the incremental root slug (e.g. `/main-3/...`). */
export const sitePaths = {
    home: () => `/`,
    privacy: () => `/privacy`,
    deleteAccount: () => `/delete-account`,
    support: () => `/support`,
} as const;
