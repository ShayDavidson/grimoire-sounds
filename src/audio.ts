import type { Sound } from './sounds'

// One Web Audio graph for the whole app: every sound → its own gain → master gain → limiter → speakers.
// The master can boost above 100% (to cut through background music); the limiter stops it clipping.
// Browsers only allow audio after a user gesture, so the context is created on first play.

let ctx: AudioContext | null = null
let master: GainNode | null = null
export const MAX_VOLUME = 3
export const DEFAULT_VOLUME = 1.5
let masterLevel = DEFAULT_VOLUME
const buffers = new Map<string, Promise<AudioBuffer>>()
const playing = new Map<string, { stop: () => void }>()
const listeners = new Set<() => void>()

function context() {
  if (!ctx) {
    ctx = new AudioContext()
    master = ctx.createGain()
    master.gain.value = masterLevel
    const limiter = ctx.createDynamicsCompressor()
    limiter.threshold.value = -3
    limiter.knee.value = 0
    limiter.ratio.value = 20
    limiter.attack.value = 0.002
    limiter.release.value = 0.2
    master.connect(limiter).connect(ctx.destination)
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return { ctx, master: master! }
}

function notify() {
  listeners.forEach((fn) => fn())
}

export function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function isPlaying(id: string) {
  return playing.has(id)
}

export function playingIds() {
  return [...playing.keys()]
}

/** Create/resume the audio context. Call from a click so the browser allows sound later (speaker mode). */
export function unlock() {
  context()
}

export function setMasterVolume(v: number) {
  masterLevel = v
  if (!ctx || !master) return
  master.gain.setTargetAtTime(v, ctx.currentTime, 0.02)
}

function load(src: string) {
  let buf = buffers.get(src)
  if (!buf) {
    const { ctx } = context()
    buf = fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load ${src}: ${r.status}`)
        return r.arrayBuffer()
      })
      .then((data) => ctx.decodeAudioData(data))
    buffers.set(src, buf)
  }
  return buf
}


/** Fetch and decode every sound up front so the first tap plays instantly. */
export function preload(sounds: Sound[]) {
  sounds.forEach((s) => void load(import.meta.env.BASE_URL + s.src).catch(() => {}))
}

export async function play(sound: Sound) {
  const { ctx, master } = context()
  if (!sound.stack) stop(sound.id)

  const gain = ctx.createGain()
  gain.gain.value = sound.volume ?? 1
  gain.connect(master)
  const loop = sound.kind === 'loop'

  const source = ctx.createBufferSource()
  source.buffer = await load(import.meta.env.BASE_URL + sound.src)
  source.loop = loop
  source.connect(gain)
  source.start()
  // Stacked sounds (rapid repeats) just play out; they aren't tracked or stoppable.
  if (sound.stack) return
  const stopSource = () => source.stop()
  const duration = loop ? Infinity : source.buffer.duration

  const entry = {
    stop: () => {
      // Short fade to avoid clicks.
      gain.gain.setTargetAtTime(0, ctx.currentTime, 0.05)
      setTimeout(() => {
        try {
          stopSource()
        } catch {
          /* already stopped */
        }
        gain.disconnect()
      }, 300)
    },
  }
  playing.set(sound.id, entry)
  notify()

  if (Number.isFinite(duration)) {
    setTimeout(() => {
      if (playing.get(sound.id) === entry) {
        playing.delete(sound.id)
        notify()
      }
    }, duration * 1000)
  }
}

export function stop(id: string) {
  const entry = playing.get(id)
  if (!entry) return
  entry.stop()
  playing.delete(id)
  notify()
}

export function stopAll() {
  ;[...playing.keys()].forEach(stop)
}
