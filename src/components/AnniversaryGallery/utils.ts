/**
 * Parse YYYY-MM-DD from image basename, ignore trailing -index
 * @param path - Image path or filename
 * @returns Date object or null if parsing fails
 */
export function parseDateFromPath(path: string): Date | null {
  const basename = path.split('/').pop() || path;
  const match = basename.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const [, year, month, day] = match;
  // 한국 시간 기준으로 날짜 생성
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Calculate days difference between image date and anniversary date
 * @param imageDate - Date parsed from image filename
 * @param anniversaryDate - Anniversary date string (YYYY-MM-DD)
 * @returns Days difference or null if calculation fails
 */
export function calculateDaysCount(imageDate: Date | null, anniversaryDate: string): number | null {
  if (!imageDate) return null;

  try {
    const anniversary = new Date(anniversaryDate);
    anniversary.setHours(0, 0, 0, 0);

    const diffTime = imageDate.getTime() - anniversary.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Failed to compute D+ from filename/anniversaryDate:', error);
    return null;
  }
}

/**
 * Format days count for display
 * @param daysCount - Days difference
 * @returns Object with sign and display value
 */
export function formatDaysDisplay(daysCount: number | null): { sign: string; displayValue: number | null } {
  const sign = daysCount !== null ? (daysCount >= 0 ? '+' : '-') : '';
  const displayValue = daysCount !== null ? Math.abs(daysCount + 1) : null;
  return { sign, displayValue };
}
