// ---------------------------------------------------------------------------
// World Cup 2026 group-stage schedule — all 72 matches across 3 matchdays.
//
// Times are given in Oslo local time (CEST, UTC+2) plus a full ISO timestamp.
// homeTeam / awayTeam reference Team.name in data/teams.ts (use getTeamByName).
// ---------------------------------------------------------------------------

export interface GroupMatch {
  id: string;
  group: string;
  date: string; // ISO date "YYYY-MM-DD"
  kickoffTimeOslo: string; // "HH:mm" local Oslo time
  kickoffISO: string;
  homeTeam: string;
  awayTeam: string;
  venue: string;
  city: string;
}

export const GROUP_MATCHES: GroupMatch[] = [
  // Matchday 1
  { id: 'm001', group: 'A', date: '2026-06-11', kickoffTimeOslo: '21:00', kickoffISO: '2026-06-11T21:00:00+02:00', homeTeam: 'Mexico', awayTeam: 'South Africa', venue: 'Mexico City Stadium', city: 'Mexico City' },
  { id: 'm002', group: 'A', date: '2026-06-12', kickoffTimeOslo: '04:00', kickoffISO: '2026-06-12T04:00:00+02:00', homeTeam: 'South Korea', awayTeam: 'Czechia', venue: 'Estadio Guadalajara', city: 'Guadalajara' },
  { id: 'm003', group: 'B', date: '2026-06-12', kickoffTimeOslo: '21:00', kickoffISO: '2026-06-12T21:00:00+02:00', homeTeam: 'Canada', awayTeam: 'Bosnia and Herzegovina', venue: 'Toronto Stadium', city: 'Toronto' },
  { id: 'm004', group: 'D', date: '2026-06-13', kickoffTimeOslo: '02:00', kickoffISO: '2026-06-13T02:00:00+02:00', homeTeam: 'United States', awayTeam: 'Paraguay', venue: 'Los Angeles Stadium', city: 'Los Angeles' },
  { id: 'm005', group: 'B', date: '2026-06-13', kickoffTimeOslo: '21:00', kickoffISO: '2026-06-13T21:00:00+02:00', homeTeam: 'Qatar', awayTeam: 'Switzerland', venue: 'San Francisco Bay Area Stadium', city: 'Santa Clara' },
  { id: 'm006', group: 'C', date: '2026-06-14', kickoffTimeOslo: '00:00', kickoffISO: '2026-06-14T00:00:00+02:00', homeTeam: 'Brazil', awayTeam: 'Morocco', venue: 'New York New Jersey Stadium', city: 'East Rutherford' },
  { id: 'm007', group: 'C', date: '2026-06-14', kickoffTimeOslo: '03:00', kickoffISO: '2026-06-14T03:00:00+02:00', homeTeam: 'Haiti', awayTeam: 'Scotland', venue: 'Boston Stadium', city: 'Foxborough' },
  { id: 'm008', group: 'D', date: '2026-06-14', kickoffTimeOslo: '06:00', kickoffISO: '2026-06-14T06:00:00+02:00', homeTeam: 'Australia', awayTeam: 'Turkey', venue: 'BC Place Vancouver', city: 'Vancouver' },
  { id: 'm009', group: 'E', date: '2026-06-14', kickoffTimeOslo: '19:00', kickoffISO: '2026-06-14T19:00:00+02:00', homeTeam: 'Germany', awayTeam: 'Curacao', venue: 'Houston Stadium', city: 'Houston' },
  { id: 'm010', group: 'F', date: '2026-06-14', kickoffTimeOslo: '22:00', kickoffISO: '2026-06-14T22:00:00+02:00', homeTeam: 'Netherlands', awayTeam: 'Japan', venue: 'Dallas Stadium', city: 'Arlington' },
  { id: 'm011', group: 'E', date: '2026-06-15', kickoffTimeOslo: '01:00', kickoffISO: '2026-06-15T01:00:00+02:00', homeTeam: 'Ivory Coast', awayTeam: 'Ecuador', venue: 'Philadelphia Stadium', city: 'Philadelphia' },
  { id: 'm012', group: 'F', date: '2026-06-15', kickoffTimeOslo: '04:00', kickoffISO: '2026-06-15T04:00:00+02:00', homeTeam: 'Sweden', awayTeam: 'Tunisia', venue: 'Estadio Monterrey', city: 'Monterrey' },
  { id: 'm013', group: 'H', date: '2026-06-15', kickoffTimeOslo: '18:00', kickoffISO: '2026-06-15T18:00:00+02:00', homeTeam: 'Spain', awayTeam: 'Cape Verde', venue: 'Atlanta Stadium', city: 'Atlanta' },
  { id: 'm014', group: 'G', date: '2026-06-15', kickoffTimeOslo: '21:00', kickoffISO: '2026-06-15T21:00:00+02:00', homeTeam: 'Belgium', awayTeam: 'Egypt', venue: 'Seattle Stadium', city: 'Seattle' },
  { id: 'm015', group: 'H', date: '2026-06-16', kickoffTimeOslo: '00:00', kickoffISO: '2026-06-16T00:00:00+02:00', homeTeam: 'Saudi Arabia', awayTeam: 'Uruguay', venue: 'Miami Stadium', city: 'Miami' },
  { id: 'm016', group: 'G', date: '2026-06-16', kickoffTimeOslo: '03:00', kickoffISO: '2026-06-16T03:00:00+02:00', homeTeam: 'Iran', awayTeam: 'New Zealand', venue: 'Los Angeles Stadium', city: 'Los Angeles' },
  { id: 'm017', group: 'I', date: '2026-06-16', kickoffTimeOslo: '21:00', kickoffISO: '2026-06-16T21:00:00+02:00', homeTeam: 'France', awayTeam: 'Senegal', venue: 'New York New Jersey Stadium', city: 'East Rutherford' },
  { id: 'm018', group: 'I', date: '2026-06-17', kickoffTimeOslo: '00:00', kickoffISO: '2026-06-17T00:00:00+02:00', homeTeam: 'Iraq', awayTeam: 'Norway', venue: 'Boston Stadium', city: 'Foxborough' },
  { id: 'm019', group: 'J', date: '2026-06-17', kickoffTimeOslo: '03:00', kickoffISO: '2026-06-17T03:00:00+02:00', homeTeam: 'Argentina', awayTeam: 'Algeria', venue: 'Kansas City Stadium', city: 'Kansas City' },
  { id: 'm020', group: 'J', date: '2026-06-17', kickoffTimeOslo: '06:00', kickoffISO: '2026-06-17T06:00:00+02:00', homeTeam: 'Austria', awayTeam: 'Jordan', venue: 'San Francisco Bay Area Stadium', city: 'Santa Clara' },
  { id: 'm021', group: 'K', date: '2026-06-17', kickoffTimeOslo: '19:00', kickoffISO: '2026-06-17T19:00:00+02:00', homeTeam: 'Portugal', awayTeam: 'DR Congo', venue: 'Houston Stadium', city: 'Houston' },
  { id: 'm022', group: 'L', date: '2026-06-17', kickoffTimeOslo: '22:00', kickoffISO: '2026-06-17T22:00:00+02:00', homeTeam: 'England', awayTeam: 'Croatia', venue: 'Dallas Stadium', city: 'Arlington' },
  { id: 'm023', group: 'L', date: '2026-06-18', kickoffTimeOslo: '01:00', kickoffISO: '2026-06-18T01:00:00+02:00', homeTeam: 'Ghana', awayTeam: 'Panama', venue: 'Toronto Stadium', city: 'Toronto' },
  { id: 'm024', group: 'K', date: '2026-06-18', kickoffTimeOslo: '04:00', kickoffISO: '2026-06-18T04:00:00+02:00', homeTeam: 'Uzbekistan', awayTeam: 'Colombia', venue: 'Mexico City Stadium', city: 'Mexico City' },

  // Matchday 2
  { id: 'm025', group: 'A', date: '2026-06-18', kickoffTimeOslo: '18:00', kickoffISO: '2026-06-18T18:00:00+02:00', homeTeam: 'Czechia', awayTeam: 'South Africa', venue: 'Atlanta Stadium', city: 'Atlanta' },
  { id: 'm026', group: 'B', date: '2026-06-18', kickoffTimeOslo: '21:00', kickoffISO: '2026-06-18T21:00:00+02:00', homeTeam: 'Switzerland', awayTeam: 'Bosnia and Herzegovina', venue: 'Los Angeles Stadium', city: 'Los Angeles' },
  { id: 'm027', group: 'B', date: '2026-06-19', kickoffTimeOslo: '00:00', kickoffISO: '2026-06-19T00:00:00+02:00', homeTeam: 'Canada', awayTeam: 'Qatar', venue: 'BC Place Vancouver', city: 'Vancouver' },
  { id: 'm028', group: 'A', date: '2026-06-19', kickoffTimeOslo: '03:00', kickoffISO: '2026-06-19T03:00:00+02:00', homeTeam: 'Mexico', awayTeam: 'South Korea', venue: 'Estadio Guadalajara', city: 'Guadalajara' },
  { id: 'm029', group: 'D', date: '2026-06-19', kickoffTimeOslo: '21:00', kickoffISO: '2026-06-19T21:00:00+02:00', homeTeam: 'United States', awayTeam: 'Australia', venue: 'Seattle Stadium', city: 'Seattle' },
  { id: 'm030', group: 'C', date: '2026-06-20', kickoffTimeOslo: '00:00', kickoffISO: '2026-06-20T00:00:00+02:00', homeTeam: 'Scotland', awayTeam: 'Morocco', venue: 'Boston Stadium', city: 'Foxborough' },
  { id: 'm031', group: 'C', date: '2026-06-20', kickoffTimeOslo: '03:00', kickoffISO: '2026-06-20T03:00:00+02:00', homeTeam: 'Brazil', awayTeam: 'Haiti', venue: 'Philadelphia Stadium', city: 'Philadelphia' },
  { id: 'm032', group: 'D', date: '2026-06-20', kickoffTimeOslo: '06:00', kickoffISO: '2026-06-20T06:00:00+02:00', homeTeam: 'Turkey', awayTeam: 'Paraguay', venue: 'San Francisco Bay Area Stadium', city: 'Santa Clara' },
  { id: 'm033', group: 'F', date: '2026-06-20', kickoffTimeOslo: '19:00', kickoffISO: '2026-06-20T19:00:00+02:00', homeTeam: 'Netherlands', awayTeam: 'Sweden', venue: 'Houston Stadium', city: 'Houston' },
  { id: 'm034', group: 'E', date: '2026-06-20', kickoffTimeOslo: '22:00', kickoffISO: '2026-06-20T22:00:00+02:00', homeTeam: 'Germany', awayTeam: 'Ivory Coast', venue: 'Toronto Stadium', city: 'Toronto' },
  { id: 'm035', group: 'E', date: '2026-06-21', kickoffTimeOslo: '02:00', kickoffISO: '2026-06-21T02:00:00+02:00', homeTeam: 'Ecuador', awayTeam: 'Curacao', venue: 'Kansas City Stadium', city: 'Kansas City' },
  { id: 'm036', group: 'F', date: '2026-06-21', kickoffTimeOslo: '06:00', kickoffISO: '2026-06-21T06:00:00+02:00', homeTeam: 'Tunisia', awayTeam: 'Japan', venue: 'Estadio Monterrey', city: 'Monterrey' },
  { id: 'm037', group: 'H', date: '2026-06-21', kickoffTimeOslo: '18:00', kickoffISO: '2026-06-21T18:00:00+02:00', homeTeam: 'Spain', awayTeam: 'Saudi Arabia', venue: 'Atlanta Stadium', city: 'Atlanta' },
  { id: 'm038', group: 'G', date: '2026-06-21', kickoffTimeOslo: '21:00', kickoffISO: '2026-06-21T21:00:00+02:00', homeTeam: 'Belgium', awayTeam: 'Iran', venue: 'Los Angeles Stadium', city: 'Los Angeles' },
  { id: 'm039', group: 'H', date: '2026-06-22', kickoffTimeOslo: '00:00', kickoffISO: '2026-06-22T00:00:00+02:00', homeTeam: 'Uruguay', awayTeam: 'Cape Verde', venue: 'Miami Stadium', city: 'Miami' },
  { id: 'm040', group: 'G', date: '2026-06-22', kickoffTimeOslo: '03:00', kickoffISO: '2026-06-22T03:00:00+02:00', homeTeam: 'New Zealand', awayTeam: 'Egypt', venue: 'BC Place Vancouver', city: 'Vancouver' },
  { id: 'm041', group: 'J', date: '2026-06-22', kickoffTimeOslo: '19:00', kickoffISO: '2026-06-22T19:00:00+02:00', homeTeam: 'Argentina', awayTeam: 'Austria', venue: 'Dallas Stadium', city: 'Arlington' },
  { id: 'm042', group: 'I', date: '2026-06-22', kickoffTimeOslo: '23:00', kickoffISO: '2026-06-22T23:00:00+02:00', homeTeam: 'France', awayTeam: 'Iraq', venue: 'Philadelphia Stadium', city: 'Philadelphia' },
  { id: 'm043', group: 'I', date: '2026-06-23', kickoffTimeOslo: '02:00', kickoffISO: '2026-06-23T02:00:00+02:00', homeTeam: 'Norway', awayTeam: 'Senegal', venue: 'Toronto Stadium', city: 'Toronto' },
  { id: 'm044', group: 'J', date: '2026-06-23', kickoffTimeOslo: '05:00', kickoffISO: '2026-06-23T05:00:00+02:00', homeTeam: 'Jordan', awayTeam: 'Algeria', venue: 'San Francisco Bay Area Stadium', city: 'Santa Clara' },
  { id: 'm045', group: 'K', date: '2026-06-23', kickoffTimeOslo: '19:00', kickoffISO: '2026-06-23T19:00:00+02:00', homeTeam: 'Portugal', awayTeam: 'Uzbekistan', venue: 'Houston Stadium', city: 'Houston' },
  { id: 'm046', group: 'L', date: '2026-06-23', kickoffTimeOslo: '22:00', kickoffISO: '2026-06-23T22:00:00+02:00', homeTeam: 'England', awayTeam: 'Ghana', venue: 'Boston Stadium', city: 'Foxborough' },
  { id: 'm047', group: 'L', date: '2026-06-24', kickoffTimeOslo: '01:00', kickoffISO: '2026-06-24T01:00:00+02:00', homeTeam: 'Panama', awayTeam: 'Croatia', venue: 'Boston Stadium', city: 'Foxborough' },
  { id: 'm048', group: 'K', date: '2026-06-24', kickoffTimeOslo: '04:00', kickoffISO: '2026-06-24T04:00:00+02:00', homeTeam: 'Colombia', awayTeam: 'DR Congo', venue: 'Estadio Guadalajara', city: 'Guadalajara' },

  // Matchday 3
  { id: 'm049', group: 'B', date: '2026-06-24', kickoffTimeOslo: '21:00', kickoffISO: '2026-06-24T21:00:00+02:00', homeTeam: 'Switzerland', awayTeam: 'Canada', venue: 'BC Place Vancouver', city: 'Vancouver' },
  { id: 'm050', group: 'B', date: '2026-06-24', kickoffTimeOslo: '21:00', kickoffISO: '2026-06-24T21:00:00+02:00', homeTeam: 'Bosnia and Herzegovina', awayTeam: 'Qatar', venue: 'Seattle Stadium', city: 'Seattle' },
  { id: 'm051', group: 'C', date: '2026-06-25', kickoffTimeOslo: '00:00', kickoffISO: '2026-06-25T00:00:00+02:00', homeTeam: 'Morocco', awayTeam: 'Haiti', venue: 'Atlanta Stadium', city: 'Atlanta' },
  { id: 'm052', group: 'C', date: '2026-06-25', kickoffTimeOslo: '00:00', kickoffISO: '2026-06-25T00:00:00+02:00', homeTeam: 'Scotland', awayTeam: 'Brazil', venue: 'Miami Stadium', city: 'Miami' },
  { id: 'm053', group: 'A', date: '2026-06-25', kickoffTimeOslo: '03:00', kickoffISO: '2026-06-25T03:00:00+02:00', homeTeam: 'Czechia', awayTeam: 'Mexico', venue: 'Mexico City Stadium', city: 'Mexico City' },
  { id: 'm054', group: 'A', date: '2026-06-25', kickoffTimeOslo: '03:00', kickoffISO: '2026-06-25T03:00:00+02:00', homeTeam: 'South Africa', awayTeam: 'South Korea', venue: 'Estadio Monterrey', city: 'Monterrey' },
  { id: 'm055', group: 'E', date: '2026-06-25', kickoffTimeOslo: '22:00', kickoffISO: '2026-06-25T22:00:00+02:00', homeTeam: 'Curacao', awayTeam: 'Ivory Coast', venue: 'Philadelphia Stadium', city: 'Philadelphia' },
  { id: 'm056', group: 'E', date: '2026-06-25', kickoffTimeOslo: '22:00', kickoffISO: '2026-06-25T22:00:00+02:00', homeTeam: 'Ecuador', awayTeam: 'Germany', venue: 'New York New Jersey Stadium', city: 'East Rutherford' },
  { id: 'm057', group: 'F', date: '2026-06-26', kickoffTimeOslo: '01:00', kickoffISO: '2026-06-26T01:00:00+02:00', homeTeam: 'Japan', awayTeam: 'Sweden', venue: 'Dallas Stadium', city: 'Arlington' },
  { id: 'm058', group: 'F', date: '2026-06-26', kickoffTimeOslo: '01:00', kickoffISO: '2026-06-26T01:00:00+02:00', homeTeam: 'Tunisia', awayTeam: 'Netherlands', venue: 'Kansas City Stadium', city: 'Kansas City' },
  { id: 'm059', group: 'D', date: '2026-06-26', kickoffTimeOslo: '04:00', kickoffISO: '2026-06-26T04:00:00+02:00', homeTeam: 'Turkey', awayTeam: 'United States', venue: 'Los Angeles Stadium', city: 'Los Angeles' },
  { id: 'm060', group: 'D', date: '2026-06-26', kickoffTimeOslo: '04:00', kickoffISO: '2026-06-26T04:00:00+02:00', homeTeam: 'Paraguay', awayTeam: 'Australia', venue: 'San Francisco Bay Area Stadium', city: 'Santa Clara' },
  { id: 'm061', group: 'I', date: '2026-06-26', kickoffTimeOslo: '21:00', kickoffISO: '2026-06-26T21:00:00+02:00', homeTeam: 'Norway', awayTeam: 'France', venue: 'Boston Stadium', city: 'Foxborough' },
  { id: 'm062', group: 'I', date: '2026-06-26', kickoffTimeOslo: '21:00', kickoffISO: '2026-06-26T21:00:00+02:00', homeTeam: 'Senegal', awayTeam: 'Iraq', venue: 'Toronto Stadium', city: 'Toronto' },
  { id: 'm063', group: 'H', date: '2026-06-27', kickoffTimeOslo: '02:00', kickoffISO: '2026-06-27T02:00:00+02:00', homeTeam: 'Cape Verde', awayTeam: 'Saudi Arabia', venue: 'Houston Stadium', city: 'Houston' },
  { id: 'm064', group: 'H', date: '2026-06-27', kickoffTimeOslo: '02:00', kickoffISO: '2026-06-27T02:00:00+02:00', homeTeam: 'Uruguay', awayTeam: 'Spain', venue: 'Estadio Guadalajara', city: 'Guadalajara' },
  { id: 'm065', group: 'G', date: '2026-06-27', kickoffTimeOslo: '05:00', kickoffISO: '2026-06-27T05:00:00+02:00', homeTeam: 'New Zealand', awayTeam: 'Belgium', venue: 'BC Place Vancouver', city: 'Vancouver' },
  { id: 'm066', group: 'G', date: '2026-06-27', kickoffTimeOslo: '05:00', kickoffISO: '2026-06-27T05:00:00+02:00', homeTeam: 'Egypt', awayTeam: 'Iran', venue: 'Seattle Stadium', city: 'Seattle' },
  { id: 'm067', group: 'L', date: '2026-06-27', kickoffTimeOslo: '23:00', kickoffISO: '2026-06-27T23:00:00+02:00', homeTeam: 'Panama', awayTeam: 'England', venue: 'New York New Jersey Stadium', city: 'East Rutherford' },
  { id: 'm068', group: 'L', date: '2026-06-27', kickoffTimeOslo: '23:00', kickoffISO: '2026-06-27T23:00:00+02:00', homeTeam: 'Croatia', awayTeam: 'Ghana', venue: 'Philadelphia Stadium', city: 'Philadelphia' },
  { id: 'm069', group: 'K', date: '2026-06-28', kickoffTimeOslo: '01:30', kickoffISO: '2026-06-28T01:30:00+02:00', homeTeam: 'Colombia', awayTeam: 'Portugal', venue: 'Miami Stadium', city: 'Miami' },
  { id: 'm070', group: 'K', date: '2026-06-28', kickoffTimeOslo: '01:30', kickoffISO: '2026-06-28T01:30:00+02:00', homeTeam: 'DR Congo', awayTeam: 'Uzbekistan', venue: 'Atlanta Stadium', city: 'Atlanta' },
  { id: 'm071', group: 'J', date: '2026-06-28', kickoffTimeOslo: '04:00', kickoffISO: '2026-06-28T04:00:00+02:00', homeTeam: 'Algeria', awayTeam: 'Austria', venue: 'Kansas City Stadium', city: 'Kansas City' },
  { id: 'm072', group: 'J', date: '2026-06-28', kickoffTimeOslo: '04:00', kickoffISO: '2026-06-28T04:00:00+02:00', homeTeam: 'Jordan', awayTeam: 'Argentina', venue: 'Dallas Stadium', city: 'Arlington' },
];

/** All group matches for one group, in schedule order. */
export function matchesForGroup(groupId: string): GroupMatch[] {
  return GROUP_MATCHES.filter((m) => m.group === groupId);
}
