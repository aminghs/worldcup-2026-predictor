// ---------------------------------------------------------------------------
// Group-stage constraint engine.
//
// Given real match results, work out which finishing positions are still
// reachable for each team in a group, so the UI can stop users predicting an
// outcome that has become mathematically impossible.
//
// Each group is 4 teams / 6 matches, so we brute-force every win/draw/loss
// combination of the unplayed matches (≤ 3^6 = 729) — instant in the browser.
//
// Soundness rule: we only ever declare a position *impossible* when it truly
// is. When margins/tiebreakers leave any doubt we resolve it in the direction
// that keeps the pick allowed, so a legitimate prediction is never blocked.
//
//   • guaranteedTop2  — team finishes 1st or 2nd in EVERY remaining scenario
//   • eliminatedTop2  — team finishes 3rd or 4th in EVERY remaining scenario
//   • decided         — all 6 matches played; the standing is fixed
//
// Tiebreakers use points → goal difference → goals scored → FIFA rank. That is
// the realistic, feed-supported subset of FIFA's full rules (head-to-head and
// fair-play are omitted).
// ---------------------------------------------------------------------------

import type { GroupMatch } from '@/data/groupMatches';
import { GROUP_MATCHES } from '@/data/groupMatches';
import { GROUPS, getTeam, getTeamByName } from '@/data/teams';
import type { MatchResult } from '@/lib/results';

export interface TeamConstraint {
  teamId: string;
  guaranteedTop2: boolean;
  eliminatedTop2: boolean;
  /** Final position 0..3 once the group is fully decided, else null. */
  decidedRank: number | null;
}

export interface GroupConstraint {
  groupId: string;
  decided: boolean;
  /** Final team order (1st→4th) when decided, else null. */
  finalOrder: string[] | null;
  teams: Record<string, TeamConstraint>;
}

type ResultLookup = (homeTeam: string, awayTeam: string, date: string) => MatchResult | null;

interface Stat {
  points: number;
  gd: number;
  gf: number;
}

interface PlayedMatch {
  homeId: string;
  awayId: string;
  home: number;
  away: number;
}

interface RemainingMatch {
  homeId: string;
  awayId: string;
}

const emptyStat = (): Stat => ({ points: 0, gd: 0, gf: 0 });

function applyScore(stat: Record<string, Stat>, homeId: string, awayId: string, hg: number, ag: number) {
  stat[homeId].gf += hg;
  stat[awayId].gf += ag;
  stat[homeId].gd += hg - ag;
  stat[awayId].gd += ag - hg;
  if (hg > ag) stat[homeId].points += 3;
  else if (ag > hg) stat[awayId].points += 3;
  else {
    stat[homeId].points += 1;
    stat[awayId].points += 1;
  }
}

/** Order team ids 1st→4th by points → GD → GF → FIFA rank (deterministic). */
function rankOrder(teamIds: string[], stat: Record<string, Stat>): string[] {
  return [...teamIds].sort((a, b) => {
    const sa = stat[a];
    const sb = stat[b];
    if (sb.points !== sa.points) return sb.points - sa.points;
    if (sb.gd !== sa.gd) return sb.gd - sa.gd;
    if (sb.gf !== sa.gf) return sb.gf - sa.gf;
    return (getTeam(a)?.fifaRank ?? 999) - (getTeam(b)?.fifaRank ?? 999);
  });
}

/**
 * Compute the constraint for a single group given a result lookup. With no
 * results available yet, every team is unconstrained.
 */
