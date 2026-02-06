import React from 'react'

export default function Header({ phase, currentQuestionIndex, totalQuestions, themeName, showLeaderboard, setShowLeaderboard, onNewGame }) {
  return (
    <header className="show-header text-white">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Main header row */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#F4C430] to-[#B8860B] rounded-lg flex items-center justify-center shadow-lg border-2 border-[#F4C430]/50">
              <span className="text-2xl">🎯</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display tracking-wide shine-text">
                Trivia Showdown
              </h1>
              {phase === 'setup' && (
                <p className="text-[#F4C430]/80 text-xs sm:text-sm">Get ready to play!</p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {(phase === 'playing' || phase === 'picking' || phase === 'round-results' || phase === 'standings' || phase === 'finished') && (
              <button
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="flex items-center gap-2 bg-[#F4C430] text-[#5D2E0C] px-3 sm:px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#F4C430]/90 transition-all shadow-md border-2 border-[#B8860B]"
              >
                <span>🏆</span>
                <span className="hidden sm:inline">{showLeaderboard ? 'Hide' : 'Scores'}</span>
              </button>
            )}
            {phase === 'finished' && (
              <button
                onClick={onNewGame}
                className="flex items-center gap-2 bg-[#20B2AA] text-white px-3 sm:px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#20B2AA]/90 transition-all shadow-md border-2 border-[#008080]"
              >
                <span>🔄</span>
                <span className="hidden sm:inline">New Game</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress bar - only during play */}
        {phase === 'playing' && (
          <div className="mt-4 flex items-center gap-4">
            {/* Question counter */}
            <div className="score-display text-lg">
              Q{currentQuestionIndex + 1}/{totalQuestions}
            </div>

            {/* Progress bar */}
            <div className="flex-1 h-4 bg-[#5D2E0C] rounded-full border-2 border-[#CD853F] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#20B2AA] via-[#F4C430] to-[#20B2AA] transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>

            {/* Theme name */}
            {themeName && (
              <div className="hidden md:flex items-center gap-2 bg-[#5D2E0C]/80 px-4 py-2 rounded-lg border-2 border-[#CD853F]">
                <span>📚</span>
                <span className="text-[#F4C430] font-semibold truncate max-w-[200px]">{themeName}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
