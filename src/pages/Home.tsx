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
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/explorer/Avatar';
import { BrandBadge } from '@/components/BrandBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { flagEmoji } from '@/components/explorer/format';
import ATHLETE_BRANDS from '@/data/athleteBrands.json';
import { useCountUp } from '@/hooks/useCountUp';
import { Users, Flame, Globe2, Trophy, Swords, Wind, Award, Zap, Sparkles, ShieldCheck, Repeat, Scale, type LucideIcon } from 'lucide-react';

const STAT_ICONS = { competitions: Trophy, uniqueRiders: Users, heats: Flame, countries: Globe2 };
const RESULT_ICON: Record<string, string> = { Champion: '🏆', 'Runner-up': '🥈', '2nd place': '🥈', '3rd place': '🥉' };

const INSIGHT_STYLE: Record<string, { icon: LucideIcon; color: string }> = {
  'Tightest heat of the season': { icon: Swords, color: 'text-red-400 bg-red-400/10' },
  'Wipeouts this season': { icon: Flame, color: 'text-orange-400 bg-orange-400/10' },
  'Most riders, nation': { icon: Globe2, color: 'text-sky-400 bg-sky-400/10' },
  'Most event wins, nation': { icon: Trophy, color: 'text-amber-400 bg-amber-400/10' },
  'Most riders, brand': { icon: Wind, color: 'text-emerald-400 bg-emerald-400/10' },
  'Most podiums, brand': { icon: Award, color: 'text-violet-400 bg-violet-400/10' },
  'Biggest blowout': { icon: Zap, color: 'text-yellow-400 bg-yellow-400/10' },
  "Season's biggest trick": { icon: Sparkles, color: 'text-fuchsia-400 bg-fuchsia-400/10' },
  'Most consistent rider': { icon: ShieldCheck, color: 'text-teal-400 bg-teal-400/10' },
  'Longest win streak': { icon: Repeat, color: 'text-lime-400 bg-lime-400/10' },
  'Most balanced event': { icon: Scale, color: 'text-cyan-400 bg-cyan-400/10' },
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
      <div className="text-xs text-muted-foreground mb-2">{total} {unit}</div>
      <div className="flex h-2 rounded-full overflow-hidden bg-muted">
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

function StatCard({ icon: Icon, value, label, delay }: { icon: typeof Trophy; value: number; label: string; delay: number }) {
  const animated = useCountUp(value);
  return (
    <div className="rise-in bg-card px-4 py-3.5 flex items-center gap-3" style={{ animationDelay: `${delay}ms` }}>
      <Icon className="w-5 h-5 text-primary shrink-0" />
      <div>
        <div className="font-display text-xl font-bold tabular-nums">{animated}</div>
        <div className="text-xs text-muted-foreground leading-snug">{label}</div>
      </div>
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

  const stats: { key: keyof typeof STAT_ICONS; value: number; label: string }[] = [
    { key: 'competitions', value: totals.competitions, label: 'Competitions' },
    { key: 'uniqueRiders', value: totals.uniqueRiders, label: 'Unique riders' },
    { key: 'heats', value: totals.heats, label: 'Heats analyzed' },
    { key: 'countries', value: totals.countries, label: 'Countries represented' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 max-w-4xl py-16">
        <h1 className="rise-in font-display text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ animationDelay: '60ms' }}>
          Where kitesurf data <span className="text-primary">tells the story.</span>
        </h1>
        <p className="rise-in text-muted-foreground max-w-xl mb-10 leading-relaxed" style={{ animationDelay: '120ms' }}>
          Every Big Air competition, broken down heat by heat. Leaderboards that show what actually
          happened, athlete profiles built for riders instead of statisticians, and head-to-head
          comparisons that turn raw scores into real insight.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border border border-border rounded-lg overflow-hidden mb-4">
          {stats.map((s, i) => (
            <StatCard key={s.key} icon={STAT_ICONS[s.key]} value={s.value} label={s.label} delay={220 + i * 70} />
          ))}
        </div>

        <div className="rise-in mb-10 flex flex-wrap gap-1.5" style={{ animationDelay: '380ms' }}>
          {countries.map((c) => (
            <span key={c} title={c} className="text-lg leading-none opacity-90 hover:opacity-100 hover:scale-125 transition-transform">
              {flagEmoji(c)}
            </span>
          ))}
        </div>

        <div className="rise-in mb-10 p-5 rounded-lg border border-dashed border-border bg-card/30" style={{ animationDelay: '440ms' }}>
          <div className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground mb-4">Three stops, one season</div>
          <div className="relative flex items-start justify-between">
            <div className="absolute top-[7px] left-0 right-0 h-px bg-border" />
            {timeline.map((stop) => (
              <Link
                key={stop.slug}
                to={`/${stop.slug}`}
                className="relative flex-1 flex flex-col items-center text-center px-1 group"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-primary border-4 border-background z-10 group-hover:scale-125 transition-transform" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-3">{stop.month}</span>
                <span className="text-sm font-display font-bold mt-1">{stop.competition.replace(' (GKA France) 2026', '').replace(' 2026', '')}</span>
                <span className="text-xs text-muted-foreground mt-1 group-hover:text-primary transition-colors">🏆 {stop.winner}</span>
                {stop.subtitle && (
                  <span className="text-[10px] font-semibold text-primary mt-1 uppercase tracking-wide">{stop.subtitle}</span>
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="h-px mb-10 bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="rise-in mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground" style={{ animationDelay: '460ms' }}>
          Top riders
        </div>
        <Card className="rise-in p-5 mb-10" style={{ animationDelay: '470ms' }}>
          <div className="grid sm:grid-cols-2 gap-6">
            {([['Men', ridersMenByPoints], ['Women', ridersWomenByPoints]] as const).map(([label, list]) => (
              <div key={label}>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">{label}</div>
                {!list ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <div className="space-y-1">
                    {list.slice(0, 3).map((a, i) => (
                      <Link
                        key={a.name}
                        to={`/athletes/${encodeURIComponent(a.name)}`}
                        className="flex items-center gap-3 py-1.5 -mx-1 px-1 rounded hover:bg-card/40 transition-colors"
                      >
                        <span className="w-4 text-center text-xs font-bold tabular-nums text-muted-foreground shrink-0">{i + 1}</span>
                        <Avatar name={a.name} nationality={a.nationality} size={28} />
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
          <Link to="/athletes" className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-4">
            See the full rider ranking →
          </Link>
        </Card>

        <div className="rise-in mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground" style={{ animationDelay: '480ms' }}>
          Kite Brands Championship
        </div>
        <Card className="rise-in p-5 mb-10" style={{ animationDelay: '490ms' }}>
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Overall</div>
          {!brandsOverall ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="space-y-1">
              {brandsOverall.slice(0, 3).map((b, i) => (
                <div key={b.brand} className="flex items-center gap-3 py-1.5">
                  <span className="w-5 text-center text-sm font-bold tabular-nums text-muted-foreground shrink-0">{i + 1}</span>
                  <BrandBadge brand={b.brand} size={32} />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{b.brand}</div>
                    <div className="text-xs text-muted-foreground">{b.riderCount} {b.riderCount === 1 ? 'rider' : 'riders'}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-display font-bold tabular-nums">{b.points.toLocaleString('en-US')}</div>
                    <div className="text-[11px] text-muted-foreground">points</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="h-px my-5 bg-border" />

          <div className="grid sm:grid-cols-2 gap-6">
            {([['Men', brandsMen], ['Women', brandsWomen]] as const).map(([label, list]) => (
              <div key={label}>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">{label}</div>
                {!list ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <div className="space-y-1">
                    {list.slice(0, 3).map((b, i) => (
                      <div key={b.brand} className="flex items-center gap-3 py-1.5">
                        <span className="w-4 text-center text-xs font-bold tabular-nums text-muted-foreground shrink-0">{i + 1}</span>
                        <BrandBadge brand={b.brand} size={28} />
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
          <Link to="/brands" className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-4">
            See the full Kite Brands Championship →
          </Link>
        </Card>

        <div className="h-px mb-10 bg-gradient-to-r from-transparent via-border to-transparent" />

        <Card className="rise-in p-5 mb-4 border-primary/30" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center gap-1.5 text-xs text-primary font-medium mb-3 uppercase tracking-wide">
            <Trophy className="w-3.5 h-3.5" /> Tour storyline
          </div>
          <div className="flex items-center gap-5 flex-wrap">
            <Avatar name={spotlight.name} nationality={spotlight.nationality} size={88} />
            <div className="flex-1 min-w-[180px]">
              <div className="font-display text-2xl font-bold">{spotlight.name}</div>
              <div className="text-sm text-muted-foreground mt-1 max-w-md">
                Twelve riders entered all three men's events. {spotlight.name} is the only one to reach the Final every time.
              </div>
              <div className="flex flex-wrap gap-4 mt-3">
                {spotlight.stats.map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-lg font-bold leading-none">{s.value}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {spotlight.results.map((r) => (
                <Link
                  key={r.slug}
                  to={`/${r.slug}`}
                  className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <span>{RESULT_ICON[r.resultLabel] ?? '•'}</span>
                  <span className="text-muted-foreground">{r.competition}</span>
                  <span className="font-medium text-foreground">{r.resultLabel}</span>
                </Link>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <Card className="rise-in p-5 border-primary/30 h-full" style={{ animationDelay: '530ms' }}>
            <div className="flex items-center gap-1.5 text-xs text-primary font-medium mb-3 uppercase tracking-wide">
              <Trophy className="w-3.5 h-3.5" /> Men's storyline
            </div>
            <div className="text-sm text-muted-foreground mb-3">
              Two riders closed the season with exactly {spotlightMenTie.totalWins} heat wins, reached by very different routes.
            </div>
            <div className="space-y-2.5">
              {spotlightMenTie.athletes.map((a) => (
                <div key={a.name} className="flex items-center gap-2.5 flex-wrap">
                  <Avatar name={a.name} nationality={a.nationality} size={28} />
                  <span className="text-sm font-medium shrink-0">{a.name}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {a.results.map((r) => (
                      <Link
                        key={r.slug}
                        to={`/${r.slug}`}
                        className="flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[11px] hover:border-primary hover:bg-primary/5 transition-colors"
                      >
                        {RESULT_ICON[r.resultLabel] && <span>{RESULT_ICON[r.resultLabel]}</span>}
                        <span className="text-foreground">{r.resultLabel}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rise-in p-5 border-primary/30 h-full" style={{ animationDelay: '560ms' }}>
            <div className="flex items-center gap-1.5 text-xs text-primary font-medium mb-3 uppercase tracking-wide">
              <Trophy className="w-3.5 h-3.5" /> Women's storyline
            </div>
            <div className="text-sm text-muted-foreground mb-3">
              The only three women to enter every event, each closed the season with exactly {spotlightWomen.totalWins} heat wins, reached by different routes.
            </div>
            <div className="space-y-2.5">
              {spotlightWomen.athletes.map((a) => (
                <div key={a.name} className="flex items-center gap-2.5 flex-wrap">
                  <Avatar name={a.name} nationality={a.nationality} size={28} />
                  <span className="text-sm font-medium shrink-0">{a.name}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {a.results.map((r) => (
                      <Link
                        key={r.slug}
                        to={`/${r.slug}`}
                        className="flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[11px] hover:border-primary hover:bg-primary/5 transition-colors"
                      >
                        {RESULT_ICON[r.resultLabel] && <span>{RESULT_ICON[r.resultLabel]}</span>}
                        <span className="text-foreground">{r.resultLabel}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="h-px mb-10 bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="rise-in mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground" style={{ animationDelay: '620ms' }}>
          Latest competition
        </div>
        <Card className="rise-in p-5 mb-10" style={{ animationDelay: '640ms' }}>
          <Link to={`/${recap.divisions[0].slug}`} className="block mb-4 group w-fit">
            <div className="font-display text-xl font-bold group-hover:text-primary transition-colors">{recap.competition}</div>
            <div className="text-sm text-muted-foreground">{recap.location} · {recap.date}</div>
          </Link>
          <div className="grid sm:grid-cols-2 gap-5">
            {recap.divisions.map((d) => (
              <div key={d.slug}>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">{d.division}</div>
                <div className="space-y-1.5">
                  {d.podium.map((p) => (
                    <Link
                      key={p.name}
                      to={`/${d.slug}`}
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                    >
                      <span className="w-4 text-center text-xs text-muted-foreground shrink-0">{p.placement}</span>
                      <Avatar name={p.name} nationality={p.nationality} size={24} />
                      <span className="font-medium">{p.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>


        <div className="rise-in mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground" style={{ animationDelay: '740ms' }}>
          By the numbers
        </div>
        <p className="rise-in text-sm text-muted-foreground mb-4 max-w-lg" style={{ animationDelay: '760ms' }}>
          The records, the ties, and the quirks that defined the season, from the tightest margin of the year to which sponsor actually wins the most heats.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {insights.map((f, i) => {
            const style = INSIGHT_STYLE[f.label] ?? { icon: Trophy, color: 'text-primary bg-primary/10' };
            const Icon = style.icon;
            const composition = COMPOSITION_FOR_LABEL[f.label]?.();
            const content = (
              <Card className="p-4 h-full">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-3 ${style.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-sm text-foreground/90 font-medium">{f.label}</div>
                {composition ? (
                  <div className="mt-2.5">
                    <CompositionBar
                      segments={composition}
                      flags={f.label === 'Most riders, nation'}
                      unit={f.label === 'Most podiums, brand' ? 'podium spots' : 'riders total'}
                    />
                  </div>
                ) : (
                  <>
                    <div className="font-display text-xl font-bold leading-tight mt-1 tabular-nums">
                      <AnimatedValue value={f.value} />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 leading-snug">{f.detail}</div>
                  </>
                )}
              </Card>
            );
            const href = 'slug' in f ? `/${f.slug}` : f.to;
            return href ? (
              <Link
                key={f.label}
                to={href}
                className="rise-in block hover:-translate-y-0.5 transition-transform"
                style={{ animationDelay: `${800 + i * 70}ms` }}
              >
                {content}
              </Link>
            ) : (
              <div key={f.label} className="rise-in" style={{ animationDelay: `${800 + i * 70}ms` }}>
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
