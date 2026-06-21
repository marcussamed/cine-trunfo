import { getFilmTitle, t } from '../i18n'

export default function VHSCard({ film, onClick, disabled = false, lang = 'en' }) {
  const handleClick = () => {
    if (!disabled && onClick) onClick(film)
  }

  const title = getFilmTitle(film, lang)

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`vhs-card w-full aspect-[2/3] relative group ${
        disabled ? 'opacity-60' : 'cursor-pointer'
      }`}
    >
      {film.poster ? (
        <img
          src={film.poster}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-vhs-tape flex items-center justify-center p-2">
          <span className="font-body text-vhs-label text-center text-base">{title}</span>
        </div>
      )}

      <div className="rental-sticker">{t(lang, 'rentMe')}</div>

      <div className="tape-label">
        <p className="font-body text-white leading-tight text-base">
          {title}
        </p>
        <p className="font-body text-vhs-neon-cyan text-sm">
          {film.year}
        </p>
      </div>

      {!disabled && (
        <div className="absolute inset-0 bg-vhs-neon-blue/0 group-active:bg-vhs-neon-blue/10 transition-colors" />
      )}
    </button>
  )
}
