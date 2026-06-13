import { useMemo } from 'react';
import { GROUP_IDS } from '@/data/teams';
import { computeGroupConstraints, type GroupConstraint } from '@/lib/groupConstraints';
import { useResults } from '@/store/ResultsContext';

/**
 * Constraints for all 12 groups, recomputed only when results change. Before
 * results load the map is empty (every position allowed).
 */
export function useGroupConstraints(): Record<string, GroupConstraint> {
  const { results, resultFor } = useResults();
  return useMemo(() => {
    const out: Record<string, GroupConstraint> = {};
    for (const id of GROUP_IDS) out[id] = computeGroupConstraints(id, resultFor);
    return out;
    // `results` identity is the real dependency; resultFor closes over it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);
}
