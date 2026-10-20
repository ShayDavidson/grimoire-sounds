# ADR 0001 — Static site on Cloudflare Workers

**Context.** A public soundboard used at the table on phones. No accounts or server state yet.

**Decision.** Build with Vite + React + TS and deploy `dist/` as Workers static assets
(`wrangler.jsonc`, SPA fallback). Deploys from Shay's machine with `npm run deploy` for now.

**Trade-offs.** No backend; anything shared (e.g. a remote control from another device) would need a Worker
route or Durable Object later, which this setup allows without migrating.

**Cost.** Free tier: static asset requests are free and unlimited.

**Exit criteria.** Revisit if we need server state, auth, or audio files beyond the 25 MiB per-file asset limit.

**Reversal.** `dist/` is a plain static site; it can move to any static host.
