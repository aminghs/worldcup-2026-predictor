import { useMemo, useState } from 'react';
import { FAN_PREDICTIONS } from '@/data/mock';
import { getTeam } from '@/data/teams';

type SortKey = 'newest' | 'popular' | 'champion';

export default function Predictions() {
  const [sort, setSort] = useState<SortKey>('popular');
  const [championFilter, setChampionFilter] = useState<string>('all');

  // Distinct champions present in the mock data, for the filter dropdown.
  const champions = useMemo(
    () => Array.from(new Set(FAN_PREDICTIONS.map((p) => p.championId))),
    []
  );

  const list = useMemo(() => {
    let items = [...FAN_PREDICTIONS];
    if (championFilter !== 'all') {
      items = items.filter((p) => p.championId === championFilter);
    }
    items.sort((a, b) => {
      if (sort === 'popular') return b.likes - a.likes;
      if (sort === 'newest') return +new Date(b.createdAt) - +new Date(a.createdAt);
      return (getTeam(a.championId)?.name ?? '').localeCompare(getTeam(b.championId)?.name ?? '');
    });
    return items;
  }, [sort, championFilter]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Fan predictions</h1>
      <p className="mt-1 text-sm text-slate-400">
        See who the community is backing. (Sample data for now — your saved brackets will
        appear here once the backend is connected.)
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-xl border border-white/10 bg-pitch-800 px-3 py-2 text-sm"
        >
          <option value="popular">Most popular</option>
          <option value="newest">Newest</option>
          <option value="champion">Champion A–Z</option>
        </select>
        <select
          value={championFilter}
          onChange={(e) => setChampionFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-pitch-800 px-3 py-2 text-sm"
        >
          <option value="all">All champions</option>
          {champions.map((id) => (
            <option key={id} value={id}>
              {getTeam(id)?.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => {
          const champ = getTeam(p.championId);
          const finalist = getTeam(p.finalistId);
          return (
            <div key={p.id} className="card p-5 transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{p.nickname}</span>
                <span className="chip bg-white/5 text-slate-300">♥ {p.likes}</span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="text-4xl">{champ?.flagEmoji}</div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-gold">Champion</div>
                  <div className="font-display text-lg font-bold">{champ?.name}</div>
                </div>
              </div>
              <div className="mt-3 text-sm text-slate-400">
                Final vs {finalist?.flagEmoji} {finalist?.name}
              </div>
              <div className="mt-3 text-xs text-slate-500">
                {new Date(p.createdAt).toLocaleDateString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
