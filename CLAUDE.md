# Grimoire Sounds

A BOTC soundboard (Vite + React + TS on Cloudflare Workers static assets).

- How it works: `docs/wiki/`. Decisions: `docs/STATUS.md`. Next tasks: `TODO.md`.
- Add sounds by putting files in `public/sounds/` and entries in `src/sounds.ts`. Only add audio that is
  licensed for public use, and record its source and license.
- Run `npm run check` before committing. After every finished change, run the `ship` skill.
