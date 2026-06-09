import type {
  BracketPrediction,
  GroupPrediction,
  KnockoutMatch,
  KnockoutRound,
} from '@/types';
import { GROUPS, GROUP_IDS, getTeam } from '@/data/teams';

// ---------------------------------------------------------------------------
// Tournament logic for the 48-team / 12-group World Cup 2026 format.
//
//   • 12 groups of 4 → top 2 of each group advance (24 teams)
//   • 8 best third-placed teams advance              (+8 teams) = 32
//   • Single-elimination Round of 32 → R16 → QF → SF → Final
//   • Plus a third-place playoff between the two semi-final losers
// ---------------------------------------------------------------------------

/**
 * Fixed Round-of-32 seeding template. Each entry is a "slot key":
 *   W:<group>  → predicted 1st place of that group
 *   R:<group>  → predicted 2nd place of that group
 *   T:<n>      → the n-th selected best third-placed team (0..7)
 *
 * The 32 keys are paired consecutively (0+1, 2+3, …) into 16 matches.
 * No match pairs a group's winner against its own runner-up.
 *
 * This is a *simplified* deterministic bracket — the official 2026 third-place
 * allocation table can replace this array without touching the rest of the app.
 */
const R32_SEED_ORDER: string[] = [
  'W:A', 'T:0', 'W:B', 'R:C', 'W:C', 'R:D', 'W:D', 'T:1',
  'W:E', 'R:F', 'W:F', 'T:2', 'W:G', 'R:H', 'W:H', 'T:3',
  'W:I', 'R:J', 'W:J', 'T:4', 'W:K', 'R:L', 'W:L', 'T:5',
  'R:A', 'T:6', 'R:B', 'R:E', 'R:G', 'T:7', 'R:I', 'R:K',
];

export const ROUND_LABELS: Record<KnockoutRound, string> = {
  R32: 'Round of 32',
  R16: 'Round of 16',
  QF: 'Quarter Finals',
  SF: 'Semi Finals',
  THIRD: 'Third Place Match',
  FINAL: 'The Final',
};

/** Ordered rounds as displayed left→right on the bracket. */
export const ROUND_FLOW: KnockoutRound[] = ['R32', 'R16', 'QF', 'SF', 'FINAL'];

function resolveSlot(
  key: string,
  groupPredictions: GroupPrediction[],
  thirdPlaceQualifiers: string[]
): string | null {
  const [kind, ref] = key.split(':');
  if (kind === 'T') return thirdPlaceQualifiers[Number(ref)] ?? null;
  const gp = groupPredictions.find((g) => g.groupId === ref);
  if (!gp) return null;
  const index = kind === 'W' ? 0 : 1; // winner vs runner-up
  return gp.orderedTeamIds[index] ?? null;
}

/**
 * Build a fresh knockout tree from group standings + selected third-place teams.
 * R32 is pre-filled with resolved teams; later rounds start empty and fill in
 * as winners are chosen.
 */
export function generateKnockout(
  groupPredictions: GroupPrediction[],
  thirdPlaceQualifiers: string[]
): KnockoutMatch[] {
  const matches: KnockoutMatch[] = [];

  // Round of 32 — 16 matches with teams resolved from the seeding template.
  for (let i = 0; i < 16; i++) {
    const teamA = resolveSlot(R32_SEED_ORDER[i * 2], groupPredictions, thirdPlaceQualifiers);
    const teamB = resolveSlot(R32_SEED_ORDER[i * 2 + 1], groupPredictions, thirdPlaceQualifiers);
    matches.push({
      id: `R32-${i}`,
      round: 'R32',
      position: i,
      teamA,
      teamB,
      winnerId: null,
      nextMatchId: `R16-${Math.floor(i / 2)}`,
      nextSlot: i % 2 === 0 ? 'A' : 'B',
    });
  }

  // Helper to add a standard knockout round that feeds the next.
  const addRound = (round: KnockoutRound, count: number, nextRound: KnockoutRound | null) => {
    for (let i = 0; i < count; i++) {
      matches.push({
        id: `${round}-${i}`,
        round,
        position: i,
        teamA: null,
        teamB: null,
        winnerId: null,
        nextMatchId: nextRound ? `${nextRound}-${Math.floor(i / 2)}` : null,
        nextSlot: nextRound ? (i % 2 === 0 ? 'A' : 'B') : null,
      });
    }
  };

  addRound('R16', 8, 'QF');
  addRound('QF', 4, 'SF');

  // Semi-finals: winners flow to the FINAL, losers flow to the THIRD-place match.
  for (let i = 0; i < 2; i++) {
    matches.push({
      id: `SF-${i}`,
      round: 'SF',
      position: i,
      teamA: null,
      teamB: null,
      winnerId: null,
      nextMatchId: 'FINAL-0',
      nextSlot: i === 0 ? 'A' : 'B',
      feedsThirdMatchId: 'THIRD-0',
      feedsThirdSlot: i === 0 ? 'A' : 'B',
    });
  }

  matches.push({
    id: 'THIRD-0', round: 'THIRD', position: 0,
    teamA: null, teamB: null, winnerId: null, nextMatchId: null, nextSlot: null,
  });
  matches.push({
    id: 'FINAL-0', round: 'FINAL', position: 0,
    teamA: null, teamB: null, winnerId: null, nextMatchId: null, nextSlot: null,
  });

  return matches;
}

