import { getTeam } from '@/data/teams';
import { thirdPlacedTeamIds } from '@/lib/bracket';
import { useBracket } from '@/store/BracketContext';

export function ThirdPlaceSelector() {
  const { bracket, toggleThirdPlace } = useBracket();
  const candidates = thirdPlacedTeamIds(bracket.groupPredictions);
  const selectedCount = bracket.thirdPlaceQualifiers.length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-300">
          Pick the <strong className="text-white">8 best third-placed teams</strong> that
          advance to the Round of 32.
        </p>
        <span
          className={`chip ${
            selectedCount === 8 ? 'bg-accent/15 text-accent' : 'bg-gold/15 text-gold'
          }`}
        >
          {selectedCount} / 8 selected
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {candidates.map((teamId) => {
          const team = getTeam(teamId);
          if (!team) return null;
          const selected = bracket.thirdPlaceQualifiers.includes(teamId);
          const atCap = selectedCount >= 8 && !selected;
          return (
            <button
              key={teamId}
              onClick={() => toggleThirdPlace(teamId)}
              disabled={atCap}
              className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all ${
                selected
                  ? 'border-accent bg-accent/10 shadow-[0_0_18px_-8px_rgba(22,224,163,0.7)]'
                  : atCap
                    ? 'border-white/5 bg-white/[0.02] opacity-40'
                    : 'border-white/10 bg-white/[0.03] hover:border-accent/40'
              }`}
            >
              <span className="text-xl">{team.flagEmoji}</span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{team.name}</div>
                <div className="text-[11px] text-slate-400">
                  3rd · Group {team.group} · #{team.fifaRank}
                </div>
              </div>
              <span
                className={`grid h-5 w-5 place-items-center rounded-full text-[11px] ${
                  selected ? 'bg-accent text-pitch-950' : 'bg-white/10 text-transparent'
                }`}
              >
                ✓
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
