import React from 'react'

export default function Header({ phase, currentQuestionIndex, totalQuestions, themeName, showLeaderboard, setShowLeaderboard, onNewGame }) {
  return (
    <header className="quiz-header text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        {/* Top row - Title and buttons */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="text-2xl sm:text-3xl">🧠</span>
            <h1 className="text-lg sm:text-xl font-bold truncate">Quiz Master</h1>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {(phase === 'playing' || phase === 'picking' || phase === 'finished') && (
              <button
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium hover:bg-white/30 transition-all text-xs sm:text-sm border border-white/30"
              >
                <span className="hidden sm:inline">🏆</span>
                <span>{showLeaderboard ? 'Hide' : 'Scores'}</span>
              </button>
            )}
            {phase === 'finished' && (
              <button
                onClick={onNewGame}
                className="flex items-center gap-1 bg-emerald-500 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium hover:bg-emerald-400 transition-all text-xs sm:text-sm shadow-lg"
              >
                <span className="hidden sm:inline">🔄</span>
                <span>New</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom row - Progress info (only when playing) */}
        {phase === 'playing' && (
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border border-white/20">
              <span className="font-bold text-amber-300">{currentQuestionIndex + 1}</span>
              <span className="text-white/70">/</span>
              <span>{totalQuestions}</span>
            </div>
            {themeName && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border border-white/20 truncate max-w-[200px] sm:max-w-none">
                <span>📚</span>
                <span className="truncate">{themeName}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
