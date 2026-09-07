import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { buildBrandRankings, type BrandRanking } from '@/data/brandRankings';
import { GKA_POINTS_TIERS } from '@/components/explorer/format';
import { BrandBadge } from '@/components/BrandBadge';
import { YearSelector } from '@/components/YearSelector';
import { Skeleton } from '@/components/ui/skeleton';
import { Waves, Info } from 'lucide-react';

function ordinalLabel(n: number): string {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

/** Renders each points tier as a rank range, e.g. rank 5 through (next tier's rank - 1) → "5th–6th". The last tier is open-ended. A small bar chart (height proportional to points) reads more immediately than a text legend — the shape of the drop-off from champion to round-of-24 is the actual point. */
function PointsExplainer() {
  const maxPoints = GKA_POINTS_TIERS[0][1];
  return (
    <div className="rounded-lg border border-dashed border-border bg-card/20 p-5 mt-10">
      <div className="flex items-center gap-1.5 text-xs text-primary font-medium mb-2 uppercase tracking-wide">
        <Info className="w-3.5 h-3.5" /> How points work
      </div>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        Each rider earns points for how they actually finished a competition's bracket, the same scale
        used for individual tour rankings. A brand's total is just the sum across every rider it sponsors,
        across every event.
      </p>
      <div className="flex items-end gap-2 sm:gap-3 h-28">
        {GKA_POINTS_TIERS.map(([rank, points], i) => {
          const nextRank = GKA_POINTS_TIERS[i + 1]?.[0];
          const rangeLabel = nextRank == null ? `${ordinalLabel(rank)}+` : nextRank - 1 === rank ? ordinalLabel(rank) : `${ordinalLabel(rank)}–${ordinalLabel(nextRank - 1)}`;
          return (
            <div key={rank} className="flex-1 flex flex-col items-center justify-end h-full">
              <div className="text-xs font-display font-bold tabular-nums mb-1.5">{points}</div>
              <div
                className="w-full rounded-t-sm bg-gradient-to-t from-primary/50 to-primary"
                style={{ height: `${(points / maxPoints) * 100}%` }}
              />
              <div className="text-[10px] text-muted-foreground mt-1.5 whitespace-nowrap">{rangeLabel}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type Division = 'Overall' | 'Men' | 'Women';

export default function BrandsIndex() {
  const [brands, setBrands] = useState<BrandRanking[] | null>(null);
  const [division, setDivision] = useState<Division>('Overall');

  useEffect(() => {
    setBrands(null);
    buildBrandRankings(division).then(setBrands);
  }, [division]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 max-w-4xl py-16">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="text-xs font-mono tracking-widest uppercase text-muted-foreground flex items-center gap-2">
            <Waves className="w-3.5 h-3.5" /> Brands
          </div>
          <YearSelector />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Kite Brands <span className="text-primary">Championship.</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mb-8 leading-relaxed">
          Every sponsor, ranked by points. Each rider's points-by-finish across every
          competition they entered, summed for their brand. Same scale the tour itself uses to rank
          individual riders.
        </p>

        <div className="inline-flex rounded-lg border border-border p-0.5 mb-6">
          {(['Overall', 'Men', 'Women'] as Division[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDivision(d)}
              className={`px-4 py-1.5 text-sm rounded-md transition-colors ${division === d ? 'bg-primary text-primary-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {d}
            </button>
          ))}
        </div>

        {!brands ? (
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            {brands.map((b, i) => (
              <Link
                key={b.brand}
                to={`/athletes?q=${encodeURIComponent(b.brand)}&division=${division}`}
                className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-card/40 transition-colors"
              >
                <span className="w-8 text-center font-bold tabular-nums text-muted-foreground shrink-0">{i + 1}</span>
                <BrandBadge brand={b.brand} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{b.brand}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {b.riderCount} {b.riderCount === 1 ? 'rider' : 'riders'}
                    {b.championships > 0 && (
                      <>
                        {' '}
                        · {b.championships} {b.championships === 1 ? 'championship' : 'championships'}
                      </>
                    )}
                    {b.podiums > 0 && <> · {b.podiums} podiums</>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-display text-lg font-bold leading-none tabular-nums">{b.points.toLocaleString('en-US')}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">points</div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <PointsExplainer />
      </div>
    </div>
  );
}
