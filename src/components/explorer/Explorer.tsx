import { useState } from 'react';
import type { BigAirEventData } from '@/types/bigAirEvent';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Leaderboard } from './Leaderboard';
import { AthleteDetail } from './AthleteDetail';
import { Compare } from './Compare';
import { Bracket } from './Bracket';
import { HeatDetail } from './HeatDetail';
import { Avatar } from './Avatar';
import { fmt, pct, isRichSchema, eventBiggestTrick, eventClosestHeat, eventHighestScore, eventMostCompactHeat, eventBrandLeaders, eventEscalation, roundShort } from './format';
import { Zap, Swords, TrendingUp, Users2, Shirt, LineChart } from 'lucide-react';

type Tab = 'list' | 'bracket' | 'compare';

export function Explorer({ data, initialAthlete }: { data: BigAirEventData; initialAthlete?: string }) {
  const [tab, setTab] = useState<Tab>('list');
  const [detail, setDetail] = useState<string | null>(initialAthlete && data.profiles[initialAthlete] ? initialAthlete : null);
  const [heatDetail, setHeatDetail] = useState<number | null>(null);
  const [compare, setCompare] = useState<string[]>([]);

  const names = Object.keys(data.profiles);
  const rich = isRichSchema(data);
  const hasBonus = rich && data.field.avg_auto_imp != null;

  function toggleCompare(name: string) {
    setCompare((prev) => {
      if (prev.includes(name)) return prev.filter((n) => n !== name);
      if (prev.length < 2) return [...prev, name];
      return [prev[1], name];
    });
  }

  /** Sets a specific compare slot (0 = left, 1 = right) — used by the picker in the Compare tab itself, as opposed to toggleCompare's add/replace-oldest behavior used by the "+ Add to compare" button elsewhere. */
  function setCompareSlot(slot: 0 | 1, name: string) {
    setCompare((prev) => {
      const next: string[] = [prev[0] ?? '', prev[1] ?? ''];
      const other = slot === 0 ? 1 : 0;
      if (next[other] === name) next[other] = '';
      next[slot] = name;
      return next.filter(Boolean);
    });
  }

  function selectAthlete(name: string) {
    setHeatDetail(null);
    setDetail(name);
  }

  const kpis = rich
    ? [
        { v: data.field.n_athletes, l: 'Athletes' },
        { v: data.heats.length, l: 'Heats' },
        { v: fmt(data.field.avg_total!, 1), l: 'Avg heat total, whole field' },
        { v: pct(data.field.crash_rate!), l: 'Avg crash rate, whole field' },
      ]
    : [
        { v: data.field.n_athletes, l: 'Athletes' },
        { v: data.heats.length, l: 'Heats' },
        { v: fmt(data.field.avg_score!, 1), l: 'Avg heat score, whole field' },
        { v: fmt(data.field.best_score!, 1), l: 'Best heat score, whole field' },
      ];

  const biggestTrick = eventBiggestTrick(data.profiles, rich);
  const closestHeat = eventClosestHeat(data.heats);
  const highestScore = eventHighestScore(data.profiles, rich);
  const compactHeat = eventMostCompactHeat(data.heats);
  const brandLeaders = eventBrandLeaders(data.profiles);
  const escalation = eventEscalation(data.heats);
  const showHighlights = !detail && !heatDetail && (biggestTrick || closestHeat || highestScore || compactHeat || brandLeaders || escalation);

  return (
    <div>
      <div className="flex flex-wrap border-t border-b border-border mb-8">
        {kpis.map((k, i, arr) => (
          <div key={k.l} className={`flex-1 min-w-[8rem] py-4 pr-4 ${i < arr.length - 1 ? 'border-r border-border' : ''}`}>
            <div className="font-display text-2xl md:text-3xl font-bold tabular-nums leading-none">{k.v}</div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mt-2 leading-snug">{k.l}</div>
          </div>
        ))}
      </div>

      {showHighlights && (
        <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-l border-border mb-8">
          {highestScore && (
            <button
              type="button"
              onClick={() => selectAthlete(highestScore.name)}
              className="text-left p-4 border-r border-b border-border hover:bg-card/30 transition-colors"
            >
              <div className="flex items-center gap-1.5 text-xs text-primary font-mono font-medium mb-2.5 uppercase tracking-widest">
                <TrendingUp className="w-3.5 h-3.5" /> Highest score
              </div>
              <div className="flex items-center gap-3">
                <Avatar name={highestScore.name} nationality={highestScore.nationality} size={32} />
                <div>
                  <div className="font-display text-lg font-bold leading-none">{fmt(highestScore.value, 2)}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{highestScore.name}</div>
                </div>
              </div>
            </button>
          )}
          {biggestTrick && (
            <button
              type="button"
              onClick={() => selectAthlete(biggestTrick.name)}
              className="text-left p-4 border-r border-b border-border hover:bg-card/30 transition-colors"
            >
              <div className="flex items-center gap-1.5 text-xs text-primary font-mono font-medium mb-2.5 uppercase tracking-widest">
                <Zap className="w-3.5 h-3.5" /> Biggest trick
              </div>
              <div className="flex items-center gap-3">
                <Avatar name={biggestTrick.name} nationality={biggestTrick.nationality} size={32} />
                <div>
                  <div className="font-display text-lg font-bold leading-none">{fmt(biggestTrick.value, 2)}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{biggestTrick.name}</div>
                </div>
              </div>
            </button>
          )}
          {closestHeat && (
            <button
              type="button"
              onClick={() => setHeatDetail(closestHeat.heatNo)}
              className="text-left p-4 border-r border-b border-border hover:bg-card/30 transition-colors"
            >
              <div className="flex items-center gap-1.5 text-xs text-primary font-mono font-medium mb-2.5 uppercase tracking-widest">
                <Swords className="w-3.5 h-3.5" /> Closest heat
              </div>
              <div className="font-display text-lg font-bold leading-none">Won by {fmt(closestHeat.gap, 2)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {closestHeat.winner} over {closestHeat.runnerUp} · {roundShort(closestHeat.round)} · Heat {closestHeat.heatNo}
              </div>
            </button>
          )}
          {compactHeat && (
            <button
              type="button"
              onClick={() => setHeatDetail(compactHeat.heatNo)}
              className="text-left p-4 border-r border-b border-border hover:bg-card/30 transition-colors"
            >
              <div className="flex items-center gap-1.5 text-xs text-primary font-mono font-medium mb-2.5 uppercase tracking-widest">
                <Users2 className="w-3.5 h-3.5" /> Most compact heat
              </div>
              <div className="font-display text-lg font-bold leading-none">{fmt(compactHeat.spread, 2)} spread</div>
              <div className="text-xs text-muted-foreground mt-1">
                1st to last of {compactHeat.count} · {roundShort(compactHeat.round)} · Heat {compactHeat.heatNo}
              </div>
            </button>
          )}
          {brandLeaders && (
            <div className="p-4 border-r border-b border-border">
              <div className="flex items-center gap-1.5 text-xs text-primary font-mono font-medium mb-2.5 uppercase tracking-widest">
                <Shirt className="w-3.5 h-3.5" /> Brands in this field
              </div>
              <div className="text-sm">
                <span className="font-display font-bold">{brandLeaders.mostPresent.brand}</span>
                <span className="text-muted-foreground"> · most riders ({brandLeaders.mostPresent.count})</span>
              </div>
              {brandLeaders.mostWins && (
                <div className="text-sm mt-1">
                  <span className="font-display font-bold">{brandLeaders.mostWins.brand}</span>
                  <span className="text-muted-foreground"> · most heat wins ({brandLeaders.mostWins.count})</span>
                </div>
              )}
            </div>
          )}
          {escalation && (
            <div className="p-4 border-r border-b border-border sm:col-span-2">
              <div className="flex items-center gap-1.5 text-xs text-primary font-mono font-medium mb-3 uppercase tracking-widest">
                <LineChart className="w-3.5 h-3.5" /> Escalation, round by round
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {escalation.map((s, i) => (
                  <div key={s.depth} className="flex items-center gap-2">
                    {i > 0 && <span className="text-muted-foreground text-xs">→</span>}
                    <div className="text-center">
                      <div className="font-display text-base font-bold leading-none tabular-nums">{fmt(s.avg, 1)}</div>
                      <div className="text-[10px] text-muted-foreground mt-1">{roundShort(s.label)}</div>
                    </div>
                  </div>
                ))}
                <span className="text-xs text-muted-foreground ml-2">avg heat {rich ? 'total' : 'score'}, whole field</span>
              </div>
            </div>
          )}
        </div>
      )}

      {!detail && !heatDetail && (
        <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="mb-6">
          <TabsList>
            <TabsTrigger value="list">Athletes</TabsTrigger>
            <TabsTrigger value="bracket">Bracket</TabsTrigger>
            <TabsTrigger value="compare">
              Compare
              {compare.length > 0 && <Badge variant="secondary" className="ml-1.5 h-4 min-w-4 px-1 text-[10px]">{compare.length}</Badge>}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {detail ? (
        <AthleteDetail
          name={detail}
          names={names}
          profiles={data.profiles}
          field={data.field}
          winner={data.winner}
          heats={data.heats}
          rich={rich}
          isInCompare={compare.includes(detail)}
          compareFull={compare.length >= 2}
          onBack={() => setDetail(null)}
          onToggleCompare={() => toggleCompare(detail)}
        />
      ) : heatDetail ? (
        <HeatDetail
          heat={data.heats.find((h) => h.heat_no === heatDetail)!}
          profiles={data.profiles}
          rich={rich}
          hasBonus={hasBonus}
          onBack={() => setHeatDetail(null)}
          onSelectAthlete={selectAthlete}
        />
      ) : tab === 'list' ? (
        <Leaderboard names={names} profiles={data.profiles} winner={data.winner} rich={rich} hasBonus={hasBonus} onSelectAthlete={selectAthlete} />
      ) : tab === 'bracket' ? (
        <Bracket heats={data.heats} profiles={data.profiles} onSelectAthlete={selectAthlete} onSelectHeat={setHeatDetail} />
      ) : (
        <Compare names={names} profiles={data.profiles} compare={compare} rich={rich} hasBonus={hasBonus} onRemove={(n) => toggleCompare(n)} onSelectSlot={setCompareSlot} />
      )}

      <div className="mt-10 pt-4 border-t border-border text-xs text-muted-foreground leading-relaxed">
        {rich ? (
          <>
            "Crash" = an attempt recorded as 0, exactly as labelled by the source platform. "Result" = sum of the top 3
            non-crash attempts in that heat.
            {hasBonus ? (
              <> "Auto Imp" = 0-7 variety score. "Impression" = 0-3 subjective judges' bonus.</>
            ) : (
              <> This event doesn't use the Auto Imp/Impression bonus, so "Total" always equals "Result".</>
            )}
            {' '}Standard deviation is computed on each athlete's heat totals (small samples, 2-5 heats per athlete).
          </>
        ) : (
          <>
            This source publishes a single combined judges' score per heat, with no move-by-move breakdown.
            No crash count, trick variety, or impression score is available for this event.
            {data.schema_note && <> {data.schema_note}</>}
          </>
        )}
      </div>
    </div>
  );
}
