import { Link } from 'react-router-dom';
import { groupedEvents } from '@/data/eventsIndex';
import { Avatar } from '@/components/explorer/Avatar';
import { YearSelector } from '@/components/YearSelector';
import { flagEmoji } from '@/components/explorer/format';
import { ArrowUpRight, MapPin } from 'lucide-react';

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function CompetitionsIndex() {
  const groups = groupedEvents();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 max-w-6xl py-16 md:py-20">
        <div className="flex justify-end mb-3">
          <YearSelector />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Every competition, <span className="text-primary">heat by heat.</span>
        </h1>
        <p className="text-muted-foreground max-w-md leading-relaxed mb-14">
          Pick a competition, then a division, for the full leaderboard, bracket, and athlete
          profiles.
        </p>

        <div className="divide-y divide-border border-t border-border">
          {groups.map((g) => {
            const allCountries = [...new Set(g.divisions.flatMap((d) => d.countries))];
            return (
              <div key={g.competition} className="py-8 grid md:grid-cols-[1fr_1.4fr] gap-6 md:gap-12">
                <div>
                  <div className="font-display font-bold text-2xl">{g.competition}</div>
                  <div className="text-sm text-muted-foreground mt-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> {g.location} · {g.date}
                  </div>
                  <div className="flex items-center gap-0.5 mt-4" title={`${allCountries.length} countries represented`}>
                    {allCountries.slice(0, 10).map((c) => (
                      <span key={c} className="text-sm leading-none">{flagEmoji(c)}</span>
                    ))}
                    {allCountries.length > 10 && (
                      <span className="text-xs text-muted-foreground ml-1">+{allCountries.length - 10}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-5">
                    {g.divisions.map((d) => (
                      <Link
                        key={d.slug}
                        to={`/${d.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary border-b border-primary/40 hover:border-primary transition-colors"
                      >
                        {d.division}
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {g.divisions.map((d) => (
                    <div key={d.slug}>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">{d.division}</span>
                      <div className="space-y-2 mt-2.5">
                        {d.podium.slice(0, 3).map((p) => (
                          <div key={p.name} className="flex items-center gap-2">
                            <span className="text-xs w-4">{MEDAL[p.placement] ?? p.placement}</span>
                            <Avatar name={p.name} nationality={p.nationality} size={22} />
                            <span className="text-sm text-foreground font-medium whitespace-nowrap">{p.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
