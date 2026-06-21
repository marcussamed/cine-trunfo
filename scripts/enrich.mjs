import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const envContent = readFileSync(resolve(root, '.env'), 'utf-8')
const apiKey = envContent.match(/TMDB_API_KEY=(.+)/)?.[1]?.trim()
if (!apiKey) {
  console.error('TMDB_API_KEY not found in .env')
  process.exit(1)
}

const csv = readFileSync(resolve(root, 'notas_letterboxd.csv'), 'utf-8')
const lines = csv.trim().split('\n').slice(1)

const films = []

function parseLine(line) {
  const parts = []
  let current = ''
  let inQuotes = false
  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      parts.push(current)
      current = ''
    } else {
      current += char
    }
  }
  parts.push(current)
  return parts
}

for (const line of lines) {
  const parts = parseLine(line)
  const titulo = parts[1]
  const rating = parseFloat(parts[3])
  const yearMatch = titulo.match(/\((\d{4})\)/)
  const year = yearMatch ? parseInt(yearMatch[1]) : null
  const title = titulo.replace(/\s*\(\d{4}\)\s*$/, '')
  films.push({ title, year, rating, slug: parts[2] })
}

console.log(`Found ${films.length} films. Fetching posters + pt-BR titles from TMDB...`)

const delay = ms => new Promise(r => setTimeout(r, ms))

async function fetchFilmData(film) {
  const query = encodeURIComponent(film.title)
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}${film.year ? `&year=${film.year}` : ''}&language=en-US`

  const res = await fetch(url)
  const data = await res.json()

  let poster = null
  let tmdbId = null

  if (data.results && data.results.length > 0) {
    const match = data.results.find(r => r.release_date?.startsWith(String(film.year))) || data.results[0]
    tmdbId = match.id
    if (match.poster_path) {
      poster = `https://image.tmdb.org/t/p/w500${match.poster_path}`
    }
  }

  let titlePt = film.title
  if (tmdbId) {
    await delay(100)
    const ptUrl = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${apiKey}&language=pt-BR`
    const ptRes = await fetch(ptUrl)
    const ptData = await ptRes.json()
    if (ptData.title) {
      titlePt = ptData.title
    }
  }

  return { poster, titlePt }
}

const enriched = []

for (let i = 0; i < films.length; i++) {
  const film = films[i]
  const { poster, titlePt } = await fetchFilmData(film)
  enriched.push({
    title: film.title,
    titlePt,
    year: film.year,
    rating: film.rating,
    poster: poster || '',
  })
  const status = poster ? 'OK' : 'MISSING'
  console.log(`[${i + 1}/${films.length}] ${status} — ${film.title} → pt: ${titlePt}`)
  await delay(200)
}

const missing = enriched.filter(f => !f.poster).length
console.log(`\nDone! ${enriched.length - missing}/${enriched.length} posters found.`)

writeFileSync(resolve(root, 'src', 'films.json'), JSON.stringify(enriched, null, 2))
console.log('Saved to src/films.json')
