import { getTeam } from '@/data/teams';
import { thirdPlaceSeeds } from '@/lib/bracket';
import { useBracket } from '@/store/BracketContext';
import { FlagIcon } from './FlagIcon';

export function ThirdPlaceSelector() {
  const { bracket, toggleThirdPlace, shuffleThirds } = useBracket();
  const selectedCount = bracket.thirdPlaceQualifiers.length;
  const seeds = thirdPlaceSeeds(bracket.thirdPlaceQualifiers);

  // Candidate = each group's predicted 3rd-placed team, labelled by slot (A3…L3).
  const candidates = bracket.groupPredictions.map((gp) => ({
    slot: `${gp.groupId}3`,
    teamId: gp.orderedTeamIds[2],
  }));

  return (
    <div className="card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 font-display text-lg font-bold text-pos3">
          Select 8 Best Third Place Teams <span className="text-slate-300">ⓘ</span>
        </h3>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-semibold ${selectedCount === 8 ? 'text-brand' : 'text-slate-400'}`}>
            {selectedCount}/8 selected
          </span>
          <button onClick={shuffleThirds} className="btn-outline border-pos3/40 text-pos3 hover:bg-pos3/5">
            ⤭ Shuffle Best 3rd Places
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {candidates.map(({ slot, teamId }) => {
          const team = getTeam(teamId);
          if (!team) return null;
          const selected = bracket.thirdPlaceQualifiers.includes(teamId);
          const atCap = selectedCount >= 8 && !selected;
          return (
            <button
              key={slot}
              onClick={() => toggleThirdPlace(teamId)}
              disabled={atCap}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-all ${
                selected
                  ? 'border-brand bg-brand-50 text-ink'
                  : atCap
                    ? 'border-line bg-sand text-slate-300'
                    : 'border-line bg-white text-ink hover:border-brand/40'
              }`}
            >
              <span className="text-[10px] font-bold text-slate-400">{slot}</span>
              <FlagIcon team={team} size={20} />
              <span className="min-w-0 flex-1 truncate font-semibold">{team.name}</span>
              {selected && <span className="text-xs font-bold text-brand">#{seeds[teamId]}</span>}
            </button>
          );
        })}
      </div>

      {selectedCount === 8 && (
        <p className="mt-4 text-center text-sm text-brand">
          ✅ FIFA Official Rules applied — each Third Place team assigned to their official R32 slot
        </p>
      )}
    </div>
  );
}
