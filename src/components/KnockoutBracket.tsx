import type { KnockoutMatch, KnockoutRound } from '@/types';
import { ROUND_FLOW, ROUND_LABELS, getRoundMatches, getMatch } from '@/lib/bracket';
import { MatchCard } from './MatchCard';

interface KnockoutBracketProps {
  matches: KnockoutMatch[];
  onPick?: (matchId: string, teamId: string) => void;
  readOnly?: boolean;
}

/**
 * Responsive knockout view.
 *   • Desktop (lg+): classic horizontal bracket, one column per round, with the
 *     third-place match shown beneath the final.
 *   • Mobile/tablet: vertical, round-by-round stacked columns (scroll down).
 */
export function KnockoutBracket({ matches, onPick, readOnly }: KnockoutBracketProps) {
  const third = getMatch(matches, 'THIRD-0');

  return (
    <div>
      {/* Horizontal scrolling bracket */}
      <div className="bracket-scroll overflow-x-auto pb-4">
        <div className="flex min-w-max gap-6 lg:gap-10">
          {ROUND_FLOW.map((round) => (
            <RoundColumn
              key={round}
              round={round}
              matches={getRoundMatches(matches, round)}
              onPick={onPick}
              readOnly={readOnly}
            />
          ))}
        </div>
      </div>

      {/* Third-place playoff lives apart from the main winners' tree. */}
      {third && (
        <div className="mt-6">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gold">
            {ROUND_LABELS.THIRD}
          </h4>
          <MatchCard
            match={third}
            readOnly={readOnly}
            onPick={(teamId) => onPick?.(third.id, teamId)}
          />
        </div>
      )}
    </div>
  );
}

function RoundColumn({
  round,
  matches,
  onPick,
  readOnly,
}: {
  round: KnockoutRound;
  matches: KnockoutMatch[];
  onPick?: (matchId: string, teamId: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {ROUND_LABELS[round]}
        <span className="ml-1 text-slate-600">({matches.length})</span>
      </h4>
      {/* Even vertical distribution makes later rounds line up with earlier pairs. */}
      <div className="flex flex-1 flex-col justify-around gap-3">
        {matches.map((m) => (
          <MatchCard
            key={m.id}
            match={m}
            readOnly={readOnly}
            onPick={(teamId) => onPick?.(m.id, teamId)}
          />
        ))}
      </div>
    </div>
  );
}
