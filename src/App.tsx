import { useEffect, useReducer, useRef, useState, type CSSProperties } from 'react'
import { ALL_SOUNDS, DAY, NIGHT, VOTE_END, VOTE_TICK, VOTE_TOCK, type Sound, type SoundGroup } from './sounds'
import {
  DEFAULT_VOLUME,
  MAX_VOLUME,
  isPlaying,
  play,
  playingIds,
  preload,
  setMasterVolume,
  stop,
  stopAll,
  subscribe,
  unlock,
} from './audio'
import {
  makeCode,
  normalizeCode,
  startRemote,
  startSpeaker,
  type Msg,
  type Remote,
  type RemoteStatus,
  type Speaker,
} from './remote'
import './App.css'

const SOUNDS_BY_ID = new Map(ALL_SOUNDS.map((s) => [s.id, s]))
const accent = (sound: Sound) => ({ '--pad': sound.color }) as CSSProperties

/** What the pads talk to: local audio, or (in remote mode) a speaker on another device. */
interface Board {
  isActive: (id: string) => boolean
  play: (sound: Sound) => void
  stop: (id: string) => void
  stopAll: () => void
}

type Mode = { kind: 'local' } | { kind: 'speaker'; code: string } | { kind: 'remote'; code: string }

function storedSpeakerCode() {
  try {
    return localStorage.getItem('speakerCode')
  } catch {
    return null
  }
}

function storeSpeakerCode(code: string) {
  try {
    localStorage.setItem('speakerCode', code)
  } catch {
    /* private mode: a new code next time is fine */
  }
}

function initialMode(): Mode {
  const code = normalizeCode(new URLSearchParams(location.search).get('remote') ?? '')
  return code.length === 4 ? { kind: 'remote', code } : { kind: 'local' }
}

function Pad({ sound, board }: { sound: Sound; board: Board }) {
  const Icon = sound.icon
  const active = board.isActive(sound.id)
  return (
    <button
      type="button"
      className={`pad${active ? ' playing' : ''}`}
      style={accent(sound)}
      onClick={() => (active ? board.stop(sound.id) : board.play(sound))}
    >
      <Icon className="pad-icon" aria-hidden />
      <span className="pad-label">{sound.label}</span>
      {sound.kind === 'loop' && <span className="pad-kind">Loop</span>}
    </button>
  )
}

function Group({ group, board }: { group: SoundGroup; board: Board }) {
  return (
    <section className={`group ${group.id}`}>
      <h2>{group.label}</h2>
      <div className="grid">
        {group.sounds.map((sound) => (
          <Pad key={sound.id} sound={sound} board={board} />
        ))}
      </div>
    </section>
  )
}

/** Voting: one tick/tock per player as the Storyteller's hand moves around the circle, then the bell. */
function Voting({ board }: { board: Board }) {
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
            board.play(ticks % 2 === 0 ? VOTE_TICK : VOTE_TOCK)
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
          className={`pad${board.isActive(VOTE_END.id) ? ' playing' : ''}`}
          style={accent(VOTE_END)}
          onClick={() => {
            setTicks(0)
            board.play(VOTE_END)
          }}
        >
          <EndIcon className="pad-icon" aria-hidden />
          <span className="pad-label">End vote</span>
        </button>
      </div>
    </section>
  )
}

function ConnectPanel({ mode, onClose, onChoose }: { mode: Mode; onClose: () => void; onChoose: (m: Mode) => void }) {
  const [code, setCode] = useState(mode.kind === 'remote' ? mode.code : '')
  return (
    <div className="overlay" onClick={onClose}>
      <div className="panel" role="dialog" aria-label="Connect devices" onClick={(e) => e.stopPropagation()}>
        <h2>Play through another device</h2>
        <p className="hint">
          Plug a laptop into the room speaker and make it the <b>speaker</b>. Then use your phone as the <b>remote</b>:
          taps on the phone play on the laptop.
        </p>

        <button
          type="button"
          className="panel-button"
          onClick={() => {
            unlock()
            onChoose({ kind: 'speaker', code: storedSpeakerCode() ?? makeCode() })
          }}
        >
          Use this device as the speaker
        </button>

        <form
          className="join"
          onSubmit={(e) => {
            e.preventDefault()
            if (code.length === 4) onChoose({ kind: 'remote', code })
          }}
        >
          <input
            value={code}
            onChange={(e) => setCode(normalizeCode(e.target.value))}
            placeholder="CODE"
            aria-label="Speaker code"
            autoCapitalize="characters"
            autoComplete="off"
            inputMode="text"
          />
          <button type="submit" className="panel-button" disabled={code.length !== 4}>
            Control a speaker
          </button>
        </form>

        {mode.kind !== 'local' && (
          <button type="button" className="panel-link" onClick={() => onChoose({ kind: 'local' })}>
            Disconnect and play on this device
          </button>
        )}
      </div>
    </div>
  )
}

