import type { EventMeta } from '@/types/bigAirEvent';

// One entry per division of a competition, in chronological order (drives
// both the events index page order and groupedEvents()). `loadData` is a
// dynamic import so the index page never has to load every event's
// dataset — only the one you open. Add a new competition by dropping its
// JSON in src/data/events/ and adding one entry per division here, in the
// right chronological slot, after re-verifying its scoring model against
// the README's "Scoring model" caveats (rich move-by-move breakdown vs.
// reduced single-score-per-heat — see types/bigAirEvent.ts). Entries
// sharing `competition` are grouped into one card on the index page,
// disambiguated by `division`.
//
// winner/podium/athleteCount/heatCount/countries are a static snapshot of
// each JSON's own numbers (see EventMeta doc) — pulled directly from the
// files, not estimated. podium mirrors what RaceStandings computes from
// the bracket (round_depth desc, then in-heat placement), not a stats
// average.
export const EVENTS: EventMeta[] = [
  {
    slug: 'lords-of-tram-france-2026-men',
    name: 'Lords of Tram (GKA France) 2026 — Men',
    competition: 'Lords of Tram (GKA France) 2026',
    division: 'Men',
    location: 'Le Barcarès, France',
    date: '28–29 Mar 2026',
    isoDate: '2026-03-29',
    source: 'heatscoring.com (GKA scoring model, no Auto Imp/Impression bonus)',
    loadData: () => import('./events/lords-of-tram-france-2026-men.json').then((m) => m.default as any),
    winner: 'Jamie Overbeek',
    winnerNationality: 'NL',
    athleteCount: 24,
    heatCount: 19,
    countries: ['BR', 'DE', 'DK', 'ES', 'FR', 'IL', 'IT', 'NL', 'NZ', 'US', 'ZA'],
    podium: [
      { name: 'Jamie Overbeek', nationality: 'NL', placement: 1 },
      { name: 'Finn Flügel', nationality: 'DE', placement: 2 },
      { name: 'Leonardo Casati', nationality: 'IT', placement: 3 },
      { name: 'Zac Adams', nationality: 'US', placement: 4 },
    ],
  },
  {
    slug: 'lords-of-tram-france-2026-women',
    name: 'Lords of Tram (GKA France) 2026 — Women',
    competition: 'Lords of Tram (GKA France) 2026',
    division: 'Women',
    location: 'Le Barcarès, France',
    date: '28–29 Mar 2026',
    isoDate: '2026-03-29',
    source: 'heatscoring.com (GKA scoring model, no Auto Imp/Impression bonus)',
    loadData: () => import('./events/lords-of-tram-france-2026-women.json').then((m) => m.default as any),
    winner: 'Alessa Mensch',
    winnerNationality: 'DE',
    athleteCount: 12,
    heatCount: 9,
    countries: ['BG', 'BR', 'DE', 'EG', 'FR', 'GB', 'HU', 'IT', 'NL', 'SE', 'SI'],
    podium: [
      { name: 'Alessa Mensch', nationality: 'DE', placement: 1 },
      { name: 'Mikaili Sol', nationality: 'BR', placement: 2 },
      { name: 'Lana Herman', nationality: 'SI', placement: 3 },
      { name: 'Zara Hoogenraad', nationality: 'NL', placement: 4 },
    ],
  },
  {
    slug: 'gka-big-air-mykonos-2026-men',
    name: 'GKA Big Air Mykonos 2026 — Men',
    competition: 'GKA Big Air Mykonos 2026',
    division: 'Men',
    location: 'Mykonos, Greece',
    date: '18–19 Jun 2026',
    isoDate: '2026-06-19',
    source: 'gkakiteworldtour.com (GKA ladder — score only)',
    loadData: () => import('./events/gka-big-air-mykonos-2026-men.json').then((m) => m.default as any),
    winner: 'Leonardo Casati',
    winnerNationality: 'IT',
    athleteCount: 24,
    heatCount: 19,
    countries: ['BR', 'CY', 'DE', 'DK', 'ES', 'GB', 'GR', 'IL', 'IT', 'NL', 'NZ', 'US', 'ZA'],
    podium: [
      { name: 'Leonardo Casati', nationality: 'IT', placement: 1 },
      { name: 'Lorenzo Casati', nationality: 'ES', placement: 2 },
      { name: 'Shahar Tsabary', nationality: 'IL', placement: 3 },
      { name: 'Jamie Overbeek', nationality: 'NL', placement: 4 },
    ],
  },
  {
    slug: 'gka-big-air-mykonos-2026-women',
    name: 'GKA Big Air Mykonos 2026 — Women',
    competition: 'GKA Big Air Mykonos 2026',
    division: 'Women',
    location: 'Mykonos, Greece',
    date: '18–19 Jun 2026',
    isoDate: '2026-06-19',
    source: 'gkakiteworldtour.com (GKA ladder — score only)',
    loadData: () => import('./events/gka-big-air-mykonos-2026-women.json').then((m) => m.default as any),
    winner: 'Mikaili Sol',
    winnerNationality: 'BR',
    athleteCount: 12,
    heatCount: 8,
    countries: ['AT', 'BG', 'BR', 'DE', 'EG', 'ES', 'FR', 'GB', 'GR', 'HU', 'IT', 'SE'],
    podium: [
      { name: 'Mikaili Sol', nationality: 'BR', placement: 1 },
      { name: 'Aya Kasabova', nationality: 'BG', placement: 2 },
      { name: 'Francesca Maini', nationality: 'GB', placement: 3 },
      { name: 'Sarah Sadek', nationality: 'EG', placement: 4 },
    ],
  },
  {
    slug: 'cold-hawaii-big-air-2026-men',
    name: 'Cold Hawaii Big Air 2026 — Men',
    competition: 'Cold Hawaii Big Air 2026',
    division: 'Men',
    location: 'Klitmøller, Denmark',
    date: '6 Sept 2026',
    isoDate: '2026-09-06',
    source: 'heatscoring.com (GKA scoring model)',
    loadData: () => import('./events/cold-hawaii-big-air-2026-men.json').then((m) => m.default as any),
    winner: 'Leonardo Casati',
    winnerNationality: 'IT',
    athleteCount: 18,
    heatCount: 22,
    countries: ['CY', 'DK', 'EE', 'ES', 'FR', 'IL', 'IT', 'NL', 'NZ', 'US', 'ZA'],
    podium: [
      { name: 'Leonardo Casati', nationality: 'IT', placement: 1 },
      { name: 'Lorenzo Casati', nationality: 'ES', placement: 2 },
      { name: 'Stijn Mul', nationality: 'NL', placement: 3 },
    ],
  },
  {
    slug: 'cold-hawaii-big-air-2026-women',
    name: 'Cold Hawaii Big Air 2026 — Women',
    competition: 'Cold Hawaii Big Air 2026',
    division: 'Women',
    location: 'Klitmøller, Denmark',
    date: '6 Sept 2026',
    isoDate: '2026-09-06',
    source: 'heatscoring.com (GKA scoring model)',
    loadData: () => import('./events/cold-hawaii-big-air-2026-women.json').then((m) => m.default as any),
    winner: 'Nathalie Lambrecht',
    winnerNationality: 'SE',
    athleteCount: 6,
    heatCount: 4,
    countries: ['DE', 'EG', 'GB', 'SE', 'SI'],
    podium: [
      { name: 'Nathalie Lambrecht', nationality: 'SE', placement: 1 },
      { name: 'Francesca Maini', nationality: 'GB', placement: 2 },
      { name: 'Sarah Sadek', nationality: 'EG', placement: 3 },
    ],
  },
];

