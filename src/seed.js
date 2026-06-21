const TZ = 'America/Sao_Paulo'

function toBrasiliaDate(date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
  return parts
}

export function mulberry32(seed) {
  let t = seed | 0
  return function () {
    t = (t + 0x6d2b79f5) | 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

export function dateToSeed(dateStr) {
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash + dateStr.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

export function seededShuffle(arr, rng) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function getTodayStr() {
  return toBrasiliaDate(new Date())
}

export function getDailyNumber(epochStr) {
  const todayStr = toBrasiliaDate(new Date())
  const today = new Date(todayStr + 'T00:00:00')
  const epoch = new Date(epochStr + 'T00:00:00')
  return Math.floor((today - epoch) / 86400000) + 1
}
