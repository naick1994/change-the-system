import { Link } from 'react-router-dom';
import { groupedEvents } from '@/data/eventsIndex';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/explorer/Avatar';
import { YearSelector } from '@/components/YearSelector';
import { flagEmoji } from '@/components/explorer/format';
import { ArrowUpRight, MapPin, Trophy } from 'lucide-react';

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function CompetitionsIndex() {
  const groups = groupedEvents();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 max-w-4xl py-16">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="text-xs font-mono tracking-widest uppercase text-muted-foreground flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5" /> Competitions
          </div>
          <YearSelector />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Every competition, <span className="text-primary">heat by heat.</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mb-10 leading-relaxed">
          Pick a competition, then a division, for the full leaderboard, bracket, and athlete
          profiles.
        </p>

        <div className="space-y-4">
          {groups.map((g) => {
            const allCountries = [...new Set(g.divisions.flatMap((d) => d.countries))];
            return (
              <Card key={g.competition} className="p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                  <div>
                    <div className="font-display font-semibold text-lg">{g.competition}</div>
                    <div className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> {g.location} · {g.date}
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0" title={`${allCountries.length} countries represented`}>
                    {allCountries.slice(0, 8).map((c) => (
                      <span key={c} className="text-sm leading-none">{flagEmoji(c)}</span>
                    ))}
                    {allCountries.length > 8 && (
                      <span className="text-xs text-muted-foreground ml-1">+{allCountries.length - 8}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {g.divisions.map((d) => (
                    <Link
                      key={d.slug}
                      to={`/${d.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary/50 bg-primary/10 text-primary px-4 py-1.5 text-sm font-medium hover:border-primary hover:bg-primary/20 transition-colors"
                    >
                      {d.division}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  ))}
                </div>

                <div className="space-y-3 pt-3 border-t border-border">
                  {g.divisions.map((d) => (
                    <div key={d.slug} className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs font-semibold text-muted-foreground w-12 shrink-0 uppercase tracking-wide">{d.division}</span>
                      {d.podium.slice(0, 3).map((p) => (
                        <div key={p.name} className="flex items-center gap-1.5">
                          <span className="text-xs">{MEDAL[p.placement] ?? p.placement}</span>
                          <Avatar name={p.name} nationality={p.nationality} size={22} />
                          <span className="text-xs text-foreground font-medium whitespace-nowrap">{p.name}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