function App() {
  const [, rerender] = useReducer((n: number) => n + 1, 0)
  const [volume, setVolume] = useState(DEFAULT_VOLUME)
  const [mode, setMode] = useState<Mode>(initialMode)
  const [panelOpen, setPanelOpen] = useState(false)

  // Speaker state
  const [remotes, setRemotes] = useState(0)
  const [speakerReady, setSpeakerReady] = useState(false)
  const speaker = useRef<Speaker | null>(null)

  // Remote state
  const [status, setStatus] = useState<RemoteStatus>('connecting')
  const [remotePlaying, setRemotePlaying] = useState<Set<string>>(new Set())
  const remote = useRef<Remote | null>(null)

  // Latest volume for the speaker's state messages (updated wherever the volume changes).
  const volumeRef = useRef(DEFAULT_VOLUME)

  useEffect(() => {
    preload(ALL_SOUNDS)
    const unsubscribe = subscribe(rerender)
    return () => {
      unsubscribe()
    }
  }, [])

  // Speaker: play what remotes ask for, and tell them what's playing.
  useEffect(() => {
    if (mode.kind !== 'speaker') return
    storeSpeakerCode(mode.code)
    const sendState = () =>
      speaker.current?.broadcast({ type: 'state', playing: playingIds(), volume: volumeRef.current })
    const s = startSpeaker(mode.code, {
      ready: () => setSpeakerReady(true),
      remotes: (n) => {
        setRemotes(n)
        sendState()
      },
      taken: () => {
        setSpeakerReady(false)
        setMode({ kind: 'speaker', code: makeCode() })
      },
      message: (msg: Msg) => {
        if (msg.type === 'play') {
          const sound = SOUNDS_BY_ID.get(msg.id)
          if (sound) void play(sound)
        } else if (msg.type === 'stop') stop(msg.id)
        else if (msg.type === 'stopAll') stopAll()
        else if (msg.type === 'volume') {
          setVolume(msg.v)
          setMasterVolume(msg.v)
          volumeRef.current = msg.v
          sendState()
        }
      },
    })
    speaker.current = s
    const unsubscribe = subscribe(sendState)
    return () => {
      unsubscribe()
      s.close()
      speaker.current = null
      setRemotes(0)
    }
  }, [mode])

  // Remote: forward taps, mirror the speaker's state.
  useEffect(() => {
    if (mode.kind !== 'remote') return
    stopAll()
    const r = startRemote(mode.code, {
      status: setStatus,
      message: (msg: Msg) => {
        if (msg.type === 'state') {
          setRemotePlaying(new Set(msg.playing))
          setVolume(msg.volume)
          volumeRef.current = msg.volume
        }
      },
    })
    remote.current = r
    return () => {
      r.close()
      remote.current = null
      setRemotePlaying(new Set())
    }
  }, [mode])

  const isRemote = mode.kind === 'remote'
  const board: Board = isRemote
    ? {
        isActive: (id) => remotePlaying.has(id),
        play: (sound) => remote.current?.send({ type: 'play', id: sound.id }),
        stop: (id) => remote.current?.send({ type: 'stop', id }),
        stopAll: () => remote.current?.send({ type: 'stopAll' }),
      }
    : { isActive: isPlaying, play: (sound) => void play(sound), stop, stopAll }

  const changeVolume = (v: number) => {
    setVolume(v)
    if (isRemote) remote.current?.send({ type: 'volume', v })
    else {
      setMasterVolume(v)
      volumeRef.current = v
      speaker.current?.broadcast({ type: 'state', playing: playingIds(), volume: v })
    }
  }

  const chooseMode = (m: Mode) => {
    setSpeakerReady(false)
    setStatus('connecting')
    setMode(m)
    setPanelOpen(false)
    // Keep the URL shareable for remotes, clean otherwise.
    const url = m.kind === 'remote' ? `?remote=${m.code}` : location.pathname
    history.replaceState(null, '', url)
  }

  let chip: { label: string; tone: 'ok' | 'wait' | 'bad' | 'off' }
  if (mode.kind === 'speaker')
    chip = speakerReady
      ? { label: `Speaker · ${mode.code} · ${remotes} remote${remotes === 1 ? '' : 's'}`, tone: 'ok' }
      : { label: `Speaker · ${mode.code} · starting…`, tone: 'wait' }
  else if (mode.kind === 'remote')
    chip =
      status === 'connected'
        ? { label: `Remote → ${mode.code}`, tone: 'ok' }
        : status === 'not-found'
          ? { label: `${mode.code} not found · retrying`, tone: 'bad' }
          : { label: `Connecting to ${mode.code}…`, tone: 'wait' }
  else chip = { label: 'Connect', tone: 'off' }

  return (
    <main className="app">
      <header className="header">
        <h1>Grimoire Sounds</h1>
        <button type="button" className={`chip ${chip.tone}`} onClick={() => setPanelOpen(true)}>
          {chip.tone !== 'off' && <span className="dot" aria-hidden />}
          {chip.label}
        </button>
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
            onChange={(e) => changeVolume(Number(e.target.value))}
          />
          <span className="volume-value">{Math.round(volume * 100)}%</span>
        </label>
        <button type="button" className="stop-all" onClick={board.stopAll}>
          Stop all
        </button>
      </section>

      <Group group={NIGHT} board={board} />
      <Group group={DAY} board={board} />
      <Voting board={board} />

      {panelOpen && <ConnectPanel mode={mode} onClose={() => setPanelOpen(false)} onChoose={chooseMode} />}
    </main>
  )
}

export default App
