
const requests = new Map<string , {count: number ; time: number}>();

export function rateLimit(key: string, limit = 10 , windowMs = 60_000) {
    const now = Date.now();
    const record = requests.get(key);

    if (!record || now - record.time > windowMs) {
        requests.set(key , {count: 1 , time: now});
        return true;
    }

    if (record.count < limit) {
        record.count += 1;
        return true;
    }

    return false;
}