import type { Team } from '@/types';

interface FlagIconProps {
  team?: Team;
  /** Visual size in pixels (width). Height is derived 4:3. */
  size?: number;
  className?: string;
}

/**
 * Renders a country flag as an SVG (via the `flag-icons` set) so it displays
 * consistently across platforms — unlike emoji flags, which don't render on
 * Windows. Falls back to a neutral placeholder when no team is supplied.
 */
export function FlagIcon({ team, size = 22, className = '' }: FlagIconProps) {
  if (!team) {
    return (
      <span
        className={`inline-block shrink-0 rounded-[3px] bg-slate-200 ${className}`}
        style={{ width: size, height: size * 0.75 }}
        aria-hidden
      />
    );
  }
  return (
    <span
      className={`fi fi-${team.iso} inline-block shrink-0 rounded-[3px] bg-cover bg-center ${className}`}
      style={{ width: size, height: size * 0.75 }}
      role="img"
      aria-label={team.name}
    />
  );
}
