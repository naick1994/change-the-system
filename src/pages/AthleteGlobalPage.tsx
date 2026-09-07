import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { buildGlobalAthletes, type GlobalAthlete } from '@/data/globalAthletes';
import { athleteSeasonHighlights } from '@/data/eventsIndex';
import { fmt, pct } from '@/components/explorer/format';
import { Avatar } from '@/components/explorer/Avatar';
import { BrandBadge } from '@/components/BrandBadge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ArrowUpRight, Sparkles } from 'lucide-react';
import ATHLETE_BRANDS from '@/data/athleteBrands.json';

export default function AthleteGlobalPage() {
  const { name: encodedName } = useParams<{ name: string }>();
  const name = encodedName ? decodeURIComponent(encodedName) : '';
  const navigate = useNavigate();
  const [athlete, setAthlete] = useState<GlobalAthlete | null | undefined>(undefined);

  useEffect(() => {
    setAthlete(undefined);
    buildGlobalAthletes().then((all) => {
      setAthlete(all.find((a) => a.name === name) ?? null);
    });
  }, [name]);

  const athleteHighlights = athlete ? athleteSeasonHighlights(athlete.name) : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 max-w-4xl py-16">
        <Link to="/athletes" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> All athletes
        </Link>

        {athlete === undefined ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : athlete === null ? (
          <p className="text-muted-foreground">No athlete found with that name.</p>
        ) : (
          <>
            <div className="flex items-center gap-5 flex-wrap mb-8">
              <Avatar name={athlete.name} nationality={athlete.nationality} size={88} />
              <div className="flex-1 min-w-[220px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display text-3xl font-bold">{athlete.name}</h1>
                  {ATHLETE_BRANDS[athlete.name as keyof typeof ATHLETE_BRANDS] && (
                    <div className="flex items-center gap-1.5">
                      <BrandBadge brand={ATHLETE_BRANDS[athlete.name as keyof typeof ATHLETE_BRANDS]} size={24} />
                      <span className="text-sm text-muted-foreground">
                        {ATHLETE_BRANDS[athlete.name as keyof typeof ATHLETE_BRANDS]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-5 mt-3">
                  <div>
                    <div className="font-display text-lg font-bold leading-none tabular-nums">{athlete.wins}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Win{athlete.wins !== 1 ? 's' : ''}</div>
                  </div>
                  <div>
                    <div className="font-display text-lg font-bold leading-none tabular-nums">{athlete.podiums}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Podium{athlete.podiums !== 1 ? 's' : ''}</div>
                  </div>
                  <div>
                    <div className="font-display text-lg font-bold leading-none tabular-nums">{athlete.events.length}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Event{athlete.events.length !== 1 ? 's' : ''} entered</div>
                  </div>
                  <div>
                    <div className="font-display text-lg font-bold leading-none tabular-nums">{athlete.points.toLocaleString('en-US')}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Points</div>
                  </div>
                </div>
              </div>
            </div>

            {athleteHighlights.length > 0 && (
              <div className="rounded-lg border border-dashed border-border bg-card/20 p-4 mb-8">
                <div className="flex items-center gap-1.5 text-xs text-primary font-medium mb-2.5 uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" /> Season highlights
                </div>
                <ul className="space-y-1.5">
                  {athleteHighlights.map((h) => (
                    <li key={h} className="text-sm text-foreground/90 flex items-start gap-2">
                      <span className="text-primary mt-1 text-xs">●</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Career stats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              <Card className="p-3.5">
                <div className="font-display text-xl font-bold tabular-nums">{pct(athlete.heatWinRate)}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Heat win rate ({athlete.heatsWon}/{athlete.heatsPlayed})
                </div>
              </Card>
              {athlete.crashRate != null && (
                <Card className="p-3.5">
                  <div className="font-display text-xl font-bold tabular-nums">{pct(athlete.crashRate)}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Crash rate</div>
                </Card>
              )}
              {athlete.bestHeatScore && (
                <Card className="p-3.5">
                  <div className="font-display text-xl font-bold tabular-nums">{fmt(athlete.bestHeatScore.value)}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Best heat score, {athlete.bestHeatScore.competition} ({athlete.bestHeatScore.division})
                  </div>
                </Card>
              )}
              {athlete.bestMove && (
                <Card className="p-3.5">
                  <div className="font-display text-xl font-bold tabular-nums">{fmt(athlete.bestMove.value)}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Best single move, {athlete.bestMove.competition} ({athlete.bestMove.division})
                  </div>
                </Card>
              )}
            </div>

            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Results by competition</h3>
            <div className="space-y-2">
              {athlete.events.map((e) => (
                <button
                  key={e.slug}
                  type="button"
                  onClick={() => navigate(`/${e.slug}`, { state: { openAthlete: athlete.name } })}
                  className="w-full text-left"
                >
                  <Card className="p-4 flex items-center justify-between gap-4 flex-wrap hover:border-primary/50 transition-colors">
                    <div>
                      <div className="font-medium">{e.competition}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{e.division} · {e.date}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`text-sm font-medium ${e.rank <= 3 ? 'text-primary' : 'text-muted-foreground'}`}>{e.resultLabel}</div>
                        <div className="text-xs text-muted-foreground">{e.points} pts</div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Card>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
