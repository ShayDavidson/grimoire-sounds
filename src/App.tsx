import { useEffect, useReducer, useState, type CSSProperties } from 'react'
import { ALL_SOUNDS, DAY, NIGHT, VOTE_END, VOTE_TICK, VOTE_TOCK, type Sound, type SoundGroup } from './sounds'
import { DEFAULT_VOLUME, MAX_VOLUME, isPlaying, play, preload, setMasterVolume, stop, stopAll, subscribe } from './audio'
import './App.css'

const accent = (sound: Sound) => ({ '--pad': sound.color }) as CSSProperties

function Pad({ sound }: { sound: Sound }) {
  const Icon = sound.icon
  const active = isPlaying(sound.id)
  return (
    <button
      type="button"
      className={`pad${active ? ' playing' : ''}`}
      style={accent(sound)}
      onClick={() => (active ? stop(sound.id) : void play(sound))}
    >
      <Icon className="pad-icon" aria-hidden />
      <span className="pad-label">{sound.label}</span>
      {sound.kind === 'loop' && <span className="pad-kind">Loop</span>}
    </button>
  )
}

function Group({ group }: { group: SoundGroup }) {
  return (
    <section className={`group ${group.id}`}>
      <h2>{group.label}</h2>
      <div className="grid">
        {group.sounds.map((sound) => (
          <Pad key={sound.id} sound={sound} />
        ))}
      </div>
    </section>
  )
}

/** Voting: one tick/tock per player as the Storyteller's hand moves around the circle, then the bell. */
function Voting() {
  const [ticks, setTicks] = useState(0)
  const TickIcon = VOTE_TICK.icon
  const EndIcon = VOTE_END.icon
  return (
    <section className="group voting-group">
      <h2>Voting</h2>
      <div className="voting">
        <button
          type="button"
          className="pad tick"
          style={accent(VOTE_TICK)}
          onClick={() => {
            // Odd taps tick, even taps tock.
            void play(ticks % 2 === 0 ? VOTE_TICK : VOTE_TOCK)
            setTicks((n) => n + 1)
          }}
        >
          <TickIcon className="pad-icon" aria-hidden />
          <span className="pad-label">Tick</span>
          <span className="tick-count" aria-live="polite">
            {ticks}
          </span>
        </button>
        <button
          type="button"
          className={`pad${isPlaying(VOTE_END.id) ? ' playing' : ''}`}
          style={accent(VOTE_END)}
          onClick={() => {
            setTicks(0)
            void play(VOTE_END)
          }}
        >
          <EndIcon className="pad-icon" aria-hidden />
          <span className="pad-label">End vote</span>
        </button>
      </div>
    </section>
  )
}

function App() {
  const [, rerender] = useReducer((n: number) => n + 1, 0)
  const [volume, setVolume] = useState(DEFAULT_VOLUME)

  useEffect(() => {
    preload(ALL_SOUNDS)
    const unsubscribe = subscribe(rerender)
    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <main className="app">
      <header className="header">
        <h1>Grimoire Sounds</h1>
      </header>

      <section className="controls">
        <label className="volume">
          Volume
          <input
            type="range"
            min={0}
            max={MAX_VOLUME}
            step={0.05}
            value={volume}
            onChange={(e) => {
              const v = Number(e.target.value)
              setVolume(v)
              setMasterVolume(v)
            }}
          />
          <span className="volume-value">{Math.round(volume * 100)}%</span>
        </label>
        <button type="button" className="stop-all" onClick={stopAll}>
          Stop all
        </button>
      </section>

      <Group group={NIGHT} />
      <Group group={DAY} />
      <Voting />
    </main>
  )
}

export default App
