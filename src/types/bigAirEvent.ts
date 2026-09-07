// Matches the schema documented in the handoff README. IMPORTANT: the
// scoring fields below are specific to how each source judges a heat and
// are NOT a universal kitesurf Big Air standard — and sources differ in
// how much they publish. Three variants exist so far:
//
// - "Rich" schema (heatscoring.com / GKA-Livewire sources, e.g. Cold
//   Hawaii): every attempt is scored, "crash" = an attempt recorded as 0,
//   "result" = sum of the top 3 non-crash attempts, plus auto_imp
//   (variety, 0-7) and impression (judges' bonus, 0-3) which sum into
//   "total". All of result/auto_imp/impression/total/crashes/best_move are
//   present.
// - "Rich, no bonus" (same heatscoring.com-style source, but an event that
//   doesn't use the Auto Imp/Impression bonus — e.g. Lords of Tram):
//   identical shape to rich, but auto_imp/impression are `null` (not 0) at
//   every level (heat participant, athlete profile, field), and `total`
//   always equals `result`. Check `isRichSchema` AND null-ness of
//   `avg_auto_imp` (see `hasBonus` in Explorer.tsx) before rendering
//   variety/impression UI — don't assume every rich event has both.
// - "Reduced" schema (GKA World Tour ladder pages, e.g. Mykonos): only a
//   single combined judges' score per athlete per heat is published — no
//   move breakdown, no crash count, no variety/impression split. These
//   events carry a `score` field instead of `result/auto_imp/impression/
//   total`, and the rich-only fields are simply absent (not faked as 0).
//
// A component must check which fields are actually present (see
// `isRichSchema` in components/explorer/format.ts) and hide sections that
// don't apply, rather than rendering zeros or nulls for data the source
// never published. See README.md "Scoring model" section before wiring up
// a new event.

/** Round names vary by source ('Semi Finals' vs 'Semi-Finals', 'Round W1'
 * for smaller women's brackets, etc.) — treat as a display label, not a
 * closed enum. `round_depth` (1 = first round, increasing toward the
 * final) is the reliable ordering signal across all sources. */
export type Round = string;

export interface HeatParticipant {
  name: string;
  nationality?: string;
  /** Score per attempt, in order. 0 = crash, exactly as labelled by the source platform. Rich schema only. */
  moves?: number[];
  /** Sum of the top 3 non-crash attempts in this heat — NOT a sum of every attempt. Rich schema only. */
  result?: number;
  /** Trick-variety score, 0-7. GKA-Livewire-specific, rich schema only. Null (not 0) at rich-schema sources that don't use this bonus (e.g. Lords of Tram). */
  auto_imp?: number | null;
  /** Subjective judges' bonus, 0-3. Rich schema only. Null (not 0) where the source doesn't use it. */
  impression?: number | null;
  /** Official heat score for rich-schema sources: result + auto_imp + impression. */
  total?: number;
  crashes?: number;
  attempts?: number;
  best_move?: number;
  /** Single combined judges' score for this heat. Reduced schema only (GKA ladder). */
  score?: number;
  /** Placement within this heat; 1 = heat winner. */
  placement: number;
}

export interface Heat {
  heat_no: number;
  round: Round;
  /** Increasing toward the final; the reliable cross-source ordering signal — the final isn't always depth 5. */
  round_depth: number;
  local_heat_no?: number;
  participants: HeatParticipant[];
}

/** Same shape as a heat's participant row, seen from one athlete's side. */
export interface AthleteHeat extends Omit<HeatParticipant, 'name' | 'nationality'> {
  heat_no: number;
  round: Round;
  round_depth: number;
  placement: number;
  opponents: string[];
}

export interface AthleteProfile {
  name: string;
  nationality: string;
  n_heats: number;
  wins: number;
  max_round_depth: number;
  max_round: Round;

  // Rich schema only — undefined for reduced-schema events.
  total_attempts?: number;
  total_crashes?: number;
  crash_rate?: number | null;
  avg_result?: number | null;
  avg_auto_imp?: number | null;
  avg_impression?: number | null;
  avg_total?: number;
  best_total?: number;
  best_move?: number;
  /** Standard deviation of heat totals — consistency indicator, small samples. Rich schema only. */
  stdev_total?: number;

  // Reduced schema only (GKA ladder) — undefined for rich-schema events.
  avg_score?: number;
  best_score?: number;
  stdev_score?: number;

  heats: AthleteHeat[];
}

export interface FieldStats {
  n_athletes: number;

  // Rich schema only. avg_auto_imp/avg_impression are null (not 0) at
  // rich-schema sources that don't use that bonus (e.g. Lords of Tram).
  avg_result?: number;
  avg_auto_imp?: number | null;
  avg_impression?: number | null;
  avg_total?: number;
  crash_rate?: number;
  best_move?: number;
  stdev_total?: number;

  // Reduced schema only.
  avg_score?: number;
  best_score?: number;
}

export interface BigAirEventData {
  heats: Heat[];
  profiles: Record<string, AthleteProfile>;
  field: FieldStats;
  winner: string;
  /** Present on reduced-schema events, explaining what the source doesn't publish. */
  schema_note?: string;
}

/** Registry entry — one per division of a competition, drives the events index page. */
export interface EventMeta {
  slug: string;
  /** Full display name, e.g. "Cold Hawaii Big Air 2026 — Men". */
  name: string;
  /** Shared name across divisions of the same competition, e.g. "Cold Hawaii Big Air 2026" — groups cards on the index page. */
  competition: string;
  /** e.g. "Men", "Women" — how divisions of the same competition are disambiguated. */
  division: string;
  location: string;
  date: string;
  /** ISO 8601 date (e.g. "2026-09-06") the competition wrapped up — the sortable counterpart to `date`'s display string, used to find the most recent competition without parsing "6 Sept 2026" at runtime. */
  isoDate: string;
  /** Which judging/scoring system produced this dataset — surfaced in the UI so numbers from different sources are never silently treated as equivalent. */
  source: string;
  loadData: () => Promise<BigAirEventData>;

  // Small, static snapshot of the dataset's own numbers, duplicated here so
  // the index page can show them without dynamically importing every
  // event's JSON just to render a homepage card. Keep in sync with the
  // source file if it's ever regenerated (values pulled directly from it,
  // never estimated).
  winner: string;
  winnerNationality: string;
  athleteCount: number;
  heatCount: number;
  /** Unique ISO alpha-2 nationality codes across this division's roster. */
  countries: string[];
  /** Top finishers (3 for a 3-way final, 4 for a 4-way final), 1-indexed placement — same ranking the Result tab computes from the bracket. */
  podium: { name: string; nationality: string; placement: number }[];
}
