import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { buildGlobalAthletes, type GlobalAthlete } from '@/data/globalAthletes';
import { athleteSeasonHighlights } from '@/data/eventsIndex';
import { fmt, pct } from '@/components/explorer/format';
import { Avatar } from '@/components/explorer/Avatar';
import { BrandBadge } from '@/components/BrandBadge';
import { SectionHead } from '@/components/SectionHead';
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
      <div className="container mx-auto px-6 max-w-6xl py-16 md:py-20">
        <Link to="/athletes" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
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
            <div className="grid md:grid-cols-[1fr_1.2fr] gap-8 md:gap-14 items-start mb-14">
              <div className="flex items-center gap-5">
                <Avatar name={athlete.name} nationality={athlete.nationality} size={88} />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-display text-3xl font-bold">{athlete.name}</h1>
                  </div>
                  {ATHLETE_BRANDS[athlete.name as keyof typeof ATHLETE_BRANDS] && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <BrandBadge brand={ATHLETE_BRANDS[athlete.name as keyof typeof ATHLETE_BRANDS]} size={20} />
                      <span className="text-sm text-muted-foreground">
                        {ATHLETE_BRANDS[athlete.name as keyof typeof ATHLETE_BRANDS]}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap border-t border-border">
                {[
                  { v: athlete.wins, l: `Win${athlete.wins !== 1 ? 's' : ''}` },
                  { v: athlete.podiums, l: `Podium${athlete.podiums !== 1 ? 's' : ''}` },
                  { v: athlete.events.length, l: `Event${athlete.events.length !== 1 ? 's' : ''} entered` },
                  { v: athlete.points.toLocaleString('en-US'), l: 'Points' },
                ].map((s, i, arr) => (
                  <div key={s.l} className={`flex-1 min-w-[6rem] py-4 pr-4 ${i < arr.length - 1 ? 'border-r border-border' : ''}`}>
                    <div className="font-display text-2xl font-bold tabular-nums leading-none">{s.v}</div>
                    <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mt-1.5">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {athleteHighlights.length > 0 && (
              <div className="mb-14 border-l-2 border-primary pl-5">
                <div className="flex items-center gap-1.5 text-xs text-primary font-mono font-medium mb-2.5 uppercase tracking-[0.2em]">
                  <Sparkles className="w-3.5 h-3.5" /> Season highlights
                </div>
                <ul className="space-y-1.5">
                  {athleteHighlights.map((h) => (
                    <li key={h} className="text-sm text-foreground/90">
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <SectionHead>Career stats</SectionHead>
            <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-l border-border mb-14">
              <div className="p-4 border-r border-b border-border">
                <div className="font-display text-xl font-bold tabular-nums">{pct(athlete.heatWinRate)}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Heat win rate ({athlete.heatsWon}/{athlete.heatsPlayed})
                </div>
              </div>
              {athlete.crashRate != null && (
                <div className="p-4 border-r border-b border-border">
                  <div className="font-display text-xl font-bold tabular-nums">{pct(athlete.crashRate)}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Crash rate</div>
                </div>
              )}
              {athlete.bestHeatScore && (
                <div className="p-4 border-r border-b border-border">
                  <div className="font-display text-xl font-bold tabular-nums">{fmt(athlete.bestHeatScore.value)}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Best heat score, {athlete.bestHeatScore.competition} ({athlete.bestHeatScore.division})
                  </div>
                </div>
              )}
              {athlete.bestMove && (
                <div className="p-4 border-r border-b border-border">
                  <div className="font-display text-xl font-bold tabular-nums">{fmt(athlete.bestMove.value)}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Best single move, {athlete.bestMove.competition} ({athlete.bestMove.division})
                  </div>
                </div>
              )}
            </div>

            <SectionHead>Results by competition</SectionHead>
            <div className="divide-y divide-border border-t border-border">
              {athlete.events.map((e) => (
                <button
                  key={e.slug}
                  type="button"
                  onClick={() => navigate(`/${e.slug}`, { state: { openAthlete: athlete.name } })}
                  className="w-full text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 py-4 hover:bg-card/30 transition-colors -mx-2 px-2"
                >
                  <div className="min-w-0">
                    <div className="font-medium">{e.competition}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{e.division} · {e.date}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-left sm:text-right">
                      <div className={`text-sm font-medium ${e.rank <= 3 ? 'text-primary' : 'text-muted-foreground'}`}>{e.resultLabel}</div>
                      <div className="text-xs text-muted-foreground">{e.points} pts</div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
