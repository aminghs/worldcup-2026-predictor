import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-white/50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="font-display text-lg font-bold text-ink">
            Bracket<span className="text-brand">Kick</span>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            An unofficial, fan-made World Cup 2026 bracket predictor. Not affiliated
            with or endorsed by FIFA.
          </p>
        </div>
        <FooterCol title="Predict">
          <FooterLink to="/create">Create bracket</FooterLink>
          <FooterLink to="/predictions">Fan predictions</FooterLink>
          <FooterLink to="/leaderboard">Leaderboard</FooterLink>
          <FooterLink to="/leagues">Private leagues</FooterLink>
        </FooterCol>
        <FooterCol title="Learn">
          <FooterLink to="/format">Format guide</FooterLink>
          <FooterLink to="/about">About</FooterLink>
          <FooterLink to="/privacy">Privacy</FooterLink>
          <FooterLink to="/contact">Contact</FooterLink>
        </FooterCol>
        <FooterCol title="The tournament">
          <li className="text-sm text-slate-500">48 teams · 12 groups</li>
          <li className="text-sm text-slate-500">USA · Canada · Mexico</li>
          <li className="text-sm text-slate-500">Kickoff June 11, 2026</li>
        </FooterCol>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} BracketKick · Built for fun, not for FIFA.
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold text-ink">{title}</h4>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link to={to} className="text-sm text-slate-500 transition-colors hover:text-brand">
        {children}
      </Link>
    </li>
  );
}
