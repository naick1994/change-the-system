import type { Heat, AthleteProfile } from '@/types/bigAirEvent';
import { Card } from '@/components/ui/card';
import { Avatar } from './Avatar';
import { eventRounds, fmt } from './format';

export function Bracket({
  heats, profiles, onSelectAthlete, onSelectHeat,
}: {
  heats: Heat[];
  profiles: Record<string, AthleteProfile>;
  onSelectAthlete: (name: string) => void;
  onSelectHeat: (heatNo: number) => void;
}) {
  const groups = eventRounds(heats).map(({ depth, label }) => ({
    round: label,
    heats: heats.filter((h) => h.round_depth === depth).sort((a, b) => a.heat_no - b.heat_no),
  }));

  return (
    <div className="space-y-8">
      {groups.map((g) => (
        <div key={g.round}>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            {g.round} <span className="text-muted-foreground/60 font-normal normal-case">· {g.heats.length} heat{g.heats.length !== 1 ? 's' : ''}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {g.heats.map((h) => (
              <Card
                key={h.heat_no}
                className="p-3 cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => onSelectHeat(h.heat_no)}
              >
                <div className="text-xs text-muted-foreground mb-2">Heat {h.heat_no}</div>
                <div className="space-y-1">
                  {[...h.participants]
                    .sort((a, b) => a.placement - b.placement)
                    .map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAthlete(p.name);
                        }}
                        className="w-full flex items-center gap-2 rounded px-1.5 py-1 text-sm hover:bg-card/60 transition-colors text-left"
                      >
                        <Avatar name={p.name} nationality={profiles[p.name]?.nationality ?? ''} size={22} />
                        <span className={`flex-1 min-w-0 truncate ${p.placement === 1 ? 'font-semibold' : 'text-muted-foreground'}`}>
                          {p.name}
                        </span>
                        {p.placement === 1 && <span className="text-primary text-xs shrink-0">1st</span>}
                        <span className="tabular-nums text-xs text-muted-foreground shrink-0">{fmt(p.total ?? p.score ?? 0)}</span>
                      </button>
                    ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
