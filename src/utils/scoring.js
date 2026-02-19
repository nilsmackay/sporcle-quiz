import { calculateYouTubeScore } from './youtube'
import { calculateSampleHitsterScore } from './sampleHitster'

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

// Sum Sample Hitster scores for a player across all songs (with optional bonuses)
export function calculateSampleHitsterTotal(player, sampleHitsterGuesses, sampleHitsterSongs, sampleHitsterBonuses) {
  if (!sampleHitsterSongs || !sampleHitsterGuesses) return 0
  let total = 0
  sampleHitsterSongs.forEach((song, index) => {
    const guess = sampleHitsterGuesses[player]?.[index]
    if (guess !== undefined) {
      let score = calculateSampleHitsterScore(guess, song.sampleYear)
      const bonuses = sampleHitsterBonuses?.[player]?.[index]
      if (bonuses?.artist) score -= 2
      if (bonuses?.title) score -= 2
      total += score
    }
  })
  return total
}

// Combined grand total across all rounds
export function calculateGrandTotal(player, answers, activeThemes, youtubeGuesses, youtubeVideos, sampleHitsterGuesses, sampleHitsterSongs, sampleHitsterBonuses) {
  return calculateYouTubeTotal(player, youtubeGuesses, youtubeVideos) +
    calculateSampleHitsterTotal(player, sampleHitsterGuesses, sampleHitsterSongs, sampleHitsterBonuses) +
    calculateSporcleTotal(player, answers, activeThemes)
}

// Get the player with the highest total score (worst performer, picks next in dynamic mode)
export function getHighestScorer(players, answers, activeThemes, youtubeGuesses, youtubeVideos, sampleHitsterGuesses, sampleHitsterSongs, sampleHitsterBonuses) {
  if (players.length === 0) return ''
  let highestPlayer = players[0]
  let highestScore = calculateGrandTotal(players[0], answers, activeThemes, youtubeGuesses, youtubeVideos, sampleHitsterGuesses, sampleHitsterSongs, sampleHitsterBonuses)
  players.forEach(player => {
    const totalScore = calculateGrandTotal(player, answers, activeThemes, youtubeGuesses, youtubeVideos, sampleHitsterGuesses, sampleHitsterSongs, sampleHitsterBonuses)
    if (totalScore > highestScore) {
      highestScore = totalScore
      highestPlayer = player
    }
  })
  return highestPlayer
}
