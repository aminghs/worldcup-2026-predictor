import { useEffect, useState } from 'react';

// World Cup 2026 opening match (Estadio Azteca, Mexico City).
const KICKOFF = new Date('2026-06-11T19:00:00-06:00');

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
      <div className="card px-6 py-4 text-center font-display text-lg font-bold text-accent">
        The tournament has kicked off! ⚽
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
          <span className="font-display text-2xl font-bold tabular-nums sm:text-3xl">
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
