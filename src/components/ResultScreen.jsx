import { useRef, useState, useCallback } from 'react'
import html2canvas from 'html2canvas'
import { theme } from '../theme'
import { getDailyNumber } from '../seed'
import { t, getFilmTitle } from '../i18n'
import StarRating from './StarRating'
import DailyShareCard from './DailyShareCard'

function MiniShelf({ films, label, accentColor, lang }) {
  return (
    <div>
      <p className={`font-body text-xs mb-1 text-center ${accentColor}`}>{label}</p>
      <div className="flex gap-1 justify-center">
        {films.map((film, i) => (
          <div
            key={i}
            className={`w-[54px] aspect-[2/3] rounded overflow-hidden border relative ${
              film === null ? 'border-red-400/30 border-dashed' : 'border-white/10'
            }`}
          >
            {film === null ? (
              <div className="w-full h-full bg-vhs-dark/80 flex flex-col items-center justify-center">
                <span className="text-red-400/50 text-sm">✕</span>
                <span className="font-body text-red-400/40 text-[6px] uppercase">{t(lang, 'timeout')}</span>
              </div>
            ) : film.poster ? (
              <img src={film.poster} alt={getFilmTitle(film, lang)} className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <div className="w-full h-full bg-vhs-tape flex items-center justify-center p-0.5">
                <span className="font-body text-vhs-label text-[7px] text-center leading-tight">{getFilmTitle(film, lang)}</span>
              </div>
            )}
            {film && film !== null && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 px-0.5 py-0.5 flex justify-center">
                <span className="font-body text-vhs-neon-yellow text-[10px] font-bold">{film.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ResultScreen({
  winner,
  shelf,
  rivalShelf,
  playerSum,
  rivalSum,
  sharpPicks,
  sharpCount,
  mode,
  stats,
  onRestart,
  onGoHome,
  sfx,
  lang,
}) {
  const isWin = winner === 'player'
  const isDaily = mode === 'daily'
  const shareRef = useRef(null)
  const [sharing, setSharing] = useState(false)
  const dailyNum = getDailyNumber(theme.dailyEpoch)

  const gridEmoji = sharpPicks.map(p =>
    p === 'sharp' ? '🟩' : p === 'miss' ? '🟨' : '⬛'
  ).join('')

  const shareText = isDaily
    ? `CINE TRUNFO 🎬 ${t(lang, 'daily')} #${dailyNum} — ${t(lang, 'myStore')} ${playerSum.toFixed(2)} vs Rival ${rivalSum.toFixed(2)} — ${gridEmoji} ${sharpCount}/5 — ${t(lang, 'streak')}: ${stats.currentStreak}`
    : `CINE TRUNFO 🎬 ${t(lang, 'myStore')} ${playerSum.toFixed(2)} vs Rival ${rivalSum.toFixed(2)} — ${gridEmoji} ${sharpCount}/5`

  const handleShareImage = useCallback(async () => {
    if (!shareRef.current || sharing) return
    setSharing(true)
    try {
      const imgs = shareRef.current.querySelectorAll('img')
      await Promise.all([...imgs].map(img => img.decode().catch(() => {})))
      const canvas = await html2canvas(shareRef.current, {
        width: 1080,
        height: 1920,
        scale: 1,
        useCORS: true,
        backgroundColor: '#0a0a0c',
      })
      canvas.toBlob(async (blob) => {
        if (!blob) { setSharing(false); return }
        const file = new File([blob], `cine-trunfo-daily-${dailyNum}.png`, { type: 'image/png' })

        if (navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({ files: [file], text: shareText })
          } catch {}
        } else {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = file.name
          a.click()
          URL.revokeObjectURL(url)
        }
        setSharing(false)
      }, 'image/png')
    } catch {
      setSharing(false)
    }
  }, [sharing, shareText, dailyNum])

  const handleCopyResult = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText)
    } catch {}
  }, [shareText])

  return (
    <div className="h-full overflow-y-auto pt-12 pb-4 px-4">
      {/* Hidden share card */}
      {isDaily && (
        <DailyShareCard
          ref={shareRef}
          winner={winner}
          playerSum={playerSum}
          rivalSum={rivalSum}
          sharpPicks={sharpPicks}
          sharpCount={sharpCount}
          streak={stats.currentStreak}
          lang={lang}
        />
      )}

      {/* Main result card */}
      <div className="bg-gradient-to-b from-vhs-dark to-vhs-black border border-vhs-tape/40 rounded-2xl p-4 mb-4">
        {/* Logo & title */}
        <div className="flex flex-col items-center mb-3">
          <a href={theme.instagram.url} target="_blank" rel="noopener noreferrer">
            <img src={theme.logo.url} alt="DDL" className="w-12 h-12 mb-1 opacity-90 active:opacity-100 transition-opacity" />
          </a>
          <h1 className="font-display text-[9px] text-vhs-neon-cyan tracking-wider neon-text">
            {t(lang, 'title')}
          </h1>
          {isDaily && (
            <span className="font-body text-vhs-neon-yellow text-xs mt-1">
              {t(lang, 'daily')} #{dailyNum}
            </span>
          )}
        </div>

        {/* Winner */}
        <div className="text-center mb-3">
          <h2
            className={`font-display text-lg mb-0.5 ${isWin ? 'text-green-400' : 'text-red-400'}`}
            style={{
              textShadow: isWin
                ? '0 0 20px rgba(0,255,136,0.5)'
                : '0 0 20px rgba(255,68,102,0.5)',
            }}
          >
            {isWin ? t(lang, 'youWin') : t(lang, 'rivalWins')}
          </h2>
          <p className="font-body text-vhs-label/60 text-xs">
            {isWin ? t(lang, 'shelfStacked') : t(lang, 'rivalLucky')}
          </p>
        </div>

        {/* Scores */}
        <div className="flex justify-center items-end gap-5 mb-3">
          <div className="text-center">
            <p className="font-body text-vhs-neon-cyan text-[10px] uppercase tracking-wider">{t(lang, 'yourStore')}</p>
            <p className={`font-display text-2xl ${isWin ? 'text-green-400' : 'text-white/80'}`}>
              {playerSum.toFixed(2)}
            </p>
          </div>
          <span className="font-display text-[10px] text-vhs-label/30 mb-1">{t(lang, 'vs')}</span>
          <div className="text-center">
            <p className="font-body text-vhs-neon-magenta text-[10px] uppercase tracking-wider">{t(lang, 'rivalStore')}</p>
            <p className={`font-display text-2xl ${!isWin ? 'text-red-400' : 'text-white/80'}`}>
              {rivalSum.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Sharp picks grid */}
        <div className="flex justify-center gap-1.5 mb-1">
          {sharpPicks.map((pick, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-md flex items-center justify-center text-sm border ${
                pick === 'sharp'
                  ? 'bg-green-400/20 border-green-400/40'
                  : pick === 'miss'
                  ? 'bg-vhs-neon-yellow/20 border-vhs-neon-yellow/40'
                  : 'bg-red-400/10 border-red-400/30 border-dashed'
              }`}
            >
              {pick === 'sharp' ? '🟩' : pick === 'miss' ? '🟨' : '⬛'}
            </div>
          ))}
        </div>
        <p className="font-body text-vhs-label/60 text-xs text-center mb-3">
          {t(lang, 'sharpPicks')}: {sharpCount}/5
        </p>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-vhs-tape/30 to-transparent mb-3" />

        {/* Shelves */}
        <div className="space-y-3 mb-3">
          <MiniShelf films={shelf} label={t(lang, 'yourShelfLabel')} accentColor="text-vhs-neon-cyan" lang={lang} />
          <MiniShelf films={rivalShelf} label={t(lang, 'rivalShelfLabel')} accentColor="text-vhs-neon-magenta" lang={lang} />
        </div>

        {/* Streak */}
        {isDaily && stats.currentStreak > 0 && (
          <p className="font-body text-vhs-neon-yellow text-sm text-center">
            🔥 {t(lang, 'streak')}: {stats.currentStreak} {stats.currentStreak > 1 ? t(lang, 'days') : t(lang, 'day')}
          </p>
        )}
      </div>

      {/* Action buttons — below the card, no overlap */}
      <div className="flex flex-col items-center gap-2.5">
        {isDaily && (
          <>
            <button
              onClick={handleShareImage}
              disabled={sharing}
              className="font-body text-base px-6 py-2.5 bg-vhs-neon-magenta/20 border-2 border-vhs-neon-magenta text-vhs-neon-magenta rounded-lg active:bg-vhs-neon-magenta/40 active:scale-95 transition-all w-full max-w-[260px]"
            >
              {sharing ? t(lang, 'generating') : t(lang, 'shareStory')}
            </button>
            <button
              onClick={handleCopyResult}
              className="font-body text-sm text-vhs-label/50 active:text-vhs-label/80 py-1"
            >
              {t(lang, 'copyResult')}
            </button>
          </>
        )}

        {!isDaily && (
          <p className="font-body text-vhs-label/40 text-xs">
            {t(lang, 'screenshotShare')}
          </p>
        )}

        <button
          onClick={() => { sfx.rewind(); onRestart() }}
          className="font-body text-lg px-6 py-2.5 bg-vhs-neon-blue/15 border-2 border-vhs-neon-blue/60 text-vhs-neon-blue rounded-lg active:bg-vhs-neon-blue/30 active:scale-95 transition-all"
        >
          {t(lang, 'rewind')}
        </button>

        <button
          onClick={onGoHome}
          className="font-body text-sm text-vhs-label/40 active:text-vhs-label/70 py-1"
        >
          {t(lang, 'backToMenu')}
        </button>

        {/* Instagram CTA */}
        <a
          href={theme.instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 mt-1 px-4 py-2 rounded-lg border border-vhs-neon-magenta/30 bg-vhs-neon-magenta/8 active:bg-vhs-neon-magenta/20 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-vhs-neon-magenta">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
          </svg>
          <span className="font-body text-vhs-neon-magenta text-sm neon-magenta">
            {t(lang, 'followUs')}
          </span>
        </a>

        <p className="font-body text-vhs-label/20 text-[10px] pb-2">{theme.tmdbAttribution}</p>
      </div>
    </div>
  )
}
