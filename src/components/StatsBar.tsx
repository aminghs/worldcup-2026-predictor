import { getTeam } from '@/data/teams';
import { getMatch } from '@/lib/bracket';
import { useBracket } from '@/store/BracketContext';
import { FlagIcon } from './FlagIcon';

/** Top summary cards: Champion · Runner Up · Third Place · Groups Done. */
export function StatsBar() {
  const { bracket } = useBracket();
  const champion = getTeam(bracket.championId);
  const runnerUp = getTeam(bracket.runnerUpId);
  const third = getTeam(getMatch(bracket.knockoutMatches, 'THIRD-0')?.winnerId ?? null);
  const groupsDone = bracket.completedGroups.length;

  const cells = [
    { icon: '🏆', label: 'CHAMPION', team: champion, accent: 'text-gold' },
    { icon: '🥈', label: 'RUNNER UP', team: runnerUp, accent: 'text-slate-500' },
    { icon: '🥉', label: 'THIRD PLACE', team: third, accent: 'text-pos3' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cells.map((c) => (
        <div key={c.label} className="card grid place-items-center gap-1 py-4 text-center">
          <span className={`text-xl ${c.accent}`}>{c.icon}</span>
          <span className="text-[10px] font-semibold tracking-wider text-slate-400">
            {c.label}
          </span>
          {c.team ? (
            <span className="flex items-center gap-1.5 text-sm font-bold text-ink">
              <FlagIcon team={c.team} size={18} />
              {c.team.name}
            </span>
          ) : (
            <span className="text-slate-300">—</span>
          )}
        </div>
      ))}
      <div className="card grid place-items-center gap-1 py-4 text-center">
        <span className="text-xl text-brand">🚩</span>
        <span className="text-[10px] font-semibold tracking-wider text-slate-400">
          GROUPS DONE
        </span>
        <span className="font-display text-lg font-bold text-brand">{groupsDone}/12</span>
      </div>
    </div>
  );
}
