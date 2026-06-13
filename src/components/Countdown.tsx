import { useEffect, useState } from 'react';

// World Cup 2026 opening match (Estadio Azteca, Mexico City).
const KICKOFF = new Date('2026-06-11T19:00:00-06:00');

const HIGHLIGHTS = [
  { id: 'DjYkkRPqV18', label: 'Mexico 2–0 South Africa' },
  { id: '6k18EJY8zIc', label: 'South Korea 2–1 Czechia' },
  { id: 'VrxCVFhN0cY', label: 'Canada 1–1 Bosnia & Herzegovina' },
  { id: 'ENqQJK2fda8', label: 'USA 4–1 Paraguay' },
  { id: 'CUo5J7CUnCo', label: 'Qatar 1–1 Switzerland' },
];

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

  useEffect(() => {
    const id = setInterval(() => setTime(diff()), 1000);
    return () => clearInterval(id);
  }, []);

  if (time.done) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {HIGHLIGHTS.map((v) => (
          <a
            key={v.id}
            href={`https://www.youtube.com/watch?v=${v.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="card group overflow-hidden p-0"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
              <img
                src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                alt={v.label}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform duration-200 group-hover:scale-110">
                  <svg className="ml-1 h-5 w-5 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="px-3 py-2 text-xs font-semibold text-slate-600">{v.label}</p>
          </a>
        ))}
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
