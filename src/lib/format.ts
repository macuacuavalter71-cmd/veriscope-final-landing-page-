/** Compact counter formatting: 1200 → 1.2k, 758000 → 758k, 1200000 → 1.2M. */
export function compactCount(value: number): string {
  if (!Number.isFinite(value)) return "0";
  const n = Math.max(0, Math.round(value));

  if (n >= 999_950) return trim(n / 1_000_000) + "M";
  if (n >= 1000) return trim(n / 1000) + "k";
  return String(n);
}

function trim(value: number): string {
  const rounded = value >= 100 ? Math.round(value) : Math.round(value * 10) / 10;
  return String(rounded).replace(/\.0$/, "");
}

/** "há 3 h", "há 2 d" — short relative time in pt. */
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `há ${hours} h`;
  const days = Math.round(hours / 24);
  if (days < 30) return `há ${days} d`;
  const months = Math.round(days / 30);
  return `há ${months} m`;
}

/**
 * Ages for the community feed: evenly spread between 2 minutes and 24 hours,
 * jittered so the ordering feels fresh on every page load.
 */
export function freshAges(count: number): string[] {
  const min = 2;
  const max = 24 * 60;
  return Array.from({ length: count }, (_, i) => {
    const base = min + ((max - min) * i) / Math.max(1, count - 1);
    const jitter = (Math.random() - 0.5) * ((max - min) / Math.max(1, count) / 1.5);
    const minutes = Math.min(max, Math.max(min, Math.round(base + jitter)));
    return minutes < 60 ? `há ${minutes} min` : `há ${Math.round(minutes / 60)} h`;
  });
}
