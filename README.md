# Grimoire Sounds

A public web soundboard for running **Blood on the Clocktower** game nights: tap a pad to play a sound
effect or start an ambience loop.

**Status:** skeleton live on Cloudflare Workers with two synthesized test sounds. The real sounds and
modes come next (see [TODO.md](TODO.md)).

## Sources of truth

| What | Where |
| --- | --- |
| How it works now | the code + [docs/wiki/](docs/wiki/README.md) |
| Decisions | [docs/STATUS.md](docs/STATUS.md) |
| Why | [docs/adr/](docs/adr/) |
| What's next | [TODO.md](TODO.md) |

## Principles

- Works on a phone at the table: big pads, no sign-in, loads fast.
- Sounds must be licensed for public use (own recordings, CC0, or properly attributed).
- Static site only until a feature needs a backend.

## Layout

```
src/sounds.ts   sound catalog (add entries here)
src/audio.ts    Web Audio engine: play, stop, loops, master volume
src/App.tsx     soundboard UI
public/sounds/  audio files
wrangler.jsonc  Cloudflare Worker (static assets) config
```

## Local setup

```bash
npm install
npm run dev        # Vite dev server
npm run check      # lint + typecheck + build
npm run deploy     # build and deploy to Cloudflare (needs `wrangler login`)
```