export function getEventBySlug(slug: string): EventMeta | undefined {
  return EVENTS.find((e) => e.slug === slug);
}

export interface CompetitionGroup {
  competition: string;
  location: string;
  date: string;
  source: string;
  divisions: EventMeta[];
}

/** Groups EVENTS by competition, preserving first-seen order (i.e. chronological, since EVENTS is ordered that way), for the index page's one-card-per-competition layout. */
export function groupedEvents(): CompetitionGroup[] {
  const groups: CompetitionGroup[] = [];
  for (const e of EVENTS) {
    let g = groups.find((g) => g.competition === e.competition);
    if (!g) {
      g = { competition: e.competition, location: e.location, date: e.date, source: e.source, divisions: [] };
      groups.push(g);
    }
    g.divisions.push(e);
  }
  return groups;
}

export interface RecentCompetition extends CompetitionGroup {
  isoDate: string;
}

/**
 * The most recently completed competition, by `isoDate` — not just the
 * last item in EVENTS, so this stays correct even if a future competition
 * with an earlier date gets inserted out of chronological order. Used for
 * the home page's "last competition played" recap, which should update
 * itself as new competitions are added rather than being hand-edited.
 */
export function mostRecentCompetition(): RecentCompetition {
  const groups = groupedEvents();
  return groups.reduce((latest, g) => {
    const gIso = g.divisions[0].isoDate;
    const latestIso = latest.divisions[0].isoDate;
    return gIso > latestIso ? { ...g, isoDate: gIso } : latest;
  }, { ...groups[0], isoDate: groups[0].divisions[0].isoDate });
}