export function computeGroupConstraints(groupId: string, getResult: ResultLookup): GroupConstraint {
  const teams = GROUPS.find((g) => g.id === groupId)?.teams ?? [];
  const teamIds = teams.map((t) => t.id);

  const unconstrained = (): GroupConstraint => ({
    groupId,
    decided: false,
    finalOrder: null,
    teams: Object.fromEntries(
      teamIds.map((id) => [id, { teamId: id, guaranteedTop2: false, eliminatedTop2: false, decidedRank: null }]),
    ),
  });

  if (teamIds.length !== 4) return unconstrained();

  const matches: GroupMatch[] = GROUP_MATCHES.filter((m) => m.group === groupId);
  const played: PlayedMatch[] = [];
  const remaining: RemainingMatch[] = [];

  for (const m of matches) {
    const homeId = getTeamByName(m.homeTeam)?.id;
    const awayId = getTeamByName(m.awayTeam)?.id;
    if (!homeId || !awayId) continue;
    const r = getResult(m.homeTeam, m.awayTeam, m.date);
    if (r) played.push({ homeId, awayId, home: r.home, away: r.away });
    else remaining.push({ homeId, awayId });
  }

  // Nothing played yet → no constraints.
  if (played.length === 0) return unconstrained();

  // Base table from played matches.
  const base: Record<string, Stat> = Object.fromEntries(teamIds.map((id) => [id, emptyStat()]));
  for (const p of played) applyScore(base, p.homeId, p.awayId, p.home, p.away);

  // Group fully decided → fixed standings.
  if (remaining.length === 0) {
    const finalOrder = rankOrder(teamIds, base);
    return {
      groupId,
      decided: true,
      finalOrder,
      teams: Object.fromEntries(
        finalOrder.map((id, rank) => [
          id,
          { teamId: id, guaranteedTop2: rank < 2, eliminatedTop2: rank >= 2, decidedRank: rank },
        ]),
      ),
    };
  }

  // Brute-force every win/draw/loss combination of the remaining matches.
  // We only need points per team for the feasibility counts; goal margins are
  // handled by the sound tie-resolution rules below.
  const canBeThirdOrWorse: Record<string, boolean> = Object.fromEntries(teamIds.map((id) => [id, false]));
  const canBeTop2: Record<string, boolean> = Object.fromEntries(teamIds.map((id) => [id, false]));

  const r = remaining.length;
  const total = 3 ** r;
  for (let combo = 0; combo < total; combo++) {
    const pts: Record<string, number> = Object.fromEntries(teamIds.map((id) => [id, base[id].points]));
    let c = combo;
    for (let i = 0; i < r; i++) {
      const outcome = c % 3; // 0 home win, 1 draw, 2 away win
      c = Math.floor(c / 3);
      const { homeId, awayId } = remaining[i];
      if (outcome === 0) pts[homeId] += 3;
      else if (outcome === 2) pts[awayId] += 3;
      else {
        pts[homeId] += 1;
        pts[awayId] += 1;
      }
    }

    for (const id of teamIds) {
      let strictlyAbove = 0; // teams that beat this one on points alone
      let atOrAbove = 0; // teams that match or beat it on points
      for (const other of teamIds) {
        if (other === id) continue;
        if (pts[other] > pts[id]) {
          strictlyAbove++;
          atOrAbove++;
        } else if (pts[other] === pts[id]) {
          atOrAbove++;
        }
      }
      // Pessimistic for the team: a points tie could be lost on GD → counts
      // against it. If ≥2 teams sit at-or-above, it could be pushed to ≥3rd.
      if (atOrAbove >= 2) canBeThirdOrWorse[id] = true;
      // Generous for the team: it could win every points tie on GD. If ≤1 team
      // is strictly above, it could still reach the top 2.
      if (strictlyAbove <= 1) canBeTop2[id] = true;
    }
  }

  return {
    groupId,
    decided: false,
    finalOrder: null,
    teams: Object.fromEntries(
      teamIds.map((id) => [
        id,
        {
          teamId: id,
          guaranteedTop2: !canBeThirdOrWorse[id],
          eliminatedTop2: !canBeTop2[id],
          decidedRank: null,
        },
      ]),
    ),
  };
}

// ---------------------------------------------------------------------------
// Enforcement helpers used by the UI and the store.
// ---------------------------------------------------------------------------

/**
 * Can `teamId` legally be assigned the NEXT rank (index = rankedCount) given
 * the current ordering? Accounts for "starvation" — e.g. you can't fill a
 * top-2 slot with a non-guaranteed team if doing so would leave too few top-2
 * slots for the teams that must finish there.
 */
export function canAssignNext(
  constraint: GroupConstraint,
  orderedTeamIds: string[],
  rankedCount: number,
  teamId: string,
): boolean {
  if (constraint.decided) return false; // decided groups are locked
  const i = rankedCount; // target slot index
  if (i > 3) return false;

  const c = constraint.teams[teamId];
  if (!c) return true;

  const rankedSet = new Set(orderedTeamIds.slice(0, rankedCount));
  const countUnranked = (pred: (id: string) => boolean) =>
    orderedTeamIds.filter((id) => !rankedSet.has(id) && id !== teamId && pred(id)).length;

  if (i <= 1) {
    // Top-2 slot.
    if (c.eliminatedTop2) return false;
    if (!c.guaranteedTop2) {
      const topSlotsAfter = 2 - i - 1; // slots left once this one is taken
      const guaranteedStillNeeded = countUnranked((id) => constraint.teams[id]?.guaranteedTop2 ?? false);
      if (topSlotsAfter < guaranteedStillNeeded) return false;
    }
    return true;
  }

  // Bottom-2 slot (i === 2 or 3).
  if (c.guaranteedTop2) return false;
  if (!c.eliminatedTop2) {
    const bottomSlotsAfter = 4 - i - 1;
    const eliminatedStillNeeded = countUnranked((id) => constraint.teams[id]?.eliminatedTop2 ?? false);
    if (bottomSlotsAfter < eliminatedStillNeeded) return false;
  }
  return true;
}

/**
 * Reorder a full 4-team list so it satisfies the constraints: guaranteed-top-2
 * teams move to the front, eliminated teams to the back, others keep their
 * incoming relative order. For decided groups the fixed standing wins. Used by
 * Smart Predict and Shuffle so they never produce an impossible bracket.
 */
export function orderRespectingConstraints(constraint: GroupConstraint, orderedTeamIds: string[]): string[] {
  if (constraint.decided && constraint.finalOrder) return constraint.finalOrder;

  const bucket = (id: string): number => {
    const c = constraint.teams[id];
    if (c?.guaranteedTop2) return 0;
    if (c?.eliminatedTop2) return 2;
    return 1;
  };
  // Stable sort by bucket preserves the incoming order within each bucket.
  return orderedTeamIds
    .map((id, idx) => ({ id, idx, b: bucket(id) }))
    .sort((a, b) => (a.b !== b.b ? a.b - b.b : a.idx - b.idx))
    .map((e) => e.id);
}
