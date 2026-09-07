import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  siteTotals,
  siteCountries,
  tourSpotlight,
  tourSpotlightMenTie,
  tourSpotlightWomen,
  seasonTimeline,
  seasonFacts,
  fieldFacts,
  nationComposition,
  brandComposition,
  brandPodiumComposition,
  mostRecentCompetition,
  type CompositionSegment,
} from '@/data/eventsIndex';
import { buildBrandRankings, type BrandRanking } from '@/data/brandRankings';
import { buildGlobalAthletes, type GlobalAthlete } from '@/data/globalAthletes';
import { Avatar } from '@/components/explorer/Avatar';
import { BrandBadge } from '@/components/BrandBadge';
import { SectionHead } from '@/components/SectionHead';
import { Skeleton } from '@/components/ui/skeleton';
import { flagEmoji } from '@/components/explorer/format';
import { useCountUp } from '@/hooks/useCountUp';
import { Trophy, Swords, Wind, Award, Zap, Sparkles, ShieldCheck, Repeat, Scale, Compass, Globe2, Flame, type LucideIcon } from 'lucide-react';

const RESULT_ICON: Record<string, string> = { Champion: '🏆', 'Runner-up': '🥈', '2nd place': '🥈', '3rd place': '🥉' };

const INSIGHT_STYLE: Record<string, { icon: LucideIcon }> = {
  'Tightest heat of the season': { icon: Swords },
  'Wipeouts this season': { icon: Flame },
  'Most riders, nation': { icon: Globe2 },
  'Most event wins, nation': { icon: Trophy },
  'Most riders, brand': { icon: Wind },
  'Most podiums, brand': { icon: Award },
  'Biggest blowout': { icon: Zap },
  "Season's biggest trick": { icon: Sparkles },
  'Most consistent rider': { icon: ShieldCheck },
  'Longest win streak': { icon: Repeat },
  'Most balanced event': { icon: Scale },
  'Most international field': { icon: Compass },
};

const COMPOSITION_FOR_LABEL: Record<string, () => CompositionSegment[]> = {
  'Most riders, nation': nationComposition,
  'Most riders, brand': brandComposition,
  'Most podiums, brand': brandPodiumComposition,
};

const COMPOSITION_PALETTE = ['#f2661a', '#3987e5', '#2ea36b', '#c9578f', '#c9a227', '#5b6472'];

