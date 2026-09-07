import type { AthleteProfile } from '@/types/bigAirEvent';
import { Avatar } from './Avatar';
import { raceStandings } from './format';

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export function RaceStandings({
  names, profiles, onSelectAthlete,
}: {
  names: string[];
  profiles: Record<string, AthleteProfile>;
  onSelectAthlete: (name: string) => void;
}) {
  const rows = raceStandings(names, profiles);

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {rows.map((row) => (
        <button
          key={row.name}
          type="button"
          onClick={() => onSelectAthlete(row.name)}
          className="w-full flex items-center gap-3 px-3 py-2.5 border-b border-border last:border-0 hover:bg-card/40 transition-colors text-left"
        >
          <span className="w-8 shrink-0 text-center font-bold tabular-nums text-muted-foreground">
            {MEDAL[row.rank] ?? row.rank}
          </span>
          <Avatar name={row.name} nationality={profiles[row.name].nationality} size={36} />
          <div className="min-w-0 flex-1">
            <div className="font-medium truncate">{row.name}</div>
            <div className="text-xs text-muted-foreground">{profiles[row.name].nationality}</div>
          </div>
          <span className={`text-xs sm:text-sm font-medium shrink-0 ${row.rank <= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
            {row.resultLabel}
          </span>
        </button>
      ))}
    </div>
  );
}
