import themes from './data/themes.json'
import YOUTUBE_VIDEOS from './data/youtube-videos.js'
import SAMPLE_HITSTER_SONGS from './data/sample-hitster-songs.js'
import PICTURE_ROUND_IMAGES from './data/picture-round-images.js'
import BELIEVE_IT_STATEMENTS from './data/believe-it-statements.js'
import { getHighestScorer } from './utils/scoring'

const allThemeIds = themes.map(t => t.id)
const allYoutubeIndices = YOUTUBE_VIDEOS.map((_, i) => i)
const STORAGE_KEY = 'sporcle-quiz-state'

// Map selected indices (into YOUTUBE_VIDEOS) to the active subset of video objects,
// preserving master order and dropping any stale/out-of-range indices.
export function selectYoutubeVideos(indices) {
  const list = indices ?? allYoutubeIndices
  return list.filter(i => i >= 0 && i < YOUTUBE_VIDEOS.length).map(i => YOUTUBE_VIDEOS[i])
}

export function loadSavedState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      // Merge enabledRounds so new round toggles get their defaults
      parsed.enabledRounds = { ...initialState.enabledRounds, ...parsed.enabledRounds }
      // Merge with initialState to handle any new fields added after save
      return { ...initialState, ...parsed }
    }
  } catch (e) {
    // Corrupted data — fall back to default
  }
  return initialState
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    // Storage full or unavailable
  }
}

export function clearSavedState() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    // Silently fail
  }
}

export const initialState = {
  phase: 'setup',
  players: [],
  selectedThemes: [],
  currentQuestionIndex: 0,
  answers: {},
  showLeaderboard: false,
  // Dynamic mode
  isDynamicMode: true,
  dynamicQuestionCount: 3,
  currentPicker: '',
  playedThemes: [],
  dynamicAvailableThemes: allThemeIds,
  // Believe It round
  believeItIndex: 0,
  believeItGuesses: {},
  // YouTube round
  youtubeVideoIndex: 0,
  youtubeGuesses: {},
  selectedYoutubeIndices: allYoutubeIndices,
  // Picture round
  pictureRoundIndex: 0,
  pictureRoundGuesses: {},
  // Sample Hitster round
  sampleHitsterIndex: 0,
  sampleHitsterGuesses: {},
  sampleHitsterBonuses: {},
  // Sporcle multipliers
  multipliers: {},
  // Edit mode
  editReturnState: null,
  // Round toggles
  enabledRounds: { believeIt: true, youtube: true, pictureRound: true, sampleHitster: true, sporcle: true },
}

function getActiveThemes(state) {
  return state.isDynamicMode ? state.playedThemes : state.selectedThemes
}

function findWorstPlayer(state) {
  return getHighestScorer(
    state.players, state.answers, getActiveThemes(state),
    state.youtubeGuesses, selectYoutubeVideos(state.selectedYoutubeIndices),
    state.pictureRoundGuesses, PICTURE_ROUND_IMAGES,
    state.sampleHitsterGuesses, SAMPLE_HITSTER_SONGS,
    state.sampleHitsterBonuses,
    state.multipliers,
    state.believeItGuesses, BELIEVE_IT_STATEMENTS
  )
}

