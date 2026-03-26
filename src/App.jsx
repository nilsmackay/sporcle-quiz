import React, { useReducer, useEffect } from 'react'
import Header from './components/Header'
import Setup from './components/Setup'
import QuizQuestion from './components/QuizQuestion'
import QuestionPicker from './components/QuestionPicker'
import RoundResults from './components/RoundResults'
import Leaderboard from './components/Leaderboard'
import YouTubeQuestion from './components/YouTubeQuestion'
import YouTubeResults from './components/YouTubeResults'
import SampleHitsterQuestion from './components/SampleHitsterQuestion'
import SampleHitsterResults from './components/SampleHitsterResults'
import PictureRoundQuestion from './components/PictureRoundQuestion'
import PictureRoundResults from './components/PictureRoundResults'
import PasswordGate from './components/PasswordGate'
import themes from './data/themes.json'
import YOUTUBE_VIDEOS from './data/youtube-videos.js'
import PICTURE_ROUND_IMAGES from './data/picture-round-images.js'
import SAMPLE_HITSTER_SONGS from './data/sample-hitster-songs.js'
import { gameReducer, initialState, loadSavedState, saveState } from './gameReducer'
import { getThemeById } from './utils/themes'

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, null, loadSavedState)

  // Persist state to localStorage on every change
  useEffect(() => {
    saveState(state)
  }, [state])

  const {
    phase, players, selectedThemes, currentQuestionIndex, answers,
    showLeaderboard, isDynamicMode, dynamicQuestionCount, currentPicker,
    playedThemes, dynamicAvailableThemes, youtubeVideoIndex,
    youtubeGuesses, pictureRoundIndex, pictureRoundGuesses,
    sampleHitsterIndex, sampleHitsterGuesses, sampleHitsterBonuses,
    editReturnState, enabledRounds,
  } = state

  // Scroll to top on phase/question change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [phase, currentQuestionIndex, youtubeVideoIndex, pictureRoundIndex, sampleHitsterIndex])

  // Derived state
  const activeThemes = isDynamicMode ? playedThemes : selectedThemes
  const currentTheme = activeThemes[currentQuestionIndex]
    ? getThemeById(activeThemes[currentQuestionIndex])
    : null
  const totalQuestions = isDynamicMode ? dynamicQuestionCount : selectedThemes.length
  const isLastQuestion = isDynamicMode
    ? playedThemes.length >= dynamicQuestionCount
    : currentQuestionIndex === selectedThemes.length - 1
  const isLastYouTubeVideo = youtubeVideoIndex === YOUTUBE_VIDEOS.length - 1
  const isLastPicture = pictureRoundIndex === PICTURE_ROUND_IMAGES.length - 1
  const isLastSampleHitsterSong = sampleHitsterIndex === SAMPLE_HITSTER_SONGS.length - 1
  const isEditing = editReturnState !== null
  const isYouTubePhase = phase === 'youtube-playing' || phase === 'youtube-results' || phase === 'youtube-standings'
  const isPictureRoundPhase = phase === 'picture-round-playing' || phase === 'picture-round-results' || phase === 'picture-round-standings'
  const isSampleHitsterPhase = phase === 'sample-hitster-playing' || phase === 'sample-hitster-results' || phase === 'sample-hitster-standings'
  const isPreSporclePhase = isYouTubePhase || isPictureRoundPhase || isSampleHitsterPhase

  // Field setter helper — lets Setup use the same setX={setField('x')} interface
  const setField = (field) => (value) => dispatch({ type: 'SET_FIELD', field, value })

  // Event handlers that dispatch actions
  const handleEditQuestion = (type, index) =>
    dispatch({ type: 'EDIT_QUESTION', questionType: type, index })

  const handleSaveAndReturn = () => dispatch({ type: 'SAVE_AND_RETURN' })
  const handleCancelEdit = () => dispatch({ type: 'CANCEL_EDIT' })

  return (
    <PasswordGate>
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
        pictureRoundIndex={pictureRoundIndex}
        totalPictureRoundImages={PICTURE_ROUND_IMAGES.length}
        sampleHitsterIndex={sampleHitsterIndex}
        totalSampleHitsterSongs={SAMPLE_HITSTER_SONGS.length}
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
            pictureRoundCount={PICTURE_ROUND_IMAGES.length}
            sampleHitsterSongCount={SAMPLE_HITSTER_SONGS.length}
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
          <div className="w-fit max-w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
            <Leaderboard
              players={players}
              answers={{}}
              selectedThemes={[]}
              themes={themes}
              onClose={() => dispatch({ type: 'YOUTUBE_CONTINUE_FROM_STANDINGS' })}
              isOverlay={false}
              youtubeGuesses={youtubeGuesses}
              youtubeVideos={YOUTUBE_VIDEOS}
              onEditQuestion={handleEditQuestion}
              defaultExpandedRound="youtube"
            />
            <button
              onClick={() => dispatch({ type: 'YOUTUBE_CONTINUE_FROM_STANDINGS' })}
              className="w-full mt-4 btn-gold py-3 sm:py-4 font-bold text-base sm:text-lg"
            >
              {isLastYouTubeVideo
                ? (enabledRounds.pictureRound ? 'Start Round 2: Picture Round'
                  : enabledRounds.sampleHitster ? 'Start Round 2: Sample Hitster'
                  : enabledRounds.sporcle ? 'Start Round 2: The Sporcle Round'
                  : 'Final Results')
                : 'Next Video'}
            </button>
          </div>
        )}

        {phase === 'picture-round-playing' && (
          <PictureRoundQuestion
            players={players}
            picture={PICTURE_ROUND_IMAGES[pictureRoundIndex]}
            pictureIndex={pictureRoundIndex}
            totalPictures={PICTURE_ROUND_IMAGES.length}
            onSubmitGuesses={(pictureIndex, guesses) =>
              dispatch({ type: 'SUBMIT_PICTURE_ROUND_GUESSES', pictureIndex, guesses })
            }
            isLastPicture={isLastPicture}
            isEditing={isEditing}
            onSaveAndReturn={handleSaveAndReturn}
            onCancelEdit={handleCancelEdit}
            committedGuesses={pictureRoundGuesses}
          />
        )}

        {phase === 'picture-round-results' && (
          <PictureRoundResults
            players={players}
            picture={PICTURE_ROUND_IMAGES[pictureRoundIndex]}
            guesses={
              Object.fromEntries(
                players.map(p => [p, pictureRoundGuesses[p]?.[pictureRoundIndex] ?? 0])
              )
            }
            pictureIndex={pictureRoundIndex}
            onContinue={() => dispatch({ type: 'SHOW_PICTURE_ROUND_STANDINGS' })}
          />
        )}

        {phase === 'picture-round-standings' && (
          <div className="w-fit max-w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
            <Leaderboard
              players={players}
              answers={{}}
              selectedThemes={[]}
              themes={themes}
              onClose={() => dispatch({ type: 'PICTURE_ROUND_CONTINUE_FROM_STANDINGS' })}
              isOverlay={false}
              youtubeGuesses={youtubeGuesses}
              youtubeVideos={YOUTUBE_VIDEOS}
              pictureRoundGuesses={pictureRoundGuesses}
              pictureRoundImages={PICTURE_ROUND_IMAGES}
              onEditQuestion={handleEditQuestion}
              defaultExpandedRound="pictureRound"
            />
            <button
              onClick={() => dispatch({ type: 'PICTURE_ROUND_CONTINUE_FROM_STANDINGS' })}
              className="w-full mt-4 btn-gold py-3 sm:py-4 font-bold text-base sm:text-lg"
            >
              {isLastPicture
                ? (enabledRounds.sampleHitster ? 'Start Round 3: Sample Hitster'
                  : enabledRounds.sporcle ? 'Start Round 3: The Sporcle Round'
                  : 'Final Results')
                : 'Next Picture'}
            </button>
          </div>
        )}

        {phase === 'sample-hitster-playing' && (
          <SampleHitsterQuestion
            players={players}
            song={SAMPLE_HITSTER_SONGS[sampleHitsterIndex]}
            songIndex={sampleHitsterIndex}
            totalSongs={SAMPLE_HITSTER_SONGS.length}
            onSubmitGuesses={(songIndex, guesses) =>
              dispatch({ type: 'SUBMIT_SAMPLE_HITSTER_GUESSES', songIndex, guesses })
            }
            isLastSong={isLastSampleHitsterSong}
            isEditing={isEditing}
            onSaveAndReturn={handleSaveAndReturn}
            onCancelEdit={handleCancelEdit}
            committedGuesses={sampleHitsterGuesses}
          />
        )}

        {phase === 'sample-hitster-results' && (
          <SampleHitsterResults
            players={players}
            song={SAMPLE_HITSTER_SONGS[sampleHitsterIndex]}
            guesses={
              Object.fromEntries(
                players.map(p => [p, sampleHitsterGuesses[p]?.[sampleHitsterIndex] ?? 0])
              )
            }
            songIndex={sampleHitsterIndex}
            bonuses={sampleHitsterBonuses}
            onToggleBonus={(player, songIndex, field, value) => {
              const current = sampleHitsterBonuses?.[player]?.[songIndex] ?? { artist: false, song: false }
              dispatch({
                type: 'SET_SAMPLE_HITSTER_BONUS',
                player,
                songIndex,
                artist: field === 'artist' ? value : current.artist,
                song: field === 'song' ? value : current.song,
              })
            }}
            onContinue={() => dispatch({ type: 'SHOW_SAMPLE_HITSTER_STANDINGS' })}
          />
        )}

        {phase === 'sample-hitster-standings' && (
          <div className="w-fit max-w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
            <Leaderboard
              players={players}
              answers={{}}
              selectedThemes={[]}
              themes={themes}
              onClose={() => dispatch({ type: 'SAMPLE_HITSTER_CONTINUE_FROM_STANDINGS' })}
              isOverlay={false}
              youtubeGuesses={youtubeGuesses}
              youtubeVideos={YOUTUBE_VIDEOS}
              pictureRoundGuesses={pictureRoundGuesses}
              pictureRoundImages={PICTURE_ROUND_IMAGES}
              sampleHitsterGuesses={sampleHitsterGuesses}
              sampleHitsterSongs={SAMPLE_HITSTER_SONGS}
              sampleHitsterBonuses={sampleHitsterBonuses}
              onEditQuestion={handleEditQuestion}
              defaultExpandedRound="sampleHitster"
            />
            <button
              onClick={() => dispatch({ type: 'SAMPLE_HITSTER_CONTINUE_FROM_STANDINGS' })}
              className="w-full mt-4 btn-gold py-3 sm:py-4 font-bold text-base sm:text-lg"
            >
              {isLastSampleHitsterSong
                ? (enabledRounds.sporcle ? 'Start Round 4: The Sporcle Round' : 'Final Results')
                : 'Next Song'}
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
            onSubmitRound={() => dispatch({ type: 'SHOW_ROUND_RESULTS' })}
            isLastQuestion={isLastQuestion}
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
          <div className="w-fit max-w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
            <Leaderboard
              players={players}
              answers={answers}
              selectedThemes={activeThemes}
              themes={themes}
              onClose={() => dispatch({ type: 'CONTINUE_FROM_STANDINGS' })}
              isOverlay={false}
              youtubeGuesses={youtubeGuesses}
              youtubeVideos={YOUTUBE_VIDEOS}
              pictureRoundGuesses={pictureRoundGuesses}
              pictureRoundImages={PICTURE_ROUND_IMAGES}
              sampleHitsterGuesses={sampleHitsterGuesses}
              sampleHitsterSongs={SAMPLE_HITSTER_SONGS}
              sampleHitsterBonuses={sampleHitsterBonuses}
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
          <div className="w-fit max-w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
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
              pictureRoundGuesses={pictureRoundGuesses}
              pictureRoundImages={PICTURE_ROUND_IMAGES}
              sampleHitsterGuesses={sampleHitsterGuesses}
              sampleHitsterSongs={SAMPLE_HITSTER_SONGS}
              sampleHitsterBonuses={sampleHitsterBonuses}
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
          answers={isPreSporclePhase ? {} : answers}
          selectedThemes={isPreSporclePhase ? [] : activeThemes}
          themes={themes}
          onClose={() => dispatch({ type: 'SET_FIELD', field: 'showLeaderboard', value: false })}
          youtubeGuesses={youtubeGuesses}
          youtubeVideos={YOUTUBE_VIDEOS}
          pictureRoundGuesses={isPictureRoundPhase || isSampleHitsterPhase || !isPreSporclePhase ? pictureRoundGuesses : {}}
          pictureRoundImages={isPictureRoundPhase || isSampleHitsterPhase || !isPreSporclePhase ? PICTURE_ROUND_IMAGES : []}
          sampleHitsterGuesses={isSampleHitsterPhase || !isPreSporclePhase ? sampleHitsterGuesses : {}}
          sampleHitsterSongs={isSampleHitsterPhase || !isPreSporclePhase ? SAMPLE_HITSTER_SONGS : []}
          sampleHitsterBonuses={sampleHitsterBonuses}
          onEditQuestion={handleEditQuestion}
          defaultExpandedRound={isYouTubePhase ? 'youtube' : isPictureRoundPhase ? 'pictureRound' : isSampleHitsterPhase ? 'sampleHitster' : 'sporcle'}
        />
      )}
    </div>
    </PasswordGate>
  )
}
