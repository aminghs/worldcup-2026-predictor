import { GROUPS } from '@/data/teams';
import { useBracket } from '@/store/BracketContext';
import { TeamRow } from './TeamRow';

interface GroupCardProps {
  groupId: string;
}

export function GroupCard({ groupId }: GroupCardProps) {
  const { bracket, selectTeamPosition } = useBracket();
  const gp = bracket.groupPredictions.find((g) => g.groupId === groupId);
  if (!gp) return null;

  const complete = gp.rankedCount === 4;
  // Display in the fixed original group order; only the badge reflects rank.
  const displayTeams = GROUPS.find((g) => g.id === groupId)?.teams ?? [];

  return (
    <section
      className={`card p-4 transition-colors ${complete ? 'border-brand/40 bg-brand-50/60' : ''}`}
    >
      <header className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-base font-bold text-brand">Group {groupId}</h3>
        {complete ? (
          <span className="chip bg-brand/15 text-brand font-semibold">✓ Complete</span>
        ) : (
          <span className="text-[11px] text-slate-400">Tap to rank 1st → 4th</span>
        )}
      </header>
      <div className="space-y-2">
        {displayTeams.map((team) => {
          // A team is ranked only if it sits within the first `rankedCount` slots.
          const slot = gp.orderedTeamIds.indexOf(team.id);
          const position = slot < gp.rankedCount ? slot : null;
          return (
            <TeamRow
              key={team.id}
              team={team}
              position={position}
              onClick={() => selectTeamPosition(groupId, team.id)}
            />
          );
        })}
      </div>
    </section>
  );
}
