import Peer, { type DataConnection } from 'peerjs'

// Remote mode: one device (the "speaker", e.g. a laptop plugged into the room speaker) plays the sounds;
// other devices (the "remote", e.g. the Storyteller's phone) send taps to it. Devices talk directly over
// WebRTC; PeerJS's free public broker is only used to find each other by room code.

export type Msg =
  | { type: 'play'; id: string }
  | { type: 'stop'; id: string }
  | { type: 'stopAll' }
  | { type: 'volume'; v: number }
  | { type: 'state'; playing: string[]; volume: number }

const PREFIX = 'grimoire-sounds-'
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function makeCode() {
  return Array.from({ length: 4 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('')
}

export function normalizeCode(code: string) {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4)
}

export interface Speaker {
  broadcast: (msg: Msg) => void
  close: () => void
}

export function startSpeaker(
  code: string,
  on: { message: (msg: Msg) => void; remotes: (n: number) => void; ready: () => void; taken: () => void },
): Speaker {
  const peer = new Peer(PREFIX + code)
  const conns = new Set<DataConnection>()
  let closed = false

  peer.on('open', on.ready)
  peer.on('connection', (conn) => {
    conn.on('open', () => {
      conns.add(conn)
      on.remotes(conns.size)
    })
    conn.on('data', (data) => on.message(data as Msg))
    conn.on('close', () => {
      conns.delete(conn)
      on.remotes(conns.size)
    })
  })
  peer.on('error', (err) => {
    if (err.type === 'unavailable-id') on.taken()
  })
  // Lost the broker (e.g. Wi-Fi blip): existing remotes keep working, but re-register so new ones can join.
  peer.on('disconnected', () => {
    if (!closed) setTimeout(() => !closed && !peer.destroyed && peer.reconnect(), 2000)
  })

  return {
    broadcast: (msg) => conns.forEach((c) => c.open && c.send(msg)),
    close: () => {
      closed = true
      peer.destroy()
    },
  }
}

export type RemoteStatus = 'connecting' | 'connected' | 'not-found'

export interface Remote {
  send: (msg: Msg) => void
  close: () => void
}

export function startRemote(
  code: string,
  on: { message: (msg: Msg) => void; status: (s: RemoteStatus) => void },
): Remote {
  const peer = new Peer()
  let conn: DataConnection | null = null
  let closed = false
  let retry: ReturnType<typeof setTimeout> | undefined

  const reconnectSoon = (ms: number) => {
    if (closed) return
    clearTimeout(retry)
    retry = setTimeout(connect, ms)
  }

  function connect() {
    if (closed || peer.destroyed) return
    if (peer.disconnected) peer.reconnect()
    on.status('connecting')
    const c = peer.connect(PREFIX + code, { reliable: true })
    conn = c
    c.on('open', () => on.status('connected'))
    c.on('data', (data) => on.message(data as Msg))
    c.on('close', () => {
      if (conn === c) reconnectSoon(1500)
    })
  }

  peer.on('open', connect)
  peer.on('error', (err) => {
    if (err.type === 'peer-unavailable') {
      on.status('not-found')
      reconnectSoon(3000)
    }
  })
  peer.on('disconnected', () => reconnectSoon(2000))

  return {
    send: (msg) => {
      if (conn?.open) conn.send(msg)
    },
    close: () => {
      closed = true
      clearTimeout(retry)
      peer.destroy()
    },
  }
}
