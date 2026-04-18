import { interpolateColor } from './colors'

export function calculateBelieveItScore(guess, isTrue) {
  return isTrue ? (10 - guess) : guess
}

export function getBelieveItScoreColor(score) {
  const green = '#2D6A4F'
  const gold = '#B8924A'
  const red = '#C23B22'
  if (score <= 0) return { bg: '#2563EB', text: 'white' }
  if (score <= 3) {
    const factor = score / 3
    return { bg: interpolateColor(green, gold, factor), text: 'white' }
  }
  const factor = (score - 3) / 7
  return { bg: interpolateColor(gold, red, factor), text: 'white' }
}
