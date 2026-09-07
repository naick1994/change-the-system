import { fmt, topResultIndices } from './format';

/** Every attempt in a heat, not just the summed result — crashes marked, and the top-3 non-crash attempts that count toward "result" highlighted. */
export function MoveChips({ moves }: { moves: number[] }) {
  const counted = topResultIndices(moves);
  return (
    <div className="flex flex-wrap gap-1.5">
      {moves.map((m, i) => (
        <span
          key={i}
          className={`text-xs px-2 py-1 rounded tabular-nums ${
            m === 0
              ? 'bg-red-400/10 text-red-400'
              : counted.has(i)
              ? 'bg-primary/15 text-primary font-medium'
              : 'bg-muted text-muted-foreground'
          }`}
          title={m === 0 ? 'Crash' : counted.has(i) ? 'Counted toward result (top 3)' : 'Not counted'}
        >
          {m === 0 ? '✕' : fmt(m, 1)}
        </span>
      ))}
    </div>
  );
}
