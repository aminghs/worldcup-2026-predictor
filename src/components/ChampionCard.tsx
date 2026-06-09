import { getTeam } from '@/data/teams';

interface ChampionCardProps {
  championId: string | null;
  runnerUpId?: string | null;
}

export function ChampionCard({ championId, runnerUpId }: ChampionCardProps) {
  const champion = getTeam(championId);
  const runnerUp = getTeam(runnerUpId);

  if (!champion) {
    return (
      <div className="card grid place-items-center p-10 text-center">
        <div className="text-5xl opacity-40">🏆</div>
        <p className="mt-3 text-sm text-slate-400">
          Complete the final to crown your champion.
        </p>
      </div>
    );
  }

  return (
    <div className="card relative overflow-hidden p-8 text-center">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gold/10 to-transparent" />
      <div className="relative">
        <div className="animate-trophy-bounce text-6xl">🏆</div>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          Your World Cup 2026 Champion
        </p>
        <div className="mt-3 flex items-center justify-center gap-3">
          <span className="text-5xl">{champion.flagEmoji}</span>
          <span className="font-display text-3xl font-bold">{champion.name}</span>
        </div>
        {runnerUp && (
          <p className="mt-3 text-sm text-slate-400">
            Runner-up: <span className="text-slate-200">{runnerUp.flagEmoji} {runnerUp.name}</span>
          </p>
        )}
      </div>
    </div>
  );
}
