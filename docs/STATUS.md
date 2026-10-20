# Status and decisions

Decisions here override the original brief.

| Date | Decision |
| --- | --- |
| 2026-10-20 | Name: **grimoire-sounds**. Public GitHub repo. |
| 2026-10-20 | Stack: Vite + React + TypeScript, served as static assets from a Cloudflare Worker ([ADR 0001](adr/0001-static-site-on-workers.md)). |
| 2026-10-20 | Audio via one Web Audio graph (per-sound gain → master gain) rather than `<audio>` tags, for overlap, loops and fades. |
| 2026-10-20 | Hosting moved from Cloudflare Workers to **GitHub Pages**; the Worker was deleted ([ADR 0002](adr/0002-github-pages.md)). |