/**
 * Site-wide totals for the homepage stats strip, derived from EVENTS so
 * most of it never drifts out of sync. `uniqueRiders` can't be derived the
 * same way (EVENTS only stores per-division counts/podiums, not full
 * rosters) — it's a static count of distinct names across all six
 * divisions' actual profile lists, computed once from the JSON files.
 */
export function siteTotals() {
  const countries = new Set<string>();
  let heats = 0;
  for (const e of EVENTS) {
    heats += e.heatCount;
    e.countries.forEach((c) => countries.add(c));
  }
  return {
    competitions: groupedEvents().length,
    heats,
    countries: countries.size,
    uniqueRiders: 48,
  };
}

/** Every distinct nationality code across all 6 divisions, sorted — for the flag mosaic under the home page stats strip. */
export function siteCountries(): string[] {
  const countries = new Set<string>();
  for (const e of EVENTS) e.countries.forEach((c) => countries.add(c));
  return [...countries].sort();
}

export interface TourSpotlight {
  name: string;
  nationality: string;
  results: { competition: string; slug: string; resultLabel: string }[];
  stats: { label: string; value: string }[];
}

/**
 * The single most striking cross-event storyline in the current data set.
 * Twelve men entered all three events, but Leonardo Casati is the only one
 * of them to reach the Final in all three, champion at two. Verified by
 * checking each of the twelve multi-event riders' max_round_depth against
 * that event's own max heat depth, not just "did they compete" (they all
 * did) or "did they podium" (several did without reaching the Final,
 * since some brackets seed a bronze-medal heat separately). Athlete names
 * were cross-checked and unified across sources first (e.g. "Cohan Van
 * Dijk" vs "Cohan van Dijk", "Stino Mul" vs "Stijn Mul") since inconsistent
 * capitalization/nicknames between sources would otherwise silently split
 * one rider into two and undercount them. `stats` is a season aggregate —
 * 9 heat wins total (1 at Lords of Tram, 4 at GKA Mykonos, 4 at Cold
 * Hawaii) — counted the same way as tourSpotlightMenTie() below.
 */
export function tourSpotlight(): TourSpotlight {
  return {
    name: 'Leonardo Casati',
    nationality: 'IT',
    results: [
      { competition: 'Lords of Tram (GKA France) 2026', slug: 'lords-of-tram-france-2026-men', resultLabel: '3rd place' },
      { competition: 'GKA Big Air Mykonos 2026', slug: 'gka-big-air-mykonos-2026-men', resultLabel: 'Champion' },
      { competition: 'Cold Hawaii Big Air 2026', slug: 'cold-hawaii-big-air-2026-men', resultLabel: 'Champion' },
    ],
    stats: [
      { label: 'Championships', value: '2' },
      { label: 'Heat wins', value: '9' },
      { label: 'Podium finishes', value: '3 of 3' },
    ],
  };
}

