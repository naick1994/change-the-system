import type { AthleteProfile, FieldStats, Heat } from '@/types/bigAirEvent';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fmt, pct, rankOf, delta, raceStandings, roundShort, eventRounds, ordinal } from './format';
import { Avatar } from './Avatar';
import { RoundLadder } from './RoundLadder';
import { MoveChips } from './MoveChips';
import { ArrowLeft } from 'lucide-react';
import ATHLETE_BRANDS from '@/data/athleteBrands.json';

const CHART_COLORS = { result: '#f2661a', autoimp: '#2ea36b', impress: '#c9578f', score: '#f2661a' };

function DeltaTag({ value, reference, higherIsBetter, format }: { value: number; reference: number; higherIsBetter: boolean; format?: (n: number) => string }) {
  const d = delta(value, reference, higherIsBetter, format);
  return (
    <span className={d.positive ? 'text-emerald-500' : 'text-red-400'}>
      {d.text} vs field avg
    </span>
  );
}

export function AthleteDetail({
  name, names, profiles, field, winner, heats, rich, isInCompare, compareFull, onBack, onToggleCompare,
}: {
  name: string;
  names: string[];
  profiles: Record<string, AthleteProfile>;
  field: FieldStats;
  winner: string;
  heats: Heat[];
  rich: boolean;
  isInCompare: boolean;
  compareFull: boolean;
  onBack: () => void;
  onToggleCompare: () => void;
}) {
  const p: AthleteProfile = profiles[name];
  const isWinner = name === winner;
  const standing = raceStandings(names, profiles).find((s) => s.name === name)!;
  const rounds = eventRounds(heats);
  const rankKey = rich ? 'avg_total' : 'avg_score';
  // Some rich sources (e.g. Lords of Tram) don't use the Auto Imp/Impression
  // bonus at all — those fields come through as null, not 0, and must be
  // hidden rather than rendered as a fabricated zero score.
  const hasBonus = rich && field.avg_auto_imp != null;

  const chartData = p.heats.map((h) => ({
    heat: `${roundShort(h.round)} · H${h.heat_no}`,
    ...(rich ? { Result: h.result, ...(hasBonus && { 'Auto Imp': h.auto_imp, Impression: h.impression }) } : { Score: h.score }),
  }));

  const statCells: { v: string; l: string; d?: JSX.Element }[] = rich
    ? [
        { v: `${p.wins}/${p.n_heats}`, l: 'Heats won / played' },
        { v: pct(p.crash_rate!), l: `Crash rate (${p.total_crashes}/${p.total_attempts} attempts)`, d: <DeltaTag value={p.crash_rate!} reference={field.crash_rate!} higherIsBetter={false} format={pct} /> },
        { v: fmt(p.avg_result!), l: hasBonus ? 'Avg result (top-3 moves)' : 'Avg result', d: <DeltaTag value={p.avg_result!} reference={field.avg_result!} higherIsBetter /> },
        ...(hasBonus
          ? [
              { v: fmt(p.avg_auto_imp!), l: 'Avg variety (/7)', d: <DeltaTag value={p.avg_auto_imp!} reference={field.avg_auto_imp!} higherIsBetter /> },
              { v: fmt(p.avg_impression!), l: 'Avg impression (/3)', d: <DeltaTag value={p.avg_impression!} reference={field.avg_impression!} higherIsBetter /> },
            ]
          : []),
        { v: fmt(p.avg_total!), l: hasBonus ? 'Avg heat total' : 'Avg heat total (= avg result, no bonus)', d: <DeltaTag value={p.avg_total!} reference={field.avg_total!} higherIsBetter /> },
        { v: fmt(p.best_total!), l: 'Best heat total' },
        { v: fmt(p.best_move!), l: 'Best single move' },
        { v: fmt(p.stdev_total!), l: 'Std. dev of totals (consistency, lower = steadier)' },
      ]
    : [
        { v: `${p.wins}/${p.n_heats}`, l: 'Heats won / played' },
        { v: fmt(p.avg_score!), l: 'Avg heat score', d: <DeltaTag value={p.avg_score!} reference={field.avg_score!} higherIsBetter /> },
        { v: fmt(p.best_score!), l: 'Best heat score' },
        { v: fmt(p.stdev_score!), l: 'Std. dev of scores (consistency, lower = steadier)' },
      ];

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 -ml-2">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to leaderboard
      </Button>

      <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
        <div className="flex items-center gap-4">
          <Avatar name={name} nationality={p.nationality} size={64} />
          <div>
            <h2 className="font-display text-2xl font-bold">
              {name}
              {ATHLETE_BRANDS[name as keyof typeof ATHLETE_BRANDS] && (
                <span className="text-sm text-muted-foreground font-normal ml-2">
                  · {ATHLETE_BRANDS[name as keyof typeof ATHLETE_BRANDS]}
                </span>
              )}
            </h2>
            <div className={`text-sm font-medium mt-0.5 ${standing.rank <= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
              {standing.resultLabel}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">{p.n_heats} heats played</div>
          </div>
        </div>
        <div className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground">
          #{rankOf(names, profiles, name, rankKey, true)} of {names.length} by stats average
        </div>
      </div>

      <Card className="p-4 mb-6 flex items-center justify-center overflow-x-auto">
        <RoundLadder
          rounds={rounds}
          athleteHeats={p.heats}
          reachedDepth={p.max_round_depth}
          won={isWinner}
        />
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {statCells.map((c) => (
          <Card key={c.l} className="p-4">
            <div className="text-xl font-bold tabular-nums">{c.v}</div>
            <div className="text-xs text-muted-foreground mt-1 leading-snug">{c.l}</div>
            {c.d && <div className="text-xs mt-1.5">{c.d}</div>}
          </Card>
        ))}
      </div>

      {!isWinner && (
        <Card className="p-4 mb-8 text-sm text-muted-foreground">
          {rich ? (
            <>
              <strong className="text-foreground">Vs the event winner ({winner}):</strong> avg total {fmt(p.avg_total!)} vs {fmt(profiles[winner].avg_total!)}
              {hasBonus && <> · variety {fmt(p.avg_auto_imp!)} vs {fmt(profiles[winner].avg_auto_imp!)}</>}
              {' · '}crash rate {pct(p.crash_rate!)} vs {pct(profiles[winner].crash_rate!)}
            </>
          ) : (
            <>
              <strong className="text-foreground">Vs the event winner ({winner}):</strong> avg score {fmt(p.avg_score!)} vs {fmt(profiles[winner].avg_score!)}
            </>
          )}
        </Card>
      )}

      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Score breakdown, heat by heat</h3>
      <Card className="p-4 mb-8 h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="heat" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {rich ? (
              hasBonus ? (
                <>
                  <Bar dataKey="Result" stackId="s" fill={CHART_COLORS.result} />
                  <Bar dataKey="Auto Imp" stackId="s" fill={CHART_COLORS.autoimp} />
                  <Bar dataKey="Impression" stackId="s" fill={CHART_COLORS.impress} radius={[4, 4, 0, 0]} />
                </>
              ) : (
                <Bar dataKey="Result" fill={CHART_COLORS.result} radius={[4, 4, 0, 0]} />
              )
            ) : (
              <Bar dataKey="Score" fill={CHART_COLORS.score} radius={[4, 4, 0, 0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">All heats played</h3>
      <div className="space-y-3 mb-8">
        {p.heats.map((h) => (
          <div key={h.heat_no} className="border border-border rounded-lg p-3">
            <div className="flex items-center gap-3 flex-wrap mb-2.5">
              <div className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${h.placement === 1 ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
                {ordinal(h.placement)}
              </div>
              <div className="text-xs text-muted-foreground shrink-0">{roundShort(h.round)} · Heat {h.heat_no}</div>
              <div className="flex items-center gap-2 flex-wrap flex-1 min-w-[120px]">
                {h.opponents.map((opp) => (
                  <div key={opp} className="flex items-center gap-1.5">
                    <Avatar name={opp} nationality={profiles[opp]?.nationality ?? ''} size={20} />
                    <span className="text-xs text-muted-foreground">{opp}</span>
                  </div>
                ))}
              </div>
              <div className="text-right shrink-0">
                <div className="font-display text-lg font-bold leading-none tabular-nums">{fmt((rich ? h.total : h.score) ?? 0)}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{rich ? 'total' : 'score'}</div>
              </div>
            </div>

            {rich && (
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs tabular-nums text-muted-foreground">
                <span>Result <b className="text-foreground">{fmt(h.result!)}</b></span>
                {hasBonus && (
                  <>
                    <span>Auto Imp <b className="text-foreground">{h.auto_imp}</b></span>
                    <span>Impr. <b className="text-foreground">{fmt(h.impression!)}</b></span>
                  </>
                )}
                <span className={h.crashes! > 0 ? 'text-red-400' : 'text-emerald-500'}>{h.crashes} crash{h.crashes !== 1 ? 'es' : ''}</span>
              </div>
            )}

            {rich && h.moves && (
              <div className="mt-2 pt-2 border-t border-border/60">
                <MoveChips moves={h.moves} />
              </div>
            )}
          </div>
        ))}
      </div>

      <Button
        variant={isInCompare ? 'secondary' : 'default'}
        onClick={onToggleCompare}
        disabled={!isInCompare && compareFull}
      >
        {isInCompare ? '✓ Added to compare' : '+ Add to compare'}
      </Button>
    </div>
  );
}