function CompositionBar({ segments, flags, unit = 'riders total' }: { segments: CompositionSegment[]; flags?: boolean; unit?: string }) {
  const total = segments.reduce((sum, s) => sum + s.count, 0);
  return (
    <div>
      <div className="text-xs font-mono text-muted-foreground mb-2">{total} {unit}</div>
      <div className="flex h-1.5 overflow-hidden bg-muted">
        {segments.map((s, i) => (
          <div
            key={s.label}
            style={{ width: `${(s.count / total) * 100}%`, backgroundColor: COMPOSITION_PALETTE[i % COMPOSITION_PALETTE.length] }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-2.5 gap-y-1 mt-2.5">
        {segments.map((s, i) => (
          <div key={s.label} className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: COMPOSITION_PALETTE[i % COMPOSITION_PALETTE.length] }} />
            {flags && flagEmoji(s.label)} {s.label} <span className="text-foreground font-medium">{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Animates the leading integer in a value string (e.g. "12 riders" → counts up "12", keeps " riders" static). Falls back to plain text if the value doesn't start with a number. */
function AnimatedValue({ value }: { value: string }) {
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const animated = useCountUp(target);
  if (!match) return <>{value}</>;
  return (
    <>
      {animated}
      {match[2]}
    </>
  );
}

function HeroStat({ value, label, delay, last }: { value: number; label: string; delay: number; last?: boolean }) {
  const animated = useCountUp(value);
  return (
    <div className={`rise-in flex-1 min-w-[7rem] py-5 pr-6 ${last ? '' : 'border-r border-border'}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="font-display text-4xl md:text-5xl font-bold tabular-nums leading-none">{animated}</div>
      <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mt-2">{label}</div>
    </div>
  );
}

export default function Home() {
  const totals = siteTotals();
  const spotlight = tourSpotlight();
  const spotlightMenTie = tourSpotlightMenTie();
  const spotlightWomen = tourSpotlightWomen();
  const timeline = seasonTimeline();
  const countries = siteCountries();
  const recap = mostRecentCompetition();
  const [brandsOverall, setBrandsOverall] = useState<BrandRanking[] | null>(null);
  const [brandsMen, setBrandsMen] = useState<BrandRanking[] | null>(null);
  const [brandsWomen, setBrandsWomen] = useState<BrandRanking[] | null>(null);
  const [riders, setRiders] = useState<GlobalAthlete[] | null>(null);
  useEffect(() => {
    buildBrandRankings('Overall').then(setBrandsOverall);
    buildBrandRankings('Men').then(setBrandsMen);
    buildBrandRankings('Women').then(setBrandsWomen);
    buildGlobalAthletes().then(setRiders);
  }, []);
  // Sorted by points specifically for this teaser, since it displays each rider's points value — the
  // /athletes page itself stays sorted by actual bracket results (its own deliberate ranking philosophy).
  const ridersMenByPoints = riders ? riders.filter((a) => a.events[0]?.division === 'Men').sort((a, b) => b.points - a.points) : null;
  const ridersWomenByPoints = riders ? riders.filter((a) => a.events[0]?.division === 'Women').sort((a, b) => b.points - a.points) : null;
  const facts = seasonFacts();
  const field = fieldFacts();
  const insights = [...facts, ...field];

  const stats: { key: string; value: number; label: string }[] = [
    { key: 'competitions', value: totals.competitions, label: 'Competitions' },
    { key: 'uniqueRiders', value: totals.uniqueRiders, label: 'Unique riders' },
    { key: 'heats', value: totals.heats, label: 'Heats analyzed' },
    { key: 'countries', value: totals.countries, label: 'Countries' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 max-w-6xl py-16 md:py-20">

        {/* ===== Hero ===== */}
        <div className="grid md:grid-cols-[1.3fr_1fr] gap-10 md:gap-16 items-end mb-12">
          <div>
            <h1 className="rise-in font-display text-5xl md:text-6xl font-bold mb-5 leading-[1.05]" style={{ animationDelay: '60ms' }}>
              Where kitesurf data <span className="text-primary">tells the story.</span>
            </h1>
            <p className="rise-in text-muted-foreground max-w-md leading-relaxed" style={{ animationDelay: '120ms' }}>
              Every Big Air competition, broken down heat by heat. Leaderboards that show what actually
              happened, athlete profiles built for riders instead of statisticians, and head-to-head
              comparisons that turn raw scores into real insight.
            </p>
          </div>
          <div className="rise-in flex flex-wrap content-end gap-1.5 md:justify-end pb-1" style={{ animationDelay: '200ms' }}>
            {countries.map((c) => (
              <span key={c} title={c} className="text-lg leading-none opacity-90 hover:opacity-100 hover:scale-125 transition-transform">
                {flagEmoji(c)}
              </span>
            ))}
          </div>
        </div>

        {/* ===== Stat strip ===== */}
        <div className="flex flex-wrap border-t border-border mb-16">
          {stats.map((s, i) => (
            <HeroStat key={s.key} value={s.value} label={s.label} delay={260 + i * 60} last={i === stats.length - 1} />
          ))}
        </div>

        {/* ===== Season timeline ===== */}
        <section className="mb-16">
          <SectionHead delay={420}>Three stops, one season</SectionHead>
          <div className="rise-in relative flex items-start justify-between" style={{ animationDelay: '460ms' }}>
            <div className="absolute top-[7px] left-0 right-0 h-px bg-border" />
            {timeline.map((stop) => (
              <Link
                key={stop.slug}
                to={`/${stop.slug}`}
                className="relative flex-1 flex flex-col items-center text-center px-1 group"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-primary border-4 border-background z-10 group-hover:scale-125 transition-transform" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-3">{stop.month}</span>
                <span className="text-sm md:text-base font-display font-bold mt-1">{stop.competition.replace(' (GKA France) 2026', '').replace(' 2026', '')}</span>
                <span className="text-xs text-muted-foreground mt-1 group-hover:text-primary transition-colors">🏆 {stop.winner}</span>
                {stop.subtitle && (
                  <span className="text-[10px] font-semibold text-primary mt-1 uppercase tracking-wide">{stop.subtitle}</span>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* ===== Top riders + Brand Championship: two-column spread ===== */}
        <section className="grid md:grid-cols-2 gap-10 md:gap-0 md:divide-x md:divide-border mb-16">
          <div className="md:pr-10">
            <SectionHead delay={480}>Top riders</SectionHead>
            <div className="rise-in grid sm:grid-cols-2 gap-8" style={{ animationDelay: '500ms' }}>
              {([['Men', ridersMenByPoints], ['Women', ridersWomenByPoints]] as const).map(([label, list]) => (
                <div key={label}>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-3">{label}</div>
                  {!list ? (
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <div className="divide-y divide-border/60">
                      {list.slice(0, 3).map((a, i) => (
                        <Link
                          key={a.name}
                          to={`/athletes/${encodeURIComponent(a.name)}`}
                          className="flex items-center gap-3 py-2.5 hover:text-primary transition-colors"
                        >
                          <span className="w-4 text-center text-xs font-mono font-bold tabular-nums text-muted-foreground shrink-0">{i + 1}</span>
                          <Avatar name={a.name} nationality={a.nationality} size={26} />
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium truncate">{a.name}</div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-sm font-display font-bold tabular-nums">{a.points.toLocaleString('en-US')}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Link to="/athletes" className="rise-in inline-flex items-center gap-1 text-sm text-primary hover:underline mt-5" style={{ animationDelay: '520ms' }}>
              See the full rider ranking →
            </Link>
          </div>

          <div className="md:pl-10">
            <SectionHead delay={520}>Kite Brands Championship</SectionHead>
            <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-3">Overall</div>
            {!brandsOverall ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <div className="divide-y divide-border/60 mb-5">
                {brandsOverall.slice(0, 3).map((b, i) => (
                  <div key={b.brand} className="flex items-center gap-3 py-2.5">
                    <span className="w-5 text-center text-xs font-mono font-bold tabular-nums text-muted-foreground shrink-0">{i + 1}</span>
                    <BrandBadge brand={b.brand} size={30} />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate text-sm">{b.brand}</div>
                      <div className="text-xs text-muted-foreground">{b.riderCount} {b.riderCount === 1 ? 'rider' : 'riders'}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-display font-bold tabular-nums text-sm">{b.points.toLocaleString('en-US')}</div>
                      <div className="text-[10px] text-muted-foreground">points</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-8">
              {([['Men', brandsMen], ['Women', brandsWomen]] as const).map(([label, list]) => (
                <div key={label}>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-3">{label}</div>
                  {!list ? (
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <div className="divide-y divide-border/60">
                      {list.slice(0, 3).map((b, i) => (
                        <div key={b.brand} className="flex items-center gap-3 py-2">
                          <span className="w-4 text-center text-xs font-mono font-bold tabular-nums text-muted-foreground shrink-0">{i + 1}</span>
                          <BrandBadge brand={b.brand} size={24} />
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium truncate">{b.brand}</div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-sm font-display font-bold tabular-nums">{b.points.toLocaleString('en-US')}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Link to="/brands" className="rise-in inline-flex items-center gap-1 text-sm text-primary hover:underline mt-5" style={{ animationDelay: '540ms' }}>
              See the full Kite Brands Championship →
            </Link>
          </div>
        </section>

        {/* ===== Tour storyline: the one deliberately elevated moment on the page ===== */}
        <section className="rise-in relative left-1/2 right-1/2 -mx-[50vw] w-screen mb-8 py-10 bg-gradient-to-b from-primary/[0.07] to-transparent border-y border-primary/20" style={{ animationDelay: '580ms' }}>
          <div className="container mx-auto max-w-6xl px-6">
            <div className="flex items-center gap-1.5 text-xs text-primary font-mono font-medium mb-5 uppercase tracking-[0.2em]">
              <Trophy className="w-3.5 h-3.5" /> Tour storyline
            </div>
            <div className="flex items-start gap-6 flex-wrap">
              <Avatar name={spotlight.name} nationality={spotlight.nationality} size={104} />
              <div className="flex-1 min-w-[220px]">
                <div className="font-display text-3xl md:text-4xl font-bold leading-none">{spotlight.name}</div>
                <div className="text-sm text-muted-foreground mt-3 max-w-md">
                  Twelve riders entered all three men's events. {spotlight.name} is the only one to reach the Final every time.
                </div>
                <div className="flex flex-wrap gap-8 mt-5">
                  {spotlight.stats.map((s) => (
                    <div key={s.label}>
                      <div className="font-display text-2xl font-bold leading-none tabular-nums">{s.value}</div>
                      <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mt-1.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:min-w-[220px]">
                {spotlight.results.map((r) => (
                  <Link
                    key={r.slug}
                    to={`/${r.slug}`}
                    className="flex items-center justify-between gap-3 border-b border-border/60 pb-2 text-xs hover:border-primary transition-colors group"
                  >
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">{r.competition}</span>
                    <span className="font-medium text-foreground whitespace-nowrap">{RESULT_ICON[r.resultLabel] ?? ''} {r.resultLabel}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== Men's / Women's storyline: two-column spread ===== */}
        <section className="grid md:grid-cols-2 gap-10 md:gap-0 md:divide-x md:divide-border mb-16">
          <div className="md:pr-10">
            <SectionHead delay={620}>Men's storyline</SectionHead>
            <p className="rise-in text-sm text-muted-foreground mb-4" style={{ animationDelay: '630ms' }}>
              Two riders closed the season with exactly {spotlightMenTie.totalWins} heat wins, reached by very different routes.
            </p>
            <div className="space-y-3">
              {spotlightMenTie.athletes.map((a) => (
                <div key={a.name} className="flex items-center gap-2.5 flex-wrap">
                  <Avatar name={a.name} nationality={a.nationality} size={26} />
                  <span className="text-sm font-medium shrink-0">{a.name}</span>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {a.results.map((r) => (
                      <Link
                        key={r.slug}
                        to={`/${r.slug}`}
                        className="text-[11px] text-muted-foreground hover:text-primary transition-colors"
                      >
                        {RESULT_ICON[r.resultLabel] && <span className="mr-0.5">{RESULT_ICON[r.resultLabel]}</span>}
                        {r.resultLabel}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:pl-10">
            <SectionHead delay={640}>Women's storyline</SectionHead>
            <p className="rise-in text-sm text-muted-foreground mb-4" style={{ animationDelay: '650ms' }}>
              The only three women to enter every event, each closed the season with exactly {spotlightWomen.totalWins} heat wins, reached by different routes.
            </p>
            <div className="space-y-3">
              {spotlightWomen.athletes.map((a) => (
                <div key={a.name} className="flex items-center gap-2.5 flex-wrap">
                  <Avatar name={a.name} nationality={a.nationality} size={26} />
                  <span className="text-sm font-medium shrink-0">{a.name}</span>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {a.results.map((r) => (
                      <Link
                        key={r.slug}
                        to={`/${r.slug}`}
                        className="text-[11px] text-muted-foreground hover:text-primary transition-colors"
                      >
                        {RESULT_ICON[r.resultLabel] && <span className="mr-0.5">{RESULT_ICON[r.resultLabel]}</span>}
                        {r.resultLabel}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Latest competition ===== */}
        <section className="mb-16">
          <SectionHead delay={680}>Latest competition</SectionHead>
          <Link to={`/${recap.divisions[0].slug}`} className="rise-in block mb-5 group w-fit" style={{ animationDelay: '700ms' }}>
            <div className="font-display text-2xl font-bold group-hover:text-primary transition-colors">{recap.competition}</div>
            <div className="text-sm text-muted-foreground mt-1">{recap.location} · {recap.date}</div>
          </Link>
          <div className="rise-in grid sm:grid-cols-2 gap-8" style={{ animationDelay: '720ms' }}>
            {recap.divisions.map((d) => (
              <div key={d.slug}>
                <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-2.5">{d.division}</div>
                <div className="space-y-2">
                  {d.podium.map((p) => (
                    <Link
                      key={p.name}
                      to={`/${d.slug}`}
                      className="flex items-center gap-2.5 text-sm hover:text-primary transition-colors"
                    >
                      <span className="w-4 text-center text-xs font-mono text-muted-foreground shrink-0">{p.placement}</span>
                      <Avatar name={p.name} nationality={p.nationality} size={24} />
                      <span className="font-medium">{p.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== By the numbers: one instrument panel, hairline-divided, not 12 boxes ===== */}
        <section>
          <SectionHead delay={760}>By the numbers</SectionHead>
          <p className="rise-in text-sm text-muted-foreground mb-6 max-w-lg" style={{ animationDelay: '770ms' }}>
            The records, the ties, and the quirks that defined the season, from the tightest margin of the year to which sponsor actually wins the most heats.
          </p>
          <div className="rise-in grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-border" style={{ animationDelay: '790ms' }}>
            {insights.map((f, i) => {
              const style = INSIGHT_STYLE[f.label] ?? { icon: Trophy };
              const Icon = style.icon;
              const composition = COMPOSITION_FOR_LABEL[f.label]?.();
              const content = (
                <div className="h-full p-5 border-r border-b border-border hover:bg-card/30 transition-colors">
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground/90 font-medium">{f.label}</span>
                  </div>
                  {composition ? (
                    <div className="mt-1">
                      <CompositionBar
                        segments={composition}
                        flags={f.label === 'Most riders, nation'}
                        unit={f.label === 'Most podiums, brand' ? 'podium spots' : 'riders total'}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="font-display text-2xl font-bold leading-tight tabular-nums">
                        <AnimatedValue value={f.value} />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 leading-snug">{f.detail}</div>
                    </>
                  )}
                </div>
              );
              const href = 'slug' in f ? `/${f.slug}` : f.to;
              return href ? (
                <Link key={f.label} to={href} className="block">
                  {content}
                </Link>
              ) : (
                <div key={f.label}>{content}</div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
