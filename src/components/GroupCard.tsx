import { useRef } from 'react';
import { getTeam } from '@/data/teams';
import { useBracket } from '@/store/BracketContext';
import { TeamRow } from './TeamRow';

interface GroupCardProps {
  groupId: string;
}

export function GroupCard({ groupId }: GroupCardProps) {
  const { bracket, moveTeam, setGroupOrder } = useBracket();
  const gp = bracket.groupPredictions.find((g) => g.groupId === groupId);
  const dragIndex = useRef<number | null>(null);

  if (!gp) return null;

  const handleDrop = (targetIndex: number) => {
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from === null || from === targetIndex) return;
    const order = [...gp.orderedTeamIds];
    const [moved] = order.splice(from, 1);
    order.splice(targetIndex, 0, moved);
    setGroupOrder(groupId, order);
  };

  return (
    <section className="card p-4">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-base font-bold">Group {groupId}</h3>
        <span className="text-[11px] text-slate-400">Drag or use ▲▼ to rank</span>
      </header>
      <div className="space-y-2">
        {gp.orderedTeamIds.map((teamId, index) => {
          const team = getTeam(teamId);
          if (!team) return null;
          return (
            <TeamRow
              key={teamId}
              team={team}
              position={index}
              draggable
              onDragStart={() => (dragIndex.current = index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(index)}
              onMoveUp={() => moveTeam(groupId, teamId, 'up')}
              onMoveDown={() => moveTeam(groupId, teamId, 'down')}
            />
          );
        })}
      </div>
    </section>
  );
}
