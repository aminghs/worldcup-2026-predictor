import { useState } from 'react';
import { SCORING_RULES } from '@/data/mock';

/** Collapsible "How are points calculated?" disclosure. */
export function PointsExplainer() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mx-auto max-w-md text-center">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-ink"
      >
        🏅 How are points calculated?
        <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>⌄</span>
      </button>
      {open && (
        <div className="card mt-3 p-4 text-left animate-pop-in">
          <p className="mb-2 text-xs text-slate-500">
            Once the tournament begins, your bracket scores points for every correct call:
          </p>
          <ul className="space-y-1.5">
            {SCORING_RULES.map((r) => (
              <li
                key={r.label}
                className="flex items-center justify-between rounded-lg bg-sand px-3 py-1.5 text-sm"
              >
                <span className="text-ink">{r.label}</span>
                <span className="font-bold text-brand">+{r.points}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
