import StarRating from './StarRating'
import { getFilmTitle, t } from '../i18n'

export default function ShelfSlots({ shelf, totalSlots = 5, label = 'Your Shelf', lang = 'en' }) {
  return (
    <div className="w-full">
      <p className="font-body text-vhs-neon-cyan text-base mb-1.5 text-center">{label}</p>
      <div className="flex gap-1.5 justify-center">
        {[...Array(totalSlots)].map((_, i) => {
          const hasEntry = i < shelf.length
          const film = shelf[i]
          const isTimeout = hasEntry && film === null
          const title = film ? getFilmTitle(film, lang) : ''
          return (
            <div
              key={i}
              className={`shelf-slot w-full aspect-[2/3] max-w-[62px] flex items-center justify-center overflow-hidden ${
                hasEntry && !isTimeout ? 'filled animate-shelf-slide' : ''
              } ${isTimeout ? 'shelf-slot-timeout' : ''}`}
            >
              {isTimeout ? (
                <div className="w-full h-full bg-vhs-dark/80 flex flex-col items-center justify-center border-2 border-dashed border-red-400/30 rounded-md">
                  <span className="font-body text-red-400/50 text-lg">✕</span>
                  <span className="font-body text-red-400/40 text-[7px] uppercase">{t(lang, 'timeout')}</span>
                </div>
              ) : film ? (
                <div className="relative w-full h-full">
                  {film.poster ? (
                    <img src={film.poster} alt={title} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-vhs-tape flex items-center justify-center p-1">
                      <span className="font-body text-vhs-label text-[8px] text-center leading-tight">{title}</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/75 px-1 py-0.5">
                    <StarRating rating={film.rating} size="sm" />
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <span className="font-body text-vhs-neon-blue/40 text-xl">{i + 1}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