export interface SeasonTimelineStop {
  competition: string;
  slug: string;
  month: string;
  winner: string;
  /** Extra badge text for a stop that carries more than just an event win — e.g. Mykonos also being the GKA World Championship. */
  subtitle?: string;
}

/**
 * The season's three stops, chronologically, for the home page's visual
 * timeline. `winner` is each event's own `winner` field from EVENTS above.
 * `subtitle` on the Mykonos stop is real-world context supplied directly
 * (GKA Big Air Mykonos 2026 doubled as the GKA World Championship), not
 * something derivable from the heat/score JSON.
 */
export function seasonTimeline(): SeasonTimelineStop[] {
  return [
    {
      competition: 'Lords of Tram (GKA France) 2026',
      slug: 'lords-of-tram-france-2026-men',
      month: 'March',
      winner: 'Jamie Overbeek',
    },
    {
      competition: 'GKA Big Air Mykonos 2026',
      slug: 'gka-big-air-mykonos-2026-men',
      month: 'June',
      winner: 'Leonardo Casati',
      subtitle: 'GKA World Champion',
    },
    {
      competition: 'Cold Hawaii Big Air 2026',
      slug: 'cold-hawaii-big-air-2026-men',
      month: 'September',
      winner: 'Leonardo Casati',
    },
  ];
}

export interface TiedSeasonStoryline {
  totalWins: number;
  athletes: { name: string; nationality: string; results: { competition: string; slug: string; resultLabel: string }[] }[];
}

/**
 * A second men's storyline, alongside tourSpotlight() — that one is about
 * the single dominant rider (Leonardo Casati); this one is a genuine tie
 * further down the standings. Jamie Overbeek and Lorenzo Casati both
 * closed the season with exactly 7 heat wins in total, reached very
 * differently: Overbeek front-loaded his at Lords of Tram (won it
 * outright, 4 heat wins there) then faded, while Casati built his steadily
 * as a two-time runner-up at GKA Mykonos and Cold Hawaii. Verified
 * per-event: Overbeek 4+1+2, Casati 1+3+3.
 */
export function tourSpotlightMenTie(): TiedSeasonStoryline {
  return {
    totalWins: 7,
    athletes: [
      {
        name: 'Jamie Overbeek',
        nationality: 'NL',
        results: [
          { competition: 'Lords of Tram (GKA France) 2026', slug: 'lords-of-tram-france-2026-men', resultLabel: 'Champion' },
          { competition: 'GKA Big Air Mykonos 2026', slug: 'gka-big-air-mykonos-2026-men', resultLabel: '4th place' },
          { competition: 'Cold Hawaii Big Air 2026', slug: 'cold-hawaii-big-air-2026-men', resultLabel: 'Eliminated in Semi Finals' },
        ],
      },
      {
        name: 'Lorenzo Casati',
        nationality: 'ES',
        results: [
          { competition: 'Lords of Tram (GKA France) 2026', slug: 'lords-of-tram-france-2026-men', resultLabel: 'Eliminated in Round 3' },
          { competition: 'GKA Big Air Mykonos 2026', slug: 'gka-big-air-mykonos-2026-men', resultLabel: '2nd place' },
          { competition: 'Cold Hawaii Big Air 2026', slug: 'cold-hawaii-big-air-2026-men', resultLabel: '2nd place' },
        ],
      },
    ],
  };
}

/**
 * The women's-side counterpart to tourSpotlight() above — but the real
 * storyline here isn't one dominant rider, it's a three-way tie. Francesca
 * Maini, Nathalie Lambrecht, and Sarah Sadek are the only three women to
 * enter all three events, and each finished the season with exactly 3 heat
 * wins in total (verified per-event: Maini 1+1+1, Lambrecht 0+1+2, Sadek
 * 1+1+1 — same season total via different paths). resultLabel per event
 * mirrors raceStandings()' own logic (Final placement vs. "Eliminated in
 * <round>"), cross-checked against each event's own podium array above.
 */
