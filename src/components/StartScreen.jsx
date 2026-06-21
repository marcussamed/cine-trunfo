import { theme } from '../theme'
import { getDailyNumber } from '../seed'
import { t } from '../i18n'

export default function StartScreen({ onStart, hasPlayedDaily, onShowStats, lang }) {
  const dailyNum = getDailyNumber(theme.dailyEpoch)

  return (
    <div className="h-full flex flex-col items-center justify-center px-6 text-center pt-12">
      <a
        href={theme.instagram.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={theme.logo.url}
          alt="Donos da Locadora"
          className="w-24 h-24 mb-3 opacity-90 active:opacity-100 transition-opacity"
        />
      </a>

      <h1 className="font-display text-xl sm:text-2xl text-white mb-2 neon-text leading-relaxed">
        {t(lang, 'title')}
      </h1>
      <p className="font-body text-vhs-neon-cyan text-lg sm:text-xl mb-1">
        {t(lang, 'subtitle')}
      </p>
      <p className="font-body text-vhs-label/60 text-sm sm:text-base mb-6 max-w-[280px]">
        {t(lang, 'tagline')}
      </p>

      <div className="flex flex-col gap-3 w-full max-w-[260px] mb-6">
        <button
          onClick={() => onStart('daily')}
          disabled={hasPlayedDaily}
          className={`font-body text-lg px-6 py-3 rounded-lg border-2 transition-all ${
            hasPlayedDaily
              ? 'border-vhs-tape/30 text-vhs-tape/50 cursor-not-allowed'
              : 'border-vhs-neon-yellow bg-vhs-neon-yellow/10 text-vhs-neon-yellow active:bg-vhs-neon-yellow/30 active:scale-95 animate-neon-pulse'
          }`}
        >
          {hasPlayedDaily
            ? `${t(lang, 'daily')} #${dailyNum} ${t(lang, 'dailyPlayed')} ✓`
            : `${t(lang, 'daily')} #${dailyNum}`
          }
        </button>

        {hasPlayedDaily && (
          <p className="font-body text-vhs-label/40 text-xs -mt-1">
            {t(lang, 'nextChallenge')}
          </p>
        )}

        <button
          onClick={() => onStart('free')}
          className="font-body text-lg px-6 py-3 bg-vhs-neon-blue/15 border-2 border-vhs-neon-blue/60 text-vhs-neon-blue rounded-lg active:bg-vhs-neon-blue/30 active:scale-95 transition-all"
        >
          {t(lang, 'freePlay')}
        </button>
      </div>

      <button
        onClick={onShowStats}
        className="font-body text-sm text-vhs-label/50 active:text-vhs-label/80 transition-colors mb-6"
      >
        {t(lang, 'yourStats')}
      </button>

      <div className="mt-auto pb-3 flex flex-col items-center gap-2">
        <a
          href={theme.instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2 rounded-lg border border-vhs-neon-magenta/40 bg-vhs-neon-magenta/10 active:bg-vhs-neon-magenta/25 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-vhs-neon-magenta">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
          </svg>
          <span className="font-body text-vhs-neon-magenta text-base neon-magenta">
            {t(lang, 'followUs')}
          </span>
        </a>
        <p className="font-body text-vhs-label/25 text-[10px]">{theme.tmdbAttribution}</p>
      </div>
    </div>
  )
}
