import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const NAV = [
  { to: '/create', label: 'Create' },
  { to: '/schedule', label: 'Schedule' },
  { to: '/predictions', label: 'Predictions' },
  { to: '/format', label: 'Format' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          {/* Football icon */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <circle cx="16" cy="16" r="15" fill="#16a34a" stroke="#15803d" strokeWidth="1.5"/>
            <polygon points="16,7 19,12 24,12 20,16 22,21 16,18 10,21 12,16 8,12 13,12" fill="white" opacity="0.95"/>
            <circle cx="16" cy="16" r="3" fill="#16a34a"/>
          </svg>
          <span className="tracking-tight text-ink">
            WC2026 <span className="text-brand">Predictor</span>
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
