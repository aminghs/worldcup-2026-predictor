import type { Group, Team } from '@/types';

// ---------------------------------------------------------------------------
// World Cup 2026 teams — 48 nations in 12 groups of 4.
//
// Team `id`s are canonical slugs (e.g. "south-korea"); `name`s match the
// official group-stage fixture data exactly so matches can be linked by name.
// FIFA ranks are approximate placeholders used by Smart Predict and third-place
// seeding. Hosts (USA, Canada, Mexico) are flagged with isHost.
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
  t('mexico', 'Mexico', '🇲🇽', 'mx', 'A', 14, 'CONCACAF', true),
  t('south-africa', 'South Africa', '🇿🇦', 'za', 'A', 60, 'CAF'),
  t('south-korea', 'South Korea', '🇰🇷', 'kr', 'A', 23, 'AFC'),
  t('czechia', 'Czechia', '🇨🇿', 'cz', 'A', 27, 'UEFA'),

  // Group B
  t('canada', 'Canada', '🇨🇦', 'ca', 'B', 43, 'CONCACAF', true),
  t('switzerland', 'Switzerland', '🇨🇭', 'ch', 'B', 19, 'UEFA'),
  t('qatar', 'Qatar', '🇶🇦', 'qa', 'B', 37, 'AFC'),
  t('bosnia-and-herzegovina', 'Bosnia and Herzegovina', '🇧🇦', 'ba', 'B', 74, 'UEFA'),

  // Group C
  t('brazil', 'Brazil', '🇧🇷', 'br', 'C', 5, 'CONMEBOL'),
  t('morocco', 'Morocco', '🇲🇦', 'ma', 'C', 12, 'CAF'),
  t('haiti', 'Haiti', '🇭🇹', 'ht', 'C', 83, 'CONCACAF'),
  t('scotland', 'Scotland', '🏴', 'gb-sct', 'C', 39, 'UEFA'),

  // Group D
  t('united-states', 'United States', '🇺🇸', 'us', 'D', 16, 'CONCACAF', true),
  t('paraguay', 'Paraguay', '🇵🇾', 'py', 'D', 35, 'CONMEBOL'),
  t('australia', 'Australia', '🇦🇺', 'au', 'D', 24, 'AFC'),
  t('turkey', 'Turkey', '🇹🇷', 'tr', 'D', 26, 'UEFA'),

  // Group E
  t('germany', 'Germany', '🇩🇪', 'de', 'E', 9, 'UEFA'),
  t('curacao', 'Curacao', '🇨🇼', 'cw', 'E', 90, 'CONCACAF'),
  t('ivory-coast', 'Ivory Coast', '🇨🇮', 'ci', 'E', 49, 'CAF'),
  t('ecuador', 'Ecuador', '🇪🇨', 'ec', 'E', 31, 'CONMEBOL'),

  // Group F
  t('netherlands', 'Netherlands', '🇳🇱', 'nl', 'F', 7, 'UEFA'),
  t('japan', 'Japan', '🇯🇵', 'jp', 'F', 18, 'AFC'),
  t('tunisia', 'Tunisia', '🇹🇳', 'tn', 'F', 41, 'CAF'),
  t('sweden', 'Sweden', '🇸🇪', 'se', 'F', 34, 'UEFA'),

  // Group G
  t('belgium', 'Belgium', '🇧🇪', 'be', 'G', 6, 'UEFA'),
  t('egypt', 'Egypt', '🇪🇬', 'eg', 'G', 36, 'CAF'),
  t('iran', 'Iran', '🇮🇷', 'ir', 'G', 22, 'AFC'),
  t('new-zealand', 'New Zealand', '🇳🇿', 'nz', 'G', 94, 'OFC'),

  // Group H
  t('spain', 'Spain', '🇪🇸', 'es', 'H', 8, 'UEFA'),
  t('cape-verde', 'Cape Verde', '🇨🇻', 'cv', 'H', 70, 'CAF'),
  t('saudi-arabia', 'Saudi Arabia', '🇸🇦', 'sa', 'H', 56, 'AFC'),
  t('uruguay', 'Uruguay', '🇺🇾', 'uy', 'H', 11, 'CONMEBOL'),

  // Group I
  t('france', 'France', '🇫🇷', 'fr', 'I', 2, 'UEFA'),
  t('senegal', 'Senegal', '🇸🇳', 'sn', 'I', 20, 'CAF'),
  t('norway', 'Norway', '🇳🇴', 'no', 'I', 33, 'UEFA'),
  t('iraq', 'Iraq', '🇮🇶', 'iq', 'I', 58, 'AFC'),

  // Group J
  t('argentina', 'Argentina', '🇦🇷', 'ar', 'J', 1, 'CONMEBOL'),
  t('algeria', 'Algeria', '🇩🇿', 'dz', 'J', 38, 'CAF'),
  t('austria', 'Austria', '🇦🇹', 'at', 'J', 25, 'UEFA'),
  t('jordan', 'Jordan', '🇯🇴', 'jo', 'J', 64, 'AFC'),

  // Group K
  t('portugal', 'Portugal', '🇵🇹', 'pt', 'K', 3, 'UEFA'),
  t('uzbekistan', 'Uzbekistan', '🇺🇿', 'uz', 'K', 57, 'AFC'),
  t('colombia', 'Colombia', '🇨🇴', 'co', 'K', 13, 'CONMEBOL'),
  t('dr-congo', 'DR Congo', '🇨🇩', 'cd', 'K', 59, 'CAF'),

  // Group L
  t('england', 'England', '🏴', 'gb-eng', 'L', 4, 'UEFA'),
  t('croatia', 'Croatia', '🇭🇷', 'hr', 'L', 10, 'UEFA'),
  t('ghana', 'Ghana', '🇬🇭', 'gh', 'L', 68, 'CAF'),
  t('panama', 'Panama', '🇵🇦', 'pa', 'L', 41, 'CONCACAF'),
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

const TEAMS_BY_NAME: Record<string, Team> = Object.fromEntries(
  TEAMS.map((team) => [team.name, team])
);

export function getTeam(id: string | null | undefined): Team | undefined {
  return id ? TEAMS_BY_ID[id] : undefined;
}

/** Look up a team by its exact display name (used to link fixture data). */
export function getTeamByName(name: string | null | undefined): Team | undefined {
  return name ? TEAMS_BY_NAME[name] : undefined;
}
