import type { AthleteProfile } from '@/types/bigAirEvent';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { fmt, pct, delta, roundShort } from './format';
import { Avatar } from './Avatar';
import { ChevronDown, Users } from 'lucide-react';

const COLOR_A = '#f2661a';
const COLOR_B = '#3987e5';

type Metric = { key: keyof AthleteProfile; label: string; higherIsBetter: boolean };
type TableRow = { key: keyof AthleteProfile; label: string; format: (v: number) => string; higherIsBetter: boolean };

const RICH_RADAR_METRICS: Metric[] = [
  { key: 'avg_result', label: 'Result', higherIsBetter: true },
  { key: 'avg_auto_imp', label: 'Variety', higherIsBetter: true },
  { key: 'avg_impression', label: 'Impression', higherIsBetter: true },
  { key: 'avg_total', label: 'Total', higherIsBetter: true },
  { key: 'crash_rate', label: 'Consistency', higherIsBetter: false },
];

const RICH_TABLE_ROWS: TableRow[] = [
  { key: 'avg_total', label: 'Avg heat total', format: (v) => fmt(v), higherIsBetter: true },
  { key: 'avg_result', label: 'Avg result', format: (v) => fmt(v), higherIsBetter: true },
  { key: 'avg_auto_imp', label: 'Avg variety', format: (v) => fmt(v), higherIsBetter: true },
  { key: 'avg_impression', label: 'Avg impression', format: (v) => fmt(v), higherIsBetter: true },
  { key: 'crash_rate', label: 'Crash rate', format: (v) => pct(v), higherIsBetter: false },
  { key: 'wins', label: 'Heat wins', format: (v) => String(v), higherIsBetter: true },
  { key: 'best_total', label: 'Best heat total', format: (v) => fmt(v), higherIsBetter: true },
  { key: 'stdev_total', label: 'Std. dev (consistency)', format: (v) => fmt(v), higherIsBetter: false },
];

// Rich schema, no Auto Imp/Impression bonus at this source — avg_result is
// dropped too since it's numerically identical to avg_total here.
const RICH_NO_BONUS_RADAR_METRICS: Metric[] = [
  { key: 'avg_total', label: 'Result', higherIsBetter: true },
  { key: 'best_move', label: 'Best move', higherIsBetter: true },
  { key: 'wins', label: 'Heat wins', higherIsBetter: true },
  { key: 'crash_rate', label: 'Consistency', higherIsBetter: false },
];

const RICH_NO_BONUS_TABLE_ROWS: TableRow[] = [
  { key: 'avg_total', label: 'Avg heat total', format: (v) => fmt(v), higherIsBetter: true },
  { key: 'crash_rate', label: 'Crash rate', format: (v) => pct(v), higherIsBetter: false },
  { key: 'wins', label: 'Heat wins', format: (v) => String(v), higherIsBetter: true },
  { key: 'best_total', label: 'Best heat total', format: (v) => fmt(v), higherIsBetter: true },
  { key: 'stdev_total', label: 'Std. dev (consistency)', format: (v) => fmt(v), higherIsBetter: false },
];

const REDUCED_RADAR_METRICS: Metric[] = [
  { key: 'avg_score', label: 'Avg score', higherIsBetter: true },
  { key: 'best_score', label: 'Best score', higherIsBetter: true },
  { key: 'wins', label: 'Heat wins', higherIsBetter: true },
  { key: 'stdev_score', label: 'Consistency', higherIsBetter: false },
];

const REDUCED_TABLE_ROWS: TableRow[] = [
  { key: 'avg_score', label: 'Avg heat score', format: (v) => fmt(v), higherIsBetter: true },
  { key: 'best_score', label: 'Best heat score', format: (v) => fmt(v), higherIsBetter: true },
  { key: 'wins', label: 'Heat wins', format: (v) => String(v), higherIsBetter: true },
  { key: 'stdev_score', label: 'Std. dev (consistency)', format: (v) => fmt(v), higherIsBetter: false },
];

// Normalizes a metric to 0-100 against the field's min/max, so very
// different scales (e.g. a 0-3 impression score and a 0-40 total) sit on
// the same radar axis. Lower-is-better metrics are inverted so "further
// out" always reads as "better" on every axis.
function normalize(value: number, names: string[], profiles: Record<string, AthleteProfile>, key: keyof AthleteProfile, higherIsBetter: boolean): number {
  const vals = names.map((n) => profiles[n][key] as number);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  if (max === min) return 50;
  const pctVal = ((value - min) / (max - min)) * 100;
  return higherIsBetter ? pctVal : 100 - pctVal;
}

