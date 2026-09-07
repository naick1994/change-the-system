import { Ban } from 'lucide-react';
import { brandLogo } from '@/data/brandLogos';

/**
 * Favicons that are opaque squares with their own solid background fill
 * (not a mark on transparent), verified visually — padding them inside a
 * white circular chip leaves the square's corners poking out. These get a
 * full-bleed circular crop (object-cover, no padding, no added
 * background) instead, same as cropping a square photo into an avatar.
 */
const FULL_BLEED_BRANDS = new Set(['RRD', 'Eleveight', 'Core', 'Slingshot']);

/**
 * A brand's visual identity in a list row: real logo on a white chip (or,
 * for opaque square favicons, a full-bleed circular crop — see
 * FULL_BLEED_BRANDS), and a distinct "unsponsored" treatment for
 * "Independent", which isn't a real company, it's how riders without a
 * personal sponsor are labeled in the source data (see brandRankings.ts).
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
  const fullBleed = FULL_BLEED_BRANDS.has(brand);
  return (
    <div
      className={`rounded-full flex items-center justify-center shrink-0 overflow-hidden ${fullBleed ? '' : 'p-1.5 bg-white'}`}
      style={{ width: size, height: size }}
    >
      <img src={logo} alt={brand} className={`w-full h-full ${fullBleed ? 'object-cover' : 'object-contain'}`} />
    </div>
  );
}
