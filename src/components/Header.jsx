import React from 'react'

export default function Header({ phase, currentQuestionIndex, totalQuestions, themeName, showLeaderboard, setShowLeaderboard, onNewGame }) {
  return (
    <header className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Quiz Dashboard</h1>
          {phase === 'playing' && (
            <span className="bg-indigo-500 px-3 py-1 rounded-full text-sm">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
          )}
          {phase === 'playing' && themeName && (
            <span className="bg-indigo-700 px-3 py-1 rounded-full text-sm">
              {themeName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {(phase === 'playing' || phase === 'finished') && (
            <button
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
            >
              {showLeaderboard ? 'Hide Leaderboard' : 'View Leaderboard'}
            </button>
          )}
          {phase === 'finished' && (
            <button
              onClick={onNewGame}
              className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              New Game
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
