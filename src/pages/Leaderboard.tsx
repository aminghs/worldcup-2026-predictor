import { LEADERBOARD, SCORING_MAX, SCORING_SECTIONS } from '@/data/mock';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { EmptyState } from '@/components/EmptyState';

export default function Leaderboard() {
  // Before the tournament begins nobody has scored — show the empty state but
  // keep the (zeroed) standings visible so the structure is clear.
  const tournamentStarted = false;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Leaderboard</h1>
      <p className="mt-1 text-sm text-slate-500">
        Points are awarded as real results come in — up to{' '}
        <strong className="text-ink">{SCORING_MAX} pts</strong> in total.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {SCORING_SECTIONS.map((s) => (
          <span key={s.title} className="chip bg-white border border-line text-slate-600">
            {s.title} <span className="text-brand font-bold">max {s.max}</span>
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
