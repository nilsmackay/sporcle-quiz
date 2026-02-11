import { calculateYouTubeScore } from './youtube'

// Sum Sporcle percentages for a player across the given themes
export function calculateSporcleTotal(player, answers, activeThemes) {
  let total = 0
  if (!activeThemes) return total
  activeThemes.forEach((_, index) => {
    const answer = answers[player]?.[index]
    if (answer) {
      total += answer.percentage
    }
  })
  return total
}

// Sum YouTube scores for a player across all videos
export function calculateYouTubeTotal(player, youtubeGuesses, youtubeVideos) {
  if (!youtubeVideos || !youtubeGuesses) return 0
  let total = 0
  youtubeVideos.forEach((video, index) => {
    const guess = youtubeGuesses[player]?.[index]
    if (guess !== undefined) {
      total += calculateYouTubeScore(guess, video.views)
    }
  })
  return total
}

// Combined grand total across both rounds
export function calculateGrandTotal(player, answers, activeThemes, youtubeGuesses, youtubeVideos) {
  return calculateYouTubeTotal(player, youtubeGuesses, youtubeVideos) +
    calculateSporcleTotal(player, answers, activeThemes)
}

// Get the player with the highest total score (worst performer, picks next in dynamic mode)
export function getHighestScorer(players, answers, activeThemes, youtubeGuesses, youtubeVideos) {
  if (players.length === 0) return ''
  let highestPlayer = players[0]
  let highestScore = calculateGrandTotal(players[0], answers, activeThemes, youtubeGuesses, youtubeVideos)
  players.forEach(player => {
    const totalScore = calculateGrandTotal(player, answers, activeThemes, youtubeGuesses, youtubeVideos)
    if (totalScore > highestScore) {
      highestScore = totalScore
      highestPlayer = player
    }
  })
  return highestPlayer
}
