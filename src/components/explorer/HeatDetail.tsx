import type { Heat, AthleteProfile } from '@/types/bigAirEvent';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from './Avatar';
import { MoveChips } from './MoveChips';
import { fmt, ordinal } from './format';
import { ArrowLeft } from 'lucide-react';

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export function HeatDetail({
  heat, profiles, rich, hasBonus, onBack, onSelectAthlete,
}: {
  heat: Heat;
  profiles: Record<string, AthleteProfile>;
  rich: boolean;
  hasBonus: boolean;
  onBack: () => void;
  onSelectAthlete: (name: string) => void;
}) {
  const participants = [...heat.participants].sort((a, b) => a.placement - b.placement);

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 -ml-2">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to bracket
      </Button>

      <div className="mb-6">
        <div className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-1">{heat.round}</div>
        <h2 className="font-display text-2xl font-bold">Heat {heat.heat_no}</h2>
      </div>

      <div className="space-y-3">
        {participants.map((p) => {
          const profile = profiles[p.name];
          return (
            <Card
              key={p.name}
              className="p-4 cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => onSelectAthlete(p.name)}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 text-center font-bold tabular-nums text-muted-foreground shrink-0">
                  {MEDAL[p.placement] ?? p.placement}
                </span>
                <Avatar name={p.name} nationality={profile?.nationality ?? p.nationality ?? ''} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{ordinal(p.placement)} place</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-display text-xl font-bold tabular-nums">{fmt((rich ? p.total : p.score) ?? 0, rich ? 2 : 2)}</div>
                  <div className="text-xs text-muted-foreground">{rich ? 'total' : 'score'}</div>
                </div>
              </div>

              {rich && p.moves && (
                <div className="mb-2 pl-11">
                  <MoveChips moves={p.moves} />
                </div>
              )}

              {rich && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 pl-11 text-xs tabular-nums text-muted-foreground">
                  <span>Result <b className="text-foreground">{fmt(p.result ?? 0)}</b></span>
                  {hasBonus && (
                    <>
                      <span>Auto Imp <b className="text-foreground">{p.auto_imp}</b></span>
                      <span>Impr. <b className="text-foreground">{fmt(p.impression ?? 0)}</b></span>
                    </>
                  )}
                  <span className={p.crashes && p.crashes > 0 ? 'text-red-400' : 'text-emerald-500'}>
                    {p.crashes ?? 0} crash{p.crashes !== 1 ? 'es' : ''}
                  </span>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
