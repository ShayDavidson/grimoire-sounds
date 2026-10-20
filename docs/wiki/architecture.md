# Architecture

- **`src/sounds.ts`** is the catalog. Each sound is a `oneshot` or a `loop`, with a `src` file under
  `public/sounds/` or (for now) a placeholder `synth`.
- **`src/audio.ts`** owns a single `AudioContext`, created on the first tap (browsers block audio before a
  user gesture). Graph: source → per-sound gain → master gain → speakers. Files are fetched and decoded once
  and cached. Starting a sound that's already playing restarts it; stopping fades out over ~0.3s.
  Components subscribe to play/stop changes to highlight active pads.
- **`src/App.tsx`** renders the pad grid, master volume and "Stop all".
- **Hosting:** Cloudflare Worker with static assets only (no Worker script), SPA fallback.
