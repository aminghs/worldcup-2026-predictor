import type { Team } from '@/types';

type Outcome = 'qualified' | 'wildcard' | 'eliminated';

const POSITION_META: Record<number, { outcome: Outcome; label: string }> = {
  0: { outcome: 'qualified', label: '1st · Qualified' },
  1: { outcome: 'qualified', label: '2nd · Qualified' },
  2: { outcome: 'wildcard', label: '3rd · Wildcard' },
  3: { outcome: 'eliminated', label: '4th · Out' },
};

const OUTCOME_STYLE: Record<Outcome, string> = {
  qualified: 'border-accent/40 bg-accent/5',
  wildcard: 'border-gold/40 bg-gold/5',
  eliminated: 'border-white/5 bg-white/[0.02] opacity-60',
};

const BADGE_STYLE: Record<Outcome, string> = {
  qualified: 'bg-accent/15 text-accent',
  wildcard: 'bg-gold/15 text-gold',
  eliminated: 'bg-white/10 text-slate-400',
};

interface TeamRowProps {
  team: Team;
  position: number; // 0..3
  draggable?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDragStart?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: () => void;
}

export function TeamRow({
  team,
  position,
  draggable,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragOver,
  onDrop,
}: TeamRowProps) {
  const meta = POSITION_META[position];
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all ${OUTCOME_STYLE[meta.outcome]} ${
        draggable ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
    >
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white/10 text-xs font-bold">
        {position + 1}
      </span>
      <span className="text-xl leading-none">{team.flagEmoji}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 truncate text-sm font-semibold">
          {team.name}
          {team.isHost && (
            <span className="chip bg-accent/15 text-accent text-[10px]">HOST</span>
          )}
        </div>
        <div className="text-[11px] text-slate-400">
          FIFA #{team.fifaRank} · {team.confederation}
        </div>
      </div>

      <span className={`chip ${BADGE_STYLE[meta.outcome]} hidden sm:inline-flex`}>
        {meta.label}
      </span>

      {/* Up/down controls — the mobile-friendly fallback for drag-and-drop. */}
      <div className="flex flex-col">
        <button
          onClick={onMoveUp}
          disabled={position === 0}
          className="grid h-5 w-6 place-items-center rounded text-slate-300 hover:bg-white/10 disabled:opacity-20"
          aria-label={`Move ${team.name} up`}
        >
          ▲
        </button>
        <button
          onClick={onMoveDown}
          disabled={position === 3}
          className="grid h-5 w-6 place-items-center rounded text-slate-300 hover:bg-white/10 disabled:opacity-20"
          aria-label={`Move ${team.name} down`}
        >
          ▼
        </button>
      </div>
    </div>
  );
}
