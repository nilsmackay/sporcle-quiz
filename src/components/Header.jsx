import React, { useState } from 'react'

export default function Header({
  phase,
  currentQuestionIndex,
  totalQuestions,
  themeName,
  showLeaderboard,
  setShowLeaderboard,
  onNewGame,
  youtubeVideoIndex,
  totalYouTubeVideos,
  sampleHitsterIndex,
  totalSampleHitsterSongs
}) {
  const [showConfirm, setShowConfirm] = useState(false)

  const isInGame = phase !== 'setup'
  const showScoresButton = (
    phase === 'playing' || phase === 'picking' || phase === 'round-results' ||
    phase === 'standings' || phase === 'finished' ||
    phase === 'youtube-playing' || phase === 'youtube-results' || phase === 'youtube-standings' ||
    phase === 'sample-hitster-playing' || phase === 'sample-hitster-results' || phase === 'sample-hitster-standings'
  )

  const handleNewGameClick = () => {
    if (phase === 'finished') {
      onNewGame()
    } else {
      setShowConfirm(true)
    }
  }

  const handleConfirm = () => {
    setShowConfirm(false)
    onNewGame()
  }

  return (
    <header className="show-header">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Main header row */}
        <div className="flex items-center justify-between">
          {/* Logo - editorial stamp */}
          <div className="flex items-center gap-3">
            <div className="editorial-stamp w-12 h-12 text-[#C23B22] text-2xl">
              T
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display text-[#1A1A1A] tracking-wide">
                Trivia Showdown
              </h1>
              {phase === 'setup' && (
                <p className="text-[#6B6560] text-xs sm:text-sm">Get ready to play!</p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {showScoresButton && (
              <button
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="flex items-center gap-2 border-2 border-[#1A1A1A] text-[#1A1A1A] px-3 sm:px-4 py-2 font-semibold text-sm hover:bg-[#1A1A1A] hover:text-white transition-all"
              >
                <span className="hidden sm:inline">{showLeaderboard ? 'Hide' : 'Scores'}</span>
                <span className="sm:hidden">Scores</span>
              </button>
            )}
            {isInGame && (
              <button
                onClick={handleNewGameClick}
                className="flex items-center gap-2 bg-[#C23B22] text-white px-3 sm:px-4 py-2 font-semibold text-sm hover:bg-[#A33020] transition-all"
              >
                <span className="hidden sm:inline">New Game</span>
                <span className="sm:hidden">New</span>
              </button>
            )}
          </div>
        </div>

        {/* New Game confirmation modal */}
        {showConfirm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          >
            <div
              className="bg-white border border-[#D4CFC7] mx-4 p-6 max-w-sm w-full animate-bounce-in"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-display text-[#1A1A1A] mb-2">Start New Game?</h3>
              <p className="text-[#6B6560] text-sm mb-6">
                Your current game progress will be lost. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 btn-teal py-2 font-semibold text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 btn-gold py-2 font-semibold text-sm"
                >
                  New Game
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Progress bar - YouTube round */}
        {phase === 'youtube-playing' && (
          <div className="mt-4 flex items-center gap-4">
            <div className="score-display text-lg">
              V{youtubeVideoIndex + 1}/{totalYouTubeVideos}
            </div>

            <div className="flex-1 h-[2px] bg-[#D4CFC7] overflow-hidden">
              <div
                className="h-full bg-[#C23B22] transition-all duration-500"
                style={{ width: `${((youtubeVideoIndex + 1) / totalYouTubeVideos) * 100}%` }}
              />
            </div>

            <div className="hidden md:flex items-center gap-3 border-l border-[#D4CFC7] pl-4">
              <span className="text-[#1A1A1A] font-display">Round 1: YouTube Views</span>
            </div>
          </div>
        )}

        {/* Progress bar - Sample Hitster round */}
        {phase === 'sample-hitster-playing' && (
          <div className="mt-4 flex items-center gap-4">
            <div className="score-display text-lg">
              S{sampleHitsterIndex + 1}/{totalSampleHitsterSongs}
            </div>

            <div className="flex-1 h-[2px] bg-[#D4CFC7] overflow-hidden">
              <div
                className="h-full bg-[#C23B22] transition-all duration-500"
                style={{ width: `${((sampleHitsterIndex + 1) / totalSampleHitsterSongs) * 100}%` }}
              />
            </div>

            <div className="hidden md:flex items-center gap-3 border-l border-[#D4CFC7] pl-4">
              <span className="text-[#1A1A1A] font-display">Round 2: Sample Hitster</span>
            </div>
          </div>
        )}

        {/* Progress bar - Sporcle round */}
        {phase === 'playing' && (
          <div className="mt-4 flex items-center gap-4">
            <div className="score-display text-lg">
              Q{currentQuestionIndex + 1}/{totalQuestions}
            </div>

            <div className="flex-1 h-[2px] bg-[#D4CFC7] overflow-hidden">
              <div
                className="h-full bg-[#C23B22] transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>

            {themeName && (
              <div className="hidden md:flex items-center gap-3 border-l border-[#D4CFC7] pl-4">
                <span className="text-[#1A1A1A] font-display truncate max-w-[200px]">
                  Round 2: {themeName}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Mobile round label */}
        {(phase === 'youtube-playing' || phase === 'sample-hitster-playing' || phase === 'playing') && (
          <div className="mt-2 md:hidden">
            <span className="text-xs text-[#6B6560] uppercase tracking-wider font-bold">
              {phase === 'youtube-playing' ? 'Round 1: YouTube Views' : phase === 'sample-hitster-playing' ? 'Round 2: Sample Hitster' : 'The Sporcle Round'}
            </span>
          </div>
        )}
      </div>
    </header>
  )
}
