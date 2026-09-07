import { EVENTS } from './eventsIndex';
import { raceStandings, gkaPointsForRank, isRichSchema } from '@/components/explorer/format';

export interface AthleteEventResult {
  slug: string;
  competition: string;
  division: string;
  date: string;
  rank: number;
  resultLabel: string;
  points: number;
}

export interface GlobalAthlete {
  name: string;
  nationality: string;
  wins: number;
  podiums: number;
  /** Mean of this athlete's RaceStandings rank across events entered — each event counts equally regardless of field size, per how this ranking is meant to work. */
  avgRank: number;
  /** Total GKA points across every event entered (see gkaPointsForRank) — the season-total metric brand rankings are built from. */
  points: number;
  events: AthleteEventResult[];

  /** Heats won across every event entered, career-wide (distinct from `wins`, which counts event wins). */
  heatsWon: number;
  heatsPlayed: number;
  /** Career heat win rate (heatsWon / heatsPlayed). Always available — every schema publishes wins/n_heats. */
  heatWinRate: number;
  /**
   * Career crash rate, weighted across every rich-schema event entered
   * (total_crashes / total_attempts, summed). Undefined if the athlete has
   * only competed in reduced-schema events (e.g. a GKA ladder-only rider),
   * since those sources don't publish attempt-level data.
   */
  crashRate: number | undefined;
  /** Best single heat total on record, whichever event it came from — rich (best_total) and reduced (best_score) events are both eligible since both represent "best heat result" on that source's own scale. */
  bestHeatScore: { value: number; competition: string; division: string } | undefined;
  /** Best single scored move on record. Rich-schema events only (reduced schema doesn't publish move-level detail). */
  bestMove: { value: number; competition: string; division: string } | undefined;
}

/**
 * Builds one combined roster across every competition, ranked by actual
 * bracket results (RaceStandings' rank — see format.ts), not a stats
 * average. Each event is loaded (small, code-split JSON, ~48 athletes
 * total) and contributes one result per athlete who entered it; an
 * athlete who only entered one event is ranked purely on that one result.
 * Athlete names are assumed already unified across sources (see
 * eventsIndex.ts's note on cross-source name variants like "Cohan Van
 * Dijk" vs "Cohan van Dijk") — this function does not do its own fuzzy
 * matching, so a new unmerged variant would silently show up as two
 * separate riders.
 */
export async function buildGlobalAthletes(): Promise<GlobalAthlete[]> {
  const byName = new Map<string, GlobalAthlete>();
  // Accumulators keyed by name, summed across events, kept out of the
  // public GlobalAthlete shape until finalized below.
  const crashTotals = new Map<string, { crashes: number; attempts: number }>();

  for (const meta of EVENTS) {
    const data = await meta.loadData();
    const rich = isRichSchema(data);
    const names = Object.keys(data.profiles);
    const standings = raceStandings(names, data.profiles);

    for (const s of standings) {
      const profile = data.profiles[s.name];
      let athlete = byName.get(s.name);
      if (!athlete) {
        athlete = {
          name: s.name,
          nationality: profile.nationality,
          wins: 0,
          podiums: 0,
          avgRank: 0,
          points: 0,
          events: [],
          heatsWon: 0,
          heatsPlayed: 0,
          heatWinRate: 0,
          crashRate: undefined,
          bestHeatScore: undefined,
          bestMove: undefined,
        };
        byName.set(s.name, athlete);
      }
      const points = gkaPointsForRank(s.rank);
      athlete.events.push({
        slug: meta.slug,
        competition: meta.competition,
        division: meta.division,
        date: meta.date,
        rank: s.rank,
        resultLabel: s.resultLabel,
        points,
      });
      if (s.rank === 1) athlete.wins += 1;
      if (s.rank <= 3) athlete.podiums += 1;
      athlete.points += points;

      athlete.heatsWon += profile.wins;
      athlete.heatsPlayed += profile.n_heats;

      if (rich && profile.total_crashes != null && profile.total_attempts != null) {
        const totals = crashTotals.get(s.name) ?? { crashes: 0, attempts: 0 };
        totals.crashes += profile.total_crashes;
        totals.attempts += profile.total_attempts;
        crashTotals.set(s.name, totals);
      }

      const heatScore = rich ? profile.best_total : profile.best_score;
      if (heatScore != null && (athlete.bestHeatScore == null || heatScore > athlete.bestHeatScore.value)) {
        athlete.bestHeatScore = { value: heatScore, competition: meta.competition, division: meta.division };
      }

      if (rich && profile.best_move != null && (athlete.bestMove == null || profile.best_move > athlete.bestMove.value)) {
        athlete.bestMove = { value: profile.best_move, competition: meta.competition, division: meta.division };
      }
    }
  }

  const list = [...byName.values()];
  for (const athlete of list) {
    athlete.avgRank = athlete.events.reduce((sum, e) => sum + e.rank, 0) / athlete.events.length;
    athlete.heatWinRate = athlete.heatsPlayed > 0 ? athlete.heatsWon / athlete.heatsPlayed : 0;
    const totals = crashTotals.get(athlete.name);
    athlete.crashRate = totals && totals.attempts > 0 ? totals.crashes / totals.attempts : undefined;
  }

  list.sort((a, b) => b.wins - a.wins || b.podiums - a.podiums || a.avgRank - b.avgRank || a.name.localeCompare(b.name));
  return list;
}
