export function normalizePhone(phone: string) {
    const cleaned = phone.trim().replace(/\s+/g, "");

    if (cleaned.startsWith("0")) {
        return "234" + cleaned.slice(1);
    }

    if (cleaned.startsWith("+")) {
        return cleaned.slice(1);
    }
    return cleaned;
}