const images = import.meta.glob('/src/assets/brands/*.{png,svg}', { eager: true, import: 'default' }) as Record<string, string>;

const BY_KEY: Record<string, string> = {};
for (const [path, url] of Object.entries(images)) {
  const key = path.split('/').pop()!.replace(/\.(png|svg)$/, '');
  BY_KEY[key] = url;
}

/**
 * Official logo for a brand, keyed by name (case-insensitive). Returns
 * undefined for brands without a sourced logo yet (Duotone, Gong, Vantage,
 * North — official sites don't expose a directly linkable logo file) or
 * for "Independent", which isn't a real company at all (see
 * brandRankings.ts) — callers should fall back to an initials badge for
 * the former and a distinct "unsponsored" treatment for the latter.
 */
export function brandLogo(brand: string): string | undefined {
  return BY_KEY[brand.toLowerCase()];
}
