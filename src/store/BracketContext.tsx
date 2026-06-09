import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { BracketPrediction, GroupPrediction } from '@/types';
import {
  autoResolveByRank,
  autoResolveRandom,
  defaultGroupPredictions,
  generateKnockout,
  getChampion,
  getRunnerUp,
  pickWinner as pickWinnerLib,
  shortCode,
  shuffle,
  smartRankGroup,
} from '@/lib/bracket';
import { GROUPS, GROUP_IDS } from '@/data/teams';
import { loadCurrent, saveBracket, saveCurrent, clearCurrent } from '@/lib/storage';

interface BracketContextValue {
  bracket: BracketPrediction;
  setNickname: (name: string) => void;
  /**
   * Click-to-rank one team in a group. Clicking an unranked team assigns it the
   * next position (1st→2nd→3rd→4th); clicking a ranked team deselects it and the
   * teams ranked after it shift up one place.
   */
  selectTeamPosition: (groupId: string, teamId: string) => void;
  toggleThirdPlace: (teamId: string) => void;
  pickWinner: (matchId: string, teamId: string) => void;
  /** Rebuild the knockout tree from current group + third-place picks. */
  regenerateKnockout: () => void;
  smartPredict: () => void;
  randomize: () => void;
  shuffleGroups: () => void;
  shuffleThirds: () => void;
  shuffleKnockout: () => void;
  reset: () => void;
  /** Persist as a finished, shareable bracket; returns the share code. */
  commit: () => string;
}

const BracketContext = createContext<BracketContextValue | null>(null);

function createEmptyBracket(): BracketPrediction {
  const groupPredictions = defaultGroupPredictions();
  return {
    id: crypto.randomUUID(),
    nickname: '',
    createdAt: new Date().toISOString(),
    groupPredictions,
    completedGroups: [],
    thirdPlaceQualifiers: [],
    knockoutMatches: generateKnockout(groupPredictions, []),
    championId: null,
    runnerUpId: null,
    shareCode: shortCode(),
  };
}

