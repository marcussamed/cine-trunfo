import { useState, useRef, useMemo } from 'react'

let audioCtx = null
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}

function playTone(freq, duration, type = 'square', volume = 0.08) {
  try {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.value = volume
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch {}
}

function playNoise(duration, volume = 0.04) {
  try {
    const ctx = getCtx()
    const bufferSize = Math.floor(ctx.sampleRate * duration)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * volume
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const gain = ctx.createGain()
    gain.gain.value = 1
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    source.connect(gain)
    gain.connect(ctx.destination)
    source.start()
  } catch {}
}

export function useSfx() {
  const [muted, setMuted] = useState(() => {
    try { return localStorage.getItem('cine-trunfo-muted') === '1' } catch { return false }
  })
  const mutedRef = useRef(muted)

  const toggleMute = () => {
    setMuted(prev => {
      const next = !prev
      mutedRef.current = next
      try { localStorage.setItem('cine-trunfo-muted', next ? '1' : '0') } catch {}
      return next
    })
  }

  const sfx = useMemo(() => ({
    tapeInsert() {
      if (mutedRef.current) return
      playNoise(0.15, 0.06)
      setTimeout(() => playTone(120, 0.1, 'square', 0.05), 50)
      setTimeout(() => playTone(80, 0.08, 'square', 0.04), 120)
    },
    reveal() {
      if (mutedRef.current) return
      playNoise(0.3, 0.03)
      setTimeout(() => playTone(440, 0.12, 'sine', 0.06), 200)
      setTimeout(() => playTone(660, 0.15, 'sine', 0.07), 350)
    },
    sharpPick() {
      if (mutedRef.current) return
      playTone(523, 0.08, 'sine', 0.06)
      setTimeout(() => playTone(659, 0.08, 'sine', 0.06), 80)
      setTimeout(() => playTone(784, 0.12, 'sine', 0.07), 160)
    },
    skip() {
      if (mutedRef.current) return
      playNoise(0.1, 0.05)
      playTone(200, 0.08, 'sawtooth', 0.03)
    },
    rivalReveal() {
      if (mutedRef.current) return
      playTone(330, 0.1, 'square', 0.04)
      setTimeout(() => playNoise(0.08, 0.03), 80)
    },
    win() {
      if (mutedRef.current) return
      const notes = [523, 659, 784, 1047]
      notes.forEach((n, i) => setTimeout(() => playTone(n, 0.2, 'sine', 0.06), i * 120))
    },
    lose() {
      if (mutedRef.current) return
      playTone(330, 0.3, 'sawtooth', 0.05)
      setTimeout(() => playTone(260, 0.4, 'sawtooth', 0.04), 250)
    },
    rewind() {
      if (mutedRef.current) return
      for (let i = 0; i < 6; i++) {
        setTimeout(() => playTone(800 - i * 80, 0.06, 'square', 0.03), i * 50)
      }
    },
  }), [])

  return { muted, toggleMute, sfx }
}
