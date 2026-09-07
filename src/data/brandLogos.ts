const images = import.meta.glob('/src/assets/brands/*.{png,svg,webp,ico}', { eager: true, import: 'default' }) as Record<string, string>;

const BY_KEY: Record<string, string> = {};
for (const [path, url] of Object.entries(images)) {
  const key = path.split('/').pop()!.replace(/\.(png|svg|webp|ico)$/, '');
  BY_KEY[key] = url;
}

/**
 * Official logo for a brand, keyed by name (case-insensitive) — sourced
 * directly from each brand's own site (favicon/apple-touch-icon, not a
 * full wordmark, so these are meant to sit small in a circular badge; see
 * handoff/brand-logos-package/README.md for per-brand source/size notes).
 * Returns undefined only for "Independent", which isn't a real company at
 * all (see brandRankings.ts) — callers should fall back to a distinct
 * "unsponsored" treatment for that one.
 */
export function brandLogo(brand: string): string | undefined {
  return BY_KEY[brand.toLowerCase()];
}
