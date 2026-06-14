import { useEffect, useMemo, useState } from 'react';
import { GROUP_MATCHES, type GroupMatch } from '@/data/groupMatches';
import { GROUP_IDS, getTeamByName } from '@/data/teams';
import { FlagIcon } from '@/components/FlagIcon';
import { useResults } from '@/store/ResultsContext';
import type { MatchResult } from '@/lib/results';

// Resolve the viewer's timezone once for the subtitle label.
const LOCAL_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

function localDateKey(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function localTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export default function Schedule() {
  const [group, setGroup] = useState<string>('all');
  const results = useResults();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  // Group matches by the viewer's local calendar date (matches are already
  // chronological, so the date keys come out in order too).
  const days = useMemo(() => {
    const filtered = group === 'all' ? GROUP_MATCHES : GROUP_MATCHES.filter((m) => m.group === group);
    const map = new Map<string, GroupMatch[]>();
    for (const m of filtered) {
      const key = localDateKey(m.kickoffISO);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    }
    return [...map.entries()];
  }, [group]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Group-stage schedule</h1>
      <p className="mt-1 text-sm text-slate-500">
        All 72 group matches. Kickoff times shown in your local timezone
        {LOCAL_TZ ? ` (${LOCAL_TZ})` : ''}. Final scores update automatically once
        matches finish{results.error ? ' (results feed unavailable right now)' : ''}.
      </p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        <FilterPill active={group === 'all'} onClick={() => setGroup('all')}>
          All groups
        </FilterPill>
        {GROUP_IDS.map((g) => (
          <FilterPill key={g} active={group === g} onClick={() => setGroup(g)}>
            {g}
          </FilterPill>
        ))}
      </div>

      <div className="mt-6 space-y-8">
        {days.map(([day, matches]) => (
          <section key={day}>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-brand">{day}</h2>
            <div className="space-y-2">
              {matches.map((m) => (
                <FixtureRow
                  key={m.id}
                  match={m}
                  result={results.resultFor(m.homeTeam, m.awayTeam, m.date)}
                  now={now}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function FixtureRow({ match, result, now }: { match: GroupMatch; result: MatchResult | null; now: number }) {
  const home = getTeamByName(match.homeTeam);
  const away = getTeamByName(match.awayTeam);
  const played = result !== null;
  const homeWon = played && result.home > result.away;
  const awayWon = played && result.away > result.home;
  const kickoffMs = new Date(match.kickoffISO).getTime();
  const isLive = !played && now >= kickoffMs && now < kickoffMs + 120 * 60 * 1000;
  return (
    <div className="card flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:gap-4">
      {/* Time/result + group */}
      <div className="flex shrink-0 items-center gap-2 sm:w-32">
        {isLive ? (
          <span className="chip flex items-center gap-1 bg-red-500/10 font-semibold text-red-500">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            LIVE
          </span>
        ) : played ? (
          <span className="chip bg-brand/10 font-semibold text-brand">FT</span>
        ) : (
          <span className="whitespace-nowrap font-display text-base font-bold tabular-nums text-ink">
            {localTime(match.kickoffISO)}
          </span>
        )}
        <span className="chip whitespace-nowrap bg-brand/10 text-brand">Group {match.group}</span>
      </div>

      {/* Teams */}
      <div className="flex flex-1 items-center justify-center gap-2 sm:justify-start">
        <span
          className={`flex flex-1 items-center justify-end gap-2 text-sm sm:flex-none sm:justify-start sm:w-52 ${
            homeWon ? 'font-bold text-ink' : 'font-semibold text-ink'
          }`}
        >
          <span className="truncate text-right sm:order-1 sm:text-left">{match.homeTeam}</span>
          <FlagIcon team={home} size={20} />
        </span>
        {played ? (
          <span className="font-display text-sm font-bold tabular-nums text-ink">
            {result.home}–{result.away}
          </span>
        ) : (
          <span className="text-xs font-bold text-slate-400">vs</span>
        )}
        <span
          className={`flex flex-1 items-center gap-2 text-sm sm:flex-none sm:w-52 ${
            awayWon ? 'font-bold text-ink' : 'font-semibold text-ink'
          }`}
        >
          <FlagIcon team={away} size={20} />
          <span className="truncate">{match.awayTeam}</span>
        </span>
      </div>

      {/* Venue */}
      <div className="shrink-0 text-xs text-slate-400 sm:w-52 sm:text-right">
        🏟 {match.venue} · {match.city}
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
        active ? 'bg-ink text-white' : 'bg-white border border-line text-slate-500 hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}
