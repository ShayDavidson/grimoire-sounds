# Operations

- `npm run dev`: local dev server.
- `npm run check`: oxlint + `tsc` + build. Run before every commit.
- `npm run deploy`: builds and runs `wrangler deploy` to the Worker `grimoire-sounds` on Shay's Cloudflare
  account. Needs `npx wrangler login` once on the machine.
- CI (`.github/workflows/ci.yml`): build and gitleaks on every push and PR to `main`. CI does not deploy yet.
