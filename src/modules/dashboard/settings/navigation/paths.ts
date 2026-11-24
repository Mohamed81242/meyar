import { SETTINGS_PATH } from "./constant";

import { notificationsPaths } from "../features/notifications/navigation/paths";


export const settingsPaths = {
    root: () => SETTINGS_PATH,
  
    notifications: notificationsPaths,

} as const;

export default settingsPaths;
