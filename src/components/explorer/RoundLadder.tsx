import type { EventRoundStage } from './format';
import { roundShort, ordinal } from './format';

export function RoundLadder({
  rounds, athleteHeats, reachedDepth, won,
}: {
  rounds: EventRoundStage[];
  /** This athlete's own heats — used to show their placement at each stage they actually played, not just the round name. */
  athleteHeats: { round_depth: number; placement: number }[];
  reachedDepth: number;
  won: boolean;
}) {
  const placementByDepth = new Map(athleteHeats.map((h) => [h.round_depth, h.placement]));

  return (
    <div className="flex items-center gap-1.5">
      {rounds.map((stage, i) => {
        const reached = stage.depth <= reachedDepth;
        const isLast = stage.depth === reachedDepth;
        const placement = reached ? placementByDepth.get(stage.depth) : undefined;
        // Some brackets let a heat winner skip straight to a deeper round
        // (a "bye") — reached-but-no-placement means they never actually
        // played a heat at this depth, so it's neither a round name nor a
        // placement, just a pass-through.
        const isBye = reached && placement == null && stage.depth < reachedDepth;
        const label = placement != null ? ordinal(placement) : isBye ? 'bye' : roundShort(stage.label);
        return (
          <div key={stage.depth} className="flex items-center gap-1.5">
            <div className={`flex flex-col items-center gap-1 ${reached ? '' : 'opacity-35'}`} title={stage.label}>
              <div
                className={`w-3 h-3 rounded-full border-2 ${
                  reached ? 'bg-primary border-primary' : 'bg-transparent border-muted-foreground'
                } ${isLast && won ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
              />
              <span className={`text-[10px] whitespace-nowrap ${placement === 1 ? 'text-primary font-semibold' : reached ? 'text-foreground' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </div>
            {i < rounds.length - 1 && (
              <div className={`w-4 sm:w-8 h-0.5 -mt-4 ${stage.depth < reachedDepth ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
            )}
          </div>
        );
      })}
      {won && <span className="text-lg -mt-4 ml-1">🏆</span>}
    </div>
  );
}
