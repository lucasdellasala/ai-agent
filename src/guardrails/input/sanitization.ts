/** Strip control characters (except newline/tab), format chars, and normalize unicode */
export function sanitizeInput(input: string): string {
  return input
    // Remove control chars except \n (0x0A) and \t (0x09)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Remove unicode format characters (zero-width spaces, BOM, etc.)
    .replace(/[\u200B-\u200F\u2028-\u202F\uFEFF]/g, '')
    // Normalize unicode to NFC form
    .normalize('NFC')
    .trim();
}
