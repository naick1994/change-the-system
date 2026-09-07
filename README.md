# Megaloop

Stats, athlete profiles, and head-to-head comparisons for kitesurf Big Air
competitions. Static site, one page per competition, built to grow event
after event without being centered on any one athlete.

Vite + React + TypeScript + Tailwind + shadcn/ui, deployed to GitHub Pages.
Structurally based on the `big-air-scoring-system` repo (same build/deploy
pipeline, same component conventions), with everything specific to that
project's live judging tool and WOO/Capital.com branding stripped out.

## What's here

- `src/pages/EventsIndex.tsx` — lists every competition in `src/data/eventsIndex.ts`
- `src/pages/EventPage.tsx` — loads one event's dataset and mounts the Explorer
- `src/components/explorer/`:
  - `Explorer.tsx` — top-level KPI row, tab switching (Athletes / Bracket / Compare)
  - `Leaderboard.tsx` — Result (actual bracket placement) vs Stats (sortable
    averages) toggle — kept as two separate views on purpose, see below
  - `RaceStandings.tsx` — the "Result" view: ranked by how far each athlete
    got in the bracket, not by any stat average
  - `Bracket.tsx` — every heat, every round, grouped by `round_depth`
  - `AthleteDetail.tsx` — round-progress ladder, stat cards, heat-by-heat
    chart and log; branches on rich vs. reduced schema (see below)
  - `Compare.tsx` — two-athlete delta table + radar chart
  - `Avatar.tsx` — initials + nationality flag, no photos (source has none)
  - `format.ts` — shared helpers: schema detection, round ordering/labels,
    race-standings ranking, flag emoji, avatar color
- `src/data/events/*.json` — one dataset per competition
- `src/types/bigAirEvent.ts` — the schema, documented inline
- `scripts/` — the Python pipelines that produced each dataset, kept for
  reference (not run automatically)

## Competitions wired up

| Event | Slug | Schema |
|---|---|---|
| Cold Hawaii Big Air 2026 — Men | `cold-hawaii-big-air-2026-men` | Rich |
| Cold Hawaii Big Air 2026 — Women | `cold-hawaii-big-air-2026-women` | Rich |
| GKA Big Air Mykonos 2026 — Men | `gka-big-air-mykonos-2026-men` | Reduced |
| GKA Big Air Mykonos 2026 — Women | `gka-big-air-mykonos-2026-women` | Reduced |

**Not wired up, on purpose:** Lords of Tram (GKA France) 2026 — the only
sources found either show all-zero scores or an explicitly-labelled "TEST"
bracket. Red Bull King of the Air 2025 — only the podium is confirmed
(no heat-by-heat data found), so there's nothing to build an Explorer page
around yet. Don't add either without a real primary source; a plausible
podium guess is not good enough.

## Result vs. Stats — why both exist

The leaderboard has two toggled views because they can genuinely disagree:
**Result** ranks by what actually happened in the bracket (round reached,
then in-heat placement — computed in `raceStandings()`); **Stats** ranks by
heat-scoring averages across the event. A finalist who scored lower in the
final than their own average across earlier rounds can out-average the
champion. Showing one blended ranking hides this; showing both makes it
legible. `RaceStandings`/`raceStandings()` never assume the final is
round_depth 5 — it uses whatever the deepest round in that event's bracket
actually is, and it doesn't assume the final only has 3 participants (some
brackets run 4-way finals).

## Two data schemas — read before adding a new competition

Sources publish different amounts of detail. `isRichSchema()` in
`format.ts` detects which one a given event uses (checks whether heat
participants have a `result` field), and every component that shows
scoring detail branches on it — reduced-schema events never get rich
fields faked as zero.

- **Rich** (heatscoring.com / GKA-Livewire sources, e.g. Cold Hawaii): every
  attempt is scored. `"crash"` = an attempt recorded as `0`, exactly as the
  source platform labels it. `"result"` = sum of the top 3 non-crash
  attempts in that heat, not everything landed. `auto_imp` (0-7 variety)
  and `impression` (0-3 judges' bonus) sum with result into `total`. These
  are GKA/heatscoring-specific — re-verify against a new source's own
  displayed numbers before reusing the aggregation.
- **Reduced** (GKA World Tour ladder pages, e.g. Mykonos): only a single
  combined judges' `score` per athlete per heat is published — no move
  breakdown, no crash count, no variety/impression split. Profiles carry
  `avg_score`/`best_score`/`stdev_score` instead of the rich fields, and a
  `schema_note` on the event explaining what's missing.

Round names also vary by source and aren't a closed set (`'Semi Finals'` vs
`'Semi-Finals'`, `'Round W1'`/`'Round W2'` for a smaller women's bracket,
etc.) — `Round` is typed as `string`. Never group or order heats by
matching the literal round-name string; always use `round_depth` (the
`eventRounds()` helper derives the event's actual stages from it). Don't
assume every bracket has 5 rounds or that the final is always depth 5 in
absolute terms across different-sized brackets — `raceStandings()` and
`RoundLadder` both derive this from the data instead of hardcoding it.

## Adding a new competition

1. Extract the raw heat data from the new source. For a heatscoring.com-style
   source, `scripts/coldhawaii_full.py` / `coldhawaii_women.py` show the
   shape of hand-transcribed data `dataset_builder.py` expects. For a GKA
   ladder page, `scripts/gka_mykonos_raw.py` shows how to pull it from the
   DOM (`admin-ajax.php` response, `.gkaladders-heat` / `.gkaladders-rider`).
2. Re-verify the scoring-model points above against the new source before
   reusing the aggregation scripts as-is — don't assume a new source
   matches either schema without checking its own displayed numbers.
3. Produce a JSON file matching `src/types/bigAirEvent.ts` (rich or reduced
   shape) and drop it in `src/data/events/`.
4. Add one entry to `src/data/eventsIndex.ts` (slug, name, location, date,
   `source` label, and a `loadData` dynamic import pointing at the new
   file).

That's the whole integration surface — the Explorer component itself
doesn't need to change, it already branches on schema and round structure.

## Local development

```bash
npm install
npm run dev      # http://localhost:8081/change-the-system/ (or next free port)
npm run build    # outputs to dist/
```

## Not done yet

- No custom favicon/OG image yet — using defaults.
- No real athlete photos — the only source checked
  (coldhawaiigames.thewindgames.app) doesn't have any either, just
  initials + flag badges, which is what `Avatar.tsx` replicates.
- Lords of Tram and Red Bull King of the Air are not wired up (see above) —
  needs either a better primary source or a "podium only" card type that
  doesn't try to mount the full Explorer.
- Deploy is handled manually (GitHub Actions workflow is in place and
  mirrors the sibling repos, but nothing has been pushed to a remote yet).
