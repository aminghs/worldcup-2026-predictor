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

// ---------------------------------------------------------------------------
// Scoring model — total possible 1000 pts. Used by the "How scoring works"
// panel and the Leaderboard. A future backend can implement these exact rules
// to grade a saved BracketPrediction against real results.
//
//   Group stage           360 pts  (12 groups × 30)
//   Knockout winners      400 pts
//   Knockout correct pair 240 pts
// ---------------------------------------------------------------------------

export interface ScoringRule {
  label: string;
  points: string; // display string, e.g. "+10 pts"
}

export interface ScoringSection {
  title: string;
  max: number;
  accent: 'group' | 'winner' | 'pair';
  rules: ScoringRule[];
}

export const SCORING_MAX = 1000;

export const SCORING_SECTIONS: ScoringSection[] = [
  {
    title: 'Group stage',
    max: 360,
    accent: 'group',
    rules: [
      { label: '1st place correct', points: '+10 pts' },
      { label: '2nd place correct', points: '+8 pts' },
      { label: '3rd place correct (advancing)', points: '+5 pts' },
      { label: '4th place correct (eliminated)', points: '+1 pt' },
      { label: 'Exact order 1-2-3-4 bonus', points: '+6 pts per group' },
    ],
  },
  {
    title: 'Knockout — correct winner',
    max: 400,
    accent: 'winner',
    rules: [
      { label: 'Round of 32', points: '+4 pts per match' },
      { label: 'Round of 16', points: '+8 pts per match' },
      { label: 'Quarter Finals', points: '+16 pts per match' },
      { label: 'Semi Finals', points: '+30 pts per match' },
      { label: '3rd Place Match', points: '+15 pts' },
      { label: 'Final winner', points: '+55 pts' },
      { label: 'Champion bonus', points: '+78 pts' },
    ],
  },
  {
    title: 'Knockout — correct pair (both teams in match)',
    max: 240,
    accent: 'pair',
    rules: [
      { label: 'Round of 32', points: '+3 pts per match' },
      { label: 'Round of 16', points: '+7 pts per match' },
      { label: 'Quarter Finals', points: '+13 pts per match' },
      { label: 'Semi Finals', points: '+22 pts per match' },
      { label: 'Final', points: '+40 pts' },
    ],
  },
];