function SlotPicker({
  label, color, options, onPick,
}: {
  label: string;
  color: string;
  options: string[];
  onPick: (name: string) => void;
}) {
  return (
    <Card className="p-4 border-dashed relative" style={{ borderColor: `${color}80` }}>
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-4 h-4" style={{ color }} />
        <span className="text-sm font-medium" style={{ color }}>{label}</span>
      </div>
      <div className="relative">
        <select
          value=""
          onChange={(e) => e.target.value && onPick(e.target.value)}
          className="w-full appearance-none bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="" disabled>Pick an athlete…</option>
          {options.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </Card>
  );
}

export function Compare({
  names, profiles, compare, rich, hasBonus, onRemove, onSelectSlot,
}: {
  names: string[];
  profiles: Record<string, AthleteProfile>;
  compare: string[];
  rich: boolean;
  hasBonus: boolean;
  onRemove: (name: string) => void;
  onSelectSlot: (slot: 0 | 1, name: string) => void;
}) {
  const [nameA, nameB] = compare;
  const sortedNames = [...names].sort((a, b) => a.localeCompare(b));

  const slots = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      {([0, 1] as const).map((slot) => {
        const name = compare[slot];
        const color = slot === 0 ? COLOR_A : COLOR_B;
        if (!name) {
          const otherName = compare[slot === 0 ? 1 : 0];
          return (
            <SlotPicker
              key={slot}
              label={slot === 0 ? 'Athlete A' : 'Athlete B'}
              color={color}
              options={sortedNames.filter((n) => n !== otherName)}
              onPick={(n) => onSelectSlot(slot, n)}
            />
          );
        }
        const p = profiles[name];
        return (
          <Card key={slot} className="p-4" style={{ borderColor: color }}>
            <div className="flex items-center gap-3">
              <Avatar name={name} nationality={p.nationality} size={40} />
              <div>
                <div className="font-semibold" style={{ color }}>{name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{p.wins}/{p.n_heats} won · {roundShort(p.max_round)}</div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="mt-2 -ml-2 text-xs h-7" onClick={() => onRemove(name)}>Change</Button>
          </Card>
        );
      })}
    </div>
  );

  if (!nameA || !nameB) {
    return (
      <div>
        {slots}
        <Card className="p-8 text-center">
          <p className="text-sm text-muted-foreground">Pick two athletes above to compare them head-to-head.</p>
        </Card>
      </div>
    );
  }

  const A = profiles[nameA];
  const B = profiles[nameB];
  const radarMetrics = rich ? (hasBonus ? RICH_RADAR_METRICS : RICH_NO_BONUS_RADAR_METRICS) : REDUCED_RADAR_METRICS;
  const tableRows = rich ? (hasBonus ? RICH_TABLE_ROWS : RICH_NO_BONUS_TABLE_ROWS) : REDUCED_TABLE_ROWS;

  const radarData = radarMetrics.map((m) => ({
    metric: m.label,
    [nameA]: normalize(A[m.key] as number, names, profiles, m.key, m.higherIsBetter),
    [nameB]: normalize(B[m.key] as number, names, profiles, m.key, m.higherIsBetter),
  }));

  return (
    <div>
      {slots}

      <Card className="p-4 mb-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left font-semibold px-2 py-2">Metric</th>
              <th className="text-right font-semibold px-2 py-2" style={{ color: COLOR_A }}>{nameA}</th>
              <th className="text-right font-semibold px-2 py-2" style={{ color: COLOR_B }}>{nameB}</th>
              <th className="text-right font-semibold px-2 py-2">Delta</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row) => {
              const va = A[row.key] as number;
              const vb = B[row.key] as number;
              const d = delta(va, vb, row.higherIsBetter, row.format);
              return (
                <tr key={row.key} className="border-b border-border last:border-0">
                  <td className="px-2 py-2 text-muted-foreground">{row.label}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{row.format(va)}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{row.format(vb)}</td>
                  <td className={`px-2 py-2 text-right tabular-nums ${d.positive ? 'text-emerald-500' : 'text-red-400'}`}>{d.text}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3 text-center">Overall profile (normalized against the field)</h3>
      <Card className="p-4 h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
            <Radar name={nameA} dataKey={nameA} stroke={COLOR_A} fill={COLOR_A} fillOpacity={0.25} />
            <Radar name={nameB} dataKey={nameB} stroke={COLOR_B} fill={COLOR_B} fillOpacity={0.25} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
          </RadarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
