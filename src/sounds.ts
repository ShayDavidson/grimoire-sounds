// The sound catalog. Add a file to public/sounds/ and an entry here.
// Sounds without a `src` are synthesized (placeholders until real files are chosen).

export type SoundKind = 'oneshot' | 'loop'

export interface Sound {
  id: string
  label: string
  kind: SoundKind
  /** Path under public/, without a leading slash, e.g. "sounds/bell.mp3". */
  src?: string
  /** Placeholder synth used when there is no file yet. */
  synth?: 'bell' | 'drone'
  volume?: number
}

export const SOUNDS: Sound[] = [
  { id: 'test-bell', label: 'Test bell', kind: 'oneshot', synth: 'bell' },
  { id: 'test-drone', label: 'Test drone', kind: 'loop', synth: 'drone', volume: 0.5 },
]
