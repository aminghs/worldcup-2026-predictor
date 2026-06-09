import type { KnockoutMatch, KnockoutRound } from '@/types';
import { ROUND_LABELS, getRoundMatches, getMatch } from '@/lib/bracket';
import { MatchCard } from './MatchCard';
import { ChampionCard } from './ChampionCard';

interface KnockoutBracketProps {
  matches: KnockoutMatch[];
  onPick?: (matchId: string, teamId: string) => void;
  readOnly?: boolean;
  championId?: string | null;
  runnerUpId?: string | null;
}

/**
 * Vertical, stacked knockout view (matches the design mocks):
 *   Round of 32 → Round of 16 → Quarter Finals → Semi Finals
 *   → Third-place match + Final (side by side) → Champion card.
 * Each round is a panel with a grid of match cards.
 */
export function KnockoutBracket({
  matches,
  onPick,
  readOnly,
  championId,
  runnerUpId,
}: KnockoutBracketProps) {
  const third = getMatch(matches, 'THIRD-0');
  const final = getMatch(matches, 'FINAL-0');

  return (
    <div className="space-y-6">
      <RoundPanel round="R32" matches={getRoundMatches(matches, 'R32')} onPick={onPick} readOnly={readOnly} />
      <RoundPanel round="R16" matches={getRoundMatches(matches, 'R16')} onPick={onPick} readOnly={readOnly} />
      <RoundPanel round="QF" matches={getRoundMatches(matches, 'QF')} onPick={onPick} readOnly={readOnly} />
      <RoundPanel round="SF" matches={getRoundMatches(matches, 'SF')} onPick={onPick} readOnly={readOnly} centered />

      {/* Third-place playoff + final, side by side. */}
      {third && final && (
        <div className="rounded-2xl border border-line bg-white/60 p-4 sm:p-6">
          <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
            <MatchCard match={third} variant="third" readOnly={readOnly} onPick={(t) => onPick?.(third.id, t)} />
            <MatchCard match={final} variant="final" readOnly={readOnly} onPick={(t) => onPick?.(final.id, t)} />
          </div>
        </div>
      )}

      {/* Champion crown. */}
      <div className="flex justify-center pt-2">
        <div className="w-full max-w-sm">
          <ChampionCard championId={championId ?? final?.winnerId ?? null} runnerUpId={runnerUpId} compact />
        </div>
      </div>
    </div>
  );
}

function RoundPanel({
  round,
  matches,
  onPick,
  readOnly,
  centered,
}: {
  round: KnockoutRound;
  matches: KnockoutMatch[];
  onPick?: (matchId: string, teamId: string) => void;
  readOnly?: boolean;
  centered?: boolean;
}) {
  return (
    <section className="rounded-2xl border border-line bg-white/60 p-4 sm:p-6">
      <h4 className="mb-4 font-display text-base font-bold text-gold">{ROUND_LABELS[round]}</h4>
      <div
        className={
          centered
            ? 'mx-auto grid max-w-2xl gap-4 sm:grid-cols-2'
            : 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4'
        }
      >
        {matches.map((m) => (
          <MatchCard
            key={m.id}
            match={m}
            readOnly={readOnly}
            onPick={(teamId) => onPick?.(m.id, teamId)}
          />
        ))}
      </div>
    </section>
  );
}
