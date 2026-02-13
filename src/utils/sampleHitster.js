// Calculate the score for a sample hitster guess (absolute year difference)
export function calculateSampleHitsterScore(guess, actualYear) {
  return Math.abs(guess - actualYear)
}

// Color for sample hitster scores: green (0-2), gold (3-5), red (6+)
export function getSampleHitsterScoreColor(score) {
  if (score <= 2) return { bg: '#2D6A4F', text: 'white' }
  if (score <= 5) return { bg: '#B8924A', text: 'white' }
  return { bg: '#C23B22', text: 'white' }
}
