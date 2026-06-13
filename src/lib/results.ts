// ---------------------------------------------------------------------------
// Live(ish) match results from openfootball/worldcup.json.
//
// Public-domain JSON, no API key, no auth. Served from the jsDelivr CDN so it
// is CORS-friendly and cacheable. Results are community-maintained, so they
// land within hours of a match finishing rather than second-by-second.
//
// We match feed fixtures to our own GROUP_MATCHES on the team-name pair (order
// independent) plus the calendar date, with light name normalisation to absorb
// spelling differences between the two datasets.
// ---------------------------------------------------------------------------

const FEED_URL =
  'https://cdn.jsdelivr.net/gh/openfootball/worldcup.json@master/2026/worldcup.json';

/** Full-time result for a single fixture, oriented to the caller's home/away. */
export interface MatchResult {
  home: number;
  away: number;
}

/** Internal store: goals keyed by each team's normalised name. */
interface PairScore {
  [normTeamName: string]: number;
}

interface FeedMatch {
  date?: string;
  team1?: string;
  team2?: string;
  group?: string;
  score?: { ft?: [number, number]; ht?: [number, number] };
}

interface Feed {
  matches?: FeedMatch[];
}

/**
 * Normalise a team name so the two feeds line up despite spelling differences
 * (Türkiye/Turkey, USA/United States, accents, casing, punctuation).
 */
function normName(name: string): string {
  const base = name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .replace(/[^a-z0-9]/g, ''); // drop spaces/punctuation

  // Map every known spelling variant to a single canonical token. Verified
  // against the openfootball 2026 feed (e.g. "Bosnia & Herzegovina", "USA",
  // "Czech Republic") vs. our own team names.
  const aliases: Record<string, string> = {
    usa: 'unitedstates',
    us: 'unitedstates',
    turkiye: 'turkey',
    czechrepublic: 'czechia',
    korearepublic: 'southkorea',
    democraticrepublicofthecongo: 'drcongo',
    capeverdeislands: 'capeverde',
    bosniaherzegovina: 'bosniaandherzegovina',
    bosnia: 'bosniaandherzegovina',
    cotedivoire: 'ivorycoast',
  };

  return aliases[base] ?? base;
}

/** Stable, order-independent key for a fixture: sorted team pair + date. */
function pairKey(a: string, b: string, date: string): string {
  return [normName(a), normName(b)].sort().join('|') + '@' + date;
}

/** Return the given ISO date plus offset days (e.g. -1, 0, +1) as "YYYY-MM-DD". */
function shiftDate(date: string, days: number): string {
  const d = new Date(date + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * Fetch results and return a Map keyed by pairKey -> { home, away } in the
 * feed's own team order. Callers resolve home/away orientation themselves.
 */
export async function fetchResults(signal?: AbortSignal): Promise<Map<string, PairScore>> {
  const res = await fetch(FEED_URL, { signal });
  if (!res.ok) throw new Error(`Results feed returned ${res.status}`);

  const data = (await res.json()) as Feed;
  const map = new Map<string, PairScore>();

  for (const m of data.matches ?? []) {
    const ft = m.score?.ft;
    if (!m.team1 || !m.team2 || !m.date || !ft || ft.length !== 2) continue;
    map.set(pairKey(m.team1, m.team2, m.date), {
      [normName(m.team1)]: ft[0],
      [normName(m.team2)]: ft[1],
    });
  }

  return map;
}

/**
 * Look up the result for a fixture given our (homeTeam, awayTeam, date),
 * returning the score oriented to OUR home/away order, or null if unplayed.
 */
export function resultFor(
  results: Map<string, PairScore>,
  homeTeam: string,
  awayTeam: string,
  date: string,
): MatchResult | null {
  // Our date is Oslo-local; the feed uses the match's local (US) date, so the
  // calendar day can differ by one for late kickoffs. Try the exact day first,
  // then ±1.
  const hit =
    results.get(pairKey(homeTeam, awayTeam, date)) ??
    results.get(pairKey(homeTeam, awayTeam, shiftDate(date, -1))) ??
    results.get(pairKey(homeTeam, awayTeam, shiftDate(date, 1)));
  if (!hit) return null;

  const home = hit[normName(homeTeam)];
  const away = hit[normName(awayTeam)];
  if (home === undefined || away === undefined) return null;
  return { home, away };
}
