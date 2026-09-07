import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { buildGlobalAthletes, type GlobalAthlete } from '@/data/globalAthletes';
import { Avatar } from '@/components/explorer/Avatar';
import { BrandBadge } from '@/components/BrandBadge';
import { YearSelector } from '@/components/YearSelector';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Search } from 'lucide-react';
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
      <div className="container mx-auto px-6 max-w-6xl py-16 md:py-20">
        <div className="flex justify-end mb-3">
          <YearSelector />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Every rider, <span className="text-primary">across every event.</span>
        </h1>
        <p className="text-muted-foreground max-w-md leading-relaxed mb-10">
          Ranked by actual bracket results (Champion, Final, Semi Final...), not stats averages. Each
          competition counts the same regardless of field size, so a rider who entered fewer events
          isn't penalized for it.
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-2 border-b border-border pb-3">
          <div className="flex items-center gap-6">
            {DIVISIONS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDivision(d)}
                className={`text-sm pb-3 -mb-3 border-b-2 transition-colors ${division === d ? 'border-primary text-foreground font-medium' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-4 h-4 text-muted-foreground absolute left-0 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search rider or brand…"
              className="w-full bg-transparent border-b border-border pl-6 pr-2 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {!list ? (
          <div className="space-y-2 mt-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="w-14 text-[11px] font-mono uppercase tracking-widest">Pos.</TableHead>
                <TableHead className="text-[11px] font-mono uppercase tracking-widest">Rider</TableHead>
                <TableHead className="text-[11px] font-mono uppercase tracking-widest">Nationality</TableHead>
                <TableHead className="text-[11px] font-mono uppercase tracking-widest">Brand</TableHead>
                <TableHead className="text-[11px] font-mono uppercase tracking-widest text-right">Pts.</TableHead>
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
                    <TableCell className="font-mono font-bold tabular-nums text-muted-foreground">{i + 1}</TableCell>
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
        )}
      </div>
    </div>
  );
}
