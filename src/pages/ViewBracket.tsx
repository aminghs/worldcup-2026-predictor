import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { BracketPrediction } from '@/types';
import { decodeShareCode } from '@/lib/bracket';
import { getTeam } from '@/data/teams';
import { useGroupConstraints } from '@/store/useGroupConstraints';
import { FlagIcon } from '@/components/FlagIcon';
import { KnockoutBracket } from '@/components/KnockoutBracket';
import { ChampionCard } from '@/components/ChampionCard';
import { ShareModal } from '@/components/ShareModal';
import { EmptyState } from '@/components/EmptyState';

export default function ViewBracket() {
  const [params] = useSearchParams();
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const constraints = useGroupConstraints();

  // Brackets are shared as self-contained encoded links (?d=…); no storage.
  const bracket = useMemo<BracketPrediction | null>(() => {
    const encoded = params.get('d');
    return encoded ? decodeShareCode(encoded) : null;
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
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
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
        <h2 className="mb-3 font-display text-lg font-bold text-ink">Group results</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bracket.groupPredictions.map((gp) => {
            const gc = constraints[gp.groupId];
            const decided = gc?.decided ?? false;
            return (
              <div key={gp.groupId} className="card p-3">
                <h3 className="mb-2 flex items-center justify-between text-sm font-bold text-brand">
                  Group {gp.groupId}
                  {decided && (
                    <span className="chip bg-amber-400/20 text-[10px] font-semibold text-amber-700">
                      🔒 Result in
                    </span>
                  )}
                </h3>
                <ol className="space-y-1">
                  {gp.orderedTeamIds.map((id, i) => {
                    const team = getTeam(id);
                    const qualified = i < 2;
                    const wildcard = i === 2 && bracket.thirdPlaceQualifiers.includes(id);
                    const tc = gc?.teams[id];

                    // Compare this prediction against what results now allow.
                    let status: 'correct' | 'wrong' | 'impossible' | null = null;
                    if (decided && tc) {
                      status = tc.decidedRank === i ? 'correct' : 'wrong';
                    } else if (tc?.eliminatedTop2 && i < 2) {
                      status = 'impossible';
                    } else if (tc?.guaranteedTop2 && i >= 2) {
                      status = 'impossible';
                    }

                    return (
                      <li
                        key={id}
                        className={`flex items-center gap-2 rounded-md px-2 py-1 text-sm ${
                          qualified
                            ? 'text-ink font-semibold'
                            : wildcard
                              ? 'text-pos3 font-semibold'
                              : 'text-slate-400'
                        }`}
                      >
                        <span className="text-xs text-slate-400">{i + 1}</span>
                        <FlagIcon team={team} size={16} />
                        <span className={`truncate ${status === 'wrong' ? 'line-through' : ''}`}>
                          {team?.name}
                        </span>
                        <span className="ml-auto flex items-center gap-1">
                          {status === 'correct' && <span className="text-[11px] text-brand">✓</span>}
                          {status === 'wrong' && <span className="text-[11px] text-pos4">✗</span>}
                          {status === 'impossible' && (
                            <span className="chip bg-pos4/15 text-[9px] font-semibold text-pos4">
                              impossible
                            </span>
                          )}
                          {wildcard && <span className="text-[10px]">WC</span>}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold text-ink">Knockout bracket</h2>
        <KnockoutBracket
          matches={bracket.knockoutMatches}
          readOnly
          championId={bracket.championId}
          runnerUpId={bracket.runnerUpId}
        />
      </section>

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} bracket={bracket} />
    </div>
  );
}
