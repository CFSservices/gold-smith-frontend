/**
 * Date utilities for the jewel product inventory
*/
export function toDateOnly(d: Date | string | null | undefined): Date | null {
  if (!d) return null;
  const date = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(date.getTime())) return null;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
