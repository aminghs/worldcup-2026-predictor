import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GROUP_IDS } from '@/data/teams';
import { isKnockoutComplete } from '@/lib/bracket';
import { useBracket } from '@/store/BracketContext';
import { StatsBar } from '@/components/StatsBar';
import { PointsExplainer } from '@/components/PointsExplainer';
import { StageTabs, type Stage } from '@/components/StageTabs';
import { GroupCard } from '@/components/GroupCard';
import { GroupLegend } from '@/components/GroupLegend';
import { ThirdPlaceSelector } from '@/components/ThirdPlaceSelector';
import { KnockoutBracket } from '@/components/KnockoutBracket';
import { ShareModal } from '@/components/ShareModal';
import { ResetDialog } from '@/components/ResetDialog';
import { MobileActionBar } from '@/components/MobileActionBar';

export default function CreateBracket() {
  const {
    bracket,
    pickWinner,
    shuffleGroups,
    shuffleKnockout,
    smartPredict,
    reset,
    commit,
  } = useBracket();
  const navigate = useNavigate();

  const [stage, setStage] = useState<Stage>('group');
  const [shareOpen, setShareOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  const groupsDone = bracket.completedGroups.length;
  const groupComplete = groupsDone === GROUP_IDS.length;
  const thirdsDone = bracket.thirdPlaceQualifiers.length === 8;
  const knockoutDone = isKnockoutComplete(bracket.knockoutMatches);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Top toolbar */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <h1 className="mr-auto font-display text-xl font-bold sm:text-2xl">Build your bracket</h1>
        <button onClick={smartPredict} className="btn-outline">✨ Smart Predict</button>
        <button onClick={() => setShareOpen(true)} className="btn-ghost">Share</button>
        <button onClick={() => setResetOpen(true)} className="btn-ghost">↺ Reset</button>
        {knockoutDone && (
          <button onClick={() => { commit(); navigate(`/view?code=${bracket.shareCode}`); }} className="btn-primary">
            Save & view
          </button>
        )}
      </div>

      <StatsBar />

      <div className="my-5">
        <PointsExplainer />
      </div>

      <div className="mb-6">
        <StageTabs
          stage={stage}
          onChange={setStage}
          groupComplete={groupComplete}
          knockoutEnabled={groupComplete}
        />
      </div>

      {/* ---- GROUP STAGE ---- */}
      {stage === 'group' && (
        <div className="animate-pop-in">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold">Group Stage</h2>
            <p className="mt-1 text-sm text-slate-500">Rank all 4 teams in each group (1st through 4th)</p>
            <p className="text-sm text-brand">Top 2 from each group + 8 best 3rd place teams advance</p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="rounded-full bg-sand px-4 py-1.5 text-sm">
                Progress: <strong className="text-brand">{groupsDone}/12 groups</strong>
              </span>
              <button onClick={shuffleGroups} className="btn-outline border-violet-400/50 text-violet-600 hover:bg-violet-50">
                ⤭ Shuffle
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GROUP_IDS.map((id) => (
              <GroupCard key={id} groupId={id} />
            ))}
          </div>

          <div className="mt-6">
            <GroupLegend />
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setStage('knockout')}
              disabled={!groupComplete}
              className="btn-primary px-8 py-3 text-base"
            >
              Continue to Knockout Stage →
            </button>
            {!groupComplete && (
              <p className="mt-2 text-xs text-pos3">Rank all 12 groups to continue.</p>
            )}
          </div>
        </div>
      )}

      {/* ---- KNOCKOUT STAGE ---- */}
      {stage === 'knockout' && (
        <div className="animate-pop-in space-y-6">
          <ThirdPlaceSelector />

          <div className="text-center">
            <button
              onClick={shuffleKnockout}
              disabled={!thirdsDone}
              className="btn-outline border-violet-400/50 text-violet-600 hover:bg-violet-50"
            >
              ⤭ Shuffle Knockout Stage
            </button>
          </div>

          {thirdsDone ? (
            <KnockoutBracket
              matches={bracket.knockoutMatches}
              onPick={pickWinner}
              championId={bracket.championId}
              runnerUpId={bracket.runnerUpId}
            />
          ) : (
            <p className="rounded-2xl border border-dashed border-line bg-white/50 py-10 text-center text-sm text-slate-400">
              Select your 8 best third-placed teams above to generate the Round of 32.
            </p>
          )}
        </div>
      )}

      <MobileActionBar
        onBack={stage === 'knockout' ? () => setStage('group') : undefined}
        backDisabled={stage === 'group'}
        onContinue={stage === 'group' ? () => setStage('knockout') : undefined}
        continueDisabled={!groupComplete}
        onSave={knockoutDone ? () => { commit(); navigate(`/view?code=${bracket.shareCode}`); } : undefined}
        onShare={() => setShareOpen(true)}
        continueLabel="Knockouts"
      />

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} bracket={bracket} />
      <ResetDialog open={resetOpen} onClose={() => setResetOpen(false)} onConfirm={() => { reset(); setStage('group'); }} />
    </div>
  );
}