export function gameReducer(state, action) {
  switch (action.type) {
    // Generic field setter — keeps Setup component unchanged
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }

    case 'START_GAME': {
      const updates = {
        believeItIndex: 0,
        believeItGuesses: {},
        youtubeVideoIndex: 0,
        youtubeGuesses: {},
        pictureRoundIndex: 0,
        pictureRoundGuesses: {},
        sampleHitsterIndex: 0,
        sampleHitsterGuesses: {},
        sampleHitsterBonuses: {},
        currentQuestionIndex: 0,
        answers: {},
        multipliers: {},
      }
      if (state.isDynamicMode) {
        updates.playedThemes = []
      }
      if (state.enabledRounds.believeIt) {
        updates.phase = 'believe-it-playing'
      } else if (state.enabledRounds.youtube) {
        updates.phase = 'youtube-playing'
      } else if (state.enabledRounds.pictureRound) {
        updates.phase = 'picture-round-playing'
      } else if (state.enabledRounds.sampleHitster) {
        updates.phase = 'sample-hitster-playing'
      } else if (state.enabledRounds.sporcle) {
        if (state.isDynamicMode) {
          updates.currentPicker = findWorstPlayer({ ...state, ...updates })
          updates.phase = 'picking'
        } else {
          updates.phase = 'playing'
        }
      }
      return { ...state, ...updates }
    }

    case 'SUBMIT_BELIEVE_IT_GUESSES': {
      const { statementIndex, guesses: biGuesses } = action
      const nextBI = { ...state.believeItGuesses }
      for (const [player, guess] of Object.entries(biGuesses)) {
        nextBI[player] = { ...nextBI[player], [statementIndex]: guess }
      }
      return {
        ...state,
        believeItGuesses: nextBI,
        ...(state.editReturnState === null ? { phase: 'believe-it-results' } : {}),
      }
    }

    case 'SHOW_BELIEVE_IT_STANDINGS':
      return { ...state, phase: 'believe-it-standings' }

    case 'BELIEVE_IT_SKIP_EXAMPLE':
      return {
        ...state,
        believeItIndex: 1,
        phase: 'believe-it-playing',
      }

    case 'BELIEVE_IT_CONTINUE_FROM_STANDINGS': {
      const isLastStatement = state.believeItIndex === BELIEVE_IT_STATEMENTS.length - 1
      if (isLastStatement) {
        if (state.enabledRounds.youtube) {
          return { ...state, phase: 'youtube-playing' }
        }
        if (state.enabledRounds.pictureRound) {
          return { ...state, phase: 'picture-round-playing' }
        }
        if (state.enabledRounds.sampleHitster) {
          return { ...state, phase: 'sample-hitster-playing' }
        }
        if (state.enabledRounds.sporcle) {
          if (state.isDynamicMode) {
            return {
              ...state,
              currentPicker: findWorstPlayer(state),
              phase: 'picking',
            }
          }
          return { ...state, phase: 'playing' }
        }
        return { ...state, phase: 'finished' }
      }
      return {
        ...state,
        believeItIndex: state.believeItIndex + 1,
        phase: 'believe-it-playing',
      }
    }

    case 'SUBMIT_YOUTUBE_GUESSES': {
      const { videoIndex, guesses } = action
      const next = { ...state.youtubeGuesses }
      for (const [player, guess] of Object.entries(guesses)) {
        next[player] = { ...next[player], [videoIndex]: guess }
      }
      return {
        ...state,
        youtubeGuesses: next,
        // Only advance phase when not editing
        ...(state.editReturnState === null ? { phase: 'youtube-results' } : {}),
      }
    }

    case 'SHOW_YOUTUBE_STANDINGS':
      return { ...state, phase: 'youtube-standings' }

    case 'SUBMIT_PICTURE_ROUND_GUESSES': {
      const { pictureIndex, guesses: prGuesses } = action
      const nextPR = { ...state.pictureRoundGuesses }
      for (const [player, guess] of Object.entries(prGuesses)) {
        nextPR[player] = { ...nextPR[player], [pictureIndex]: guess }
      }
      return {
        ...state,
        pictureRoundGuesses: nextPR,
        ...(state.editReturnState === null ? { phase: 'picture-round-results' } : {}),
      }
    }

    case 'SHOW_PICTURE_ROUND_STANDINGS':
      return { ...state, phase: 'picture-round-standings' }

    case 'PICTURE_ROUND_CONTINUE_FROM_STANDINGS': {
      const isLastPicture = state.pictureRoundIndex === PICTURE_ROUND_IMAGES.length - 1
      if (isLastPicture) {
        if (state.enabledRounds.sampleHitster) {
          return { ...state, phase: 'sample-hitster-playing' }
        }
        if (state.enabledRounds.sporcle) {
          if (state.isDynamicMode) {
            return {
              ...state,
              currentPicker: findWorstPlayer(state),
              phase: 'picking',
            }
          }
          return { ...state, phase: 'playing' }
        }
        return { ...state, phase: 'finished' }
      }
      return {
        ...state,
        pictureRoundIndex: state.pictureRoundIndex + 1,
        phase: 'picture-round-playing',
      }
    }

    case 'EDIT_QUESTION': {
      const { questionType, index } = action
      const editReturn = {
        phase: state.phase,
        questionIndex: state.currentQuestionIndex,
        believeItIndex: state.believeItIndex,
        youtubeVideoIndex: state.youtubeVideoIndex,
        pictureRoundIndex: state.pictureRoundIndex,
        sampleHitsterIndex: state.sampleHitsterIndex,
      }
      if (questionType === 'believeIt') {
        return {
          ...state,
          editReturnState: editReturn,
          showLeaderboard: false,
          believeItIndex: index,
          phase: 'believe-it-playing',
        }
      }
      if (questionType === 'youtube') {
        return {
          ...state,
          editReturnState: editReturn,
          showLeaderboard: false,
          youtubeVideoIndex: index,
          phase: 'youtube-playing',
        }
      }
      if (questionType === 'pictureRound') {
        return {
          ...state,
          editReturnState: editReturn,
          showLeaderboard: false,
          pictureRoundIndex: index,
          phase: 'picture-round-playing',
        }
      }
      if (questionType === 'sampleHitster') {
        return {
          ...state,
          editReturnState: editReturn,
          showLeaderboard: false,
          sampleHitsterIndex: index,
          phase: 'sample-hitster-playing',
        }
      }
      return {
        ...state,
        editReturnState: editReturn,
        showLeaderboard: false,
        currentQuestionIndex: index,
        phase: 'playing',
      }
    }

    case 'SAVE_AND_RETURN':
    case 'CANCEL_EDIT': {
      const returnTo = state.editReturnState
      return {
        ...state,
        editReturnState: null,
        currentQuestionIndex: returnTo.questionIndex,
        believeItIndex: returnTo.believeItIndex,
        youtubeVideoIndex: returnTo.youtubeVideoIndex,
        pictureRoundIndex: returnTo.pictureRoundIndex,
        sampleHitsterIndex: returnTo.sampleHitsterIndex,
        phase: returnTo.phase,
      }
    }

    case 'YOUTUBE_CONTINUE_FROM_STANDINGS': {
      const isLastVideo = state.youtubeVideoIndex === selectYoutubeVideos(state.selectedYoutubeIndices).length - 1
      if (isLastVideo) {
        if (state.enabledRounds.pictureRound) {
          return { ...state, phase: 'picture-round-playing' }
        }
        if (state.enabledRounds.sampleHitster) {
          return { ...state, phase: 'sample-hitster-playing' }
        }
        if (state.enabledRounds.sporcle) {
          if (state.isDynamicMode) {
            return {
              ...state,
              currentPicker: findWorstPlayer(state),
              phase: 'picking',
            }
          }
          return { ...state, phase: 'playing' }
        }
        return { ...state, phase: 'finished' }
      }
      return {
        ...state,
        youtubeVideoIndex: state.youtubeVideoIndex + 1,
        phase: 'youtube-playing',
      }
    }

    case 'SUBMIT_SAMPLE_HITSTER_GUESSES': {
      const { songIndex, guesses: shGuesses } = action
      const nextSH = { ...state.sampleHitsterGuesses }
      for (const [player, guess] of Object.entries(shGuesses)) {
        nextSH[player] = { ...nextSH[player], [songIndex]: guess }
      }
      return {
        ...state,
        sampleHitsterGuesses: nextSH,
        ...(state.editReturnState === null ? { phase: 'sample-hitster-results' } : {}),
      }
    }

    case 'SET_SAMPLE_HITSTER_BONUS': {
      const { player, songIndex, artist, song: songBonus } = action
      const nextBonuses = { ...state.sampleHitsterBonuses }
      nextBonuses[player] = { ...nextBonuses[player], [songIndex]: { artist, song: songBonus } }
      return { ...state, sampleHitsterBonuses: nextBonuses }
    }

    case 'SHOW_SAMPLE_HITSTER_STANDINGS':
      return { ...state, phase: 'sample-hitster-standings' }

    case 'SAMPLE_HITSTER_CONTINUE_FROM_STANDINGS': {
      const isLastSong = state.sampleHitsterIndex === SAMPLE_HITSTER_SONGS.length - 1
      if (isLastSong) {
        if (state.enabledRounds.sporcle) {
          if (state.isDynamicMode) {
            return {
              ...state,
              currentPicker: findWorstPlayer(state),
              phase: 'picking',
            }
          }
          return { ...state, phase: 'playing' }
        }
        return { ...state, phase: 'finished' }
      }
      return {
        ...state,
        sampleHitsterIndex: state.sampleHitsterIndex + 1,
        phase: 'sample-hitster-playing',
      }
    }

    case 'SELECT_QUESTION':
      return {
        ...state,
        playedThemes: [...state.playedThemes, action.themeId],
        multipliers: { ...state.multipliers, [state.currentQuestionIndex]: action.multiplier ?? 1 },
        phase: 'playing',
      }

    case 'BATCH_ANSWERS': {
      const { questionIndex, playerAnswers } = action
      const next = { ...state.answers }
      for (const [player, answer] of Object.entries(playerAnswers)) {
        next[player] = { ...next[player], [questionIndex]: answer }
      }
      return { ...state, answers: next }
    }

    case 'SHOW_ROUND_RESULTS':
      return { ...state, phase: 'round-results' }

    case 'SHOW_STANDINGS':
      return { ...state, phase: 'standings' }

    case 'CONTINUE_FROM_STANDINGS': {
      const isLast = state.isDynamicMode
        ? state.playedThemes.length >= state.dynamicQuestionCount
        : state.currentQuestionIndex === state.selectedThemes.length - 1

      if (isLast) {
        return { ...state, phase: 'finished' }
      }
      if (state.isDynamicMode) {
        return {
          ...state,
          currentPicker: findWorstPlayer(state),
          currentQuestionIndex: state.currentQuestionIndex + 1,
          phase: 'picking',
        }
      }
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        phase: 'playing',
      }
    }

    case 'NEW_GAME':
      clearSavedState()
      return { ...initialState }

    default:
      return state
  }
}
