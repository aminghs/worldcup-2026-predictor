import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { fetchResults, resultFor as lookup, type MatchResult } from '@/lib/results';

type PairScore = Record<string, number>;

interface ResultsContextValue {
  /** Resolve a fixture to its full-time score, oriented home/away, or null. */
  resultFor: (homeTeam: string, awayTeam: string, date: string) => MatchResult | null;
  /** Raw lookup map — stable identity, changes once when results land. */
  results: Map<string, PairScore> | null;
  loading: boolean;
  error: boolean;
}

const ResultsContext = createContext<ResultsContextValue | null>(null);

/**
 * Fetches World Cup results once for the whole app from the openfootball feed.
 * Everything that needs scores (schedule, group constraints, the store) reads
 * the same shared map so we only hit the network a single time.
 */
export function ResultsProvider({ children }: { children: ReactNode }) {
  const [results, setResults] = useState<Map<string, PairScore> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    fetchResults(ctrl.signal)
      .then((map) => setResults(map))
      .catch((e) => {
        if (e?.name !== 'AbortError') setError(true);
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  const value = useMemo<ResultsContextValue>(
    () => ({
      results,
      loading,
      error,
      resultFor: (homeTeam, awayTeam, date) =>
        results ? lookup(results, homeTeam, awayTeam, date) : null,
    }),
    [results, loading, error],
  );

  return <ResultsContext.Provider value={value}>{children}</ResultsContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useResults(): ResultsContextValue {
  const ctx = useContext(ResultsContext);
  if (!ctx) throw new Error('useResults must be used within a ResultsProvider');
  return ctx;
}
