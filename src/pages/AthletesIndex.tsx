import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { buildGlobalAthletes, type GlobalAthlete } from '@/data/globalAthletes';
import { Avatar } from '@/components/explorer/Avatar';
import { BrandBadge } from '@/components/BrandBadge';
import { YearSelector } from '@/components/YearSelector';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Waves, Search } from 'lucide-react';
import ATHLETE_BRANDS from '@/data/athleteBrands.json';

type Division = 'Men' | 'Women';
const DIVISIONS: Division[] = ['Men', 'Women'];

export default function AthletesIndex() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [athletes, setAthletes] = useState<GlobalAthlete[] | null>(null);
  const initialDivision = DIVISIONS.find((d) => d === searchParams.get('division')) ?? 'Men';
  const [division, setDivision] = useState<Division>(initialDivision);
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
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="text-xs font-mono tracking-widest uppercase text-muted-foreground flex items-center gap-2">
            <Waves className="w-3.5 h-3.5" /> Athletes
          </div>
          <YearSelector />
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
            {DIVISIONS.map((d) => (
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
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="w-14 text-xs uppercase tracking-wide">Pos.</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Rider</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Nationality</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Brand</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-right">Pts.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((a, i) => {
                  const brand = ATHLETE_BRANDS[a.name as keyof typeof ATHLETE_BRANDS];
                  return (
                    <TableRow
                      key={a.name}
                      onClick={() => navigate(`/athletes/${encodeURIComponent(a.name)}`)}
                      className="cursor-pointer border-border"
                    >
                      <TableCell className="font-bold tabular-nums text-muted-foreground">{i + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar name={a.name} nationality={a.nationality} size={32} />
                          <span className="font-medium whitespace-nowrap">{a.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{a.nationality}</TableCell>
                      <TableCell>
                        {brand ? (
                          <div className="flex items-center gap-2">
                            <BrandBadge brand={brand} size={22} />
                            <span className="text-muted-foreground whitespace-nowrap">{brand}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-display font-bold tabular-nums">{a.points.toLocaleString('en-US')}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