export function tourSpotlightWomen(): TiedSeasonStoryline {
  return {
    totalWins: 3,
    athletes: [
      {
        name: 'Francesca Maini',
        nationality: 'GB',
        results: [
          { competition: 'Lords of Tram (GKA France) 2026', slug: 'lords-of-tram-france-2026-women', resultLabel: 'Eliminated in Semi Finals' },
          { competition: 'GKA Big Air Mykonos 2026', slug: 'gka-big-air-mykonos-2026-women', resultLabel: '3rd place' },
          { competition: 'Cold Hawaii Big Air 2026', slug: 'cold-hawaii-big-air-2026-women', resultLabel: '2nd place' },
        ],
      },
      {
        name: 'Nathalie Lambrecht',
        nationality: 'SE',
        results: [
          { competition: 'Lords of Tram (GKA France) 2026', slug: 'lords-of-tram-france-2026-women', resultLabel: 'Eliminated in Round 2' },
          { competition: 'GKA Big Air Mykonos 2026', slug: 'gka-big-air-mykonos-2026-women', resultLabel: 'Eliminated in Round 1' },
          { competition: 'Cold Hawaii Big Air 2026', slug: 'cold-hawaii-big-air-2026-women', resultLabel: 'Champion' },
        ],
      },
      {
        name: 'Sarah Sadek',
        nationality: 'EG',
        results: [
          { competition: 'Lords of Tram (GKA France) 2026', slug: 'lords-of-tram-france-2026-women', resultLabel: 'Eliminated in Semi Finals' },
          { competition: 'GKA Big Air Mykonos 2026', slug: 'gka-big-air-mykonos-2026-women', resultLabel: '4th place' },
          { competition: 'Cold Hawaii Big Air 2026', slug: 'cold-hawaii-big-air-2026-women', resultLabel: '3rd place' },
        ],
      },
    ],
  };
}

export interface ConcentrationFact {
  label: string;
  value: string;
  detail: string;
}

/**
 * Two facts about how concentrated (vs. wide-open) each event's results
 * were — a different flavor from the record-style tiles above, about tour
 * depth rather than any single standout performance.
 * - Heat-winners parity: in every one of the three men's events, exactly
 *   12 riders ever won a heat — verified by counting distinct
 *   `placement === 1` names per event's heats and comparing against that
 *   event's own roster size (24, 24, 18).
 * - Nations in every men's event: the 8 countries with at least one rider
 *   in all three men's competitions, via set intersection of each event's
 *   distinct `nationality` values.
 */
export function fieldConcentrationFacts(): ConcentrationFact[] {
  return [
    {
      label: 'Heat-winners parity',
      value: '12 riders',
      detail: "Exactly 12 riders won at least one heat in every men's event — Lords of Tram (12 of 24), GKA Mykonos (12 of 24), Cold Hawaii (12 of 18)",
    },
    {
      label: "Nations in every men's event",
      value: '8 countries',
      detail: 'Denmark, Spain, Israel, Italy, Netherlands, New Zealand, USA, South Africa — the only nations to enter a rider in all three',
    },
  ];
}

export interface FieldFact {
  label: string;
  value: string;
  detail: string;
  /** Deep link into the Athletes search for facts with one unambiguous answer (a single nation/brand) — omitted for ties like "Most riders, nation" (NL and FR tied at 8), since there's no single destination to send someone to. */
  to?: string;
}

/**
 * Field-composition facts across all 48 unique riders and six divisions.
 * "Wins" here means event championships (the JSON's own `winner` field per
 * division), not heat wins. Computed by grouping the deduped roster by
 * nationality and by sponsor (src/data/athleteBrands.json, provided
 * directly rather than scraped) — see the counts below, tallied by hand
 * against both source lists before hardcoding.
 */
export interface CompositionSegment {
  label: string;
  count: number;
}

/**
 * Nationality breakdown across all 48 unique riders (top 5 + "Other"),
 * feeding the mini composition bar on the "Most riders, nation" home tile.
 * Tallied from every profile's own `nationality` field across all 6 event
 * JSON files, deduped to the same 48-rider roster used everywhere else on
 * the site.
 */
