import { useState, useCallback } from 'react'
import { getTodayStr } from './seed'

const STORAGE_KEY = 'cine-trunfo-stats'

function loadStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultStats()
    return { ...defaultStats(), ...JSON.parse(raw) }
  } catch {
    return defaultStats()
  }
}

function defaultStats() {
  return {
    totalGames: 0,
    wins: 0,
    bestScore: 0,
    currentStreak: 0,
    bestStreak: 0,
    lastDailyDate: null,
    lastDailyPlayed: false,
  }
}

function saveStats(stats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
}

export function useStats() {
  const [stats, setStats] = useState(loadStats)

  const hasPlayedDailyToday = useCallback(() => {
    const s = loadStats()
    return s.lastDailyDate === getTodayStr() && s.lastDailyPlayed
  }, [])

  const recordGame = useCallback((mode, won, score) => {
    setStats(prev => {
      const next = { ...prev }
      next.totalGames++
      if (won) next.wins++
      if (score > next.bestScore) next.bestScore = score

      if (mode === 'daily') {
        const today = getTodayStr()
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`

        if (prev.lastDailyDate === yesterdayStr) {
          next.currentStreak = prev.currentStreak + 1
        } else if (prev.lastDailyDate !== today) {
          next.currentStreak = 1
        }
        if (next.currentStreak > next.bestStreak) {
          next.bestStreak = next.currentStreak
        }
        next.lastDailyDate = today
        next.lastDailyPlayed = true
      }

      saveStats(next)
      return next
    })
  }, [])

  const refreshStats = useCallback(() => {
    setStats(loadStats())
  }, [])

  return { stats, recordGame, hasPlayedDailyToday, refreshStats }
}
