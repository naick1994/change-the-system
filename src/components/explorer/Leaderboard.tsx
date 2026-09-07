import { useState } from 'react';
import type { AthleteProfile } from '@/types/bigAirEvent';
import { Avatar } from './Avatar';
import { RaceStandings } from './RaceStandings';
import { fmt, pct, roundShort } from './format';
import { ArrowUpDown } from 'lucide-react';

type SortKey = keyof Pick<
  AthleteProfile,
  'avg_total' | 'avg_result' | 'avg_auto_imp' | 'avg_impression' | 'crash_rate' | 'wins' | 'avg_score' | 'best_score'
>;
type View = 'result' | 'stats';
type Column = { key: SortKey; label: string; higherIsBetter: boolean; format: (v: number) => string };

const RICH_COLUMNS: Column[] = [
  { key: 'avg_total', label: 'Avg total', higherIsBetter: true, format: (v) => fmt(v) },
  { key: 'avg_result', label: 'Avg result', higherIsBetter: true, format: (v) => fmt(v) },
  { key: 'avg_auto_imp', label: 'Avg variety', higherIsBetter: true, format: (v) => fmt(v) },
  { key: 'avg_impression', label: 'Avg impression', higherIsBetter: true, format: (v) => fmt(v) },
  { key: 'crash_rate', label: 'Crash rate', higherIsBetter: false, format: (v) => pct(v) },
  { key: 'wins', label: 'Heat wins', higherIsBetter: true, format: (v) => String(v) },
];

// Rich schema, but no Auto Imp/Impression bonus at this source (e.g. Lords
// of Tram) — those columns would just be a wall of "null"s, and avg_result
// is dropped since it's numerically identical to avg_total here.
const RICH_NO_BONUS_COLUMNS: Column[] = [
  { key: 'avg_total', label: 'Avg total', higherIsBetter: true, format: (v) => fmt(v) },
  { key: 'crash_rate', label: 'Crash rate', higherIsBetter: false, format: (v) => pct(v) },
  { key: 'wins', label: 'Heat wins', higherIsBetter: true, format: (v) => String(v) },
];

const REDUCED_COLUMNS: Column[] = [
  { key: 'avg_score', label: 'Avg score', higherIsBetter: true, format: (v) => fmt(v) },
  { key: 'best_score', label: 'Best score', higherIsBetter: true, format: (v) => fmt(v) },
  { key: 'wins', label: 'Heat wins', higherIsBetter: true, format: (v) => String(v) },
];

export function Leaderboard({
  names, profiles, winner, rich, hasBonus, onSelectAthlete,
}: {
  names: string[];
  profiles: Record<string, AthleteProfile>;
  winner: string;
  rich: boolean;
  hasBonus: boolean;
  onSelectAthlete: (name: string) => void;
}) {
  const columns = rich ? (hasBonus ? RICH_COLUMNS : RICH_NO_BONUS_COLUMNS) : REDUCED_COLUMNS;
  const [view, setView] = useState<View>('result');
  const [sortKey, setSortKey] = useState<SortKey>(columns[0].key);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sorted = [...names].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    return ((profiles[a][sortKey] as number) - (profiles[b][sortKey] as number)) * dir;
  });

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  return (
    <div>
      <div className="flex items-center gap-6 border-b border-border pb-3 mb-4">
        <button
          type="button"
          onClick={() => setView('result')}
          className={`text-sm pb-3 -mb-3 border-b-2 transition-colors ${view === 'result' ? 'border-primary text-foreground font-medium' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Result
        </button>
        <button
          type="button"
          onClick={() => setView('stats')}
          className={`text-sm pb-3 -mb-3 border-b-2 transition-colors ${view === 'stats' ? 'border-primary text-foreground font-medium' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Stats
        </button>
      </div>

      {view === 'result' ? (
        <>
          <p className="text-xs text-muted-foreground mb-3">
            How the competition actually finished, ranked by how far each athlete got in the bracket.
          </p>
          <RaceStandings names={names} profiles={profiles} onSelectAthlete={onSelectAthlete} />
        </>
      ) : (
        <>
          <p className="text-xs text-muted-foreground mb-3">
            Ranked by heat-scoring averages across the event. This can disagree with the actual result above
            (e.g. a strong average over more heats vs. a lower-scoring heat win in the final).
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-t border-border">
                  <th className="text-left font-semibold px-3 py-2.5 sticky left-0 bg-background">#</th>
                  <th className="text-left font-semibold px-3 py-2.5">Athlete</th>
                  {columns.map((col) => (
                    <th key={col.key} className="text-right font-semibold px-3 py-2.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => toggleSort(col.key)}
                        className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        {col.label}
                        <ArrowUpDown className="w-3 h-3 opacity-50" />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((name, i) => {
                  const p = profiles[name];
                  const isWinner = name === winner;
                  return (
                    <tr
                      key={name}
                      className="border-b border-border last:border-0 hover:bg-card/40 cursor-pointer transition-colors"
                      onClick={() => onSelectAthlete(name)}
                    >
                      <td className="px-3 py-2.5 text-muted-foreground sticky left-0 bg-background">{i + 1}</td>
                      <td className="px-3 py-2.5 font-medium">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={name} nationality={p.nationality} size={30} />
                          <div>
                            {name}
                            {isWinner && <span className="ml-1.5 text-primary">🏆</span>}
                            <div className="text-xs text-muted-foreground font-normal">{p.nationality} · {roundShort(p.max_round)}</div>
                          </div>
                        </div>
                      </td>
                      {columns.map((col) => (
                        <td key={col.key} className="px-3 py-2.5 text-right tabular-nums">
                          {col.format(p[col.key] as number)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
