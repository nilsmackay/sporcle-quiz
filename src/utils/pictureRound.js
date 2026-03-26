// Score = absolute difference between guess and correct number (0 = perfect, lower is better)
export function calculatePictureRoundScore(guess, correctNumber) {
  return Math.abs(guess - correctNumber)
}

// Color grading: green (0-2), gold (3-5), red (6+)
export function getPictureRoundScoreColor(score) {
  if (score <= 2) return { bg: '#2D6A4F', text: 'white' }
  if (score <= 5) return { bg: '#B8924A', text: 'white' }
  return { bg: '#C23B22', text: 'white' }
}
