interface MobileActionBarProps {
  onBack?: () => void;
  onContinue?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  backDisabled?: boolean;
  continueDisabled?: boolean;
  continueLabel?: string;
}

/** Sticky bottom action bar — only shown on small screens. */
export function MobileActionBar({
  onBack,
  onContinue,
  onSave,
  onShare,
  backDisabled,
  continueDisabled,
  continueLabel = 'Continue',
}: MobileActionBarProps) {
  return (
    <div className="sticky bottom-0 z-30 border-t border-white/10 bg-pitch-950/90 px-3 py-2.5 backdrop-blur-md md:hidden">
      <div className="flex items-center gap-2" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <button onClick={onBack} disabled={backDisabled} className="btn-ghost flex-1">
          ← Back
        </button>
        {onSave && (
          <button onClick={onSave} className="btn-ghost flex-1">
            Save
          </button>
        )}
        {onShare && (
          <button onClick={onShare} className="btn-ghost flex-1">
            Share
          </button>
        )}
        {onContinue && (
          <button onClick={onContinue} disabled={continueDisabled} className="btn-primary flex-1">
            {continueLabel}
          </button>
        )}
      </div>
    </div>
  );
}
