import React, { useReducer, useEffect } from 'react'
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
import { fetchVideoMetadata } from './utils/youtube'
import { gameReducer, initialState } from './gameReducer'

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  const {
    phase, players, selectedThemes, currentQuestionIndex, answers,
    showLeaderboard, isDynamicMode, dynamicQuestionCount, currentPicker,
    playedThemes, dynamicAvailableThemes, youtubeVideoIndex,
    youtubeGuesses, videoMetadata, editReturnState, enabledRounds,
  } = state

  // Prefetch YouTube video metadata when YouTube round starts
  useEffect(() => {
    if (phase === 'youtube-playing' && Object.keys(videoMetadata).length === 0) {
      YOUTUBE_VIDEOS.forEach((video, index) => {
        fetchVideoMetadata(video.url).then(meta => {
          if (meta) dispatch({ type: 'SET_VIDEO_METADATA', index, meta })
        })
      })
    }
  }, [phase])

  // Derived state
  const activeThemes = isDynamicMode ? playedThemes : selectedThemes
  const currentTheme = activeThemes[currentQuestionIndex]
    ? themes.find(t => t.id === activeThemes[currentQuestionIndex])
    : null
  const totalQuestions = isDynamicMode ? dynamicQuestionCount : selectedThemes.length
  const isLastQuestion = isDynamicMode
    ? playedThemes.length >= dynamicQuestionCount
    : currentQuestionIndex === selectedThemes.length - 1
  const isLastYouTubeVideo = youtubeVideoIndex === YOUTUBE_VIDEOS.length - 1
  const isEditing = editReturnState !== null
  const isYouTubePhase = phase === 'youtube-playing' || phase === 'youtube-results' || phase === 'youtube-standings'

  // Field setter helper — lets Setup use the same setX={setField('x')} interface
  const setField = (field) => (value) => dispatch({ type: 'SET_FIELD', field, value })

  // Event handlers that dispatch actions
  const handleEditQuestion = (type, index) =>
    dispatch({ type: 'EDIT_QUESTION', questionType: type, index })

  const handleSaveAndReturn = () => dispatch({ type: 'SAVE_AND_RETURN' })
  const handleCancelEdit = () => dispatch({ type: 'CANCEL_EDIT' })

  return (
    <div className="min-h-screen relative">
      <Header
        phase={phase}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        themeName={currentTheme?.name}
        showLeaderboard={showLeaderboard}
        setShowLeaderboard={setField('showLeaderboard')}
        onNewGame={() => dispatch({ type: 'NEW_GAME' })}
        youtubeVideoIndex={youtubeVideoIndex}
        totalYouTubeVideos={YOUTUBE_VIDEOS.length}
      />

      <main className="main-content py-4 sm:py-6">
        {phase === 'setup' && (
          <Setup
            themes={themes}
            players={players}
            setPlayers={setField('players')}
            selectedThemes={selectedThemes}
            setSelectedThemes={setField('selectedThemes')}
            onStart={() => dispatch({ type: 'START_GAME' })}
            isDynamicMode={isDynamicMode}
            setIsDynamicMode={setField('isDynamicMode')}
            dynamicQuestionCount={dynamicQuestionCount}
            setDynamicQuestionCount={setField('dynamicQuestionCount')}
            currentPicker={currentPicker}
            setCurrentPicker={setField('currentPicker')}
            dynamicAvailableThemes={dynamicAvailableThemes}
            setDynamicAvailableThemes={setField('dynamicAvailableThemes')}
            youtubeVideoCount={YOUTUBE_VIDEOS.length}
            enabledRounds={enabledRounds}
            setEnabledRounds={setField('enabledRounds')}
          />
        )}

        {phase === 'youtube-playing' && (
          <YouTubeQuestion
            players={players}
            video={YOUTUBE_VIDEOS[youtubeVideoIndex]}
            videoIndex={youtubeVideoIndex}
            totalVideos={YOUTUBE_VIDEOS.length}
            metadata={videoMetadata[youtubeVideoIndex] || null}
            onSubmitGuesses={(videoIndex, guesses) =>
              dispatch({ type: 'SUBMIT_YOUTUBE_GUESSES', videoIndex, guesses })
            }
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
            onContinue={() => dispatch({ type: 'SHOW_YOUTUBE_STANDINGS' })}
          />
        )}

        {phase === 'youtube-standings' && (
          <div className="max-w-2xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
            <Leaderboard
              players={players}
              answers={{}}
              selectedThemes={[]}
              themes={themes}
              onClose={() => dispatch({ type: 'YOUTUBE_CONTINUE_FROM_STANDINGS' })}
              isOverlay={false}
              youtubeGuesses={youtubeGuesses}
              youtubeVideos={YOUTUBE_VIDEOS}
              videoMetadata={videoMetadata}
              onEditQuestion={handleEditQuestion}
              defaultExpandedRound="youtube"
            />
            <button
              onClick={() => dispatch({ type: 'YOUTUBE_CONTINUE_FROM_STANDINGS' })}
              className="w-full mt-4 btn-gold py-3 sm:py-4 font-bold text-base sm:text-lg"
            >
              {isLastYouTubeVideo ? 'Start Round 2: The Sporcle Round' : 'Next Video'}
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
            onSelectQuestion={(themeId) => dispatch({ type: 'SELECT_QUESTION', themeId })}
          />
        )}

        {phase === 'playing' && currentTheme && (
          <QuizQuestion
            players={players}
            currentTheme={currentTheme}
            currentQuestionIndex={currentQuestionIndex}
            onBatchAnswers={(questionIndex, playerAnswers) =>
              dispatch({ type: 'BATCH_ANSWERS', questionIndex, playerAnswers })
            }
            onNext={() => dispatch({ type: 'SHOW_ROUND_RESULTS' })}
            isLastQuestion={isLastQuestion}
            onFinish={() => dispatch({ type: 'SHOW_ROUND_RESULTS' })}
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
            onContinue={() => dispatch({ type: 'SHOW_STANDINGS' })}
          />
        )}

        {phase === 'standings' && (
          <div className="max-w-2xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
            <Leaderboard
              players={players}
              answers={answers}
              selectedThemes={activeThemes}
              themes={themes}
              onClose={() => dispatch({ type: 'CONTINUE_FROM_STANDINGS' })}
              isOverlay={false}
              youtubeGuesses={youtubeGuesses}
              youtubeVideos={YOUTUBE_VIDEOS}
              videoMetadata={videoMetadata}
              onEditQuestion={handleEditQuestion}
              defaultExpandedRound="sporcle"
            />
            <button
              onClick={() => dispatch({ type: 'CONTINUE_FROM_STANDINGS' })}
              className="w-full mt-4 btn-gold py-3 sm:py-4 font-bold text-base sm:text-lg"
            >
              {isLastQuestion ? 'Final Results' : 'Next Question'}
            </button>
          </div>
        )}

        {phase === 'finished' && (
          <div className="max-w-2xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
            <div className="text-center mb-6">
              <div className="editorial-stamp w-16 h-16 text-[#C23B22] text-2xl mx-auto mb-3">
                TS
              </div>
              <h2 className="text-2xl font-display text-[#1A1A1A]">Quiz Complete!</h2>
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
              onClick={() => dispatch({ type: 'NEW_GAME' })}
              className="w-full mt-4 btn-gold py-3 sm:py-4 font-bold text-base sm:text-lg"
            >
              New Game
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
          onClose={() => dispatch({ type: 'SET_FIELD', field: 'showLeaderboard', value: false })}
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
