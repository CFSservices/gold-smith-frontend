/**
 * Date utilities for the jewel product inventory
 */
export function toDateOnly(d: Date | string | null | undefined): Date | null {
  // console.log('d:', d);
  if (!d) return null;
  const date = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(date.getTime())) return null;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Format ISO string for display: date and time (e.g. "Jan 30, 2026, 9:39 AM") */
export function formatDateTime(d: Date | string | null | undefined): string {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(date.getTime())) return '';
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Format ISO string for display: date only (e.g. "Jan 30, 2026") */
export function formatDateOnlyDisplay(d: Date | string | null | undefined): string {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
