import type { AthleteProfile, BigAirEventData, Heat } from '@/types/bigAirEvent';
import ATHLETE_BRANDS from '@/data/athleteBrands.json';

const ROUND_SHORT_MAP: Record<string, string> = {
  'Round 1': 'R1', 'Round 2': 'R2', 'Round 3': 'R3', 'Round 4': 'R4',
  'Round W1': 'W1', 'Round W2': 'W2',
  'Semi Finals': 'Semi', 'Semi-Finals': 'Semi', 'Semifinals': 'Semi',
  Final: 'Final', Finals: 'Final',
};

/** Short label for a round name. Falls back to the round string itself for names not in the map, since sources keep introducing new ones. */
export function roundShort(round: string): string {
  return ROUND_SHORT_MAP[round] ?? round.replace(/^Round /, 'R');
}

export interface EventRoundStage {
  depth: number;
  label: string;
}

/** The distinct rounds actually present in this event's bracket, ordered by depth — NOT a fixed 5-stage assumption, since brackets vary in size (a 4-heat women's draw skips straight from depth 2 to the Final at depth 5). */
export function eventRounds(heats: Heat[]): EventRoundStage[] {
  const byDepth = new Map<number, string>();
  for (const h of heats) if (!byDepth.has(h.round_depth)) byDepth.set(h.round_depth, h.round);
  return [...byDepth.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([depth, label]) => ({ depth, label }));
}

/** True if this event publishes the full move-by-move breakdown (result/auto_imp/impression/crashes). False for reduced "score only" sources like the GKA ladder, which must not have those fields faked as zero. */
export function isRichSchema(data: BigAirEventData): boolean {
  const p = data.heats[0]?.participants[0];
  return p ? p.result !== undefined : true;
}

/** Indices of the top-3 non-crash attempts — the ones that count toward "result" in the rich schema. */
export function topResultIndices(moves: number[]): Set<number> {
  return new Set(
    moves
      .map((v, i) => ({ v, i }))
      .filter((m) => m.v > 0)
      .sort((a, b) => b.v - a.v)
      .slice(0, 3)
      .map((m) => m.i)
  );
}

export function fmt(n: number, d = 2): string {
  return Number(n).toFixed(d);
}

export function pct(n: number): string {
  return (n * 100).toFixed(1) + '%';
}

export function rankOf(
  names: string[],
  profiles: Record<string, AthleteProfile>,
  name: string,
  key: keyof AthleteProfile,
  higherIsBetter: boolean
): number {
  const sorted = [...names].sort((x, y) => {
    const vx = profiles[x][key] as number;
    const vy = profiles[y][key] as number;
    return higherIsBetter ? vy - vx : vx - vy;
  });
  return sorted.indexOf(name) + 1;
}

