# Sounds

Every file in `public/sounds/`, where it came from and its licence. Only add audio that is licensed for
public use.

| File | Pad | Source | Licence | Notes |
| --- | --- | --- | --- | --- |
| `night-approaching.mp3` | Night approaching (loop) | ElevenLabs SFX v2: "Crickets chirping in a quiet grassy field at dusk, gentle breeze, calm and steady" | ElevenLabs paid plan (commercial use) | 20s seamless loop |
| `night-falls.mp3` | Night falls | ElevenLabs SFX v2: "Lone wolf howling at night, long eerie howl echoing across distant hills" | ElevenLabs paid plan | 6s |
| `demon-kill.mp3` | Killed by the Demon | ElevenLabs SFX v2: "Deep monstrous demon growl rising into a dark whoosh, ending in a low heavy thud" | ElevenLabs paid plan | 4s |
| `morning.mp3` | Morning | ElevenLabs SFX v2: "Rooster crowing loudly at dawn on a farm, one long cock-a-doodle-doo, birds chirping softly" | ElevenLabs paid plan | 4s |
| `execution.mp3` | Executed | ElevenLabs SFX v2: "Medieval execution snare drumroll building up, ending in one heavy wooden trapdoor thud" | ElevenLabs paid plan | 5s |
| `protected.mp3` | Protected | [Choir of Voices – Single Chord](https://freesound.org/people/bone666138/sounds/274121/) by bone666138 (Freesound) | CC0 | Trimmed to 3s, fade-out |
| `slayer.mp3` | Slayer shot | [Crossbow Shot](https://freesound.org/people/spookymodem/sounds/249810/) by spookymodem (Freesound) | CC0 | 2s |
| `nomination.mp3` | Nomination | [LowerCrunchyHammerGavel](https://freesound.org/people/TurtleLG/sounds/80448/) by TurtleLG (Freesound) | CC0 | Cut to two hits (2.95–3.95s), 1s |
| `vote-tick.mp3` | Voting → Tick | [clock-tick-01](https://freesound.org/people/pbimal/sounds/534094/) by pbimal (Freesound) | CC0 | 0.3s |
| `vote-end.mp3` | Voting → End vote | [bec low bell solo](https://freesound.org/people/HMTSCCSound/sounds/554655/) by HMTSCCSound (Freesound) | CC0 | Trimmed to 8s, fade-out |
| `dun-dun-dun.mp3` | Dun dun DUN | [Dramatic Dun Dun Dun](https://pixabay.com/sound-effects/musical-dramatic-dun-dun-dun-460379/) by MrDwarf92 (Pixabay) | Pixabay Content License (free, commercial, no credit) | 3s |

Freesound files are its HQ MP3 previews. Downloaded files are trimmed and loudness-normalized with ffmpeg
(`loudnorm=I=-16:TP=-1.5`).

ElevenLabs prompts live in the flow "Grimoire Sounds — BOTC SFX" in Shay's ElevenLabs workspace.

## Voting panel

The Storyteller taps **Tick** once per player as their hand moves around the circle; each tap plays a new
tick (overlapping is fine) and bumps the counter. **End vote** rings the bell and resets the counter.