const byId = (matches: KnockoutMatch[]) =>
  Object.fromEntries(matches.map((m) => [m.id, m])) as Record<string, KnockoutMatch>;

/**
 * Pick a winner for a match and propagate it forward. If the choice changes an
 * existing result, every downstream slot fed by this match is cleared so the
 * bracket can never hold a stale, impossible team.
 */
export function pickWinner(
  matches: KnockoutMatch[],
  matchId: string,
  teamId: string
): KnockoutMatch[] {
  const next = matches.map((m) => ({ ...m }));
  const map = byId(next);
  const match = map[matchId];
  if (!match) return next;
  if (match.winnerId === teamId) return next; // no-op

  const loserId = match.teamA === teamId ? match.teamB : match.teamA;
  match.winnerId = teamId;

  // Propagate the winner to the next match slot, clearing it first.
  if (match.nextMatchId && match.nextSlot) {
    placeAndClear(map, match.nextMatchId, match.nextSlot, teamId);
  }
  // Semi-finals also feed the third-place match with the loser.
  if (match.feedsThirdMatchId && match.feedsThirdSlot && loserId) {
    placeAndClear(map, match.feedsThirdMatchId, match.feedsThirdSlot, loserId);
  }

  return next;
}

/** Set one slot of a downstream match; if it changed, recursively invalidate. */
function placeAndClear(
  map: Record<string, KnockoutMatch>,
  matchId: string,
  slot: 'A' | 'B',
  teamId: string
) {
  const m = map[matchId];
  if (!m) return;
  const key = slot === 'A' ? 'teamA' : 'teamB';
  if (m[key] === teamId) return; // unchanged → downstream still valid

  m[key] = teamId;

  // The incoming team changed, so any previously chosen winner here is now suspect.
  if (m.winnerId !== null) {
    const stillValid = m.winnerId === m.teamA || m.winnerId === m.teamB;
    if (!stillValid) clearForward(map, m);
  }
}

/** Clear a match's result and cascade the clear to everything it feeds. */
function clearForward(map: Record<string, KnockoutMatch>, m: KnockoutMatch) {
  const previousWinner = m.winnerId;
  m.winnerId = null;
  if (m.nextMatchId && m.nextSlot) {
    const target = map[m.nextMatchId];
    const key = m.nextSlot === 'A' ? 'teamA' : 'teamB';
    if (target && target[key] === previousWinner) {
      target[key] = null;
      clearForward(map, target);
    }
  }
  if (m.feedsThirdMatchId && m.feedsThirdSlot) {
    const target = map[m.feedsThirdMatchId];
    const key = m.feedsThirdSlot === 'A' ? 'teamA' : 'teamB';
    if (target) {
      target[key] = null;
      clearForward(map, target);
    }
  }
}

export function getMatch(matches: KnockoutMatch[], id: string) {
  return matches.find((m) => m.id === id);
}

export function getRoundMatches(matches: KnockoutMatch[], round: KnockoutRound) {
  return matches.filter((m) => m.round === round).sort((a, b) => a.position - b.position);
}

export function getChampion(matches: KnockoutMatch[]): string | null {
  return getMatch(matches, 'FINAL-0')?.winnerId ?? null;
}

