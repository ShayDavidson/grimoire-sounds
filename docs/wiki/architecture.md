# Architecture

- **`src/sounds.ts`** is the catalog. Each sound is a `oneshot` or a `loop`, with a `src` file under
  `public/sounds/` or (for now) a placeholder `synth`.
- **`src/audio.ts`** owns a single `AudioContext`, created on the first tap (browsers block audio before a
  user gesture). Graph: source → per-sound gain → master gain → limiter (DynamicsCompressor, -3 dB threshold, 20:1) → speakers. The volume slider goes to 300% (default 150%) so sounds cut through background music; the limiter keeps the boost from clipping. Files are fetched and decoded once
  and cached. Starting a sound that's already playing restarts it; stopping fades out over ~0.3s.
  Components subscribe to play/stop changes to highlight active pads.
- **`src/App.tsx`** renders the pad groups, voting panel, master volume and "Stop all". Each sound has an accent `color` (set as the `--pad` CSS variable) for its icon, tint, top border and playing glow.
- **Hosting:** GitHub Pages at `/grimoire-sounds/` (Vite `base`). Sound `src` paths are relative and get `import.meta.env.BASE_URL` prepended.
- **Layout:** the board always fits one screen with no scrolling. `.app` is `100dvh` tall; Night, Day and Voting share the leftover height in proportion to their rows of pads (3 columns on phones, 5 from 700px wide).
