import { useState, useCallback, useRef } from 'react'
import allFilms from './films.json'
import { mulberry32, dateToSeed, seededShuffle, getTodayStr } from './seed'

const TOTAL_ROUNDS = 5
const MAX_SKIPS = 2

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generateDailyPairs() {
  const today = getTodayStr()
  const seed = dateToSeed('cine-trunfo-' + today)
  const rng = mulberry32(seed)
  const indexed = allFilms.map((f, i) => ({ ...f, _index: i }))
  const shuffled = seededShuffle(indexed, rng)
  const pairs = []
  for (let i = 0; i < TOTAL_ROUNDS; i++) {
    pairs.push([shuffled[i * 2], shuffled[i * 2 + 1]])
  }
  const rivalPool = shuffled.slice(TOTAL_ROUNDS * 2, TOTAL_ROUNDS * 2 + 5)
  return { pairs, rivalPool }
}

export function useGame() {
  const [phase, setPhase] = useState('start')
  const [mode, setMode] = useState(null)
  const [round, setRound] = useState(0)
  const [pair, setPair] = useState([])
  const [shelf, setShelf] = useState([])
  const [rivalShelf, setRivalShelf] = useState([])
  const [skipsLeft, setSkipsLeft] = useState(MAX_SKIPS)
  const [revealedFilm, setRevealedFilm] = useState(null)
  const [isSharpPick, setIsSharpPick] = useState(false)
  const [sharpPicks, setSharpPicks] = useState([])
  const [rivalRevealIndex, setRivalRevealIndex] = useState(-1)
  const [winner, setWinner] = useState(null)
  const usedIndices = useRef(new Set())
  const dailyData = useRef(null)

  const startGame = useCallback((gameMode) => {
    usedIndices.current = new Set()
    setShelf([])
    setRivalShelf([])
    setRound(0)
    setSkipsLeft(MAX_SKIPS)
    setRevealedFilm(null)
    setIsSharpPick(false)
    setSharpPicks([])
    setRivalRevealIndex(-1)
    setWinner(null)
    setMode(gameMode)
    setPhase('playing')

    if (gameMode === 'daily') {
      const data = generateDailyPairs()
      dailyData.current = data
      setPair(data.pairs[0])
      data.pairs[0].forEach(f => usedIndices.current.add(f._index))
    } else {
      dailyData.current = null
      const available = allFilms.map((f, i) => ({ ...f, _index: i }))
      const shuffled = shuffle(available)
      setPair(shuffled.slice(0, 2))
    }
  }, [])

  const drawNextPair = useCallback((currentRound) => {
    if (mode === 'daily') {
      const nextPair = dailyData.current.pairs[currentRound]
      setPair(nextPair)
    } else {
      const available = allFilms
        .map((f, i) => ({ ...f, _index: i }))
        .filter((_, i) => !usedIndices.current.has(i))
      const shuffled = shuffle(available)
      setPair(shuffled.slice(0, 2))
    }
  }, [mode])

  const pickFilm = useCallback((film) => {
    usedIndices.current.add(pair[0]._index)
    usedIndices.current.add(pair[1]._index)

    const other = pair.find(f => f._index !== film._index)
    const sharp = film.rating >= other.rating

    setRevealedFilm(film)
    setIsSharpPick(sharp)
    setPhase('revealing')

    setTimeout(() => {
      const newShelf = [...shelf, film]
      setShelf(newShelf)
      const newSharpPicks = [...sharpPicks, sharp ? 'sharp' : 'miss']
      setSharpPicks(newSharpPicks)
      const newRound = round + 1

      if (newRound >= TOTAL_ROUNDS) {
        let rivalPicks
        if (mode === 'daily') {
          rivalPicks = dailyData.current.rivalPool
        } else {
          const available = allFilms
            .map((f, i) => ({ ...f, _index: i }))
            .filter((_, i) => !usedIndices.current.has(i))
          rivalPicks = shuffle(available).slice(0, 5)
        }
        rivalPicks.forEach(f => usedIndices.current.add(f._index))
        setRivalShelf(rivalPicks)
        setRound(newRound)
        setRevealedFilm(null)
        setIsSharpPick(false)
        setPhase('rival-reveal')
        setRivalRevealIndex(0)
      } else {
        setRound(newRound)
        setRevealedFilm(null)
        setIsSharpPick(false)
        setPhase('playing')
        drawNextPair(newRound)
      }
    }, 2200)
  }, [pair, shelf, round, sharpPicks, mode, drawNextPair])

  const skip = useCallback(() => {
    if (skipsLeft <= 0) return
    usedIndices.current.add(pair[0]._index)
    usedIndices.current.add(pair[1]._index)
    setSkipsLeft(s => s - 1)

    if (mode === 'daily') {
      const available = allFilms
        .map((f, i) => ({ ...f, _index: i }))
        .filter((_, i) => !usedIndices.current.has(i))
      const shuffled = shuffle(available)
      setPair(shuffled.slice(0, 2))
    } else {
      const available = allFilms
        .map((f, i) => ({ ...f, _index: i }))
        .filter((_, i) => !usedIndices.current.has(i))
      const shuffled = shuffle(available)
      setPair(shuffled.slice(0, 2))
    }
  }, [pair, skipsLeft, mode])

  const timeout = useCallback(() => {
    usedIndices.current.add(pair[0]._index)
    usedIndices.current.add(pair[1]._index)

    const newShelf = [...shelf, null]
    setShelf(newShelf)
    setSharpPicks(prev => [...prev, 'timeout'])
    const newRound = round + 1

    if (newRound >= TOTAL_ROUNDS) {
      let rivalPicks
      if (mode === 'daily') {
        rivalPicks = dailyData.current.rivalPool
      } else {
        const available = allFilms
          .map((f, i) => ({ ...f, _index: i }))
          .filter((_, i) => !usedIndices.current.has(i))
        rivalPicks = shuffle(available).slice(0, 5)
      }
      rivalPicks.forEach(f => usedIndices.current.add(f._index))
      setRivalShelf(rivalPicks)
      setRound(newRound)
      setRevealedFilm(null)
      setIsSharpPick(false)
      setPhase('rival-reveal')
      setRivalRevealIndex(0)
    } else {
      setRound(newRound)
      setRevealedFilm(null)
      setIsSharpPick(false)
      setPhase('playing')
      drawNextPair(newRound)
    }
  }, [pair, shelf, round, mode, drawNextPair])

  const advanceRivalReveal = useCallback(() => {
    const next = rivalRevealIndex + 1
    if (next >= 5) {
      const playerSumVal = shelf.reduce((s, f) => s + (f?.rating || 0), 0)
      const rivalSumVal = rivalShelf.reduce((s, f) => s + f.rating, 0)
      setWinner(playerSumVal >= rivalSumVal ? 'player' : 'rival')
      setPhase('result')
    } else {
      setRivalRevealIndex(next)
    }
  }, [rivalRevealIndex, shelf, rivalShelf])

  const goToStart = useCallback(() => {
    setPhase('start')
    setMode(null)
  }, [])

  const playerSum = shelf.reduce((s, f) => s + (f?.rating || 0), 0)
  const rivalSum = rivalShelf.reduce((s, f) => s + f.rating, 0)
  const sharpCount = sharpPicks.filter(p => p === 'sharp').length

  return {
    phase,
    mode,
    round,
    pair,
    shelf,
    rivalShelf,
    skipsLeft,
    revealedFilm,
    isSharpPick,
    sharpPicks,
    sharpCount,
    rivalRevealIndex,
    winner,
    playerSum,
    rivalSum,
    startGame,
    pickFilm,
    skip,
    timeout,
    advanceRivalReveal,
    goToStart,
    TOTAL_ROUNDS,
    MAX_SKIPS,
  }
}
