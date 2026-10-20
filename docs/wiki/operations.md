# Operations

- `npm run dev`: local dev server (at `/grimoire-sounds/`).
- `npm run check`: oxlint + `tsc` + build. Run before every commit.
- Deploy: every push to `main` runs `.github/workflows/pages.yml`, which builds and publishes to
  https://shaydavidson.github.io/grimoire-sounds/. It can also be run by hand from the Actions tab.
- CI (`.github/workflows/ci.yml`): build and gitleaks on every push and PR to `main`.
