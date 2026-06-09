import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GROUP_IDS } from '@/data/teams';
import {
  allGroupsRanked,
  isKnockoutComplete,
} from '@/lib/bracket';
import { useBracket } from '@/store/BracketContext';
import { BRACKET_STEPS, Stepper } from '@/components/Stepper';
import { GroupCard } from '@/components/GroupCard';
import { ThirdPlaceSelector } from '@/components/ThirdPlaceSelector';
import { KnockoutBracket } from '@/components/KnockoutBracket';
import { ChampionCard } from '@/components/ChampionCard';
import { ShareModal } from '@/components/ShareModal';
import { ResetDialog } from '@/components/ResetDialog';
import { MobileActionBar } from '@/components/MobileActionBar';
import { getRoundMatches } from '@/lib/bracket';

export default function CreateBracket() {
  const {
    bracket,
    pickWinner,
    smartPredict,
    randomize,
    reset,
    commit,
    setNickname,
  } = useBracket();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [shareOpen, setShareOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  // --- Per-step completion gates ------------------------------------------
  const groupsDone = allGroupsRanked(bracket.groupPredictions);
  const thirdsDone = bracket.thirdPlaceQualifiers.length === 8;
  const knockoutDone = isKnockoutComplete(bracket.knockoutMatches);
  const r32Filled = getRoundMatches(bracket.knockoutMatches, 'R32').every(
    (m) => m.teamA && m.teamB
  );

  const canContinue = useMemo(() => {
    switch (step) {
      case 1: return groupsDone;
      case 2: return thirdsDone;
      case 3: return r32Filled;
      case 4: return knockoutDone;
      default: return false;
    }
  }, [step, groupsDone, thirdsDone, r32Filled, knockoutDone]);

  // Furthest step the user is allowed to jump to via the stepper.
  const maxReached = groupsDone ? (thirdsDone ? 5 : 2) : 1;

  const goNext = () => setStep((s) => Math.min(5, s + 1));
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const handleSaveAndFinish = () => {
    commit();
    setStep(5);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Build your bracket</h1>
        <p className="mt-1 text-sm text-slate-400">
          Your progress saves automatically — come back any time.
        </p>
      </div>

      {/* Top toolbar */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button onClick={smartPredict} className="btn-outline">
          ✨ Smart Predict
        </button>
        <button onClick={randomize} className="btn-ghost">
          🎲 Randomize
        </button>
        <button onClick={() => setResetOpen(true)} className="btn-ghost">
          ↺ Reset
        </button>
        <div className="ml-auto hidden gap-2 md:flex">
          <button onClick={() => setShareOpen(true)} className="btn-ghost">
            Share
          </button>
          {step === 5 && (
            <button onClick={() => navigate(`/view?code=${bracket.shareCode}`)} className="btn-primary">
              View saved bracket
            </button>
          )}
        </div>
      </div>

      <div className="mb-6">
        <Stepper current={step} onStepClick={setStep} maxReached={maxReached} />
      </div>

      {/* ---- Step content ---- */}
      {step === 1 && (
        <StepShell
          title="1 · Rank the groups"
          subtitle="Order each group 1st → 4th. Top 2 qualify (green), 3rd is a wildcard candidate (gold), 4th is eliminated."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {GROUP_IDS.map((id) => (
              <GroupCard key={id} groupId={id} />
            ))}
          </div>
        </StepShell>
      )}

      {step === 2 && (
        <StepShell
          title="2 · Best third-placed teams"
          subtitle="Eight of the twelve third-placed teams advance. Choose exactly eight."
        >
          <ThirdPlaceSelector />
        </StepShell>
      )}

      {step === 3 && (
        <StepShell
          title="3 · Round of 32"
          subtitle="Here's the bracket your group picks generated. Tap a team to send it through — or jump ahead to fill out every round."
        >
          <KnockoutBracket
            matches={bracket.knockoutMatches}
            onPick={pickWinner}
          />
        </StepShell>
      )}

      {step === 4 && (
        <StepShell
          title="4 · Knockout rounds"
          subtitle="Advance a team in each match. Winners auto-fill the next round; changing a result clears anything downstream."
        >
          <KnockoutBracket matches={bracket.knockoutMatches} onPick={pickWinner} />
        </StepShell>
      )}

      {step === 5 && (
        <StepShell
          title="5 · Your champion"
          subtitle="Add a nickname, then save and share your completed bracket."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <ChampionCard championId={bracket.championId} runnerUpId={bracket.runnerUpId} />
            <div className="card p-6">
              <label className="text-sm font-semibold">Your nickname</label>
              <input
                value={bracket.nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. MidfieldMaestro"
                className="mt-2 w-full rounded-xl border border-white/10 bg-pitch-950 px-3 py-2.5 text-sm outline-none focus:border-accent"
              />
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={handleSaveAndFinish}
                  disabled={!knockoutDone}
                  className="btn-primary"
                >
                  Save bracket
                </button>
                <button onClick={() => setShareOpen(true)} className="btn-ghost">
                  Share
                </button>
              </div>
              {!knockoutDone && (
                <p className="mt-3 text-xs text-gold">
                  Finish every knockout match (including the third-place playoff) to save.
                </p>
              )}
            </div>
          </div>
        </StepShell>
      )}

      {/* Desktop step nav */}
      <div className="mt-8 hidden items-center justify-between md:flex">
        <button onClick={goBack} disabled={step === 1} className="btn-ghost">
          ← Back
        </button>
        {!canContinue && step < 5 && (
          <span className="text-xs text-gold">{gateMessage(step)}</span>
        )}
        {step < 5 && (
          <button onClick={goNext} disabled={!canContinue} className="btn-primary">
            {BRACKET_STEPS[step]?.label ?? 'Continue'} →
          </button>
        )}
      </div>

      {/* Mobile sticky bar */}
      <MobileActionBar
        onBack={goBack}
        backDisabled={step === 1}
        onContinue={step < 5 ? goNext : undefined}
        continueDisabled={!canContinue}
        onSave={step === 5 ? handleSaveAndFinish : undefined}
        onShare={() => setShareOpen(true)}
        continueLabel="Next"
      />

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} bracket={bracket} />
      <ResetDialog open={resetOpen} onClose={() => setResetOpen(false)} onConfirm={() => { reset(); setStep(1); }} />
    </div>
  );
}

function gateMessage(step: number): string {
  switch (step) {
    case 1: return 'Rank all 12 groups to continue';
    case 2: return 'Select exactly 8 third-placed teams';
    case 3: return 'Round of 32 not ready';
    case 4: return 'Decide every knockout match';
    default: return '';
  }
}

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-pop-in">
      <div className="mb-4">
        <h2 className="font-display text-xl font-bold">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
