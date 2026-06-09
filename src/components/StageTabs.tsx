export type Stage = 'group' | 'knockout';

interface StageTabsProps {
  stage: Stage;
  onChange: (stage: Stage) => void;
  groupComplete: boolean;
  knockoutEnabled: boolean;
}

/** Two-tab switch between the group stage and the knockout stage. */
export function StageTabs({ stage, onChange, groupComplete, knockoutEnabled }: StageTabsProps) {
  const tab = (key: Stage, label: string, enabled: boolean, done?: boolean) => (
    <button
      onClick={() => enabled && onChange(key)}
      disabled={!enabled}
      className={`rounded-xl px-6 py-2.5 text-sm font-bold transition-all ${
        stage === key
          ? 'bg-ink text-white shadow'
          : enabled
            ? 'text-slate-500 hover:text-ink'
            : 'cursor-not-allowed text-slate-300'
      }`}
    >
      {label}
      {done && <span className="ml-1.5 text-brand">✓</span>}
    </button>
  );

  return (
    <div className="mx-auto flex w-max items-center gap-1 rounded-2xl bg-sand p-1">
      {tab('group', 'Group Stage', true, groupComplete)}
      {tab('knockout', 'Knockout Stage', knockoutEnabled)}
    </div>
  );
}
