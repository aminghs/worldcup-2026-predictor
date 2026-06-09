import type { KnockoutRound } from '@/types';

// ---------------------------------------------------------------------------
// Static knockout-stage schedule. Each knockout match id (as produced by
// generateKnockout) maps to a real-world match number, date and kickoff time.
//
// These are plausible placeholder fixtures for the design — adjust freely when
// the official 2026 schedule is published. Match numbers continue from the
// group stage (matches 1–72), so the Round of 32 begins at match 73.
// ---------------------------------------------------------------------------

export interface Fixture {
  matchNumber: number;
  date: string; // short display date, e.g. "Jun 28"
  time: string; // kickoff, e.g. "18:00 GMT"
}

function f(matchNumber: number, date: string, time: string): Fixture {
  return { matchNumber, date, time };
}

/** Build the ordered fixture list for one round so we can zip it to match ids. */
const R32: Fixture[] = [
  f(73, 'Jun 28', '18:00 GMT'),
  f(74, 'Jun 29', '15:00 GMT'),
  f(75, 'Jun 29', '18:00 GMT'),
  f(76, 'Jun 29', '21:00 GMT'),
  f(77, 'Jun 30', '15:00 GMT'),
  f(78, 'Jun 30', '18:00 GMT'),
  f(79, 'Jun 30', '21:00 GMT'),
  f(80, 'Jul 1', '15:00 GMT'),
  f(81, 'Jul 1', '18:00 GMT'),
  f(82, 'Jul 1', '21:00 GMT'),
  f(83, 'Jul 2', '15:00 GMT'),
  f(84, 'Jul 2', '18:00 GMT'),
  f(85, 'Jul 2', '21:00 GMT'),
  f(86, 'Jul 3', '15:00 GMT'),
  f(87, 'Jul 3', '18:00 GMT'),
  f(88, 'Jul 3', '21:00 GMT'),
];

const R16: Fixture[] = [
  f(89, 'Jul 4', '18:00 GMT'),
  f(90, 'Jul 4', '21:00 GMT'),
  f(91, 'Jul 5', '18:00 GMT'),
  f(92, 'Jul 5', '21:00 GMT'),
  f(93, 'Jul 6', '18:00 GMT'),
  f(94, 'Jul 6', '21:00 GMT'),
  f(95, 'Jul 7', '18:00 GMT'),
  f(96, 'Jul 7', '21:00 GMT'),
];

const QF: Fixture[] = [
  f(97, 'Jul 9', '21:00 GMT'),
  f(98, 'Jul 9', '21:00 GMT'),
  f(99, 'Jul 10', '18:00 GMT'),
  f(100, 'Jul 10', '21:00 GMT'),
];

const SF: Fixture[] = [
  f(101, 'Jul 14', '21:00 GMT'),
  f(102, 'Jul 15', '21:00 GMT'),
];

const THIRD: Fixture[] = [f(103, 'Jul 18', '18:00 GMT')];
const FINAL: Fixture[] = [f(104, 'Jul 19', '21:00 GMT')];

const BY_ROUND: Record<KnockoutRound, Fixture[]> = {
  R32,
  R16,
  QF,
  SF,
  THIRD,
  FINAL,
};

/** Look up the fixture for a knockout match id like "R32-5" or "FINAL-0". */
export function getFixture(matchId: string): Fixture | undefined {
  const [round, idx] = matchId.split('-');
  const list = BY_ROUND[round as KnockoutRound];
  return list?.[Number(idx)];
}
