import type { Group, Team } from '@/types';

// ---------------------------------------------------------------------------
// SAMPLE World Cup 2026 groups (48 teams / 12 groups of 4).
//
// NOTE: Placeholder groupings (not the official draw) — chosen to match the
// project design mocks. To swap in the official draw later, edit each team's
// `group` field (and the list). FIFA ranks are approximate placeholders used by
// Smart Predict and third-place seeding.
//
// Hosts (USA, Canada, Mexico) are flagged with isHost.
// ---------------------------------------------------------------------------

const t = (
  id: string,
  name: string,
  flagEmoji: string,
  iso: string,
  group: string,
  fifaRank: number,
  confederation: Team['confederation'],
  isHost = false
): Team => ({ id, name, flagEmoji, iso, group, fifaRank, confederation, isHost });

export const TEAMS: Team[] = [
  // Group A
  t('MEX', 'Mexico', '🇲🇽', 'mx', 'A', 14, 'CONCACAF', true),
  t('KOR', 'South Korea', '🇰🇷', 'kr', 'A', 23, 'AFC'),
  t('RSA', 'South Africa', '🇿🇦', 'za', 'A', 60, 'CAF'),
  t('CZE', 'Czechia', '🇨🇿', 'cz', 'A', 27, 'UEFA'),

  // Group B
  t('CAN', 'Canada', '🇨🇦', 'ca', 'B', 43, 'CONCACAF', true),
  t('SUI', 'Switzerland', '🇨🇭', 'ch', 'B', 19, 'UEFA'),
  t('QAT', 'Qatar', '🇶🇦', 'qa', 'B', 37, 'AFC'),
  t('BIH', 'Bosnia and Herzegovina', '🇧🇦', 'ba', 'B', 74, 'UEFA'),

  // Group C
  t('BRA', 'Brazil', '🇧🇷', 'br', 'C', 5, 'CONMEBOL'),
  t('MAR', 'Morocco', '🇲🇦', 'ma', 'C', 12, 'CAF'),
  t('SCO', 'Scotland', '🏴', 'gb-sct', 'C', 39, 'UEFA'),
  t('HAI', 'Haiti', '🇭🇹', 'ht', 'C', 83, 'CONCACAF'),

  // Group D
  t('USA', 'United States', '🇺🇸', 'us', 'D', 16, 'CONCACAF', true),
  t('AUS', 'Australia', '🇦🇺', 'au', 'D', 24, 'AFC'),
  t('PAR', 'Paraguay', '🇵🇾', 'py', 'D', 35, 'CONMEBOL'),
  t('TUR', 'Turkey', '🇹🇷', 'tr', 'D', 26, 'UEFA'),

  // Group E
  t('GER', 'Germany', '🇩🇪', 'de', 'E', 9, 'UEFA'),
  t('ECU', 'Ecuador', '🇪🇨', 'ec', 'E', 31, 'CONMEBOL'),
  t('CIV', 'Côte d’Ivoire', '🇨🇮', 'ci', 'E', 49, 'CAF'),
  t('CUW', 'Curaçao', '🇨🇼', 'cw', 'E', 90, 'CONCACAF'),

  // Group F
  t('NED', 'Netherlands', '🇳🇱', 'nl', 'F', 7, 'UEFA'),
  t('JPN', 'Japan', '🇯🇵', 'jp', 'F', 18, 'AFC'),
  t('TUN', 'Tunisia', '🇹🇳', 'tn', 'F', 41, 'CAF'),
  t('SWE', 'Sweden', '🇸🇪', 'se', 'F', 34, 'UEFA'),

  // Group G
  t('BEL', 'Belgium', '🇧🇪', 'be', 'G', 6, 'UEFA'),
  t('IRN', 'Iran', '🇮🇷', 'ir', 'G', 22, 'AFC'),
  t('EGY', 'Egypt', '🇪🇬', 'eg', 'G', 36, 'CAF'),
  t('NZL', 'New Zealand', '🇳🇿', 'nz', 'G', 94, 'OFC'),

  // Group H
  t('ESP', 'Spain', '🇪🇸', 'es', 'H', 8, 'UEFA'),
  t('URU', 'Uruguay', '🇺🇾', 'uy', 'H', 11, 'CONMEBOL'),
  t('KSA', 'Saudi Arabia', '🇸🇦', 'sa', 'H', 56, 'AFC'),
  t('CPV', 'Cabo Verde', '🇨🇻', 'cv', 'H', 70, 'CAF'),

  // Group I
  t('FRA', 'France', '🇫🇷', 'fr', 'I', 2, 'UEFA'),
  t('SEN', 'Senegal', '🇸🇳', 'sn', 'I', 20, 'CAF'),
  t('NOR', 'Norway', '🇳🇴', 'no', 'I', 33, 'UEFA'),
  t('IRQ', 'Iraq', '🇮🇶', 'iq', 'I', 58, 'AFC'),

  // Group J
  t('ARG', 'Argentina', '🇦🇷', 'ar', 'J', 1, 'CONMEBOL'),
  t('AUT', 'Austria', '🇦🇹', 'at', 'J', 25, 'UEFA'),
  t('ALG', 'Algeria', '🇩🇿', 'dz', 'J', 38, 'CAF'),
  t('JOR', 'Jordan', '🇯🇴', 'jo', 'J', 64, 'AFC'),

  // Group K
  t('POR', 'Portugal', '🇵🇹', 'pt', 'K', 3, 'UEFA'),
  t('COL', 'Colombia', '🇨🇴', 'co', 'K', 13, 'CONMEBOL'),
  t('UZB', 'Uzbekistan', '🇺🇿', 'uz', 'K', 57, 'AFC'),
  t('COD', 'DR Congo', '🇨🇩', 'cd', 'K', 59, 'CAF'),

  // Group L
  t('ENG', 'England', '🏴', 'gb-eng', 'L', 4, 'UEFA'),
  t('CRO', 'Croatia', '🇭🇷', 'hr', 'L', 10, 'UEFA'),
  t('PAN', 'Panama', '🇵🇦', 'pa', 'L', 41, 'CONCACAF'),
  t('GHA', 'Ghana', '🇬🇭', 'gh', 'L', 68, 'CAF'),
];

export const GROUP_IDS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'] as const;

export const GROUPS: Group[] = GROUP_IDS.map((id) => ({
  id,
  name: `Group ${id}`,
  teams: TEAMS.filter((team) => team.group === id),
}));

export const TEAMS_BY_ID: Record<string, Team> = Object.fromEntries(
  TEAMS.map((team) => [team.id, team])
);

export function getTeam(id: string | null | undefined): Team | undefined {
  return id ? TEAMS_BY_ID[id] : undefined;
}
