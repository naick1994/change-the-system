import { Ban } from 'lucide-react';
import { brandLogo } from '@/data/brandLogos';
import { initials, avatarColor } from '@/components/explorer/format';

/** Logos that are white/light-colored in their source file (verified by sampling opaque-pixel brightness) — need a dark chip instead of the default white one, or they'd disappear. */
const LIGHT_LOGO_BRANDS = new Set(['Slingshot', 'RRD', 'F-ONE', 'Naish', 'Ozone']);

/**
 * A brand's visual identity in a list row: real logo on a white (or, for
 * light-colored logos, dark) chip when we have one, initials-on-color
 * fallback for brands without a sourced logo (Duotone, Gong, Vantage,
 * North), and a distinct "unsponsored" treatment for "Independent" — which
 * isn't a real company, it's how riders without a personal sponsor are
 * labeled in the source data (see brandRankings.ts).
 */
export function BrandBadge({ brand, size = 36 }: { brand: string; size?: number }) {
  if (brand === 'Independent') {
    return (
      <div
        className="rounded-full border border-dashed border-muted-foreground/40 flex items-center justify-center text-muted-foreground shrink-0"
        style={{ width: size, height: size }}
        title="Unsponsored"
      >
        <Ban style={{ width: size * 0.5, height: size * 0.5 }} />
      </div>
    );
  }

  const logo = brandLogo(brand);
  if (logo) {
    return (
      <div
        className={`rounded-full flex items-center justify-center shrink-0 overflow-hidden p-1.5 ${LIGHT_LOGO_BRANDS.has(brand) ? 'bg-neutral-800' : 'bg-white'}`}
        style={{ width: size, height: size }}
      >
        <img src={logo} alt={brand} className="w-full h-full object-contain" />
      </div>
    );
  }

  return (
    <div
      className="rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
      style={{ width: size, height: size, backgroundColor: avatarColor(brand) }}
    >
      {initials(brand)}
    </div>
  );
}
