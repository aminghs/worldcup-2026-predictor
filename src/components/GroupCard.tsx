import { useEffect } from 'react';
import { GROUPS } from '@/data/teams';
import { useBracket } from '@/store/BracketContext';
import { useGroupConstraints } from '@/store/useGroupConstraints';
import { canAssignNext } from '@/lib/groupConstraints';
import { TeamRow } from './TeamRow';

interface GroupCardProps {
  groupId: string;
}

export function GroupCard({ groupId }: GroupCardProps) {
  const { bracket, selectTeamPosition, applyResultStandings } = useBracket();
  const constraint = useGroupConstraints()[groupId];
  const gp = bracket.groupPredictions.find((g) => g.groupId === groupId);

  // Once results fully decide a group, lock its standings to the real order.
  const decided = constraint?.decided ?? false;
  const finalOrder = constraint?.finalOrder ?? null;
  useEffect(() => {
    if (decided && finalOrder) applyResultStandings(groupId, finalOrder);
  }, [decided, finalOrder, groupId, applyResultStandings]);

  if (!gp) return null;

  const complete = gp.rankedCount === 4;
  // Display in the fixed original group order; only the badge reflects rank.
  const displayTeams = GROUPS.find((g) => g.id === groupId)?.teams ?? [];

  return (
    <section
      className={`card p-4 transition-colors ${
        decided ? 'border-amber-300/60 bg-amber-50/40' : complete ? 'border-brand/40 bg-brand-50/60' : ''
      }`}
    >
      <header className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-base font-bold text-brand">Group {groupId}</h3>
        {decided ? (
          <span className="chip bg-amber-400/20 font-semibold text-amber-700">🔒 Final result</span>
        ) : complete ? (
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
          const tc = constraint?.teams[team.id];

          // Tag teams whose fate results have already sealed (pre-decided groups).
          const hint =
            !decided && tc?.guaranteedTop2
              ? 'top2'
              : !decided && tc?.eliminatedTop2
                ? 'out'
                : null;

          // Block tapping a team into a position that's now impossible. Already
          // ranked teams stay clickable so they can be deselected.
          const locked = decided;
          const disabled =
            !locked &&
            position === null &&
            constraint != null &&
            !canAssignNext(constraint, gp.orderedTeamIds, gp.rankedCount, team.id);

          return (
            <TeamRow
              key={team.id}
              team={team}
              position={position}
              hint={hint}
              disabled={locked || disabled}
              onClick={locked ? undefined : () => selectTeamPosition(groupId, team.id)}
            />
          );
        })}
      </div>
    </section>
  );
}
