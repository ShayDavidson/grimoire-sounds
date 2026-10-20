# ADR 0003 — Remote mode over PeerJS

**Context.** iPhones have one media volume, so background Spotify and the soundboard can't be balanced on the
phone. Playing music on a laptop fixes the balance (Spotify desktop has its own volume), but the laptop and the
phone can't share one Bluetooth speaker. So the laptop should play the sound effects too, with the phone as a
remote.

**Decision.** Peer-to-peer WebRTC data channel via PeerJS, using its free public broker for discovery by a
4-letter room code. The site stays static on GitHub Pages; no backend.

**Trade-offs.** Depends on a free community broker (no SLA) and on WebRTC working on the venue network.
Latency is low because messages go device-to-device.

**Cost.** Free.

**Exit criteria.** Broker unreliable on game nights, or we need more than a handful of remotes.

**Reversal.** Swap `src/remote.ts` for another transport (self-hosted PeerJS server, a Cloudflare Durable
Object WebSocket room, Firebase, etc.); the message protocol stays the same.
