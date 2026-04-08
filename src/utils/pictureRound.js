import { interpolateColor } from './colors'

// Score = log-scaled ratio. 0 = perfect, 9 ≈ 2x off, 14 ≈ 3x off, 30 = 10x off
export function calculatePictureRoundScore(guess, correctNumber) {
  const safeGuess = Math.max(1, Math.abs(guess))
  const safeActual = Math.max(1, Math.abs(correctNumber))
  const ratio = Math.max(safeGuess / safeActual, safeActual / safeGuess)
  return Math.round(50 * Math.log10(ratio))
}

// Color grading: green (0-9), gold (9-30), red (30+)
export function getPictureRoundScoreColor(score) {
  const green = '#2D6A4F'
  const gold = '#B8924A'
  const red = '#C23B22'

  if (score <= 0) return { bg: green, text: 'white' }
  if (score <= 15) {
    const factor = score / 15
    return { bg: interpolateColor(green, gold, factor), text: 'white' }
  }
  if (score <= 50) {
    const factor = (score - 15) / 35
    return { bg: interpolateColor(gold, red, factor), text: 'white' }
  }
  return { bg: red, text: 'white' }
}
