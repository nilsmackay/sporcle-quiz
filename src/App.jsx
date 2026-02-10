import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Setup from './components/Setup'
import QuizQuestion from './components/QuizQuestion'
import QuestionPicker from './components/QuestionPicker'
import RoundResults from './components/RoundResults'
import Leaderboard from './components/Leaderboard'
import YouTubeQuestion from './components/YouTubeQuestion'
import YouTubeResults from './components/YouTubeResults'
import themes from './data/themes.json'
import YOUTUBE_VIDEOS from './data/youtube-videos.js'
import { fetchVideoMetadata, calculateYouTubeScore } from './utils/youtube'
import { useLanguage } from './i18n.jsx'

export default function App() {
  const { t, themeName: translateThemeName } = useLanguage()
  const [phase, setPhase] = useState('setup')
  const [players, setPlayers] = useState([])
  const [selectedThemes, setSelectedThemes] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  // Dynamic mode state
  const [isDynamicMode, setIsDynamicMode] = useState(true)
  const [dynamicQuestionCount, setDynamicQuestionCount] = useState(3)
  const [currentPicker, setCurrentPicker] = useState('')
  const [playedThemes, setPlayedThemes] = useState([])
  const [dynamicAvailableThemes, setDynamicAvailableThemes] = useState(themes.map(t => t.id))

  // YouTube round state
  const [youtubeVideoIndex, setYoutubeVideoIndex] = useState(0)
  const [youtubeGuesses, setYoutubeGuesses] = useState({})
  const [videoMetadata, setVideoMetadata] = useState({})

  // Edit mode state
  const [editReturnState, setEditReturnState] = useState(null)

  // Enabled rounds
  const [enabledRounds, setEnabledRounds] = useState({
    youtube: true,
    sporcle: true
  })

  // Prefetch YouTube video metadata when YouTube round starts
  useEffect(() => {
    if (phase === 'youtube-playing' && Object.keys(videoMetadata).length === 0) {
      YOUTUBE_VIDEOS.forEach((video, index) => {
        fetchVideoMetadata(video.url).then(meta => {
          if (meta) {
            setVideoMetadata(prev => ({ ...prev, [index]: meta }))
          }
        })
      })
    }
  }, [phase])

  // In dynamic mode, use playedThemes; otherwise use selectedThemes
  const activeThemes = isDynamicMode ? playedThemes : selectedThemes
  const currentTheme = activeThemes[currentQuestionIndex]
    ? themes.find(t => t.id === activeThemes[currentQuestionIndex])
    : null

  // Calculate Sporcle score for a player
  const calculatePlayerScore = (player) => {
    let total = 0
    activeThemes.forEach((_, index) => {
      const answer = answers[player]?.[index]
      if (answer) {
        total += answer.percentage
      }
    })
    return total
  }

  // Calculate YouTube score for a player
  const calculateYouTubePlayerScore = (player) => {
    let total = 0
    YOUTUBE_VIDEOS.forEach((video, index) => {
      const guess = youtubeGuesses[player]?.[index]
      if (guess !== undefined) {
        total += calculateYouTubeScore(guess, video.views)
      }
    })
    return total
  }

  // Get the player with the highest total score across all rounds (for dynamic mode)
  // In this game, lower scores are better, so the player doing worst picks next
  // Total = YouTube score + Sporcle score
  const getHighestScorer = () => {
    if (players.length === 0) return ''
    let highestPlayer = players[0]
    let highestScore = calculateYouTubePlayerScore(players[0]) + calculatePlayerScore(players[0])
    players.forEach(player => {
      const totalScore = calculateYouTubePlayerScore(player) + calculatePlayerScore(player)
      if (totalScore > highestScore) {
        highestScore = totalScore
        highestPlayer = player
      }
    })
    return highestPlayer
  }

  // --- Phase handlers ---

  const handleStart = () => {
    // Reset state
    setYoutubeVideoIndex(0)
    setYoutubeGuesses({})
    setVideoMetadata({})
    setCurrentQuestionIndex(0)
    setAnswers({})
    if (isDynamicMode) {
      setPlayedThemes([])
    }

    // Start with first enabled round
    if (enabledRounds.youtube) {
      setPhase('youtube-playing')
    } else if (enabledRounds.sporcle) {
      if (isDynamicMode) {
        setCurrentPicker(getHighestScorer())
        setPhase('picking')
      } else {
        setPhase('playing')
      }
    }
  }

  // YouTube round handlers
  const handleYouTubeSubmitGuesses = (videoIndex, guesses) => {
    setYoutubeGuesses(prev => {
      const next = { ...prev }
      for (const [player, guess] of Object.entries(guesses)) {
        next[player] = { ...next[player], [videoIndex]: guess }
      }
      return next
    })
    if (!isEditing) {
      setPhase('youtube-results')
    }
  }

  const handleYouTubeShowStandings = () => {
    setPhase('youtube-standings')
  }

  const isLastYouTubeVideo = youtubeVideoIndex === YOUTUBE_VIDEOS.length - 1
  const isEditing = editReturnState !== null

  // Edit mode handlers
  const handleEditQuestion = (type, index) => {
    setEditReturnState({
      phase,
      questionIndex: currentQuestionIndex,
      youtubeVideoIndex: youtubeVideoIndex
    })
    setShowLeaderboard(false)

    if (type === 'youtube') {
      setYoutubeVideoIndex(index)
      setPhase('youtube-playing')
    } else {
      setCurrentQuestionIndex(index)
      setPhase('playing')
    }
  }

  const handleSaveAndReturn = () => {
    const returnTo = editReturnState
    setEditReturnState(null)
    setCurrentQuestionIndex(returnTo.questionIndex)
    setYoutubeVideoIndex(returnTo.youtubeVideoIndex)
    setPhase(returnTo.phase)
  }

  const handleCancelEdit = () => {
    const returnTo = editReturnState
    setEditReturnState(null)
    setCurrentQuestionIndex(returnTo.questionIndex)
    setYoutubeVideoIndex(returnTo.youtubeVideoIndex)
    setPhase(returnTo.phase)
  }

  const handleYouTubeContinueFromStandings = () => {
    if (isLastYouTubeVideo) {
      // Transition to Sporcle round if enabled, otherwise finish
      if (enabledRounds.sporcle) {
        if (isDynamicMode) {
          // Set the player with the worst total score as first picker
          setCurrentPicker(getHighestScorer())
          setPhase('picking')
        } else {
          setPhase('playing')
        }
      } else {
        setPhase('finished')
      }
    } else {
      setYoutubeVideoIndex(youtubeVideoIndex + 1)
      setPhase('youtube-playing')
    }
  }

  // Sporcle round handlers
  const handleSelectQuestion = (themeId) => {
    setPlayedThemes([...playedThemes, themeId])
    setPhase('playing')
  }

  const handleBatchAnswers = (questionIndex, playerAnswers) => {
    setAnswers(prev => {
      const next = { ...prev }
      for (const [player, answer] of Object.entries(playerAnswers)) {
        next[player] = { ...next[player], [questionIndex]: answer }
      }
      return next
    })
  }

  const handleNext = () => {
    setPhase('round-results')
  }

  const handleFinish = () => {
    setPhase('round-results')
  }

  const handleShowStandings = () => {
    setPhase('standings')
  }

  const handleContinueFromStandings = () => {
    if (isLastQuestion) {
      setPhase('finished')
    } else if (isDynamicMode) {
      setCurrentPicker(getHighestScorer())
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setPhase('picking')
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setPhase('playing')
    }
  }

  const handleNewGame = () => {
    setPhase('setup')
    setPlayers([])
    setSelectedThemes([])
    setCurrentQuestionIndex(0)
    setAnswers({})
    setShowLeaderboard(false)
    // Reset dynamic mode state
    setIsDynamicMode(true)
    setDynamicQuestionCount(3)
    setCurrentPicker('')
    setPlayedThemes([])
    setDynamicAvailableThemes(themes.map(t => t.id))
    // Reset YouTube state
    setYoutubeVideoIndex(0)
    setYoutubeGuesses({})
    setVideoMetadata({})
    // Reset enabled rounds
    setEnabledRounds({ youtube: true, sporcle: true })
  }

  // Determine total questions based on mode
  const totalQuestions = isDynamicMode ? dynamicQuestionCount : selectedThemes.length
  const isLastQuestion = isDynamicMode
    ? playedThemes.length >= dynamicQuestionCount
    : currentQuestionIndex === selectedThemes.length - 1

  // Determine if we're in a YouTube phase (for leaderboard overlay)
  const isYouTubePhase = phase === 'youtube-playing' || phase === 'youtube-results' || phase === 'youtube-standings'

  return (
    <div className="min-h-screen relative">
      <Header
        phase={phase}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        themeName={currentTheme ? translateThemeName(currentTheme.id) : undefined}
        showLeaderboard={showLeaderboard}
        setShowLeaderboard={setShowLeaderboard}
        onNewGame={handleNewGame}
        youtubeVideoIndex={youtubeVideoIndex}
        totalYouTubeVideos={YOUTUBE_VIDEOS.length}
      />

      <main className="main-content py-4 sm:py-6">
        {phase === 'setup' && (
          <Setup
            themes={themes}
            players={players}
            setPlayers={setPlayers}
            selectedThemes={selectedThemes}
            setSelectedThemes={setSelectedThemes}
            onStart={handleStart}
            isDynamicMode={isDynamicMode}
            setIsDynamicMode={setIsDynamicMode}
            dynamicQuestionCount={dynamicQuestionCount}
            setDynamicQuestionCount={setDynamicQuestionCount}
            currentPicker={currentPicker}
            setCurrentPicker={setCurrentPicker}
            dynamicAvailableThemes={dynamicAvailableThemes}
            setDynamicAvailableThemes={setDynamicAvailableThemes}
            youtubeVideoCount={YOUTUBE_VIDEOS.length}
            enabledRounds={enabledRounds}
            setEnabledRounds={setEnabledRounds}
          />
        )}

        {phase === 'youtube-playing' && (
          <YouTubeQuestion
            players={players}
            video={YOUTUBE_VIDEOS[youtubeVideoIndex]}
            videoIndex={youtubeVideoIndex}
            totalVideos={YOUTUBE_VIDEOS.length}
            metadata={videoMetadata[youtubeVideoIndex] || null}
            onSubmitGuesses={handleYouTubeSubmitGuesses}
            isLastVideo={isLastYouTubeVideo}
            isEditing={isEditing}
            onSaveAndReturn={handleSaveAndReturn}
            onCancelEdit={handleCancelEdit}
            committedGuesses={youtubeGuesses}
          />
        )}

        {phase === 'youtube-results' && (
          <YouTubeResults
            players={players}
            video={YOUTUBE_VIDEOS[youtubeVideoIndex]}
            metadata={videoMetadata[youtubeVideoIndex] || null}
            guesses={
              Object.fromEntries(
                players.map(p => [p, youtubeGuesses[p]?.[youtubeVideoIndex] ?? 0])
              )
            }
            videoIndex={youtubeVideoIndex}
            onContinue={handleYouTubeShowStandings}
          />
        )}

        {phase === 'youtube-standings' && (
          <div className="max-w-2xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
            <Leaderboard
              players={players}
              answers={{}}
              selectedThemes={[]}
              themes={themes}
              onClose={handleYouTubeContinueFromStandings}
              isOverlay={false}
              youtubeGuesses={youtubeGuesses}
              youtubeVideos={YOUTUBE_VIDEOS}
              videoMetadata={videoMetadata}
              onEditQuestion={handleEditQuestion}
              defaultExpandedRound="youtube"
            />
            <button
              onClick={handleYouTubeContinueFromStandings}
              className="w-full mt-4 btn-gold py-3 sm:py-4 font-bold text-base sm:text-lg"
            >
              {isLastYouTubeVideo ? t('app.startRound2') : t('app.nextVideo')}
            </button>
          </div>
        )}

        {phase === 'picking' && (
          <QuestionPicker
            themes={themes}
            playedThemes={playedThemes}
            availableThemes={dynamicAvailableThemes}
            currentPicker={currentPicker}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={dynamicQuestionCount}
            onSelectQuestion={handleSelectQuestion}
          />
        )}

        {phase === 'playing' && currentTheme && (
          <QuizQuestion
            players={players}
            currentTheme={currentTheme}
            currentQuestionIndex={currentQuestionIndex}
            onBatchAnswers={handleBatchAnswers}
            onNext={handleNext}
            isLastQuestion={isLastQuestion}
            onFinish={handleFinish}
            isEditing={isEditing}
            onSaveAndReturn={handleSaveAndReturn}
            onCancelEdit={handleCancelEdit}
            committedAnswers={answers}
          />
        )}

        {phase === 'round-results' && currentTheme && (
          <RoundResults
            players={players}
            answers={answers}
            currentQuestionIndex={currentQuestionIndex}
            currentTheme={currentTheme}
            onContinue={handleShowStandings}
          />
        )}

        {phase === 'standings' && (
          <div className="max-w-2xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
            <Leaderboard
              players={players}
              answers={answers}
              selectedThemes={activeThemes}
              themes={themes}
              onClose={handleContinueFromStandings}
              isOverlay={false}
              youtubeGuesses={youtubeGuesses}
              youtubeVideos={YOUTUBE_VIDEOS}
              videoMetadata={videoMetadata}
              onEditQuestion={handleEditQuestion}
              defaultExpandedRound="sporcle"
            />
            <button
              onClick={handleContinueFromStandings}
              className="w-full mt-4 btn-gold py-3 sm:py-4 font-bold text-base sm:text-lg"
            >
              {isLastQuestion ? t('app.finalResults') : t('app.nextQuestion')}
            </button>
          </div>
        )}

        {phase === 'finished' && (
          <div className="max-w-2xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
            <div className="text-center mb-6">
              <div className="editorial-stamp w-16 h-16 text-[#C23B22] text-2xl mx-auto mb-3">
                TS
              </div>
              <h2 className="text-2xl font-display text-[#1A1A1A]">{t('app.quizComplete')}</h2>
            </div>
            <Leaderboard
              players={players}
              answers={answers}
              selectedThemes={activeThemes}
              themes={themes}
              isOverlay={false}
              youtubeGuesses={youtubeGuesses}
              youtubeVideos={YOUTUBE_VIDEOS}
              videoMetadata={videoMetadata}
              onEditQuestion={handleEditQuestion}
              defaultExpandedRound={null}
            />
            <button
              onClick={handleNewGame}
              className="w-full mt-4 btn-gold py-3 sm:py-4 font-bold text-base sm:text-lg"
            >
              {t('app.newGame')}
            </button>
          </div>
        )}
      </main>

      {showLeaderboard && (
        <Leaderboard
          players={players}
          answers={isYouTubePhase ? {} : answers}
          selectedThemes={isYouTubePhase ? [] : activeThemes}
          themes={themes}
          onClose={() => setShowLeaderboard(false)}
          youtubeGuesses={youtubeGuesses}
          youtubeVideos={YOUTUBE_VIDEOS}
          videoMetadata={videoMetadata}
          onEditQuestion={handleEditQuestion}
          defaultExpandedRound={isYouTubePhase ? 'youtube' : 'sporcle'}
        />
      )}
    </div>
  )
}
