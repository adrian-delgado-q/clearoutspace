/**
 * Date utilities for listing lifecycle display.
 */

/** Format a date string as "Mar 15" */
export function formatShortDate(dateStr: string | null | undefined): string {
    if (!dateStr) return "–";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "–";
    return d.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

/** Format as "March 15, 2026" */
export function formatLongDate(dateStr: string | null | undefined): string {
    if (!dateStr) return "–";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "–";
    return d.toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
}

/** Days remaining from now until dateStr. Negative = expired. */
export function daysUntil(dateStr: string | null | undefined): number | null {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    const now = new Date();
    return Math.floor((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

/** True if the listing is past its availableUntil date */
export function isExpired(dateStr: string | null | undefined): boolean {
    const d = daysUntil(dateStr);
    return d !== null && d < 0;
}

/** Human-readable urgency label */
export function pickupUrgency(dateStr: string | null | undefined): string {
    const d = daysUntil(dateStr);
    if (d === null) return "";
    if (d < 0) return "Expired";
    if (d === 0) return "Last day!";
    if (d === 1) return "1 day left";
    if (d <= 3) return `${d} days left`;
    return `Pickup by ${formatShortDate(dateStr)}`;
}
