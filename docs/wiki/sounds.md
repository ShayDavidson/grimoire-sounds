# Sounds

Every file in `public/sounds/`, where it came from and its licence. Only add audio that is licensed for
public use.

| File | Pad | Source | Licence | Notes |
| --- | --- | --- | --- | --- |
| `night-approaching.mp3` | Night approaching (loop) | [Crickets chirping at Night 003](https://freesound.org/people/Borgory/sounds/751470/) by Borgory (Freesound) | CC0 | 60s cut (from 10s), made seamless with a 2s crossfade |
| `night-falls.mp3` | Night falls | [Howl_Echo.wav](https://freesound.org/people/taure/sounds/380156/) by taure (Freesound), single wolf | CC0 | Two howls (2.2–13.2s), 11s with fades. Earlier tries: ElevenLabs howl (sounded like an air-raid siren), then a wolf pack (Shay preferred one wolf) |
| `demon-kill.mp3` | Killed by the Demon | ElevenLabs SFX v2: "Deep monstrous demon growl rising into a dark whoosh, ending in a low heavy thud" | ElevenLabs paid plan | 4s |
| `morning.mp3` | Morning | ElevenLabs SFX v2: "Rooster crowing loudly at dawn on a farm, one long cock-a-doodle-doo, birds chirping softly" | ElevenLabs paid plan | 4s |
| `announcement.mp3` | Announcement | ElevenLabs SFX v2: "Medieval execution snare drumroll building up, ending in one heavy wooden trapdoor thud" | ElevenLabs paid plan | 5s. Was "Executed" |
| `protected.mp3` | Protected | [Choir of Voices – Single Chord](https://freesound.org/people/bone666138/sounds/274121/) by bone666138 (Freesound) | CC0 | Trimmed to 3s, fade-out |
| `slayer.mp3` | Slayer shot | [Crossbow Firing and Hitting Target](https://freesound.org/people/Ali_6868/sounds/384919/) by Ali_6868 + [arrow into wood](https://freesound.org/people/JoeDinesSound/sounds/534956/) by JoeDinesSound (Freesound) | CC0 | String TING brightened; impact layered on the hit at 0.74s with bass boost; compressed, -11 LUFS; 1.3s |
| `nomination.mp3` | Nomination | ElevenLabs SFX v2: "Heavy wooden staff slammed three times on a stone floor in a large castle hall, loud booming echo, commanding attention" | ElevenLabs paid plan | 3s, -12 LUFS. Earlier tries: gavel, fanfare (off-theme), door knocks (sounded like creaking wood) |
| `vote-tick.mp3` | Voting → Tick (odd taps) | ElevenLabs SFX v2: "One single tick of a huge antique grandfather clock, deep heavy wooden mechanical tick with a low resonant body, close-mic, nothing else" | ElevenLabs paid plan | 1s, fade-out, -14 LUFS |
| `vote-tock.mp3` | Voting → Tock (even taps) | ElevenLabs SFX v2: "One single tock of a huge antique grandfather clock, lower deeper wooden mechanical tock with a resonant body, close-mic, nothing else" | ElevenLabs paid plan | 1s, fade-out, -14 LUFS |
| `vote-end.mp3` | Voting → End vote | [bec low bell solo](https://freesound.org/people/HMTSCCSound/sounds/554655/) by HMTSCCSound (Freesound) | CC0 | Trimmed to 8s, fade-out |
| `dun-dun-dun.mp3` | Dun dun DUN | [Dramatic Dun Dun Dun](https://pixabay.com/sound-effects/musical-dramatic-dun-dun-dun-460379/) by MrDwarf92 (Pixabay) | Pixabay Content License (free, commercial, no credit) | 3s |

Freesound files are its HQ MP3 previews. Downloaded files are trimmed and loudness-normalized with ffmpeg
(`loudnorm=I=-16:TP=-1.5`; the slayer shot and nomination are louder at -12 LUFS).

ElevenLabs prompts live in the flow "Grimoire Sounds — BOTC SFX" in Shay's ElevenLabs workspace.

## Voting panel

The Storyteller taps **Tick** once per player as their hand moves around the circle; each tap plays a new
sound, alternating tick and tock (overlapping is fine), and bumps the counter. **End vote** rings the bell and resets the counter.
