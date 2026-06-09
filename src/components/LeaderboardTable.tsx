import type { LeaderboardEntry } from '@/types';
import { getTeam } from '@/data/teams';

export function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-slate-400">
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
                className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.03]"
              >
                <td className="px-4 py-3">
                  <span
                    className={`grid h-6 w-6 place-items-center rounded-md text-xs font-bold ${
                      e.rank === 1
                        ? 'bg-gold/20 text-gold'
                        : e.rank <= 3
                          ? 'bg-accent/15 text-accent'
                          : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {e.rank}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold">{e.name}</td>
                <td className="px-4 py-3">
                  {champ ? `${champ.flagEmoji} ${champ.name}` : '—'}
                </td>
                <td className="px-4 py-3 text-right text-slate-300">{e.correctPicks}</td>
                <td className="px-4 py-3 text-right font-bold text-accent">{e.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
