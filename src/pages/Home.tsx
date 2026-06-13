import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '@/components/HeroSection';

const BBC_FOOTBALL_RSS =
  'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffeeds.bbci.co.uk%2Fsport%2Ffootball%2Frss.xml&count=6';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
}

function useNewsFeed() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(BBC_FOOTBALL_RSS)
      .then((r) => r.json())
      .then((data) => {
        if (data?.status === 'ok') setItems(data.items ?? []);
      })
      .catch(() => {/* silently ignore — section just won't render */})
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

const FEATURES = [
  { icon: '🚫', title: 'No signup', body: 'Start predicting in seconds. Your bracket saves automatically to your device.' },
  { icon: '🔗', title: 'Shareable link', body: 'Every bracket becomes a self-contained link you can send to friends.' },
  { icon: '📱', title: 'Mobile friendly', body: 'Rank groups with a tap, scroll through the knockout bracket on any device.' },
  { icon: '🏅', title: 'Leaderboard ready', body: 'Join private leagues and climb the leaderboard once the tournament begins.' },
];

export default function Home() {
  const { items, loading } = useNewsFeed();

  return (
    <div>
      <HeroSection />

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-5 transition-transform hover:-translate-y-1">
              <div className="mb-3 text-3xl">{f.icon}</div>
              <h3 className="font-display text-base font-bold text-ink">{f.title}</h3>
              <p className="mt-1.5 text-sm text-slate-500">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {!loading && items.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-14">
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
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="card relative overflow-hidden p-8 text-center sm:p-12">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand/5 via-transparent to-gold/10" />
          <div className="relative">
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              Ready to call the World Cup?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-slate-600">
              48 teams. 104 matches. One champion. Make your picks before the first
              whistle and see how your bracket holds up.
            </p>
            <Link to="/create" className="btn-primary mt-6 px-6 py-3 text-base">
              Build my bracket →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
