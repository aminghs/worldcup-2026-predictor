import { Link } from 'react-router-dom';

type StaticKey = 'about' | 'contact' | 'privacy';

const CONTENT: Record<StaticKey, { title: string; body: React.ReactNode }> = {
  about: {
    title: 'About BracketKick',
    body: (
      <>
        <p>
          BracketKick is a free, fan-made bracket predictor for the 2026 FIFA World Cup.
          Rank the groups, pick the wildcards, fight through the knockouts and see if your
          champion lifts the trophy.
        </p>
        <p>
          It's built as a lightweight single-page app — no accounts, no tracking, your
          bracket lives entirely in the browser and resets on refresh. Share your prediction
          with a self-contained link.
        </p>
        <p className="text-slate-400">
          BracketKick is not affiliated with, endorsed by, or sponsored by FIFA. All team
          names and flags belong to their respective associations.
        </p>
      </>
    ),
  },
  contact: {
    title: 'Contact',
    body: (
      <>
        <p>Found a bug, a wrong group, or have a feature idea?</p>
        <p>
          Open an issue or start a discussion on GitHub:{' '}
          <a
            href="https://github.com/aminghs/worldcup-2026-predictor"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline font-medium"
          >
            github.com/aminghs/worldcup-2026-predictor
          </a>
        </p>
      </>
    ),
  },
  privacy: {
    title: 'Privacy',
    body: (
      <>
        <p>
          BracketKick stores your in-progress and saved brackets in your browser's
          localStorage. Nothing is sent to a server and we don't use analytics or
          third-party trackers in this MVP.
        </p>
        <p>
          Shared links encode your prediction directly in the URL — anyone with the link
          can view that bracket, so only share it where you're comfortable.
        </p>
        <p className="text-slate-400">
          Clearing your browser data will remove your saved brackets.
        </p>
      </>
    ),
  },
};

export default function StaticPage({ page }: { page: StaticKey }) {
  const { title, body } = CONTENT[page];
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-ink">{title}</h1>
      <div className="mt-5 space-y-4 text-slate-600">{body}</div>
      <Link to="/" className="btn-ghost mt-8">
        ← Back home
      </Link>
    </div>
  );
}