export function BracketProvider({ children }: { children: ReactNode }) {
  const [bracket, setBracket] = useState<BracketPrediction>(() => {
    const loaded = loadCurrent();
    if (!loaded) return createEmptyBracket();
    // Migrate older saved brackets that predate `completedGroups` / `rankedCount`.
    const completedGroups = loaded.completedGroups ?? [];
    return {
      ...loaded,
      completedGroups,
      groupPredictions: loaded.groupPredictions.map((gp) => ({
        ...gp,
        rankedCount: gp.rankedCount ?? (completedGroups.includes(gp.groupId) ? 4 : 0),
      })),
    };
  });

  // Auto-persist the working bracket on every change.
  useEffect(() => {
    saveCurrent(bracket);
  }, [bracket]);

  const value = useMemo<BracketContextValue>(() => {
    const update = (
      fn: (prev: BracketPrediction) => BracketPrediction
    ) => setBracket((prev) => fn(prev));

    const syncChampion = (b: BracketPrediction): BracketPrediction => ({
      ...b,
      championId: getChampion(b.knockoutMatches),
      runnerUpId: getRunnerUp(b.knockoutMatches),
    });

    /**
     * Apply a new order + rankedCount to one group, then keep the rest of the
     * bracket consistent: completedGroups follows rankedCount===4, any now-invalid
     * third-place pick is dropped, and the knockout tree is rebuilt.
     */
    const applyGroup = (
      prev: BracketPrediction,
      groupId: string,
      orderedTeamIds: string[],
      rankedCount: number
    ): BracketPrediction => {
      const groupPredictions = prev.groupPredictions.map((gp) =>
        gp.groupId === groupId ? { ...gp, orderedTeamIds, rankedCount } : gp
      );
      // Only fully-ranked groups contribute a third-placed candidate.
      const validThirds = groupPredictions
        .filter((gp) => gp.rankedCount === 4)
        .map((gp) => gp.orderedTeamIds[2]);
      const thirdPlaceQualifiers = prev.thirdPlaceQualifiers.filter((id) =>
        validThirds.includes(id)
      );
      const complete = rankedCount === 4;
      const completedGroups = complete
        ? prev.completedGroups.includes(groupId)
          ? prev.completedGroups
          : [...prev.completedGroups, groupId]
        : prev.completedGroups.filter((g) => g !== groupId);
      return syncChampion({
        ...prev,
        groupPredictions,
        completedGroups,
        thirdPlaceQualifiers,
        knockoutMatches: generateKnockout(groupPredictions, thirdPlaceQualifiers),
      });
    };

    return {
      bracket,

      setNickname: (name) => update((prev) => ({ ...prev, nickname: name })),

      selectTeamPosition: (groupId, teamId) =>
        update((prev) => {
          const gp = prev.groupPredictions.find((g) => g.groupId === groupId);
          if (!gp) return prev;
          const ranked = gp.orderedTeamIds.slice(0, gp.rankedCount);
          const rankedIdx = ranked.indexOf(teamId);

          let newRanked: string[];
          if (rankedIdx >= 0) {
            // Deselect: drop it; teams after it shift up automatically.
            newRanked = ranked.filter((id) => id !== teamId);
          } else {
            // Assign the next available position.
            newRanked = [...ranked, teamId];
          }
          // Unranked teams keep their existing relative order beneath the ranked ones.
          const rest = gp.orderedTeamIds.filter((id) => !newRanked.includes(id));
          return applyGroup(prev, groupId, [...newRanked, ...rest], newRanked.length);
        }),

      toggleThirdPlace: (teamId) =>
        update((prev) => {
          const selected = prev.thirdPlaceQualifiers.includes(teamId);
          let thirds: string[];
          if (selected) {
            thirds = prev.thirdPlaceQualifiers.filter((id) => id !== teamId);
          } else {
            if (prev.thirdPlaceQualifiers.length >= 8) return prev; // cap at 8
            thirds = [...prev.thirdPlaceQualifiers, teamId];
          }
          return syncChampion({
            ...prev,
            thirdPlaceQualifiers: thirds,
            knockoutMatches: generateKnockout(prev.groupPredictions, thirds),
          });
        }),

      pickWinner: (matchId, teamId) =>
        update((prev) =>
          syncChampion({
            ...prev,
            knockoutMatches: pickWinnerLib(prev.knockoutMatches, matchId, teamId),
          })
        ),

      regenerateKnockout: () =>
        update((prev) =>
          syncChampion({
            ...prev,
            knockoutMatches: generateKnockout(
              prev.groupPredictions,
              prev.thirdPlaceQualifiers
            ),
          })
        ),

      smartPredict: () =>
        update((prev) => {
          const groupPredictions = prev.groupPredictions.map((gp) => ({
            ...gp,
            orderedTeamIds: smartRankGroup(gp.orderedTeamIds),
            rankedCount: 4,
          }));
          // Best 8 thirds by FIFA rank.
          const thirds = groupPredictions
            .map((gp) => gp.orderedTeamIds[2])
            .sort((a, b) => {
              const ra = GROUPS.flatMap((g) => g.teams).find((t) => t.id === a)?.fifaRank ?? 999;
              const rb = GROUPS.flatMap((g) => g.teams).find((t) => t.id === b)?.fifaRank ?? 999;
              return ra - rb;
            })
            .slice(0, 8);
          const matches = autoResolveByRank(generateKnockout(groupPredictions, thirds));
          return syncChampion({
            ...prev,
            groupPredictions,
            completedGroups: [...GROUP_IDS],
            thirdPlaceQualifiers: thirds,
            knockoutMatches: matches,
          });
        }),

      randomize: () =>
        update((prev) => {
          const groupPredictions = prev.groupPredictions.map((gp) => ({
            ...gp,
            orderedTeamIds: shuffle(gp.orderedTeamIds),
            rankedCount: 4,
          }));
          const allThirds = groupPredictions.map((gp) => gp.orderedTeamIds[2]);
          const thirds = shuffle(allThirds).slice(0, 8);
          const matches = autoResolveRandom(generateKnockout(groupPredictions, thirds));
          return syncChampion({
            ...prev,
            groupPredictions,
            completedGroups: [...GROUP_IDS],
            thirdPlaceQualifiers: thirds,
            knockoutMatches: matches,
          });
        }),

      // Shuffle only the group standings (Group Stage tab). Clears thirds +
      // knockout winners since the qualifiers change.
      shuffleGroups: () =>
        update((prev) => {
          const groupPredictions = prev.groupPredictions.map((gp) => ({
            ...gp,
            orderedTeamIds: shuffle(gp.orderedTeamIds),
            rankedCount: 4,
          }));
          return syncChampion({
            ...prev,
            groupPredictions,
            completedGroups: [...GROUP_IDS],
            thirdPlaceQualifiers: [],
            knockoutMatches: generateKnockout(groupPredictions, []),
          });
        }),

      // Randomly pick 8 best-third teams from the 12 candidates.
      shuffleThirds: () =>
        update((prev) => {
          const candidates = prev.groupPredictions.map((gp) => gp.orderedTeamIds[2]);
          const thirds = shuffle(candidates).slice(0, 8);
          return syncChampion({
            ...prev,
            thirdPlaceQualifiers: thirds,
            knockoutMatches: generateKnockout(prev.groupPredictions, thirds),
          });
        }),

      // Randomly decide every knockout match (Knockout tab).
      shuffleKnockout: () =>
        update((prev) =>
          syncChampion({
            ...prev,
            knockoutMatches: autoResolveRandom(
              generateKnockout(prev.groupPredictions, prev.thirdPlaceQualifiers)
            ),
          })
        ),

      reset: () => {
        clearCurrent();
        setBracket(createEmptyBracket());
      },

      commit: () => {
        const finished = syncChampion({ ...bracket, createdAt: new Date().toISOString() });
        saveBracket(finished);
        setBracket(finished);
        return finished.shareCode;
      },
    };
  }, [bracket]);

  return <BracketContext.Provider value={value}>{children}</BracketContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBracket(): BracketContextValue {
  const ctx = useContext(BracketContext);
  if (!ctx) throw new Error('useBracket must be used within a BracketProvider');
  return ctx;
}

export type { GroupPrediction };
