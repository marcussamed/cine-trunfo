import { useState, useEffect, useMemo } from 'react'
import StarRating from './StarRating'
import { t, getFilmTitle } from '../i18n'

export default function TrackingReveal({ film, isSharp, lang = 'en' }) {
  const [step, setStep] = useState(0)
  const title = getFilmTitle(film, lang)

  const trackingLines = useMemo(() =>
    [...Array(8)].map((_, i) => ({
      height: `${2 + Math.random() * 4}px`,
      top: `${5 + i * 12 + Math.random() * 4}%`,
      duration: `${0.3 + Math.random() * 0.5}s`,
      delay: `${i * 60}ms`,
    })), [])

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 200),
      setTimeout(() => setStep(2), 800),
      setTimeout(() => setStep(3), 1300),
      setTimeout(() => setStep(4), 1700),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="relative flex flex-col items-center">
      {step < 3 && (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {trackingLines.map((line, i) => (
            <div
              key={i}
              className="absolute w-full bg-white/15"
              style={{
                height: line.height,
                top: line.top,
                animation: `trackingLine ${line.duration} ease-out forwards`,
                animationDelay: line.delay,
              }}
            />
          ))}
        </div>
      )}

      <div
        className={`w-24 sm:w-28 aspect-[2/3] rounded-lg overflow-hidden border-2 transition-all duration-700 ${
          step >= 2
            ? isSharp
              ? 'border-green-400 shadow-[0_0_25px_rgba(0,255,136,0.4)]'
              : 'border-vhs-neon-yellow shadow-[0_0_20px_rgba(255,225,86,0.3)]'
            : 'border-vhs-neon-blue/40'
        }`}
      >
        {film.poster ? (
          <img src={film.poster} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-vhs-tape flex items-center justify-center p-1">
            <span className="font-body text-vhs-label text-[10px] text-center">{title}</span>
          </div>
        )}
      </div>

      {step >= 1 && step < 3 && (
        <div className="mt-3 h-10 flex items-center">
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-vhs-neon-blue/60 animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        </div>
      )}

      {step >= 3 && (
        <div className="mt-3">
          <div className="bg-vhs-dark/90 border border-vhs-neon-yellow/30 rounded-lg px-4 py-2 animate-vhs-in">
            <StarRating rating={film.rating} size="lg" animate />
          </div>
        </div>
      )}

      {step >= 4 && isSharp && (
        <div className="mt-2 animate-star-pop">
          <span className="font-body text-green-400 text-sm bg-green-400/10 border border-green-400/30 rounded-full px-3 py-1">
            {t(lang, 'sharpPick')}
          </span>
        </div>
      )}

      {step >= 4 && !isSharp && (
        <p className="font-body text-vhs-neon-cyan text-xs mt-2 animate-tracking">
          {t(lang, 'addedToShelf')}
        </p>
      )}
    </div>
  )
}
