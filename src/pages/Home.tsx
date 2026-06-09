import { Link } from 'react-router-dom';
import { HeroSection } from '@/components/HeroSection';

const FEATURES = [
  { icon: '🚫', title: 'No signup', body: 'Start predicting in seconds. Your bracket saves automatically to your device.' },
  { icon: '🔗', title: 'Shareable link', body: 'Every bracket becomes a self-contained link you can send to friends.' },
  { icon: '📱', title: 'Mobile friendly', body: 'Rank groups with a tap, swipe through the knockout bracket on any device.' },
  { icon: '🏅', title: 'Leaderboard ready', body: 'Join private leagues and climb the leaderboard once the tournament begins.' },
];

export default function Home() {
  return (
    <div>
      <HeroSection />

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-5 transition-transform hover:-translate-y-1">
              <div className="mb-3 text-3xl">{f.icon}</div>
              <h3 className="font-display text-base font-bold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-slate-400">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="card relative overflow-hidden p-8 text-center sm:p-12">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-gold/10" />
          <div className="relative">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Ready to call the World Cup?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-slate-300">
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
