import type { KnockoutMatch } from '@/types';
import { getTeam } from '@/data/teams';

interface MatchCardProps {
  match: KnockoutMatch;
  onPick?: (teamId: string) => void;
  readOnly?: boolean;
}

export function MatchCard({ match, onPick, readOnly }: MatchCardProps) {
  return (
    <div className="card w-56 overflow-hidden p-1.5">
      <Slot
        teamId={match.teamA}
        isWinner={match.winnerId === match.teamA}
        decided={!!match.winnerId}
        readOnly={readOnly}
        onPick={onPick}
      />
      <div className="my-0.5 flex items-center justify-center">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          vs
        </span>
      </div>
      <Slot
        teamId={match.teamB}
        isWinner={match.winnerId === match.teamB}
        decided={!!match.winnerId}
        readOnly={readOnly}
        onPick={onPick}
      />
    </div>
  );
}

function Slot({
  teamId,
  isWinner,
  decided,
  readOnly,
  onPick,
}: {
  teamId: string | null;
  isWinner: boolean;
  decided: boolean;
  readOnly?: boolean;
  onPick?: (teamId: string) => void;
}) {
  const team = getTeam(teamId);
  const clickable = !readOnly && !!team;

  return (
    <button
      disabled={!clickable}
      onClick={() => team && onPick?.(team.id)}
      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-all ${
        isWinner
          ? 'bg-accent/15 ring-1 ring-accent/50'
          : decided
            ? 'opacity-45'
            : clickable
              ? 'hover:bg-white/5'
              : ''
      }`}
    >
      <span className="text-lg leading-none">{team?.flagEmoji ?? '⚽'}</span>
      <span
        className={`flex-1 truncate text-sm ${
          team ? 'font-semibold' : 'text-slate-500'
        } ${isWinner ? 'text-accent' : ''}`}
      >
        {team?.name ?? 'TBD'}
      </span>
      {isWinner && <span className="text-accent">✓</span>}
    </button>
  );
}
