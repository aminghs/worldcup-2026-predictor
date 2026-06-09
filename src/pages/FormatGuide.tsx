import { Link } from 'react-router-dom';
import { FormatGuideSection } from '@/components/FormatGuideSection';

export default function FormatGuide() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">
        How the 2026 format works
      </h1>
      <p className="mt-2 max-w-2xl text-slate-300">
        The 2026 World Cup is the biggest ever — 48 teams, 104 matches, three host nations.
        Here's the path from group stage to glory.
      </p>

      <div className="mt-8">
        <FormatGuideSection />
      </div>

      {/* Simple flow diagram */}
      <div className="card mt-8 p-6">
        <h2 className="mb-4 font-display text-lg font-bold">The road to the final</h2>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {[
            '12 groups × 4',
            '24 group qualifiers',
            '+ 8 best thirds',
            'Round of 32',
            'Round of 16',
            'Quarter-finals',
            'Semi-finals',
            'Final',
          ].map((label, i, arr) => (
            <span key={label} className="flex items-center gap-2">
              <span className="chip bg-accent/10 text-accent">{label}</span>
              {i < arr.length - 1 && <span className="text-slate-600">→</span>}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat value="48" label="Teams" />
        <Stat value="12" label="Groups" />
        <Stat value="104" label="Matches" />
      </div>

      <div className="mt-10 text-center">
        <Link to="/create" className="btn-primary px-6 py-3 text-base">
          Try it yourself →
        </Link>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="card grid place-items-center p-6">
      <span className="font-display text-4xl font-bold text-accent">{value}</span>
      <span className="text-xs uppercase tracking-wider text-slate-400">{label}</span>
    </div>
  );
}
