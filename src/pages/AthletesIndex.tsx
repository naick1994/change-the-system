import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { buildGlobalAthletes, type GlobalAthlete } from '@/data/globalAthletes';
import { Avatar } from '@/components/explorer/Avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Waves, Search } from 'lucide-react';
import ATHLETE_BRANDS from '@/data/athleteBrands.json';

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };
const COMP_SHORT: Record<string, string> = {
  'Cold Hawaii Big Air 2026': 'Cold Hawaii',
  'Lords of Tram (GKA France) 2026': 'Lords of Tram',
  'GKA Big Air Mykonos 2026': 'GKA Mykonos',
};
type Division = 'Men' | 'Women';

export default function AthletesIndex() {
  const [searchParams] = useSearchParams();
  const [athletes, setAthletes] = useState<GlobalAthlete[] | null>(null);
  const [division, setDivision] = useState<Division>('Men');
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  useEffect(() => {
    buildGlobalAthletes().then(setAthletes);
  }, []);

  const q = query.trim().toLowerCase();
  const list =
    athletes
      ?.filter((a) => a.events[0]?.division === division)
      .filter((a) => {
        if (!q) return true;
        const brand = ATHLETE_BRANDS[a.name as keyof typeof ATHLETE_BRANDS] ?? '';
        return a.name.toLowerCase().includes(q) || brand.toLowerCase().includes(q) || a.nationality.toLowerCase() === q;
      }) ?? null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 max-w-4xl py-16">
        <div className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-3 flex items-center gap-2">
          <Waves className="w-3.5 h-3.5" /> Athletes
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Every rider, <span className="text-primary">across every event.</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mb-8 leading-relaxed">
          Ranked by actual bracket results (Champion, Final, Semi Final...), not stats averages. Each
          competition counts the same regardless of field size, so a rider who entered fewer events
          isn't penalized for it.
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex rounded-lg border border-border p-0.5">
            {(['Men', 'Women'] as Division[]).map((d) => (
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
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search rider or brand…"
              className="w-full bg-muted border border-border rounded-lg pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {!list ? (
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            {list.map((a, i) => (
              <Link
                key={a.name}
                to={`/athletes/${encodeURIComponent(a.name)}`}
                className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-card/40 transition-colors"
              >
                <span className="w-8 text-center font-bold tabular-nums text-muted-foreground shrink-0">{i + 1}</span>
                <Avatar name={a.name} nationality={a.nationality} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">
                    {a.name}
                    {ATHLETE_BRANDS[a.name as keyof typeof ATHLETE_BRANDS] && (
                      <span className="text-xs text-muted-foreground font-normal ml-1.5">
                        · {ATHLETE_BRANDS[a.name as keyof typeof ATHLETE_BRANDS]}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {a.events.map((e) => (
                      <span
                        key={e.slug}
                        title={`${e.competition} (${e.division}): ${e.resultLabel}`}
                        className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground whitespace-nowrap"
                      >
                        {MEDAL[e.rank] && <span>{MEDAL[e.rank]}</span>}
                        {COMP_SHORT[e.competition] ?? e.competition}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
