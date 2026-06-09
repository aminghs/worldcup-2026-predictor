import type { Group, Team } from '@/types';

// ---------------------------------------------------------------------------
// SAMPLE World Cup 2026 groups (48 teams / 12 groups of 4).
//
// NOTE: The official draw is not used here — these are *placeholder* groupings
// built from plausible qualified/contender nations so the app is fully usable.
// To swap in the official draw later, replace the `group` field on each team
// (and add/remove teams) — nothing else needs to change.
//
// Hosts (USA, Canada, Mexico) are flagged with isHost.
// ---------------------------------------------------------------------------

const t = (
  id: string,
  name: string,
  flagEmoji: string,
  group: string,
  fifaRank: number,
  confederation: Team['confederation'],
  isHost = false
): Team => ({ id, name, flagEmoji, group, fifaRank, confederation, isHost });

export const TEAMS: Team[] = [
  // Group A
  t('MEX', 'Mexico', '🇲🇽', 'A', 14, 'CONCACAF', true),
  t('CRO', 'Croatia', '🇭🇷', 'A', 10, 'UEFA'),
  t('KSA', 'Saudi Arabia', '🇸🇦', 'A', 56, 'AFC'),
  t('GHA', 'Ghana', '🇬🇭', 'A', 68, 'CAF'),

  // Group B
  t('CAN', 'Canada', '🇨🇦', 'B', 43, 'CONCACAF', true),
  t('BEL', 'Belgium', '🇧🇪', 'B', 6, 'UEFA'),
  t('JPN', 'Japan', '🇯🇵', 'B', 18, 'AFC'),
  t('CIV', 'Ivory Coast', '🇨🇮', 'B', 49, 'CAF'),

  // Group C
  t('USA', 'United States', '🇺🇸', 'C', 16, 'CONCACAF', true),
  t('NED', 'Netherlands', '🇳🇱', 'C', 7, 'UEFA'),
  t('KOR', 'South Korea', '🇰🇷', 'C', 23, 'AFC'),
  t('ECU', 'Ecuador', '🇪🇨', 'C', 31, 'CONMEBOL'),

  // Group D
  t('ARG', 'Argentina', '🇦🇷', 'D', 1, 'CONMEBOL'),
  t('POL', 'Poland', '🇵🇱', 'D', 28, 'UEFA'),
  t('AUS', 'Australia', '🇦🇺', 'D', 24, 'AFC'),
  t('SEN', 'Senegal', '🇸🇳', 'D', 20, 'CAF'),

  // Group E
  t('FRA', 'France', '🇫🇷', 'E', 2, 'UEFA'),
  t('URU', 'Uruguay', '🇺🇾', 'E', 11, 'CONMEBOL'),
  t('IRN', 'Iran', '🇮🇷', 'E', 22, 'AFC'),
  t('NZL', 'New Zealand', '🇳🇿', 'E', 94, 'OFC'),

  // Group F
  t('BRA', 'Brazil', '🇧🇷', 'F', 5, 'CONMEBOL'),
  t('SUI', 'Switzerland', '🇨🇭', 'F', 19, 'UEFA'),
  t('QAT', 'Qatar', '🇶🇦', 'F', 37, 'AFC'),
  t('CMR', 'Cameroon', '🇨🇲', 'F', 53, 'CAF'),

  // Group G
  t('ENG', 'England', '🏴', 'G', 4, 'UEFA'),
  t('COL', 'Colombia', '🇨🇴', 'G', 13, 'CONMEBOL'),
  t('EGY', 'Egypt', '🇪🇬', 'G', 36, 'CAF'),
  t('PAN', 'Panama', '🇵🇦', 'G', 41, 'CONCACAF'),

  // Group H
  t('POR', 'Portugal', '🇵🇹', 'H', 3, 'UEFA'),
  t('MAR', 'Morocco', '🇲🇦', 'H', 12, 'CAF'),
  t('UZB', 'Uzbekistan', '🇺🇿', 'H', 57, 'AFC'),
  t('CRC', 'Costa Rica', '🇨🇷', 'H', 54, 'CONCACAF'),

  // Group I
  t('ESP', 'Spain', '🇪🇸', 'I', 8, 'UEFA'),
  t('NGA', 'Nigeria', '🇳🇬', 'I', 39, 'CAF'),
  t('PER', 'Peru', '🇵🇪', 'I', 33, 'CONMEBOL'),
  t('JOR', 'Jordan', '🇯🇴', 'I', 64, 'AFC'),

  // Group J
  t('GER', 'Germany', '🇩🇪', 'J', 9, 'UEFA'),
  t('SRB', 'Serbia', '🇷🇸', 'J', 32, 'UEFA'),
  t('TUN', 'Tunisia', '🇹🇳', 'J', 41, 'CAF'),
  t('HON', 'Honduras', '🇭🇳', 'J', 70, 'CONCACAF'),

  // Group K
  t('ITA', 'Italy', '🇮🇹', 'K', 15, 'UEFA'),
  t('ALG', 'Algeria', '🇩🇿', 'K', 38, 'CAF'),
  t('CHI', 'Chile', '🇨🇱', 'K', 40, 'CONMEBOL'),
  t('IRQ', 'Iraq', '🇮🇶', 'K', 58, 'AFC'),

  // Group L
  t('DEN', 'Denmark', '🇩🇰', 'L', 21, 'UEFA'),
  t('MLI', 'Mali', '🇲🇱', 'L', 52, 'CAF'),
  t('PAR', 'Paraguay', '🇵🇾', 'L', 35, 'CONMEBOL'),
  t('NCL', 'New Caledonia', '🇳🇨', 'L', 152, 'OFC'),
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
