# Remote mode

Lets the Storyteller tap pads on a phone while the sounds play on another device (usually a laptop plugged
into the room speaker, which can also play Spotify with its own in-app volume).

## How to use

1. On the laptop: open the site → **Connect** → **Use this device as the speaker**. The chip shows a 4-letter
   code, e.g. `Speaker · 3NHQ · 0 remotes`. The laptop tab can stay in the background but must stay open.
2. On the phone: open the site → **Connect** → type the code → **Control a speaker**
   (or open `…/grimoire-sounds/?remote=3NHQ`). The chip turns green: `Remote → 3NHQ`.
3. Taps, **Stop all** and the volume slider on the phone act on the laptop. Pads light up while they play on
   the laptop.

The speaker keeps its code in `localStorage`, so after a reload it gets the same code and remotes reconnect on
their own. Choosing the speaker again after a reload needs a click (browsers only allow audio after a gesture).

## How it works

- `src/remote.ts` wraps [PeerJS](https://peerjs.com). The speaker registers peer id `grimoire-sounds-<CODE>`
  on PeerJS's free public broker; remotes connect to it. Audio commands then travel directly over a WebRTC
  data channel.
- Messages: `play {id}`, `stop {id}`, `stopAll`, `volume {v}` from remote → speaker; `state {playing, volume}`
  from speaker → remotes whenever anything starts/stops or the volume changes.
- The tick/tock alternation and counter live on the remote; it sends `play vote-tick` / `play vote-tock`.
- Remotes retry every 1.5–3s if the speaker is missing or the connection drops.

## Limits

- Both devices need internet (to reach the broker). Very strict networks that block WebRTC won't connect.
- The public broker is a free community service with no uptime guarantee. If it becomes unreliable, host our
  own PeerJS server or switch to a different signalling service.
