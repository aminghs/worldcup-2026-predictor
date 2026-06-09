import { useState } from 'react';
import { SCORING_MAX, SCORING_SECTIONS, type ScoringSection } from '@/data/mock';

const ACCENT: Record<ScoringSection['accent'], string> = {
  group: 'text-brand',
  winner: 'text-cyan-600',
  pair: 'text-pos3',
};

/** Collapsible "How are points calculated?" disclosure with the full rules. */
export function PointsExplainer() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mx-auto max-w-xl text-center">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-ink"
      >
        🏅 How are points calculated?
        <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>⌄</span>
      </button>

      {open && (
        <div className="card mt-3 p-5 text-left animate-pop-in">
          <h3 className="mb-4 font-display text-base font-bold text-ink">
            HOW SCORING WORKS — <span className="text-gold">MAX {SCORING_MAX} PTS</span>
          </h3>

          <div className="space-y-5">
            {SCORING_SECTIONS.map((section) => (
              <div key={section.title}>
                <h4 className={`text-xs font-bold uppercase tracking-wider ${ACCENT[section.accent]}`}>
                  {section.title}{' '}
                  <span className="font-semibold normal-case text-slate-400">
                    (max {section.max} pts)
                  </span>
                </h4>
                <ul className="mt-2 space-y-1">
                  {section.rules.map((r) => (
                    <li key={r.label} className="flex items-baseline gap-2 text-sm text-slate-600">
                      <span className="text-slate-300">•</span>
                      <span className="flex-1">{r.label}</span>
                      <span className="font-semibold text-ink">{r.points}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
