import { interpolateColor } from './colors'

// Extract the 11-character video ID from various YouTube URL formats
export function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

// Format a number with commas: 1500000 -> "1,500,000"
export function formatViews(num) {
  return new Intl.NumberFormat('en-US').format(num)
}

// Abbreviate large numbers: 1500000 -> "1.5M"
export function abbreviateViews(num) {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B'
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'
  return num.toString()
}

// Score = log-scaled integer. 0 = perfect, 3 ≈ 2x off, 10 = 10x off, 20 = 100x off
export function calculateYouTubeScore(guess, actual) {
  const safeGuess = Math.max(1, guess)
  const safeActual = Math.max(1, actual)
  const ratio = Math.max(safeGuess / safeActual, safeActual / safeGuess)
  return Math.round(10 * Math.log10(ratio))
}

// Fetch video metadata from noembed.com (CORS-friendly oEmbed proxy)
export async function fetchVideoMetadata(url) {
  try {
    const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`)
    if (!res.ok) return null
    const data = await res.json()
    if (data.error) return null
    return {
      title: data.title || null,
      author_name: data.author_name || null,
      thumbnail_url: data.thumbnail_url || null,
    }
  } catch {
    return null
  }
}

// Color for a YouTube score (integer): green (0-3) -> gold (3-10) -> red (10+)
export function getYouTubeScoreColor(score) {
  const green = '#2D6A4F'
  const gold = '#B8924A'
  const red = '#C23B22'

  if (score <= 0) return { bg: green, text: 'white' }
  if (score <= 3) {
    const factor = score / 3
    return { bg: interpolateColor(green, gold, factor), text: 'white' }
  }
  if (score <= 10) {
    const factor = (score - 3) / 7
    return { bg: interpolateColor(gold, red, factor), text: 'white' }
  }
  return { bg: red, text: 'white' }
}

// Strip non-digits and parse to number
export function parseViewsInput(str) {
  const digits = str.replace(/[^0-9]/g, '')
  if (digits === '') return NaN
  return parseInt(digits, 10)
}
