import type { Sound } from './sounds'

// One Web Audio graph for the whole app: every sound → its own gain → master gain → speakers.
// Browsers only allow audio after a user gesture, so the context is created on first play.

let ctx: AudioContext | null = null
let master: GainNode | null = null
const buffers = new Map<string, Promise<AudioBuffer>>()
const playing = new Map<string, { stop: () => void }>()
const listeners = new Set<() => void>()

function context() {
  if (!ctx) {
    ctx = new AudioContext()
    master = ctx.createGain()
    master.connect(ctx.destination)
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

export function setMasterVolume(v: number) {
  const { ctx, master } = context()
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

function synth(kind: NonNullable<Sound['synth']>, out: GainNode, loop: boolean) {
  const { ctx } = context()
  const t = ctx.currentTime
  if (kind === 'bell') {
    const nodes = [1, 2.76, 5.4].map((ratio, i) => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.frequency.value = 220 * ratio
      g.gain.setValueAtTime(0.4 / (i + 1), t)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 3)
      osc.connect(g).connect(out)
      osc.start(t)
      osc.stop(t + 3)
      return osc
    })
    return { duration: 3, stop: () => nodes.forEach((n) => n.stop()) }
  }
  const nodes = [55, 82.4, 110.3].map((f) => {
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.value = f
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 300
    osc.connect(filter).connect(out)
    osc.start(t)
    if (!loop) osc.stop(t + 6)
    return osc
  })
  return { duration: loop ? Infinity : 6, stop: () => nodes.forEach((n) => n.stop()) }
}

export async function play(sound: Sound) {
  const { ctx, master } = context()
  stop(sound.id)

  const gain = ctx.createGain()
  gain.gain.value = sound.volume ?? 1
  gain.connect(master)
  const loop = sound.kind === 'loop'

  let stopSource: () => void
  let duration: number
  if (sound.src) {
    const source = ctx.createBufferSource()
    source.buffer = await load(sound.src)
    source.loop = loop
    source.connect(gain)
    source.start()
    stopSource = () => source.stop()
    duration = loop ? Infinity : source.buffer.duration
  } else {
    ;({ stop: stopSource, duration } = synth(sound.synth ?? 'bell', gain, loop))
  }

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
