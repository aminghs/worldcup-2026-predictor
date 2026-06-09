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
import { GROUPS } from '@/data/teams';
import { loadCurrent, saveBracket, saveCurrent, clearCurrent } from '@/lib/storage';

interface BracketContextValue {
  bracket: BracketPrediction;
  setNickname: (name: string) => void;
  /** Reorder one group's standings (full ordered list of 4 ids). */
  setGroupOrder: (groupId: string, orderedTeamIds: string[]) => void;
  /** Move a team up/down within its group (mobile-friendly fallback). */
  moveTeam: (groupId: string, teamId: string, direction: 'up' | 'down') => void;
  toggleThirdPlace: (teamId: string) => void;
  pickWinner: (matchId: string, teamId: string) => void;
  /** Rebuild the knockout tree from current group + third-place picks. */
  regenerateKnockout: () => void;
  smartPredict: () => void;
  randomize: () => void;
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
    thirdPlaceQualifiers: [],
    knockoutMatches: generateKnockout(groupPredictions, []),
    championId: null,
    runnerUpId: null,
    shareCode: shortCode(),
  };
}

export function BracketProvider({ children }: { children: ReactNode }) {
  const [bracket, setBracket] = useState<BracketPrediction>(
    () => loadCurrent() ?? createEmptyBracket()
  );

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

    const setGroupOrderRaw = (
      prev: BracketPrediction,
      groupId: string,
      orderedTeamIds: string[]
    ): BracketPrediction => {
      const groupPredictions = prev.groupPredictions.map((gp) =>
        gp.groupId === groupId ? { ...gp, orderedTeamIds } : gp
      );
      // Group order changed → drop any third-place pick that's no longer 3rd,
      // and rebuild the knockout tree to reflect new qualifiers.
      const validThirds = groupPredictions
        .map((gp) => gp.orderedTeamIds[2])
        .filter(Boolean);
      const thirdPlaceQualifiers = prev.thirdPlaceQualifiers.filter((id) =>
        validThirds.includes(id)
      );
      return syncChampion({
        ...prev,
        groupPredictions,
        thirdPlaceQualifiers,
        knockoutMatches: generateKnockout(groupPredictions, thirdPlaceQualifiers),
      });
    };

    return {
      bracket,

      setNickname: (name) => update((prev) => ({ ...prev, nickname: name })),

      setGroupOrder: (groupId, orderedTeamIds) =>
        update((prev) => setGroupOrderRaw(prev, groupId, orderedTeamIds)),

      moveTeam: (groupId, teamId, direction) =>
        update((prev) => {
          const gp = prev.groupPredictions.find((g) => g.groupId === groupId);
          if (!gp) return prev;
          const idx = gp.orderedTeamIds.indexOf(teamId);
          const swap = direction === 'up' ? idx - 1 : idx + 1;
          if (idx < 0 || swap < 0 || swap >= gp.orderedTeamIds.length) return prev;
          const order = [...gp.orderedTeamIds];
          [order[idx], order[swap]] = [order[swap], order[idx]];
          return setGroupOrderRaw(prev, groupId, order);
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
            thirdPlaceQualifiers: thirds,
            knockoutMatches: matches,
          });
        }),

      randomize: () =>
        update((prev) => {
          const groupPredictions = prev.groupPredictions.map((gp) => ({
            ...gp,
            orderedTeamIds: shuffle(gp.orderedTeamIds),
          }));
          const allThirds = groupPredictions.map((gp) => gp.orderedTeamIds[2]);
          const thirds = shuffle(allThirds).slice(0, 8);
          const matches = autoResolveRandom(generateKnockout(groupPredictions, thirds));
          return syncChampion({
            ...prev,
            groupPredictions,
            thirdPlaceQualifiers: thirds,
            knockoutMatches: matches,
          });
        }),

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
