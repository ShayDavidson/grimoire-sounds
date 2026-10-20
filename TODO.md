# TODO

Legend: `[ ]` todo · `[/]` in progress · `[x]` done. Shay owns `U-` tasks (decisions, accounts), Claude owns `C-` tasks.
**Unblocked now:** Shay → U-03. Claude → C-06.

## Shay · P0 (now)

- [x] U-01 List the sounds and modes you want
- [x] U-02 Decide where sounds come from (ElevenLabs + Freesound CC0 + Pixabay)

## Shay · P1 (next)

- [ ] U-03 Try every pad on your phone before game night; list any sound to swap

## Claude · Phase 0 — Setup

- [x] C-01 Scaffold Vite + React + TS app with Web Audio engine and placeholder pads
- [x] C-02 Deploy to GitHub Pages on every push to main (moved off Cloudflare)
- [x] C-03 Public GitHub repo with CI (build + gitleaks)

## Claude · Phase 1 — Sounds and modes

- [x] C-04 Add the chosen sound files and catalog entries
  - needs: U-01, U-02
- [x] C-05 Night / Day / Voting groups with icons and a voting tick counter
  - needs: U-01
- [ ] C-06 Preload sounds and make the site work offline (PWA) for game nights with bad Wi-Fi
  - needs: C-04
