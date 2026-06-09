import type { FanPrediction, LeaderboardEntry, League } from '@/types';

// ---------------------------------------------------------------------------
// Mock data for the read-only "social" pages (predictions / leaderboard /
// leagues). Replace with backend queries later. Champion/finalist ids match
// team ids in data/teams.ts.
// ---------------------------------------------------------------------------

export const FAN_PREDICTIONS: FanPrediction[] = [
  { id: 'f1', nickname: 'MidfieldMaestro', championId: 'ARG', finalistId: 'FRA', createdAt: '2026-05-28T10:00:00Z', likes: 342 },
  { id: 'f2', nickname: 'TikiTakaTom', championId: 'ESP', finalistId: 'BRA', createdAt: '2026-05-30T14:20:00Z', likes: 287 },
  { id: 'f3', nickname: 'SambaQueen', championId: 'BRA', finalistId: 'ENG', createdAt: '2026-06-01T08:15:00Z', likes: 521 },
  { id: 'f4', nickname: 'DesBleus99', championId: 'FRA', finalistId: 'POR', createdAt: '2026-06-02T19:45:00Z', likes: 198 },
  { id: 'f5', nickname: 'ThreeLionsRoar', championId: 'ENG', finalistId: 'GER', createdAt: '2026-06-03T12:30:00Z', likes: 410 },
  { id: 'f6', nickname: 'AtlasFan', championId: 'MAR', finalistId: 'ARG', createdAt: '2026-06-04T09:00:00Z', likes: 633 },
  { id: 'f7', nickname: 'PanzerWagen', championId: 'GER', finalistId: 'NED', createdAt: '2026-06-05T16:10:00Z', likes: 156 },
  { id: 'f8', nickname: 'OranjeBoven', championId: 'NED', finalistId: 'ESP', createdAt: '2026-06-06T11:25:00Z', likes: 244 },
  { id: 'f9', nickname: 'HostNationHype', championId: 'USA', finalistId: 'MEX', createdAt: '2026-06-06T20:50:00Z', likes: 389 },
  { id: 'f10', nickname: 'CR7Forever', championId: 'POR', finalistId: 'BRA', createdAt: '2026-06-07T07:40:00Z', likes: 477 },
];

export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'SambaQueen', championId: 'BRA', points: 0, correctPicks: 0 },
  { rank: 2, name: 'MidfieldMaestro', championId: 'ARG', points: 0, correctPicks: 0 },
  { rank: 3, name: 'AtlasFan', championId: 'MAR', points: 0, correctPicks: 0 },
  { rank: 4, name: 'ThreeLionsRoar', championId: 'ENG', points: 0, correctPicks: 0 },
  { rank: 5, name: 'CR7Forever', championId: 'POR', points: 0, correctPicks: 0 },
];

export const SAMPLE_LEAGUE: League = {
  id: 'lg1',
  name: 'Office Sweepstake 2026',
  nickname: 'Commissioner',
  inviteCode: 'KICK26',
  createdAt: '2026-05-20T00:00:00Z',
  members: [
    { rank: 1, name: 'Commissioner', championId: 'FRA', points: 0, correctPicks: 0 },
    { rank: 2, name: 'Dwight', championId: 'GER', points: 0, correctPicks: 0 },
    { rank: 3, name: 'Pam', championId: 'ARG', points: 0, correctPicks: 0 },
    { rank: 4, name: 'Jim', championId: 'BRA', points: 0, correctPicks: 0 },
  ],
};

/**
 * Mock scoring rule (documented so it can be re-implemented on a backend):
 *   group-stage correct position  = 2 pts
 *   correct R16 qualifier         = 4 pts
 *   correct quarter-finalist      = 6 pts
 *   correct finalist              = 12 pts
 *   correct champion              = 25 pts
 */
export const SCORING_RULES = [
  { label: 'Correct group position', points: 2 },
  { label: 'Correct Round of 16 team', points: 4 },
  { label: 'Correct quarter-finalist', points: 6 },
  { label: 'Correct finalist', points: 12 },
  { label: 'Correct champion', points: 25 },
];
