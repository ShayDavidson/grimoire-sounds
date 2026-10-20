# ADR 0002 — Host on GitHub Pages

**Context.** The site is fully static and the repo is public. Cloudflare deploys ran from Shay's machine
using a local `wrangler` login, which is one more account and credential to think about.

**Decision.** Deploy `dist/` to GitHub Pages from the `Deploy to GitHub Pages` workflow on every push to
`main`. Vite `base` is `/grimoire-sounds/`; audio paths are relative and prefixed with `import.meta.env.BASE_URL`.
The Cloudflare Worker was deleted.

**Trade-offs.** No server-side code; GitHub Pages has a 1 GB site limit and soft bandwidth limits, fine for a
soundboard. No SPA fallback, so the app stays a single page (or uses hash routes).

**Cost.** Free for public repos.

**Exit criteria.** Revisit if we need server state or a custom domain with edge features.

**Reversal.** The build is a plain static site; it can go back to Cloudflare or any static host.
