export function normalizeFilterToken(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Parses listing tags from a free-form text field.
 * Supports comma, semicolon, and pipe delimiters.
 */
export function parseListingTags(raw: string | null | undefined): string[] {
    if (!raw) return [];

    const tokens = raw
        .split(/[;,|]/g)
        .map((part) => part.trim().replace(/^#/, ""))
        .filter(Boolean);

    const seen = new Set<string>();
    const unique: string[] = [];

    for (const token of tokens) {
        const normalized = normalizeFilterToken(token);
        if (!normalized || seen.has(normalized)) continue;
        seen.add(normalized);
        unique.push(token);
    }

    return unique;
}
