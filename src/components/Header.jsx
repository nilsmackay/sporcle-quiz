import React from 'react'

export default function Header({ phase, currentQuestionIndex, totalQuestions, themeName, showLeaderboard, setShowLeaderboard, onNewGame }) {
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
            {(phase === 'playing' || phase === 'picking' || phase === 'round-results' || phase === 'standings' || phase === 'finished') && (
              <button
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="flex items-center gap-2 border-2 border-[#1A1A1A] text-[#1A1A1A] px-3 sm:px-4 py-2 font-semibold text-sm hover:bg-[#1A1A1A] hover:text-white transition-all"
              >
                <span className="hidden sm:inline">{showLeaderboard ? 'Hide' : 'Scores'}</span>
                <span className="sm:hidden">Scores</span>
              </button>
            )}
            {phase === 'finished' && (
              <button
                onClick={onNewGame}
                className="flex items-center gap-2 bg-[#C23B22] text-white px-3 sm:px-4 py-2 font-semibold text-sm hover:bg-[#A33020] transition-all"
              >
                <span className="hidden sm:inline">New Game</span>
                <span className="sm:hidden">New</span>
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

            {/* Progress bar - thin editorial */}
            <div className="flex-1 h-[2px] bg-[#D4CFC7] overflow-hidden">
              <div
                className="h-full bg-[#C23B22] transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>

            {/* Theme name */}
            {themeName && (
              <div className="hidden md:flex items-center gap-3 border-l border-[#D4CFC7] pl-4">
                <span className="text-[#1A1A1A] font-display truncate max-w-[200px]">{themeName}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
