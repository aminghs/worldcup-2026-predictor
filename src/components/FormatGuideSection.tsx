interface FormatStep {
  icon: string;
  title: string;
  body: string;
}

const STEPS: FormatStep[] = [
  { icon: '🌍', title: '48 teams, 12 groups', body: 'For the first time the World Cup expands to 48 nations, split into 12 groups (A–L) of 4 teams each.' },
  { icon: '🥇', title: 'Top 2 advance', body: 'The top two teams from every group automatically qualify for the knockout stage — that’s 24 teams.' },
  { icon: '🃏', title: '8 best thirds', body: 'The 8 best third-placed teams across all 12 groups also advance, bringing the total to 32.' },
  { icon: '⚔️', title: 'Round of 32', body: 'A brand-new knockout round. From here it’s single elimination: lose and you go home.' },
  { icon: '🏟️', title: 'To the final', body: 'Round of 32 → Round of 16 → Quarter-finals → Semi-finals → Final, plus a third-place playoff.' },
  { icon: '🏆', title: 'One champion', body: '104 matches across the USA, Canada and Mexico decide a single world champion on July 19, 2026.' },
];

export function FormatGuideSection() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {STEPS.map((s, i) => (
        <div key={s.title} className="card p-5">
          <div className="mb-3 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-xl">
              {s.icon}
            </span>
            <span className="text-xs font-bold text-brand">STEP {i + 1}</span>
          </div>
          <h3 className="font-display text-base font-bold text-ink">{s.title}</h3>
          <p className="mt-1.5 text-sm text-slate-500">{s.body}</p>
        </div>
      ))}
    </div>
  );
}
