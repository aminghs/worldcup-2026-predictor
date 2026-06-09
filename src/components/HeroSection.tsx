import { Link } from 'react-router-dom';
import { Countdown } from './Countdown';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
      <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-14 text-center sm:pt-20">
        <span className="chip mx-auto mb-4 border border-accent/30 bg-accent/10 text-accent">
          ⚽ 48 teams · 12 groups · June–July 2026
        </span>
        <h1 className="mx-auto max-w-3xl font-display text-4xl font-bold leading-tight sm:text-6xl">
          World Cup 2026
          <br />
          <span className="text-accent">Bracket Predictor</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-slate-300 sm:text-lg">
          Rank all 12 groups, choose the 8 best third-placed teams, fight through the
          knockout rounds and crown your champion. No signup — just predict, save and share.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/create" className="btn-primary px-6 py-3 text-base">
            Create bracket →
          </Link>
          <Link to="/predictions" className="btn-ghost px-6 py-3 text-base">
            View predictions
          </Link>
          <Link to="/format" className="btn-outline px-6 py-3 text-base">
            How the format works
          </Link>
        </div>

        <div className="mt-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Kickoff in
          </p>
          <Countdown />
        </div>
      </div>
    </section>
  );
}
