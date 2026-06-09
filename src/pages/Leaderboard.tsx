import { LEADERBOARD, SCORING_RULES } from '@/data/mock';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { EmptyState } from '@/components/EmptyState';

export default function Leaderboard() {
  // Before the tournament begins nobody has scored — show the empty state but
  // keep the (zeroed) standings visible so the structure is clear.
  const tournamentStarted = false;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Leaderboard</h1>
      <p className="mt-1 text-sm text-slate-400">
        Points are awarded as real results come in. Here's how scoring works:
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {SCORING_RULES.map((r) => (
          <span key={r.label} className="chip bg-white/5 text-slate-300">
            {r.label} <span className="text-accent">+{r.points}</span>
          </span>
        ))}
      </div>

      <div className="mt-6">
        {tournamentStarted ? (
          <LeaderboardTable entries={LEADERBOARD} />
        ) : (
          <>
            <EmptyState
              icon="📊"
              title="Leaderboard starts when the tournament begins"
              description="Scores update live from June 11, 2026. Until then, here are the entries waiting at the gate."
            />
            <div className="mt-4 opacity-60">
              <LeaderboardTable entries={LEADERBOARD} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
