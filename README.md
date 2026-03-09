# DiceMine – Bitcoin Mining Workshop

A simple website to simulate **Bitcoin mining** during a workshop using the **dice analogy** from the [Bitcoin Mining Handbook](https://braiins.com/books/bitcoin-mining-handbook): participants enter their username, click to “roll the dice,” and can find **shares** or a **block**. A shared **dashboard** shows who found the most shares and who found the block.

## Idea (from the Handbook)

- Mining is like rolling a many-sided die.
- **Share**: roll below the *share target* (e.g. &lt; 100 on a 1000-sided die) → valid share.
- **Block**: roll below the *block target* (e.g. &lt; 4) → valid block (and also counts as a share).
- The operator can configure both targets.

## Features

- **Miner page**: Enter username, click “Mine!” to roll; see if you got nothing, a share, or a block.
- **Dashboard**: Leaderboard (most shares), list of block finders, recent shares. Auto-refreshes every 3 seconds.
- **Settings**: Configure dice sides, share target, and block target. Option to reset the workshop (clear all events).
- **English & Italian**: Language switcher in the header.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use **Dashboard** to show the shared view (e.g. on a projector) and **Settings** to adjust targets before the workshop.

## Tech

- **Next.js 15** (App Router), **React 19**, **TypeScript**, **Tailwind CSS**.
- In-memory store (no database); state resets on server restart. Suitable for a single-session workshop.

## Configuration (Settings page)

- **Dice sides**: e.g. 1000 → each roll is 0..999.
- **Share target**: roll &lt; this value → **share** (e.g. 100 → 10% chance per roll).
- **Block target**: roll &lt; this value → **block** (e.g. 4 → 0.4% chance). Must be ≤ share target; a block also counts as a share.

You can make shares more frequent (e.g. share target 200) or blocks rarer (e.g. block target 1) to match the length and size of your workshop.

## Hosting and protecting Settings

When you host the app (e.g. on a VPS, Vercel, or Raspberry Pi), you can **lock the Settings page** so only you can change dice targets or reset the workshop.

1. Set the environment variable **`SETTINGS_PASSWORD`** to a password of your choice.
2. (Recommended in production) Set **`SETTINGS_SESSION_SECRET`** to a random string (e.g. `openssl rand -hex 32`) so session cookies are signed securely.

Copy `.env.example` to `.env.local`

```bash
SETTINGS_PASSWORD=my-workshop-password
SETTINGS_SESSION_SECRET=your-random-secret-here
```

- **Miner** and **Dashboard** stay public: anyone can roll and view the leaderboard.
- **Settings** then shows a password screen; after entering the correct password, you can change config and reset the workshop. The session lasts 24 hours.

If `SETTINGS_PASSWORD` is not set, the Settings page remains open to everyone (useful for local use).
