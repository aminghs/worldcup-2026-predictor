export interface Step {
  id: number;
  label: string;
}

export const BRACKET_STEPS: Step[] = [
  { id: 1, label: 'Group rankings' },
  { id: 2, label: 'Best thirds' },
  { id: 3, label: 'Round of 32' },
  { id: 4, label: 'Knockouts' },
  { id: 5, label: 'Champion' },
];

interface StepperProps {
  current: number;
  onStepClick?: (step: number) => void;
  maxReached?: number;
}

export function Stepper({ current, onStepClick, maxReached = 5 }: StepperProps) {
  return (
    <ol className="flex items-center gap-1 overflow-x-auto pb-1 sm:gap-2">
      {BRACKET_STEPS.map((step, i) => {
        const isDone = step.id < current;
        const isCurrent = step.id === current;
        const reachable = step.id <= maxReached;
        return (
          <li key={step.id} className="flex flex-1 items-center">
            <button
              disabled={!reachable || !onStepClick}
              onClick={() => reachable && onStepClick?.(step.id)}
              className={`flex min-w-max items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                isCurrent
                  ? 'bg-accent text-pitch-950'
                  : isDone
                    ? 'bg-accent/15 text-accent'
                    : 'bg-white/5 text-slate-400'
              } ${reachable && onStepClick ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span
                className={`grid h-5 w-5 place-items-center rounded-full text-[10px] ${
                  isCurrent ? 'bg-pitch-950/20' : isDone ? 'bg-accent/20' : 'bg-white/10'
                }`}
              >
                {isDone ? '✓' : step.id}
              </span>
              <span className="hidden sm:inline">{step.label}</span>
            </button>
            {i < BRACKET_STEPS.length - 1 && (
              <span className="mx-1 hidden h-px flex-1 bg-white/10 sm:block" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
