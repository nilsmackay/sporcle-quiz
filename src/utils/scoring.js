import { calculateYouTubeScore } from './youtube'
import { calculatePictureRoundScore } from './pictureRound'
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

// Sum Picture Round scores for a player across all pictures
export function calculatePictureRoundTotal(player, pictureRoundGuesses, pictures) {
  if (!pictures || !pictureRoundGuesses) return 0
  let total = 0
  pictures.forEach((picture, index) => {
    const guess = pictureRoundGuesses[player]?.[index]
    if (guess !== undefined) {
      total += calculatePictureRoundScore(guess, picture.correctNumber)
    }
  })
  return total
}

// Sum Sample Hitster scores for a player across all songs
// sampleHitsterBonuses[player][songIndex] = { artist: bool, song: bool } — each true deducts 3 pts
export function calculateSampleHitsterTotal(player, sampleHitsterGuesses, sampleHitsterSongs, sampleHitsterBonuses) {
  if (!sampleHitsterSongs || !sampleHitsterGuesses) return 0
  let total = 0
  sampleHitsterSongs.forEach((song, index) => {
    const guess = sampleHitsterGuesses[player]?.[index]
    if (guess !== undefined) {
      let score = calculateSampleHitsterScore(guess, song.sampleYear)
      const bonus = sampleHitsterBonuses?.[player]?.[index]
      if (bonus?.artist) score -= 3
      if (bonus?.song) score -= 3
      total += score
    }
  })
  return total
}

// Per-question bonus: -10 for the player(s) with the lowest percentage on a given question. Split if tied.
export function calculateQuestionBonus(player, players, answers, questionIndex) {
  if (!players || players.length <= 1) return 0
  const percentages = players
    .map(p => answers[p]?.[questionIndex]?.percentage)
    .filter(p => p !== undefined)
  if (percentages.length === 0) return 0
  const playerPct = answers[player]?.[questionIndex]?.percentage
  if (playerPct === undefined) return 0
  const min = Math.min(...percentages)
  if (playerPct !== min) return 0
  const tiedCount = percentages.filter(p => p === min).length
  return -Math.floor(10 / tiedCount)
}

// Sum of all per-question bonuses for a player across the Sporcle round
export function calculateSporcleBonusTotal(player, players, answers, activeThemes) {
  if (!activeThemes || activeThemes.length === 0 || !players || players.length <= 1) return 0
  let total = 0
  activeThemes.forEach((_, index) => {
    total += calculateQuestionBonus(player, players, answers, index)
  })
  return total
}

// Combined grand total across all rounds
export function calculateGrandTotal(players, player, answers, activeThemes, youtubeGuesses, youtubeVideos, pictureRoundGuesses, pictureRoundImages, sampleHitsterGuesses, sampleHitsterSongs, sampleHitsterBonuses) {
  return calculateYouTubeTotal(player, youtubeGuesses, youtubeVideos) +
    calculatePictureRoundTotal(player, pictureRoundGuesses, pictureRoundImages) +
    calculateSampleHitsterTotal(player, sampleHitsterGuesses, sampleHitsterSongs, sampleHitsterBonuses) +
    calculateSporcleTotal(player, answers, activeThemes) +
    calculateSporcleBonusTotal(player, players, answers, activeThemes)
}

// Get the player with the highest total score (worst performer, picks next in dynamic mode)
export function getHighestScorer(players, answers, activeThemes, youtubeGuesses, youtubeVideos, pictureRoundGuesses, pictureRoundImages, sampleHitsterGuesses, sampleHitsterSongs, sampleHitsterBonuses) {
  if (players.length === 0) return ''
  let highestPlayer = players[0]
  let highestScore = calculateGrandTotal(players, players[0], answers, activeThemes, youtubeGuesses, youtubeVideos, pictureRoundGuesses, pictureRoundImages, sampleHitsterGuesses, sampleHitsterSongs, sampleHitsterBonuses)
  players.forEach(player => {
    const totalScore = calculateGrandTotal(players, player, answers, activeThemes, youtubeGuesses, youtubeVideos, pictureRoundGuesses, pictureRoundImages, sampleHitsterGuesses, sampleHitsterSongs, sampleHitsterBonuses)
    if (totalScore > highestScore) {
      highestScore = totalScore
      highestPlayer = player
    }
  })
  return highestPlayer
}
