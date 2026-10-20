# Sounds

Every file in `public/sounds/`, where it came from and its licence. Only add audio that is licensed for
public use.

| File | Pad | Source | Licence | Notes |
| --- | --- | --- | --- | --- |
| `night-approaching.mp3` | Night approaching (loop) | [Crickets chirping at Night 003](https://freesound.org/people/Borgory/sounds/751470/) by Borgory (Freesound) | CC0 | 60s cut (from 10s), made seamless with a 2s crossfade |
| `night-falls.mp3` | Night falls | [wolfs.wav](https://freesound.org/people/ondrosik/sounds/143568/) by ondrosik (Freesound), real wolf pack | CC0 | First 7s, fade-out. Replaced the ElevenLabs howl, which sounded like an air-raid siren |
| `demon-kill.mp3` | Killed by the Demon | ElevenLabs SFX v2: "Deep monstrous demon growl rising into a dark whoosh, ending in a low heavy thud" | ElevenLabs paid plan | 4s |
| `morning.mp3` | Morning | ElevenLabs SFX v2: "Rooster crowing loudly at dawn on a farm, one long cock-a-doodle-doo, birds chirping softly" | ElevenLabs paid plan | 4s |
| `announcement.mp3` | Announcement | ElevenLabs SFX v2: "Medieval execution snare drumroll building up, ending in one heavy wooden trapdoor thud" | ElevenLabs paid plan | 5s. Was "Executed" |
| `protected.mp3` | Protected | [Choir of Voices – Single Chord](https://freesound.org/people/bone666138/sounds/274121/) by bone666138 (Freesound) | CC0 | Trimmed to 3s, fade-out |
| `slayer.mp3` | Slayer shot | [Crossbow Shot](https://freesound.org/people/spookymodem/sounds/249810/) by spookymodem + [arrow into wood](https://freesound.org/people/JoeDinesSound/sounds/534956/) by JoeDinesSound (Freesound) + synthesized 55 Hz thump | CC0 | Layered, bass-boosted and compressed for punch, 1.4s |
| `nomination.mp3` | Nomination | [Fanfare](https://freesound.org/people/Arcorias/sounds/770801/) by Arcorias (Freesound) | CC0 | 3.3s, compressed and louder (-12 LUFS). Replaced the gavel |
| `vote-tick.mp3` | Voting → Tick (odd taps) | [clock-tick-01](https://freesound.org/people/pbimal/sounds/534094/) by pbimal (Freesound) | CC0 | 0.3s |
| `vote-tock.mp3` | Voting → Tock (even taps) | Same tick, pitched down to 72% | CC0 | 0.46s |
| `vote-end.mp3` | Voting → End vote | [bec low bell solo](https://freesound.org/people/HMTSCCSound/sounds/554655/) by HMTSCCSound (Freesound) | CC0 | Trimmed to 8s, fade-out |
| `dun-dun-dun.mp3` | Dun dun DUN | [Dramatic Dun Dun Dun](https://pixabay.com/sound-effects/musical-dramatic-dun-dun-dun-460379/) by MrDwarf92 (Pixabay) | Pixabay Content License (free, commercial, no credit) | 3s |

Freesound files are its HQ MP3 previews. Downloaded files are trimmed and loudness-normalized with ffmpeg
(`loudnorm=I=-16:TP=-1.5`; the slayer shot and nomination are louder at -12 LUFS).

ElevenLabs prompts live in the flow "Grimoire Sounds — BOTC SFX" in Shay's ElevenLabs workspace.

## Voting panel

The Storyteller taps **Tick** once per player as their hand moves around the circle; each tap plays a new
sound, alternating tick and tock (overlapping is fine), and bumps the counter. **End vote** rings the bell and resets the counter.
