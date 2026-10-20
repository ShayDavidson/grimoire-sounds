# TODO

Legend: `[ ]` todo · `[/]` in progress · `[x]` done. Shay owns `U-` tasks (decisions, accounts), Claude owns `C-` tasks.
**Unblocked now:** Shay → U-01, U-02. Claude → waiting on U-01.

## Shay · P0 (now)

- [ ] U-01 List the sounds and modes you want (e.g. night/day phases, deaths, nominations, execution)
- [ ] U-02 Decide where sounds come from (Freesound CC0, a paid pack, your own recordings)

## Claude · Phase 0 — Setup

- [x] C-01 Scaffold Vite + React + TS app with Web Audio engine and placeholder pads
- [x] C-02 Deploy to Cloudflare Workers (static assets)
- [x] C-03 Public GitHub repo with CI (build + gitleaks)

## Claude · Phase 1 — Sounds and modes

- [ ] C-04 Add the chosen sound files and catalog entries
  - needs: U-01, U-02
- [ ] C-05 Build modes / layouts from Shay's spec
  - needs: U-01
- [ ] C-06 Preload sounds and make the site work offline (PWA) for game nights with bad Wi-Fi
  - needs: C-04