export function getRunnerUp(matches: KnockoutMatch[]): string | null {
  const final = getMatch(matches, 'FINAL-0');
  if (!final?.winnerId) return null;
  return final.winnerId === final.teamA ? final.teamB : final.teamA;
}

// ---- Completeness checks ---------------------------------------------------

export function allGroupsRanked(groupPredictions: GroupPrediction[]): boolean {
  if (groupPredictions.length !== GROUP_IDS.length) return false;
  return groupPredictions.every((gp) => gp.orderedTeamIds.length === 4);
}

export function thirdPlaceCount(thirds: string[]): number {
  return thirds.length;
}

export function isKnockoutComplete(matches: KnockoutMatch[]): boolean {
  return matches.every((m) => m.winnerId !== null);
}

/** Default group predictions = teams in their data order (no opinion yet). */
export function defaultGroupPredictions(): GroupPrediction[] {
  return GROUPS.map((g) => ({
    groupId: g.id,
    orderedTeamIds: g.teams.map((tm) => tm.id),
    rankedCount: 0,
  }));
}

/** The set of teams a user *could* pick as their 8 best thirds (12 of them). */
export function thirdPlacedTeamIds(groupPredictions: GroupPrediction[]): string[] {
  return groupPredictions
    .map((gp) => gp.orderedTeamIds[2])
    .filter((id): id is string => Boolean(id));
}

// ---- Smart predict / randomize --------------------------------------------

/** Rank a group by FIFA ranking (lower number = better). */
export function smartRankGroup(orderedTeamIds: string[]): string[] {
  return [...orderedTeamIds].sort((a, b) => {
    const ra = getTeam(a)?.fifaRank ?? 999;
    const rb = getTeam(b)?.fifaRank ?? 999;
    return ra - rb;
  });
}

/**
 * Seed the selected best-third teams #1..#8 by FIFA ranking (best = #1).
 * Returns a map of teamId → seed number. Mirrors the idea that FIFA assigns
 * each qualifying third-placed team to a predetermined R32 slot.
 */
export function thirdPlaceSeeds(thirdPlaceQualifiers: string[]): Record<string, number> {
  const ranked = [...thirdPlaceQualifiers].sort((a, b) => {
    const ra = getTeam(a)?.fifaRank ?? 999;
    const rb = getTeam(b)?.fifaRank ?? 999;
    return ra - rb;
  });
  return Object.fromEntries(ranked.map((id, i) => [id, i + 1]));
}

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Auto-resolve every knockout match by always advancing the better-ranked
 * (lower FIFA number) team. Used by Smart Predict.
 */
export function autoResolveByRank(matches: KnockoutMatch[]): KnockoutMatch[] {
  let result = matches;
  for (const round of ['R32', 'R16', 'QF', 'SF', 'THIRD', 'FINAL'] as KnockoutRound[]) {
    for (const m of getRoundMatches(result, round)) {
      const fresh = getMatch(result, m.id)!;
      if (!fresh.teamA || !fresh.teamB) continue;
      const rankA = getTeam(fresh.teamA)?.fifaRank ?? 999;
      const rankB = getTeam(fresh.teamB)?.fifaRank ?? 999;
      const winner = rankA <= rankB ? fresh.teamA : fresh.teamB;
      result = pickWinner(result, m.id, winner);
    }
  }
  return result;
}

/** Auto-resolve every match by random coin-flip. Used by Randomize. */
export function autoResolveRandom(matches: KnockoutMatch[]): KnockoutMatch[] {
  let result = matches;
  for (const round of ['R32', 'R16', 'QF', 'SF', 'THIRD', 'FINAL'] as KnockoutRound[]) {
    for (const m of getRoundMatches(result, round)) {
      const fresh = getMatch(result, m.id)!;
      if (!fresh.teamA || !fresh.teamB) continue;
      const winner = Math.random() < 0.5 ? fresh.teamA : fresh.teamB;
      result = pickWinner(result, m.id, winner);
    }
  }
  return result;
}

// ---- Share-code encoding ---------------------------------------------------

/** Encode a prediction into a compact, URL-safe base64 string. */
export function encodeShareCode(prediction: BracketPrediction): string {
  const json = JSON.stringify(prediction);
  // Handle unicode (flag emojis) safely before base64.
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeShareCode(code: string): BracketPrediction | null {
  try {
    const padded = code.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json) as BracketPrediction;
  } catch {
    return null;
  }
}

export function shortCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}
