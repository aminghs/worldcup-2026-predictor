# BracketKick — World Cup 2026 Bracket Predictor

An interactive, mobile-first web app for building a full FIFA World Cup 2026 bracket
prediction: rank all 12 groups, choose the 8 best third-placed teams, advance teams
through the knockout rounds, crown a champion, then save and share.

> Unofficial fan project. Original UI/branding — not affiliated with FIFA.

## Tech stack

- **React 18 + TypeScript + Vite**
- **Tailwind CSS** (custom "pitch" dark theme)
- **react-router-dom** for routing
- In-memory state (no backend, no persistence — refresh starts a fresh bracket)

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # typecheck + production build
npm run preview  # preview the production build
```

## Project structure

```
src/
├─ components/        Reusable UI (GroupCard, MatchCard, KnockoutBracket, …)
│  └─ layout/         AppLayout, Header, Footer
├─ data/
│  ├─ teams.ts        48 teams across 12 groups
│  ├─ groupMatches.ts 72 group-stage fixtures (dates, venues, kickoff times)
│  └─ mock.ts         Mock leaderboard / fan predictions / leagues
├─ lib/
│  └─ bracket.ts      Tournament logic: bracket generation, winner propagation,
│                     smart-predict / randomize, share-code encode/decode
├─ pages/             Home, CreateBracket, ViewBracket, Predictions,
│                     Leaderboard, Leagues, FormatGuide, StaticPage
├─ store/
│  └─ BracketContext  Central bracket state + actions
├─ types.ts           Domain types (Team, Group, KnockoutMatch, BracketPrediction…)
└─ App.tsx            Router
```

## How the tournament logic works

- **Groups (`step 1`)** — each group is ordered 1st→4th. Top 2 qualify, 3rd is a
  wildcard candidate, 4th is eliminated.
- **Best thirds (`step 2`)** — exactly 8 of the 12 third-placed teams advance.
- **Knockouts (`steps 3–4`)** — `generateKnockout()` builds a single-elimination tree
  (R32 → R16 → QF → SF → Final) plus a third-place playoff fed by the semi-final losers.
  `pickWinner()` propagates a winner forward and **clears any now-invalid downstream
  results** so the bracket can never hold an impossible team.
- **Share codes** — a prediction is encoded into a URL-safe base64 blob, so a shared link
  is fully self-contained (`/view?d=<code>`).

## Swapping in the official draw

The groups in `src/data/teams.ts` are **placeholders**. When the official 2026 draw is
known, edit each team's `group` field (and the team list). The R32 seeding template lives
in `src/lib/bracket.ts` (`R32_SEED_ORDER`) and can be replaced with the official
third-place allocation table without touching any components.

## Adding a real backend later

The working bracket lives only in memory (`src/store/BracketContext.tsx`) and is shared
via self-contained encoded links (`/view?d=…`). The social pages read from
`src/data/mock.ts`. To persist brackets or power a real leaderboard, save the
`BracketPrediction` from the store to an API/Supabase and swap the mock data — the
components and tournament logic stay unchanged.
