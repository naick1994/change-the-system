import { buildGlobalAthletes } from './globalAthletes';
import ATHLETE_BRANDS from './athleteBrands.json';

export interface BrandRider {
  name: string;
  nationality: string;
  points: number;
}

export interface BrandRanking {
  brand: string;
  points: number;
  riderCount: number;
  /** Sum of each rider's event wins (RaceStandings rank === 1) across every competition they entered. */
  championships: number;
  /** Sum of each rider's podium finishes (RaceStandings rank <= 3) across every competition they entered. */
  podiums: number;
  riders: BrandRider[];
}

/**
 * Constructor-style brand ranking, built by grouping buildGlobalAthletes()
 * output by sponsor (athleteBrands.json) and summing each rider's GKA
 * points (see gkaPointsForRank in format.ts) — the real official
 * points-by-finish scale, not an invented weighting. Mirrors how an F1
 * constructors' championship sums its two drivers' points, generalized to
 * however many riders a brand sponsors. Split by division by default — a
 * brand's men's and women's programs are ranked separately, same as the
 * Athletes page's own Men/Women toggle — with 'Overall' available to pool
 * every rider a brand sponsors, regardless of division, into one number.
 */
export type BrandDivision = 'Men' | 'Women' | 'Overall';

export async function buildBrandRankings(division: BrandDivision): Promise<BrandRanking[]> {
  const athletes = await buildGlobalAthletes();
  const byBrand = new Map<string, BrandRanking>();

  for (const a of athletes) {
    if (division !== 'Overall' && a.events[0]?.division !== division) continue;
    const brand = (ATHLETE_BRANDS as Record<string, string>)[a.name];
    if (!brand) continue;
    let b = byBrand.get(brand);
    if (!b) {
      b = { brand, points: 0, riderCount: 0, championships: 0, podiums: 0, riders: [] };
      byBrand.set(brand, b);
    }
    b.points += a.points;
    b.riderCount += 1;
    b.championships += a.wins;
    b.podiums += a.podiums;
    b.riders.push({ name: a.name, nationality: a.nationality, points: a.points });
  }

  const list = [...byBrand.values()];
  for (const b of list) b.riders.sort((x, y) => y.points - x.points);
  list.sort((a, b) => b.points - a.points || b.championships - a.championships || b.podiums - a.podiums || a.brand.localeCompare(b.brand));
  return list;
}
