import themes from './data/themes.json'
import YOUTUBE_VIDEOS from './data/youtube-videos.js'
import { getHighestScorer } from './utils/scoring'

const allThemeIds = themes.map(t => t.id)
const STORAGE_KEY = 'sporcle-quiz-state'

export function loadSavedState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
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
  // YouTube round
  youtubeVideoIndex: 0,
  youtubeGuesses: {},
  // Edit mode
  editReturnState: null,
  // Round toggles
  enabledRounds: { youtube: true, sporcle: true },
}

function getActiveThemes(state) {
  return state.isDynamicMode ? state.playedThemes : state.selectedThemes
}

function findWorstPlayer(state) {
  return getHighestScorer(
    state.players, state.answers, getActiveThemes(state),
    state.youtubeGuesses, YOUTUBE_VIDEOS
  )
}

export function gameReducer(state, action) {
  switch (action.type) {
    // Generic field setter — keeps Setup component unchanged
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }

    case 'START_GAME': {
      const updates = {
        youtubeVideoIndex: 0,
        youtubeGuesses: {},
        currentQuestionIndex: 0,
        answers: {},
      }
      if (state.isDynamicMode) {
        updates.playedThemes = []
      }
      if (state.enabledRounds.youtube) {
        updates.phase = 'youtube-playing'
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

    case 'EDIT_QUESTION': {
      const { questionType, index } = action
      const editReturn = {
        phase: state.phase,
        questionIndex: state.currentQuestionIndex,
        youtubeVideoIndex: state.youtubeVideoIndex,
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
        youtubeVideoIndex: returnTo.youtubeVideoIndex,
        phase: returnTo.phase,
      }
    }

    case 'YOUTUBE_CONTINUE_FROM_STANDINGS': {
      const isLastVideo = state.youtubeVideoIndex === YOUTUBE_VIDEOS.length - 1
      if (isLastVideo) {
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

    case 'SELECT_QUESTION':
      return {
        ...state,
        playedThemes: [...state.playedThemes, action.themeId],
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
