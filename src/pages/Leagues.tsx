import { useState } from 'react';
import type { League } from '@/types';
import { SAMPLE_LEAGUE } from '@/data/mock';
import { shortCode } from '@/lib/bracket';
import { LeagueCard } from '@/components/LeagueCard';

export default function Leagues() {
  const [leagues, setLeagues] = useState<League[]>([SAMPLE_LEAGUE]);
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [joinMsg, setJoinMsg] = useState<string | null>(null);

  const createLeague = () => {
    if (!name.trim() || !nickname.trim()) return;
    const league: League = {
      id: crypto.randomUUID(),
      name: name.trim(),
      nickname: nickname.trim(),
      inviteCode: shortCode(),
      createdAt: new Date().toISOString(),
      members: [{ rank: 1, name: nickname.trim(), championId: '', points: 0, correctPicks: 0 }],
    };
    setLeagues((prev) => [league, ...prev]);
    setName('');
    setNickname('');
  };

  const joinLeague = () => {
    const found = leagues.find(
      (l) => l.inviteCode.toUpperCase() === joinCode.trim().toUpperCase()
    );
    setJoinMsg(
      found ? `Joined “${found.name}”! (mock)` : `No league found for code “${joinCode}”.`
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Private leagues</h1>
      <p className="mt-1 text-sm text-slate-500">
        Create a league, share the invite code and see who tops your group. (Mock UI —
        leagues live in memory for now.)
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="card p-5">
          <h3 className="font-display text-base font-bold text-ink">Create a league</h3>
          <div className="mt-3 space-y-3">
            <Field label="League name" value={name} onChange={setName} placeholder="Office Sweepstake 2026" />
            <Field label="Your nickname" value={nickname} onChange={setNickname} placeholder="Commissioner" />
            <button onClick={createLeague} disabled={!name.trim() || !nickname.trim()} className="btn-primary w-full">
              Create league
            </button>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-display text-base font-bold text-ink">Join with a code</h3>
          <div className="mt-3 space-y-3">
            <Field label="Invite code" value={joinCode} onChange={setJoinCode} placeholder="KICK26" />
            <button onClick={joinLeague} disabled={!joinCode.trim()} className="btn-ghost w-full">
              Join league
            </button>
            {joinMsg && <p className="text-sm text-slate-600">{joinMsg}</p>}
            <p className="text-xs text-slate-400">Try the sample code: KICK26</p>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="font-display text-lg font-bold text-ink">Your leagues</h2>
        {leagues.map((l) => (
          <LeagueCard key={l.id} league={l} />
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-600">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand"
      />
    </label>
  );
}
