import { getTeam } from '@/data/teams';
import { FlagIcon } from './FlagIcon';

interface ChampionCardProps {
  championId: string | null;
  runnerUpId?: string | null;
  compact?: boolean;
}

export function ChampionCard({ championId, runnerUpId, compact }: ChampionCardProps) {
  const champion = getTeam(championId);
  const runnerUp = getTeam(runnerUpId);

  if (!champion) {
    return (
      <div className="grid place-items-center rounded-2xl border-2 border-dashed border-line bg-white/60 p-6 text-center">
        <div className="text-4xl opacity-30">🏆</div>
        <p className="mt-2 text-sm text-slate-400">Complete the final to crown your champion.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-gold bg-white p-6 text-center shadow-[0_10px_30px_-12px_rgba(245,158,11,0.5)]">
      <div className="animate-trophy-bounce text-4xl">🏆</div>
      <p className="mt-1 text-[11px] font-semibold tracking-[0.18em] text-slate-400">
        WORLD CUP 2026 CHAMPION
      </p>
      <div className="mt-2 flex items-center justify-center gap-2.5">
        <FlagIcon team={champion} size={compact ? 30 : 44} />
        <span className={`font-display font-bold text-ink ${compact ? 'text-2xl' : 'text-4xl'}`}>
          {champion.name}
        </span>
      </div>
      {runnerUp && !compact && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-slate-500">
          Runner-up: <FlagIcon team={runnerUp} size={16} /> {runnerUp.name}
        </p>
      )}
    </div>
  );
}
