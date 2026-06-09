// ---------------------------------------------------------------------------
// Core domain types for the World Cup 2026 bracket predictor.
// These mirror the shape a future backend (Supabase/Postgres) would store.
// ---------------------------------------------------------------------------

export type Confederation =
  | 'UEFA'
  | 'CONMEBOL'
  | 'CONCACAF'
  | 'CAF'
  | 'AFC'
  | 'OFC';

export interface Team {
  id: string; // stable short code, e.g. "ARG"
  name: string;
  flagEmoji: string;
  /** ISO 3166-1 alpha-2 (or flag-icons subdivision like "gb-eng") for flag images. */
  iso: string;
  group: string; // group letter "A".."L"
  fifaRank: number; // placeholder ranking, used by Smart Predict
  confederation: Confederation;
  isHost: boolean;
}

export interface Group {
  id: string; // "A".."L"
  name: string; // "Group A"
  teams: Team[];
}

/** A user's predicted final standing for one group (ordered 1st→4th). */
export interface GroupPrediction {
  groupId: string;
  orderedTeamIds: string[]; // length 4
  /**
   * How many positions the user has explicitly assigned by clicking (0–4).
   * The first `rankedCount` entries of orderedTeamIds carry a position badge;
   * the rest are unranked. The group is complete when rankedCount === 4.
   */
  rankedCount: number;
}

export type KnockoutRound =
  | 'R32'
  | 'R16'
  | 'QF'
  | 'SF'
  | 'THIRD'
  | 'FINAL';

export interface KnockoutMatch {
  id: string;
  round: KnockoutRound;
  position: number; // index within the round (0-based)
  teamA: string | null; // team id or null (not yet decided)
  teamB: string | null;
  winnerId: string | null;
  /** Where the winner flows next. THIRD/FINAL get fed from the SF losers/winners. */
  nextMatchId: string | null;
  nextSlot: 'A' | 'B' | null;
  /** For the third-place match: SF losers flow here instead of winners. */
  feedsThirdMatchId?: string | null;
  feedsThirdSlot?: 'A' | 'B' | null;
}

export interface BracketPrediction {
  id: string;
  nickname: string;
  createdAt: string; // ISO
  groupPredictions: GroupPrediction[];
  /** Group ids the user has explicitly ranked (drives the "x/12 done" progress). */
  completedGroups: string[];
  thirdPlaceQualifiers: string[]; // exactly 8 team ids
  knockoutMatches: KnockoutMatch[];
  championId: string | null;
  runnerUpId: string | null;
  shareCode: string;
}

// ---- Mock-data-only types (leaderboard / predictions / leagues) ------------

export interface FanPrediction {
  id: string;
  nickname: string;
  championId: string;
  finalistId: string;
  createdAt: string;
  likes: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  championId: string;
  points: number;
  correctPicks: number;
}

export interface League {
  id: string;
  name: string;
  nickname: string;
  inviteCode: string;
  createdAt: string;
  members: LeaderboardEntry[];
}
