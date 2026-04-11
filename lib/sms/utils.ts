export function normalizePhone(phone: string) {
  const cleaned = phone.trim().replace(/\s+/g, "");

  if (cleaned.startsWith("0")) {
    return "+234" + cleaned.slice(1);
  }

  if (cleaned.startsWith("+")) {
    return cleaned;
  }

  // If it already starts with country code, add + prefix
  if (cleaned.startsWith("234")) {
    return "+" + cleaned;
  }

  return "+" + cleaned;
}