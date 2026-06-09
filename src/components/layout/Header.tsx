import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const NAV = [
  { to: '/create', label: 'Create' },
  { to: '/schedule', label: 'Schedule' },
  { to: '/predictions', label: 'Predictions' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/leagues', label: 'Leagues' },
  { to: '/format', label: 'Format' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white font-bold">
            BK
          </span>
          <span className="tracking-tight text-ink">
            Bracket<span className="text-brand">Kick</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-brand' : 'text-slate-500 hover:text-ink'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link to="/create" className="btn-primary ml-2">
            Build bracket
          </Link>
        </nav>

        <button
          className="btn-ghost md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-white px-4 py-2 md:hidden">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-3 text-sm font-medium ${
                  isActive ? 'text-brand' : 'text-ink'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