export function nationComposition(): CompositionSegment[] {
  return [
    { label: 'NL', count: 8 },
    { label: 'FR', count: 8 },
    { label: 'IT', count: 4 },
    { label: 'DE', count: 4 },
    { label: 'ZA', count: 3 },
    { label: 'Other', count: 21 },
  ];
}

/**
 * Sponsor breakdown across all 48 unique riders (top 4 + "Other" — the 5th
 * spot is a 4-way tie at 3 riders each, not worth an arbitrary tie-break).
 * Tallied by cross-referencing every rider against athleteBrands.json.
 */
export function brandComposition(): CompositionSegment[] {
  return [
    { label: 'Harlem', count: 8 },
    { label: 'F-ONE', count: 6 },
    { label: 'Duotone', count: 6 },
    { label: 'North', count: 5 },
    { label: 'Other', count: 23 },
  ];
}

export function fieldFacts(): FieldFact[] {
  return [
    { label: 'Most riders, nation', value: '🇳🇱 NL / 🇫🇷 FR', detail: '8 riders each, out of 48 total' },
    { label: 'Most event wins, nation', value: '🇮🇹 Italy', detail: '2 of 6 championships (both Leonardo Casati)', to: '/athletes?q=IT' },
    { label: 'Most riders, brand', value: 'Harlem', detail: '8 riders across both divisions', to: '/athletes?q=Harlem' },
    { label: 'Most podiums, brand', value: 'Harlem', detail: '8 of 18 total podium spots, across 5 different riders', to: '/athletes?q=Harlem' },
  ];
}

export interface SeasonFact {
  label: string;
  value: string;
  detail: string;
  /** Omitted when the fact spans more than one event (e.g. Wipeouts pools Cold Hawaii + Lords of Tram) — there's no single event to send someone to. */
  slug?: string;
}

/**
 * Two more cross-event facts, same spirit as the spotlight above: real
 * storylines, not dataset trivia. Computed by scanning every heat/profile
 * across all six divisions:
 * - Tightest heat of the season: smallest 1st-vs-2nd margin in any heat,
 *   anywhere — a same-scoring-system, same-heat comparison, so it's always
 *   fair regardless of which source's numbers are involved.
 * - Wipeout count: total crashes/attempts across the four rich-schema
 *   divisions only (Cold Hawaii + Lords of Tram) — the two GKA Mykonos
 *   divisions use the reduced ladder schema and don't publish crash counts
 *   at all, so they're correctly excluded rather than assumed crash-free.
 */
export function seasonFacts(): SeasonFact[] {
  return [
    {
      label: 'Tightest heat of the season',
      value: 'Won by 0.01',
      detail: 'Stijn Mul over Shahar Tsabary · Cold Hawaii Semi Finals',
      slug: 'cold-hawaii-big-air-2026-men',
    },
    {
      label: 'Wipeouts this season',
      value: '281',
      detail: '281 crashes across 1,186 attempts (23.7%), from Cold Hawaii and Lords of Tram only, the two events with move-by-move data',
    },
    {
      label: 'Biggest blowout',
      value: '+9.14',
      detail: 'Mikaili Sol over Eszter Nagy · GKA Mykonos Women, Round 1',
      slug: 'gka-big-air-mykonos-2026-women',
    },
    {
      label: "Season's biggest trick",
      value: '10.00',
      detail: 'Jamie Overbeek · Lords of Tram Final',
      slug: 'lords-of-tram-france-2026-men',
    },
    {
      label: 'Most consistent rider',
      value: 'Jamie Overbeek',
      detail: '3 crashes in 56 attempts (5.4%) — the lowest crash rate of the season, across Lords of Tram and Cold Hawaii',
    },
    {
      label: 'Longest win streak',
      value: '4 heats',
      detail: 'A three-way tie: Leonardo Casati (GKA Mykonos and Cold Hawaii) and Jamie Overbeek (Lords of Tram)',
    },
    {
      label: 'Most balanced event',
      value: 'Lords of Tram Women',
      detail: 'Population std. dev. of 3.19 across every recorded score — the tightest field of the season. GKA Mykonos Men was close behind at 3.20',
      slug: 'lords-of-tram-france-2026-women',
    },
  ];
}
