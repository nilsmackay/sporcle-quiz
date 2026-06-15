import { interpolateColor } from './colors'

// Score = percentOff^0.75, capped at 25. Exact = -5 (bonus).
export function calculatePictureRoundScore(guess, correctNumber) {
  if (guess === correctNumber) return -5
  const percentOff = Math.abs(guess - correctNumber) / Math.abs(correctNumber) * 100
  return Math.min(25, Math.round(Math.pow(percentOff, 0.75)))
}

// Color grading: green (0-10), gold (10-30), red (30+)
export function getPictureRoundScoreColor(score) {
  const green = '#2D6A4F'
  const gold = '#B8924A'
  const red = '#C23B22'

  if (score <= 0) return { bg: '#2563EB', text: 'white' }
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
