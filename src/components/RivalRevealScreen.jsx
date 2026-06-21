import { useState, useEffect } from 'react'
import StarRating from './StarRating'
import { t, getFilmTitle } from '../i18n'

export default function RivalRevealScreen({
  shelf,
  rivalShelf,
  rivalRevealIndex,
  onAdvance,
  playerSum,
  sfx,
  lang,
}) {
  const [autoAdvance, setAutoAdvance] = useState(true)
  const revealedRivalFilms = rivalShelf.slice(0, rivalRevealIndex + 1)
  const rivalPartialSum = revealedRivalFilms.reduce((s, f) => s + f.rating, 0)

  useEffect(() => {
    sfx.rivalReveal()
  }, [rivalRevealIndex])

  useEffect(() => {
    if (!autoAdvance) return
    const timer = setTimeout(onAdvance, 1400)
    return () => clearTimeout(timer)
  }, [rivalRevealIndex, autoAdvance, onAdvance])

  const currentFilm = rivalShelf[rivalRevealIndex]
  const currentTitle = currentFilm ? getFilmTitle(currentFilm, lang) : ''

  return (
    <div className="h-full flex flex-col px-4 pt-12 pb-4">
      <h2 className="font-display text-xs text-center text-vhs-neon-magenta neon-magenta mb-1">
        {t(lang, 'rivalStore')}
      </h2>
      <p className="font-body text-vhs-label/50 text-center text-base mb-3">
        {t(lang, 'stockingTape')} {rivalRevealIndex + 1} {t(lang, 'of')} 5...
      </p>

      {currentFilm && (
        <div className="flex justify-center mb-4" key={rivalRevealIndex}>
          <div className="flex flex-col items-center animate-vhs-in">
            <div className="vhs-card w-24 sm:w-28 aspect-[2/3] relative overflow-hidden">
              {currentFilm.poster ? (
                <img src={currentFilm.poster} alt={currentTitle} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-vhs-tape flex items-center justify-center p-2">
                  <span className="font-body text-vhs-label text-xs text-center">{currentTitle}</span>
                </div>
              )}
              <div className="absolute top-1.5 right-1.5 bg-vhs-neon-magenta text-white font-body text-[10px] px-1.5 py-0.5 rounded-sm">
                {t(lang, 'rival')}
              </div>
              <div className="tape-label">
                <p className="font-body text-white text-sm leading-tight">{currentTitle}</p>
                <p className="font-body text-vhs-neon-cyan text-xs">{currentFilm.year}</p>
              </div>
            </div>
            <div className="mt-2">
              <StarRating rating={currentFilm.rating} size="md" animate />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center min-h-0">
        <div className="bg-vhs-dark/50 border border-vhs-tape/20 rounded-xl p-3">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="font-body text-vhs-neon-cyan text-xs uppercase tracking-wider">{t(lang, 'yourStore')}</p>
              <p className="font-display text-lg text-white">{playerSum.toFixed(2)}</p>
            </div>
            <span className="font-display text-[10px] text-vhs-label/30">{t(lang, 'vs')}</span>
            <div className="text-right">
              <p className="font-body text-vhs-neon-magenta text-xs uppercase tracking-wider">{t(lang, 'rivalStore')}</p>
              <p className="font-display text-lg text-white">{rivalPartialSum.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex gap-1 justify-center">
            {[...Array(5)].map((_, i) => {
              const film = revealedRivalFilms[i]
              return (
                <div
                  key={i}
                  className={`w-11 aspect-[2/3] rounded overflow-hidden border ${
                    film ? 'border-vhs-neon-magenta/40' : 'border-vhs-tape/20 border-dashed'
                  }`}
                >
                  {film ? (
                    <div className="relative w-full h-full">
                      {film.poster ? (
                        <img src={film.poster} alt={getFilmTitle(film, lang)} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-vhs-tape" />
                      )}
                      <div className="absolute bottom-0 inset-x-0 bg-black/80 flex justify-center py-px">
                        <span className="font-body text-vhs-neon-yellow text-[9px]">{film.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-body text-vhs-tape/40 text-xs">?</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <button
        onClick={() => { setAutoAdvance(false); onAdvance() }}
        className="font-body text-xs text-vhs-label/30 text-center mt-3 active:text-vhs-label/60 py-2"
      >
        {t(lang, 'tapToSkip')}
      </button>
    </div>
  )
}
