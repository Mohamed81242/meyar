/**
 * Device Service
 *
 * Provides persistent, friendly device identification for Nota authentication flows.
 * Generates and caches a friendly device name (e.g., "Chrome on Windows (a1b2c3d4)").
 */

const DEVICE_ID_KEY = "nota_device_id";

/**
 * Detect user's browser name
 */
function getBrowserName(userAgent: string): string {
    if (/edg/i.test(userAgent)) return "Edge";
    if (/opr\//i.test(userAgent) || /opera/i.test(userAgent)) return "Opera";
    if (/samsungbrowser/i.test(userAgent)) return "Samsung Internet";
    if (/chrome|crios/i.test(userAgent)) return "Chrome";
    if (/firefox|fxios/i.test(userAgent)) return "Firefox";
    if (/safari/i.test(userAgent) && !/chrome|crios|android/i.test(userAgent)) return "Safari";
    if (/msie|trident/i.test(userAgent)) return "Internet Explorer";
    return "Browser";
}

/**
 * Detect user's operating system
 */
function getOperatingSystem(userAgent: string, platform: string): string {
    const ua = userAgent.toLowerCase();
    const plat = (platform || "").toLowerCase();

    if (/iphone|ipad|ipod/.test(ua) || /iphone|ipad|ipod/.test(plat)) return "iOS";
    if (/android/.test(ua)) return "Android";
    if (/win/.test(plat) || /windows/.test(ua)) return "Windows";
    if (/mac/.test(plat) || /macintosh|mac os x/.test(ua)) return "macOS";
    if (/linux/.test(plat) || /linux/.test(ua)) return "Linux";
    if (/cros/.test(ua)) return "ChromeOS";
    return "Device";
}

/**
 * Generate a random UUID-like unique identifier
 */
function generateUniqueId(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID().replace(/-/g, "");
    }
    return (
        Math.random().toString(36).substring(2, 10) +
        Math.random().toString(36).substring(2, 10)
    );
}

/**
 * Get or create a persistent device ID from localStorage
 */
export function getOrCreateDeviceId(): string {
    if (typeof window === "undefined" || !window.localStorage) {
        return generateUniqueId().substring(0, 8);
    }

    try {
        let deviceId = localStorage.getItem(DEVICE_ID_KEY);
        if (!deviceId) {
            deviceId = generateUniqueId();
            localStorage.setItem(DEVICE_ID_KEY, deviceId);
        }
        return deviceId;
    } catch {
        return generateUniqueId().substring(0, 8);
    }
}

/**
 * Generates a persistent friendly device name (<= 100 characters)
 * e.g., "Chrome on Windows (a1b2c3d4)"
 */
export function getDeviceName(): string {
    if (typeof window === "undefined") {
        return "Web Client";
    }

    try {
        const userAgent = navigator.userAgent || "";
        const platform = (navigator as any).userAgentData?.platform || navigator.platform || "";

        const browser = getBrowserName(userAgent);
        const os = getOperatingSystem(userAgent, platform);
        const deviceId = getOrCreateDeviceId();
        const shortId = deviceId.substring(0, 8);

        const friendlyName = `${browser} on ${os} (${shortId})`;

        // Ensure length <= 100 characters
        return friendlyName.slice(0, 100);
    } catch {
        return "Web Client";
    }
}

export default {
    getDeviceName,
    getOrCreateDeviceId,
};
