import type { League } from '@/types';

export function LeagueCard({ league }: { league: League }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-bold">{league.name}</h3>
          <p className="text-xs text-slate-400">
            {league.members.length} members · created{' '}
            {new Date(league.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-slate-400">Invite code</div>
          <div className="font-mono text-lg font-bold text-accent">{league.inviteCode}</div>
        </div>
      </div>
      <ul className="mt-4 space-y-1.5">
        {league.members.map((m) => (
          <li
            key={m.rank}
            className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2 text-sm"
          >
            <span className="flex items-center gap-2">
              <span className="text-slate-500">{m.rank}.</span>
              {m.name}
            </span>
            <span className="text-slate-400">{m.points} pts</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
