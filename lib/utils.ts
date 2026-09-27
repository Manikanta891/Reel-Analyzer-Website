export function formatDisplayDate(val?: number | string): string {
  if (!val) return '';
  const d = new Date(val);
  if (isNaN(d.getTime())) {
    return String(val).slice(0, 10);
  }
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  });
}
