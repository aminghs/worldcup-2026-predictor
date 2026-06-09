import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { BracketPrediction } from '@/types';
import { decodeShareCode } from '@/lib/bracket';
import { loadBracketByShareCode, loadCurrent } from '@/lib/storage';
import { getTeam } from '@/data/teams';
import { KnockoutBracket } from '@/components/KnockoutBracket';
import { ChampionCard } from '@/components/ChampionCard';
import { ShareModal } from '@/components/ShareModal';
import { EmptyState } from '@/components/EmptyState';

export default function ViewBracket() {
  const [params] = useSearchParams();
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Resolve the bracket from (1) encoded URL data, (2) a saved share code,
  // or (3) fall back to the in-progress bracket.
  const bracket = useMemo<BracketPrediction | null>(() => {
    const encoded = params.get('d');
    if (encoded) return decodeShareCode(encoded);
    const code = params.get('code');
    if (code) return loadBracketByShareCode(code);
    return loadCurrent();
  }, [params]);

  if (!bracket) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon="🔍"
          title="Bracket not found"
          description="This share link is invalid or the bracket isn’t saved on this device."
          action={
            <Link to="/create" className="btn-primary">
              Build your own
            </Link>
          }
        />
      </div>
    );
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            {bracket.nickname || 'Anonymous'}’s bracket
          </h1>
          <p className="text-sm text-slate-400">
            Created {new Date(bracket.createdAt).toLocaleDateString()} · read-only
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={copyLink} className="btn-ghost">
            {copied ? 'Copied ✓' : 'Copy link'}
          </button>
          <button onClick={() => setShareOpen(true)} className="btn-primary">
            Share
          </button>
        </div>
      </div>

      <div className="mb-8">
        <ChampionCard championId={bracket.championId} runnerUpId={bracket.runnerUpId} />
      </div>

      <section className="mb-8">
        <h2 className="mb-3 font-display text-lg font-bold">Group results</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bracket.groupPredictions.map((gp) => (
            <div key={gp.groupId} className="card p-3">
              <h3 className="mb-2 text-sm font-bold">Group {gp.groupId}</h3>
              <ol className="space-y-1">
                {gp.orderedTeamIds.map((id, i) => {
                  const team = getTeam(id);
                  const qualified = i < 2;
                  const wildcard = i === 2 && bracket.thirdPlaceQualifiers.includes(id);
                  return (
                    <li
                      key={id}
                      className={`flex items-center gap-2 rounded-md px-2 py-1 text-sm ${
                        qualified
                          ? 'text-accent'
                          : wildcard
                            ? 'text-gold'
                            : 'text-slate-500'
                      }`}
                    >
                      <span className="text-xs text-slate-600">{i + 1}</span>
                      <span>{team?.flagEmoji}</span>
                      <span className="truncate">{team?.name}</span>
                      {wildcard && <span className="ml-auto text-[10px]">WC</span>}
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold">Knockout bracket</h2>
        <KnockoutBracket matches={bracket.knockoutMatches} readOnly />
      </section>

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} bracket={bracket} />
    </div>
  );
}
