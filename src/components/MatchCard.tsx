import type { KnockoutMatch } from '@/types';
import { getTeam } from '@/data/teams';
import { getFixture } from '@/data/fixtures';
import { FlagIcon } from './FlagIcon';

type Variant = 'default' | 'final' | 'third';

interface MatchCardProps {
  match: KnockoutMatch;
  onPick?: (teamId: string) => void;
  readOnly?: boolean;
  variant?: Variant;
}

export function MatchCard({ match, onPick, readOnly, variant = 'default' }: MatchCardProps) {
  const fixture = getFixture(match.id);
  const isFinal = variant === 'final';

  return (
    <div
      className={`rounded-2xl border p-3 transition-colors ${
        isFinal ? 'border-gold/40 bg-gold/[0.07]' : 'border-line bg-white'
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">
          {variant === 'third' && <span className="mr-1 text-gold">🥉</span>}
          {variant === 'final' && <span className="mr-1 text-gold">🏆</span>}
          {variant === 'final' ? 'The Final' : variant === 'third' ? 'Third Place Match' : `Match ${fixture?.matchNumber ?? ''}`}
        </span>
        {fixture && (
          <span className="text-[11px] text-slate-400">
            🗓 {fixture.date} · ⏱ {fixture.time}
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        <Slot
          teamId={match.teamA}
          isWinner={match.winnerId === match.teamA}
          decided={!!match.winnerId}
          readOnly={readOnly}
          isFinal={isFinal}
          onPick={onPick}
        />
        <Slot
          teamId={match.teamB}
          isWinner={match.winnerId === match.teamB}
          decided={!!match.winnerId}
          readOnly={readOnly}
          isFinal={isFinal}
          onPick={onPick}
        />
      </div>
    </div>
  );
}

function Slot({
  teamId,
  isWinner,
  decided,
  readOnly,
  isFinal,
  onPick,
}: {
  teamId: string | null;
  isWinner: boolean;
  decided: boolean;
  readOnly?: boolean;
  isFinal?: boolean;
  onPick?: (teamId: string) => void;
}) {
  const team = getTeam(teamId);
  const clickable = !readOnly && !!team;

  return (
    <button
      disabled={!clickable}
      onClick={() => team && onPick?.(team.id)}
      className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-all ${
        isWinner
          ? 'border-brand bg-brand-50'
          : decided
            ? 'border-line bg-sand opacity-55'
            : clickable
              ? 'border-line bg-white hover:border-brand/50 hover:bg-brand-50/40'
              : 'border-dashed border-line bg-sand'
      }`}
    >
      <FlagIcon team={team ?? undefined} size={22} />
      <span className={`flex-1 truncate text-sm ${team ? 'font-semibold text-ink' : 'text-slate-400'}`}>
        {team?.name ?? 'TBD'}
      </span>
      {isWinner && isFinal ? (
        <span className="text-gold">🏆</span>
      ) : (
        <span className={isWinner ? 'text-brand' : 'text-slate-300'}>✓</span>
      )}
    </button>
  );
}
