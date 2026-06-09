import type { LeaderboardEntry } from '@/types';
import { getTeam } from '@/data/teams';
import { FlagIcon } from './FlagIcon';

export function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-slate-400">
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Champion pick</th>
            <th className="px-4 py-3 text-right">Correct</th>
            <th className="px-4 py-3 text-right">Points</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => {
            const champ = getTeam(e.championId);
            return (
              <tr
                key={e.rank}
                className="border-b border-line transition-colors last:border-0 hover:bg-sand"
              >
                <td className="px-4 py-3">
                  <span
                    className={`grid h-6 w-6 place-items-center rounded-md text-xs font-bold text-white ${
                      e.rank === 1 ? 'bg-gold' : e.rank <= 3 ? 'bg-brand' : 'bg-slate-300'
                    }`}
                  >
                    {e.rank}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-ink">{e.name}</td>
                <td className="px-4 py-3 text-ink">
                  {champ ? (
                    <span className="inline-flex items-center gap-1.5">
                      <FlagIcon team={champ} size={16} /> {champ.name}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-4 py-3 text-right text-slate-500">{e.correctPicks}</td>
                <td className="px-4 py-3 text-right font-bold text-brand">{e.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
