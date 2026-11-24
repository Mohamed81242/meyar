import { SETTINGS_PATH } from "./constant";

export const settingsPaths = {
    root: () => SETTINGS_PATH,
    personal: () => `${SETTINGS_PATH}?tab=personal`,
    email: () => `${SETTINGS_PATH}?tab=email`,
    phone: () => `${SETTINGS_PATH}?tab=phone`,
    password: () => `${SETTINGS_PATH}?tab=password`,
    alerts: () => `${SETTINGS_PATH}?tab=settings`,
    subscriptions: () => `${SETTINGS_PATH}?tab=subscriptions`,
} as const;

export default settingsPaths;
