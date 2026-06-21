import { forwardRef } from 'react'
import { theme } from '../theme'
import { getDailyNumber } from '../seed'
import { t } from '../i18n'

const DailyShareCard = forwardRef(function DailyShareCard(
  { winner, playerSum, rivalSum, sharpPicks, sharpCount, streak, lang },
  ref,
) {
  const isWin = winner === 'player'
  const dailyNum = getDailyNumber(theme.dailyEpoch)

  const pickColors = {
    sharp: { bg: 'rgba(0,255,136,0.15)', border: 'rgba(0,255,136,0.5)' },
    miss: { bg: 'rgba(255,225,86,0.15)', border: 'rgba(255,225,86,0.5)' },
    timeout: { bg: 'rgba(255,68,68,0.1)', border: 'rgba(255,68,68,0.35)' },
  }
  const pickEmoji = { sharp: '🟩', miss: '🟨', timeout: '⬛' }

  return (
    <div
      ref={ref}
      style={{
        width: 1080,
        height: 1920,
        background: 'linear-gradient(180deg, #12121a 0%, #0a0a0c 50%, #12121a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"VT323", monospace',
        color: 'white',
        padding: '100px 80px',
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
      }}
    >
      <img
        src={theme.logo.url}
        alt="DDL"
        crossOrigin="anonymous"
        style={{ width: 180, height: 180, marginBottom: 40 }}
      />

      <div style={{
        fontFamily: '"Press Start 2P", monospace',
        fontSize: 44,
        color: '#00d4ff',
        textShadow: '0 0 20px rgba(0,212,255,0.5)',
        marginBottom: 12,
      }}>
        CINE TRUNFO
      </div>

      <div style={{
        fontFamily: '"Press Start 2P", monospace',
        fontSize: 26,
        color: '#ffe156',
        marginBottom: 56,
      }}>
        {t(lang, 'daily')} #{dailyNum}
      </div>

      <div style={{
        fontFamily: '"Press Start 2P", monospace',
        fontSize: 52,
        color: isWin ? '#00ff88' : '#ff4466',
        textShadow: isWin
          ? '0 0 30px rgba(0,255,136,0.5)'
          : '0 0 30px rgba(255,68,102,0.5)',
        marginBottom: 56,
      }}>
        {isWin ? t(lang, 'youWin') : t(lang, 'rivalWins')}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 56, marginBottom: 64 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 26, color: '#00fff5', marginBottom: 8 }}>
            {t(lang, 'myStore').toUpperCase()}
          </div>
          <div style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 60,
            color: isWin ? '#00ff88' : 'white',
          }}>
            {playerSum.toFixed(2)}
          </div>
        </div>
        <div style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 22,
          color: 'rgba(232,224,208,0.3)',
        }}>
          VS
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 26, color: '#ff00aa', marginBottom: 8 }}>RIVAL</div>
          <div style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 60,
            color: !isWin ? '#ff4466' : 'white',
          }}>
            {rivalSum.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Sharp picks grid — uniform squares */}
      <div style={{
        display: 'flex',
        gap: 14,
        justifyContent: 'center',
        marginBottom: 20,
      }}>
        {sharpPicks.map((pick, i) => (
          <div
            key={i}
            style={{
              width: 72,
              height: 72,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              background: pickColors[pick].bg,
              border: `2px solid ${pickColors[pick].border}`,
            }}
          >
            {pickEmoji[pick]}
          </div>
        ))}
      </div>

      <div style={{ fontSize: 30, color: '#00fff5', marginBottom: 56 }}>
        {t(lang, 'sharpPicks')}: {sharpCount}/5
      </div>

      {streak > 0 && (
        <div style={{ fontSize: 26, color: '#ffe156', marginBottom: 56 }}>
          🔥 {t(lang, 'streak')}: {streak} {streak > 1 ? t(lang, 'days') : t(lang, 'day')}
        </div>
      )}

      <div style={{
        fontSize: 32,
        color: '#00d4ff',
        textShadow: '0 0 10px rgba(0,212,255,0.3)',
        marginBottom: 28,
        textAlign: 'center',
      }}>
        {t(lang, 'canYouBeat')}
      </div>

      <div style={{ fontSize: 26, color: 'rgba(0,212,255,0.6)' }}>
        {theme.instagram.handle}
      </div>
    </div>
  )
})

export default DailyShareCard
