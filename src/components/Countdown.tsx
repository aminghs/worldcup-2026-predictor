import { useEffect, useState } from 'react';

const KICKOFF = new Date('2026-06-11T19:00:00-06:00');

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
}

function useNewsFeed() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news')
      .then((r) => r.json())
      .then((data) => setItems(data.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { items, loading };
}

function timeAgo(pubDate: string): string {
  const mins = Math.floor((Date.now() - new Date(pubDate).getTime()) / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function diff() {
  const ms = Math.max(0, KICKOFF.getTime() - Date.now());
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms % 86_400_000) / 3_600_000),
    minutes: Math.floor((ms % 3_600_000) / 60_000),
    seconds: Math.floor((ms % 60_000) / 1000),
    done: ms === 0,
  };
}

export function Countdown() {
  const [time, setTime] = useState(diff);
  const { items, loading } = useNewsFeed();

  useEffect(() => {
    const id = setInterval(() => setTime(diff()), 1000);
    return () => clearInterval(id);
  }, []);

  if (time.done) {
    return (
      <div>
        <div className="mb-4 flex items-center gap-2">
          <h2 className="font-display text-xl font-bold text-ink">Football News</h2>
          <a
            href="https://www.bbc.com/sport/football"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-brand"
          >
            BBC Sport →
          </a>
        </div>

        {loading && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card h-24 animate-pulse bg-slate-100 p-4" />
            ))}
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <a
                key={item.link}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="card flex flex-col gap-2 p-4 transition-transform hover:-translate-y-0.5 hover:border-brand/40"
              >
                <p className="line-clamp-3 text-sm font-semibold leading-snug text-ink">
                  {item.title}
                </p>
                <div className="mt-auto text-xs text-slate-400">{timeAgo(item.pubDate)}</div>
              </a>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <p className="text-sm text-slate-400">No news available right now.</p>
        )}
      </div>
    );
  }

  const units = [
    { value: time.days, label: 'Days' },
    { value: time.hours, label: 'Hrs' },
    { value: time.minutes, label: 'Min' },
    { value: time.seconds, label: 'Sec' },
  ];

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4">
      {units.map((u) => (
        <div key={u.label} className="card grid w-16 place-items-center py-3 sm:w-20">
          <span className="font-display text-2xl font-bold tabular-nums text-ink sm:text-3xl">
            {String(u.value).padStart(2, '0')}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}
