// Normalize time format to HH:mm (24-hour format)
export const normalizeTimeToHHmm = (value: string) => {
    // If already in HH:mm format, return as is
    if (/^\d{2}:\d{2}$/.test(value)) {
        return value;
    }

    // Handle 12-hour format with AM/PM
    const time12hMatch = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (time12hMatch) {
        const [, hours, minutes, period] = time12hMatch;
        const hour24 =
            period.toUpperCase() === "PM" && hours !== "12"
                ? parseInt(hours) + 12
                : period.toUpperCase() === "AM" && hours === "12"
                  ? 0
                  : parseInt(hours);
        return `${hour24.toString().padStart(2, "0")}:${minutes}`;
    }

    // Default: try to parse and format
    const [hours, minutes] = value.split(":");
    if (hours && minutes) {
        return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
    }

    return value; // fallback
};
