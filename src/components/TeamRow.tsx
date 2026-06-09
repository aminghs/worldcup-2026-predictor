import type { Team } from '@/types';
import { FlagIcon } from './FlagIcon';

const ORDINAL = ['1st', '2nd', '3rd', '4th'];

// Badge colour keyed by finishing position (0-based).
const BADGE_STYLE = [
  'bg-pos1 text-white', // 1st
  'bg-pos2 text-white', // 2nd
  'bg-pos3 text-white', // 3rd
  'bg-pos4 text-white', // 4th
];

const ROW_STYLE = [
  'border-pos1/40 bg-pos1/[0.07]',
  'border-pos2/40 bg-pos2/[0.07]',
  'border-pos3/40 bg-pos3/[0.07]',
  'border-pos4/40 bg-pos4/[0.07]',
];

interface TeamRowProps {
  team: Team;
  /** Assigned position 0..3, or null when not yet ranked. */
  position: number | null;
  onClick?: () => void;
}

/** A clickable team row. Click to assign the next rank; click again to remove. */
export function TeamRow({ team, position, onClick }: TeamRowProps) {
  const ranked = position !== null;
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all hover:border-brand/50 ${
        ranked ? ROW_STYLE[position!] : 'border-line bg-sand'
      }`}
    >
      <FlagIcon team={team} size={24} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 truncate text-sm font-semibold text-ink">
          {team.name}
          {team.isHost && <span className="chip bg-brand/15 text-brand text-[10px]">HOST</span>}
        </div>
      </div>
      {ranked && (
        <span className={`chip ${BADGE_STYLE[position!]} font-bold`}>{ORDINAL[position!]}</span>
      )}
    </button>
  );
}
