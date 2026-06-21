import { useState, useEffect } from 'react'
import { Volume2, VolumeX, Home } from 'lucide-react'
import { useGame } from './useGame'
import { useStats } from './useStats'
import { useSfx } from './useSfx'
import { detectLang, saveLang, t } from './i18n'
import StartScreen from './components/StartScreen'
import PlayingScreen from './components/PlayingScreen'
import RivalRevealScreen from './components/RivalRevealScreen'
import ResultScreen from './components/ResultScreen'
import StatsModal from './components/StatsModal'

export default function App() {
  const game = useGame()
  const { stats, recordGame, hasPlayedDailyToday, refreshStats } = useStats()
  const { muted, toggleMute, sfx } = useSfx()
  const [showStats, setShowStats] = useState(false)
  const [resultRecorded, setResultRecorded] = useState(false)
  const [lang, setLang] = useState(detectLang)
  const [confirmLeave, setConfirmLeave] = useState(false)

  const changeLang = (l) => { setLang(l); saveLang(l) }

  useEffect(() => {
    if (game.phase === 'result' && !resultRecorded) {
      const won = game.winner === 'player'
      recordGame(game.mode, won, game.playerSum)
      setResultRecorded(true)
      if (won) sfx.win()
      else sfx.lose()
    }
    if (game.phase === 'start') setResultRecorded(false)
  }, [game.phase, game.winner, game.mode, game.playerSum, resultRecorded, recordGame, sfx])

  const handleStart = (mode) => {
    if (mode === 'daily' && hasPlayedDailyToday()) return
    game.startGame(mode)
  }

  const handleRestart = () => {
    setResultRecorded(false)
    if (game.mode === 'daily') {
      game.goToStart()
    } else {
      game.startGame('free')
    }
  }

  const handleHome = () => {
    const inGame = game.phase === 'playing' || game.phase === 'revealing' || game.phase === 'rival-reveal'
    if (inGame) {
      setConfirmLeave(true)
    } else {
      game.goToStart()
    }
  }

  const confirmHome = () => {
    setConfirmLeave(false)
    setResultRecorded(false)
    game.goToStart()
  }

  const isInGame = game.phase !== 'start'

  return (
    <div className="min-h-dvh w-full bg-[#050508] flex items-center justify-center">
      <div className="game-frame scanlines relative bg-vhs-black overflow-hidden">
        <div className="grain" />

        {/* Top bar — always visible */}
        <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-3 pt-3 pointer-events-none">
          {/* Home */}
          <button
            onClick={handleHome}
            className={`pointer-events-auto w-8 h-8 flex items-center justify-center rounded-full bg-vhs-dark/70 border border-vhs-tape/20 active:bg-vhs-tape/30 transition-all ${
              isInGame ? 'opacity-50 active:opacity-80' : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Home"
          >
            <Home size={15} className="text-vhs-label/70" />
          </button>

          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Language toggle */}
            <div className="flex items-center bg-vhs-dark/70 border border-vhs-tape/20 rounded-full overflow-hidden">
              <button
                onClick={() => changeLang('pt')}
                className={`px-2 py-1 font-body text-xs transition-colors ${
                  lang === 'pt' ? 'text-vhs-neon-cyan' : 'text-vhs-label/30 active:text-vhs-label/60'
                }`}
              >
                PT
              </button>
              <div className="w-px h-4 bg-vhs-tape/30" />
              <button
                onClick={() => changeLang('en')}
                className={`px-2 py-1 font-body text-xs transition-colors ${
                  lang === 'en' ? 'text-vhs-neon-cyan' : 'text-vhs-label/30 active:text-vhs-label/60'
                }`}
              >
                EN
              </button>
            </div>

            {/* Mute */}
            <button
              onClick={toggleMute}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-vhs-dark/70 border border-vhs-tape/20 active:bg-vhs-tape/30 transition-colors opacity-50 active:opacity-80"
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
              {muted
                ? <VolumeX size={14} className="text-vhs-label/70" />
                : <Volume2 size={14} className="text-vhs-label/70" />
              }
            </button>
          </div>
        </div>

        {/* Confirm leave dialog */}
        {confirmLeave && (
          <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center px-6">
            <div className="bg-vhs-dark border border-vhs-tape/40 rounded-xl p-5 text-center max-w-[260px]">
              <p className="font-body text-vhs-label text-lg mb-4">{t(lang, 'confirmLeave')}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={confirmHome}
                  className="font-body text-base px-5 py-2 border border-vhs-neon-magenta/50 text-vhs-neon-magenta rounded-lg active:bg-vhs-neon-magenta/20"
                >
                  {t(lang, 'yes')}
                </button>
                <button
                  onClick={() => setConfirmLeave(false)}
                  className="font-body text-base px-5 py-2 border border-vhs-neon-blue/50 text-vhs-neon-blue rounded-lg active:bg-vhs-neon-blue/20"
                >
                  {t(lang, 'no')}
                </button>
              </div>
            </div>
          </div>
        )}

        {showStats && (
          <StatsModal stats={stats} onClose={() => setShowStats(false)} lang={lang} />
        )}

        {game.phase === 'start' && (
          <StartScreen
            onStart={handleStart}
            hasPlayedDaily={hasPlayedDailyToday()}
            onShowStats={() => { refreshStats(); setShowStats(true) }}
            stats={stats}
            lang={lang}
          />
        )}

        {(game.phase === 'playing' || game.phase === 'revealing') && (
          <PlayingScreen
            round={game.round}
            totalRounds={game.TOTAL_ROUNDS}
            pair={game.pair}
            shelf={game.shelf}
            skipsLeft={game.skipsLeft}
            revealedFilm={game.revealedFilm}
            isSharpPick={game.isSharpPick}
            phase={game.phase}
            mode={game.mode}
            onPick={game.pickFilm}
            onSkip={game.skip}
            onTimeout={game.timeout}
            sfx={sfx}
            lang={lang}
          />
        )}

        {game.phase === 'rival-reveal' && (
          <RivalRevealScreen
            shelf={game.shelf}
            rivalShelf={game.rivalShelf}
            rivalRevealIndex={game.rivalRevealIndex}
            onAdvance={game.advanceRivalReveal}
            playerSum={game.playerSum}
            rivalSum={game.rivalSum}
            sfx={sfx}
            lang={lang}
          />
        )}

        {game.phase === 'result' && (
          <ResultScreen
            winner={game.winner}
            shelf={game.shelf}
            rivalShelf={game.rivalShelf}
            playerSum={game.playerSum}
            rivalSum={game.rivalSum}
            sharpPicks={game.sharpPicks}
            sharpCount={game.sharpCount}
            mode={game.mode}
            stats={stats}
            onRestart={handleRestart}
            onGoHome={game.goToStart}
            sfx={sfx}
            lang={lang}
          />
        )}
      </div>
    </div>
  )
}
