import type { BracketPrediction } from '@/types';

// ---------------------------------------------------------------------------
// LocalStorage persistence. Swap these four functions for API calls when a
// real backend is added — the rest of the app only depends on this interface.
// ---------------------------------------------------------------------------

const CURRENT_KEY = 'bk26:current-bracket';
const SAVED_KEY = 'bk26:saved-brackets';

export function loadCurrent(): BracketPrediction | null {
  try {
    const raw = localStorage.getItem(CURRENT_KEY);
    return raw ? (JSON.parse(raw) as BracketPrediction) : null;
  } catch {
    return null;
  }
}

export function saveCurrent(prediction: BracketPrediction): void {
  localStorage.setItem(CURRENT_KEY, JSON.stringify(prediction));
}

export function clearCurrent(): void {
  localStorage.removeItem(CURRENT_KEY);
}

/** Persist a finished bracket to a keyed-by-shareCode collection. */
export function saveBracket(prediction: BracketPrediction): void {
  const all = loadSavedBrackets();
  all[prediction.shareCode] = prediction;
  localStorage.setItem(SAVED_KEY, JSON.stringify(all));
}

export function loadSavedBrackets(): Record<string, BracketPrediction> {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    return raw ? (JSON.parse(raw) as Record<string, BracketPrediction>) : {};
  } catch {
    return {};
  }
}

export function loadBracketByShareCode(code: string): BracketPrediction | null {
  return loadSavedBrackets()[code] ?? null;
}