export function ordinal(n: number): string {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

/**
 * Signed delta vs. a reference value, "+" green when higher-is-better
 * matches direction, red otherwise. `formatFn` should be the same
 * formatter used to display the raw value (e.g. `pct` for a crash rate,
 * `String` for a whole-number count) — otherwise a percentage field's
 * delta renders as a bare decimal ("+0.07" instead of "+7.1%") and a count
 * field's renders with a fake ".00".
 */
export function delta(
  value: number,
  reference: number,
  higherIsBetter: boolean,
  formatFn: (n: number) => string = fmt
): { text: string; positive: boolean } {
  const diff = value - reference;
  const positive = higherIsBetter ? diff >= 0 : diff <= 0;
  const sign = diff >= 0 ? '+' : '';
  return { text: `${sign}${formatFn(diff)}`, positive };
}

export interface RaceStanding {
  name: string;
  rank: number;
  depth: number;
  round: string;
  placement: number;
  resultLabel: string;
}

/**
 * Ranks athletes by how the bracket actually played out (deepest round
 * reached, then in-heat placement), NOT by any stat average. Everyone
 * eliminated in the same round ties — only the Final splits 1st/2nd/3rd.
 * This is the "who actually won" view; it can disagree with the stats
 * leaderboard (e.g. a semifinalist can out-average the champion), which is
 * exactly why the two are shown separately instead of one sorted table.
 */
export function raceStandings(names: string[], profiles: Record<string, AthleteProfile>): RaceStanding[] {
  const rows = names.map((name) => {
    const p = profiles[name];
    const last = p.heats.reduce((best, h) => (h.round_depth > best.round_depth ? h : best), p.heats[0]);
    return { name, depth: last.round_depth, round: last.round, placement: last.placement };
  });

  rows.sort((a, b) => b.depth - a.depth || a.placement - b.placement);
  const finalDepth = Math.max(...rows.map((r) => r.depth));

  const out: RaceStanding[] = [];
  let rank = 1;
  rows.forEach((row, i) => {
    if (i > 0) {
      const prev = rows[i - 1];
      const tied = row.depth === prev.depth && (row.depth < finalDepth || row.placement === prev.placement);
      if (!tied) rank = i + 1;
    }
    const resultLabel =
      row.depth === finalDepth
        ? row.placement === 1 ? 'Champion' : `${ordinal(row.placement)} place`
        : `Eliminated in ${row.round}`;
    out.push({ ...row, rank, resultLabel });
  });
  return out;
}

/**
 * GKA's real points-by-finish scale, taken from the official 2026 GKA Big
 * Air ranking PDF (the same source already used for the sibling
 * scoring-system-gka project's season standings). Cross-checked against
 * two independent events (Lords of Tram France, GKA Mykonos Greece) — both
 * award the exact same points at the exact same rank tiers, confirming
 * this is a fixed scale rather than a one-event coincidence. The rank
 * numbers use "skip after ties" (1224-style) — e.g. a 4-way tie at rank 9
 * means the next distinct rank is 13 — which is exactly the same skip
 * pattern raceStandings() above already produces, so RaceStanding.rank
 * plugs directly into this table with no re-mapping needed.
 */
export const GKA_POINTS_TIERS: [rank: number, points: number][] = [
  [1, 1000],
  [2, 870],
  [3, 770],
  [4, 700],
  [5, 580],
  [7, 500],
  [9, 420],
  [13, 280],
  [17, 140],
  [21, 90],
];

/** GKA points for a given RaceStandings rank — the highest tier whose threshold the rank meets. Ranks deeper than the lowest tier (small brackets that never reach round-of-21) score 0. */
export function gkaPointsForRank(rank: number): number {
  let points = 0;
  for (const [tierRank, tierPoints] of GKA_POINTS_TIERS) {
    if (rank >= tierRank) points = tierPoints;
    else break;
  }
  return points;
}

/** The single biggest scored move in this event — rich schema only (reduced-schema sources never publish per-move data), null otherwise. */
export function eventBiggestTrick(profiles: Record<string, AthleteProfile>, rich: boolean): { name: string; nationality: string; value: number } | null {
  if (!rich) return null;
  const entries = Object.values(profiles).filter((p) => p.best_move != null);
  if (entries.length === 0) return null;
  const best = entries.reduce((a, b) => (b.best_move! > a.best_move! ? b : a));
  return { name: best.name, nationality: best.nationality, value: best.best_move! };
}

/** Smallest margin between 1st and 2nd across every heat in this event (not just the final — an early heat can be tighter) — schema-agnostic (total or score, whichever this heat has), always a same-scoring-system comparison. */
export function eventClosestHeat(heats: Heat[]): { gap: number; winner: string; runnerUp: string; heatNo: number; round: string } | null {
  let best: { gap: number; winner: string; runnerUp: string; heatNo: number; round: string } | null = null;
  for (const h of heats) {
    const ranked = [...h.participants].sort((a, b) => a.placement - b.placement);
    if (ranked.length < 2) continue;
    const [first, second] = ranked;
    const key = first.total !== undefined ? 'total' : 'score';
    const gap = (first[key] as number) - (second[key] as number);
    if (best === null || gap < best.gap) {
      best = { gap, winner: first.name, runnerUp: second.name, heatNo: h.heat_no, round: h.round };
    }
  }
  return best;
}

/** The single best heat score in this event — works for both schemas (best_total for rich, best_score for reduced), unlike biggest trick which only exists where move data is published. */
export function eventHighestScore(profiles: Record<string, AthleteProfile>, rich: boolean): { name: string; nationality: string; value: number } | null {
  const entries = Object.values(profiles).filter((p) => (rich ? p.best_total : p.best_score) != null);
  if (entries.length === 0) return null;
  const valueOf = (p: AthleteProfile) => (rich ? p.best_total! : p.best_score!);
  const best = entries.reduce((a, b) => (valueOf(b) > valueOf(a) ? b : a));
  return { name: best.name, nationality: best.nationality, value: valueOf(best) };
}

/** The heat with the smallest spread between 1st and LAST place — a different question from eventClosestHeat's top-2 margin: this is "how competitive was the whole field," not just the top of it. */
export function eventMostCompactHeat(heats: Heat[]): { spread: number; heatNo: number; round: string; topName: string; bottomName: string; count: number } | null {
  let best: { spread: number; heatNo: number; round: string; topName: string; bottomName: string; count: number } | null = null;
  for (const h of heats) {
    if (h.participants.length < 2) continue;
    const ranked = [...h.participants].sort((a, b) => a.placement - b.placement);
    const first = ranked[0];
    const last = ranked[ranked.length - 1];
    const key = first.total !== undefined ? 'total' : 'score';
    const spread = (first[key] as number) - (last[key] as number);
    if (best === null || spread < best.spread) {
      best = { spread, heatNo: h.heat_no, round: h.round, topName: first.name, bottomName: last.name, count: ranked.length };
    }
  }
  return best;
}

export interface EscalationStage {
  depth: number;
  label: string;
  avg: number;
}

/**
 * Round-by-round average score across the whole field (schema-agnostic:
 * total or score, whichever this heat has) — shows whether a bracket
 * escalates as the stakes rise or stays flat. Requires at least 3 rounds
 * with recorded scores to be worth showing; a 2-round bracket (e.g. a
 * small women's field) doesn't have enough stages for a "climb" to read as
 * a real trend rather than noise.
 */
export function eventEscalation(heats: Heat[]): EscalationStage[] | null {
  const byDepth = new Map<number, { label: string; values: number[] }>();
  for (const h of heats) {
    const entry = byDepth.get(h.round_depth) ?? { label: h.round, values: [] };
    for (const p of h.participants) {
      const v = p.total !== undefined ? p.total : p.score;
      if (v != null) entry.values.push(v);
    }
    byDepth.set(h.round_depth, entry);
  }
  if (byDepth.size < 3) return null;
  return [...byDepth.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([depth, { label, values }]) => ({ depth, label, avg: values.reduce((s, v) => s + v, 0) / values.length }));
}

export interface EventBrandLeaders {
  mostPresent: { brand: string; count: number };
  mostWins: { brand: string; count: number } | null;
}

/** Brand breakdown for this one event's field: which sponsor has the most riders entered, and which has the most heat wins (summed across its riders in this event only — not a tour-wide count). Athletes with no known brand (not yet in athleteBrands.json) are excluded rather than lumped into a fake "Unknown" leader. */
export function eventBrandLeaders(profiles: Record<string, AthleteProfile>): EventBrandLeaders | null {
  const riderCount = new Map<string, number>();
  const winCount = new Map<string, number>();
  for (const p of Object.values(profiles)) {
    const brand = (ATHLETE_BRANDS as Record<string, string>)[p.name];
    if (!brand) continue;
    riderCount.set(brand, (riderCount.get(brand) ?? 0) + 1);
    winCount.set(brand, (winCount.get(brand) ?? 0) + p.wins);
  }
  if (riderCount.size === 0) return null;

  const [presentBrand, presentCount] = [...riderCount.entries()].reduce((a, b) => (b[1] > a[1] ? b : a));
  const winEntries = [...winCount.entries()].filter(([, c]) => c > 0);
  const mostWins =
    winEntries.length > 0
      ? (() => {
          const [b, c] = winEntries.reduce((a, x) => (x[1] > a[1] ? x : a));
          return { brand: b, count: c };
        })()
      : null;

  return { mostPresent: { brand: presentBrand, count: presentCount }, mostWins };
}

/** ISO 3166-1 alpha-2 code → flag emoji, via regional indicator symbols. */
export function flagEmoji(code: string): string {
  if (!code || code.length !== 2) return '';
  const points = [...code.toUpperCase()].map((c) => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...points);
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const AVATAR_PALETTE = ['#f2661a', '#3987e5', '#2ea36b', '#c9578f', '#c9a227', '#8a63d2', '#4fb8c4', '#e66767'];

export function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}
