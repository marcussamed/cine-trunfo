import { useState, useEffect, useRef, useCallback } from 'react'
import VHSCard from './VHSCard'
import ShelfSlots from './ShelfSlots'
import TrackingReveal from './TrackingReveal'
import { t } from '../i18n'

const TIMER_SECONDS = 7

export default function PlayingScreen({
  round,
  totalRounds,
  pair,
  shelf,
  skipsLeft,
  revealedFilm,
  isSharpPick,
  phase,
  mode,
  onPick,
  onSkip,
  onTimeout,
  sfx,
  lang,
}) {
  const isRevealing = phase === 'revealing'
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const timerRef = useRef(null)
  const startTimeRef = useRef(null)
  const hasTimedOut = useRef(false)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (isRevealing) {
      clearTimer()
      return
    }

    hasTimedOut.current = false
    startTimeRef.current = Date.now()
    setTimeLeft(TIMER_SECONDS)

    const tick = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      const remaining = Math.max(0, TIMER_SECONDS - elapsed)
      setTimeLeft(remaining)

      if (remaining <= 0 && !hasTimedOut.current) {
        hasTimedOut.current = true
        sfx.skip()
        onTimeout()
        return
      }

      timerRef.current = requestAnimationFrame(tick)
    }

    timerRef.current = requestAnimationFrame(tick)
    return clearTimer
  }, [round, pair, isRevealing, clearTimer, onTimeout, sfx])

  const handlePick = (film) => {
    clearTimer()
    sfx.tapeInsert()
    onPick(film)
  }

  const handleSkip = () => {
    clearTimer()
    sfx.skip()
    onSkip()
  }

  const fraction = timeLeft / TIMER_SECONDS
  const displaySeconds = Math.ceil(timeLeft)
  const isUrgent = timeLeft <= 3

  return (
    <div className="h-full flex flex-col px-4 pt-12 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="font-body text-vhs-neon-cyan text-lg">
          {t(lang, 'rented')} <span className="text-white font-bold">{round}</span>/{totalRounds}
        </div>
        <div className="flex items-center gap-2">
          {mode === 'daily' && (
            <span className="font-body text-vhs-neon-yellow text-xs border border-vhs-neon-yellow/30 rounded px-1.5 py-0.5">
              DAILY
            </span>
          )}
          <button
            onClick={handleSkip}
            disabled={skipsLeft <= 0 || isRevealing}
            className={`font-body text-base px-3 py-1.5 rounded border transition-all ${
              skipsLeft > 0 && !isRevealing
                ? 'border-vhs-neon-magenta/60 text-vhs-neon-magenta active:bg-vhs-neon-magenta/20 active:scale-95'
                : 'border-vhs-tape/40 text-vhs-tape/40 cursor-not-allowed'
            }`}
          >
            {t(lang, 'skip')} ({skipsLeft})
          </button>
        </div>
      </div>

      {/* Timer bar */}
      {!isRevealing && (
        <div className="mb-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-3 rounded-sm overflow-hidden bg-vhs-dark border border-vhs-tape/30 relative">
              <div
                className={`h-full transition-none rounded-sm ${
                  isUrgent ? 'vhs-timer-urgent' : 'vhs-timer-bar'
                }`}
                style={{ width: `${fraction * 100}%` }}
              />
              {/* VHS tape reel marks */}
              <div className="absolute inset-0 flex justify-between px-px pointer-events-none">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="w-px h-full bg-black/30" />
                ))}
              </div>
            </div>
            <span className={`font-display text-sm w-5 text-right tabular-nums ${
              isUrgent ? 'text-red-400 animate-pulse' : 'text-vhs-label/60'
            }`}>
              {displaySeconds}
            </span>
          </div>
        </div>
      )}

      {/* Instruction */}
      <p className="font-body text-vhs-label/60 text-center text-base mb-2">
        {isRevealing ? '' : t(lang, 'chooseTape')}
      </p>

      {/* Main area */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        {isRevealing && revealedFilm ? (
          <TrackingReveal film={revealedFilm} isSharp={isSharpPick} lang={lang} />
        ) : (
          <div className="flex gap-3 sm:gap-4 w-full justify-center">
            {pair.map((film) => (
              <div key={film._index} className="flex-1 max-w-[170px]">
                <VHSCard
                  film={film}
                  onClick={handlePick}
                  disabled={isRevealing}
                  lang={lang}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shelf */}
      <div className="mt-3">
        <ShelfSlots shelf={shelf} totalSlots={5} label={t(lang, 'yourShelf')} lang={lang} />
      </div>
    </div>
  )
}
