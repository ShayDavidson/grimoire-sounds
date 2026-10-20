import { useEffect, useReducer, useState } from 'react'
import { SOUNDS, type Sound } from './sounds'
import { isPlaying, play, setMasterVolume, stop, stopAll, subscribe } from './audio'
import './App.css'

function App() {
  const [, rerender] = useReducer((n: number) => n + 1, 0)
  const [volume, setVolume] = useState(0.8)

  useEffect(() => {
    const unsubscribe = subscribe(rerender)
    return () => {
      unsubscribe()
    }
  }, [])

  const toggle = (sound: Sound) => {
    if (isPlaying(sound.id)) stop(sound.id)
    else void play(sound)
  }

  return (
    <main className="app">
      <header className="header">
        <h1>Grimoire Sounds</h1>
        <p className="subtitle">Sound effects for Blood on the Clocktower</p>
      </header>

      <section className="controls">
        <label className="volume">
          Volume
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => {
              const v = Number(e.target.value)
              setVolume(v)
              setMasterVolume(v)
            }}
          />
        </label>
        <button type="button" className="stop-all" onClick={stopAll}>
          Stop all
        </button>
      </section>

      <section className="grid">
        {SOUNDS.map((sound) => (
          <button
            key={sound.id}
            type="button"
            className={`pad${isPlaying(sound.id) ? ' playing' : ''}`}
            onClick={() => toggle(sound)}
          >
            <span className="pad-label">{sound.label}</span>
            <span className="pad-kind">{sound.kind === 'loop' ? 'Loop' : 'One-shot'}</span>
          </button>
        ))}
      </section>
    </main>
  )
}

export default App
