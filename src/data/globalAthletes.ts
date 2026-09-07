import { EVENTS } from './eventsIndex';
import { raceStandings } from '@/components/explorer/format';

export interface AthleteEventResult {
  slug: string;
  competition: string;
  division: string;
  date: string;
  rank: number;
  resultLabel: string;
}

export interface GlobalAthlete {
  name: string;
  nationality: string;
  wins: number;
  podiums: number;
  /** Mean of this athlete's RaceStandings rank across events entered — each event counts equally regardless of field size, per how this ranking is meant to work. */
  avgRank: number;
  events: AthleteEventResult[];
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

  for (const meta of EVENTS) {
    const data = await meta.loadData();
    const names = Object.keys(data.profiles);
    const standings = raceStandings(names, data.profiles);

    for (const s of standings) {
      const profile = data.profiles[s.name];
      let athlete = byName.get(s.name);
      if (!athlete) {
        athlete = { name: s.name, nationality: profile.nationality, wins: 0, podiums: 0, avgRank: 0, events: [] };
        byName.set(s.name, athlete);
      }
      athlete.events.push({
        slug: meta.slug,
        competition: meta.competition,
        division: meta.division,
        date: meta.date,
        rank: s.rank,
        resultLabel: s.resultLabel,
      });
      if (s.rank === 1) athlete.wins += 1;
      if (s.rank <= 3) athlete.podiums += 1;
    }
  }

  const list = [...byName.values()];
  for (const athlete of list) {
    athlete.avgRank = athlete.events.reduce((sum, e) => sum + e.rank, 0) / athlete.events.length;
  }

  list.sort((a, b) => b.wins - a.wins || b.podiums - a.podiums || a.avgRank - b.avgRank || a.name.localeCompare(b.name));
  return list;
}
