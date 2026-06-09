import { useMemo, useState } from 'react';
import type { BracketPrediction } from '@/types';
import { encodeShareCode } from '@/lib/bracket';
import { getTeam } from '@/data/teams';
import { Modal } from './Modal';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  bracket: BracketPrediction;
}

export function ShareModal({ open, onClose, bracket }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  // Encode the full prediction into the URL so a link is self-contained.
  const shareUrl = useMemo(() => {
    const code = encodeShareCode(bracket);
    return `${window.location.origin}/view?d=${code}`;
  }, [bracket]);

  const champion = getTeam(bracket.championId);
  const text = champion
    ? `My World Cup 2026 winner is ${champion.flagEmoji} ${champion.name}! Build your bracket on BracketKick.`
    : `Check out my World Cup 2026 bracket on BracketKick!`;

  const copy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socials = [
    { label: '𝕏 / Twitter', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}` },
    { label: 'Reddit', href: `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(text)}` },
  ];

  return (
    <Modal open={open} onClose={onClose} title="Share your bracket">
      <p className="mb-3 text-sm text-slate-300">
        Your prediction is encoded right into this link — anyone who opens it sees your
        exact bracket. Share code: <span className="font-mono text-accent">{bracket.shareCode}</span>
      </p>

      <div className="mb-4 flex gap-2">
        <input
          readOnly
          value={shareUrl}
          className="flex-1 truncate rounded-xl border border-white/10 bg-pitch-950 px-3 py-2.5 text-xs text-slate-300"
          onFocus={(e) => e.currentTarget.select()}
        />
        <button onClick={copy} className="btn-primary whitespace-nowrap">
          {copied ? 'Copied ✓' : 'Copy link'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost justify-center"
          >
            {s.label}
          </a>
        ))}
      </div>
    </Modal>
  );
}
