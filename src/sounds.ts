// The sound catalog. Put the file in public/sounds/ and add an entry here.
// Sources and licences for every file are in docs/wiki/sounds.md.

import type { LucideIcon } from 'lucide-react'
import { Bell, Crosshair, Drama, Gavel, Hand, Megaphone, Moon, ShieldPlus, Skull, Sunrise, Sunset } from 'lucide-react'

export type SoundKind = 'oneshot' | 'loop'

export interface Sound {
  id: string
  label: string
  kind: SoundKind
  icon: LucideIcon
  /** Path under public/, without a leading slash, e.g. "sounds/bell.mp3". */
  src: string
  /** Accent colour for the pad, so pads are easy to tell apart at a glance. */
  color: string
  volume?: number
  /** Each tap plays a new copy instead of restarting/stopping (e.g. the vote tick). */
  stack?: boolean
}

export interface SoundGroup {
  id: string
  label: string
  sounds: Sound[]
}

export const NIGHT: SoundGroup = {
  id: 'night',
  label: 'Night',
  sounds: [
    { id: 'night-approaching', color: '#3fbfa8', label: 'Night approaching', kind: 'loop', icon: Sunset, src: 'sounds/night-approaching.mp3', volume: 0.6 },
    { id: 'night-falls', color: '#7b8cff', label: 'Night falls', kind: 'oneshot', icon: Moon, src: 'sounds/night-falls.mp3' },
    { id: 'demon-kill', color: '#ff4d4f', label: 'Killed by the Demon', kind: 'oneshot', icon: Skull, src: 'sounds/demon-kill.mp3' },
    { id: 'protected', color: '#f5e27a', label: 'Protected', kind: 'oneshot', icon: ShieldPlus, src: 'sounds/protected.mp3' },
  ],
}

export const DAY: SoundGroup = {
  id: 'day',
  label: 'Day',
  sounds: [
    { id: 'morning', color: '#ff9f43', label: 'Morning', kind: 'oneshot', icon: Sunrise, src: 'sounds/morning.mp3' },
    { id: 'slayer', color: '#8fd14f', label: 'Slayer shot', kind: 'oneshot', icon: Crosshair, src: 'sounds/slayer.mp3' },
    { id: 'nomination', color: '#36c5f0', label: 'Nomination', kind: 'oneshot', icon: Gavel, src: 'sounds/nomination.mp3' },
    { id: 'announcement', color: '#d46bd9', label: 'Announcement', kind: 'oneshot', icon: Megaphone, src: 'sounds/announcement.mp3' },
    { id: 'dun-dun-dun', color: '#ff6b9a', label: 'Dun dun DUN', kind: 'oneshot', icon: Drama, src: 'sounds/dun-dun-dun.mp3' },
  ],
}

export const VOTE_TICK: Sound = {
  id: 'vote-tick',
  color: '#c9a227',
  label: 'Tick',
  kind: 'oneshot',
  icon: Hand,
  src: 'sounds/vote-tick.mp3',
  stack: true,
}

/** Alternates with VOTE_TICK so the vote goes tick, tock, tick, tock. */
export const VOTE_TOCK: Sound = {
  id: 'vote-tock',
  color: '#c9a227',
  label: 'Tock',
  kind: 'oneshot',
  icon: Hand,
  src: 'sounds/vote-tock.mp3',
  stack: true,
}

export const VOTE_END: Sound = {
  id: 'vote-end',
  color: '#e0894a',
  label: 'End vote',
  kind: 'oneshot',
  icon: Bell,
  src: 'sounds/vote-end.mp3',
}

export const ALL_SOUNDS: Sound[] = [...NIGHT.sounds, ...DAY.sounds, VOTE_TICK, VOTE_TOCK, VOTE_END]
