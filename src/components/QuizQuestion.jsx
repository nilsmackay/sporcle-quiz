import React from 'react'
import PlayerDropdown from './PlayerDropdown'

export default function QuizQuestion({
  players,
  currentTheme,
  currentQuestionIndex,
  answers,
  onAnswer,
  onNext,
  isLastQuestion,
  onFinish
}) {
  const allPlayersAnswered = players.every(
    player => answers[player]?.[currentQuestionIndex]
  )

  const answeredCount = players.filter(
    player => answers[player]?.[currentQuestionIndex]
  ).length

  const getThemeIcon = (themeName) => {
    if (themeName.toLowerCase().includes('countr') || themeName.toLowerCase().includes('africa')) return '🌍'
    if (themeName.toLowerCase().includes('capital') || themeName.toLowerCase().includes('europe')) return '🏛️'
    if (themeName.toLowerCase().includes('state') || themeName.toLowerCase().includes('us')) return '🇺🇸'
    return '📚'
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
      {/* Question Header */}
      <div className="quiz-card p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl sm:text-3xl">{getThemeIcon(currentTheme.name)}</span>
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
                {currentTheme.name}
              </h2>
              <p className="text-purple-600 text-xs sm:text-sm font-medium">
                {currentTheme.options.length} possible answers
              </p>
            </div>
          </div>
          <div className="flex-1 flex justify-end">
            <div className="bg-purple-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
              <span className="text-purple-700 font-medium text-xs sm:text-sm">
                {answeredCount}/{players.length} answered
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-purple-100">
          <p className="text-gray-600 text-xs sm:text-sm flex items-center gap-2">
            <span>💡</span>
            <span>Pick the most obscure answer you think is correct! Type to search quickly.</span>
          </p>
        </div>
      </div>

      {/* Player Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {players.map((player, index) => (
          <PlayerDropdown
            key={player}
            player={player}
            playerIndex={index}
            options={currentTheme.options}
            selectedAnswer={answers[player]?.[currentQuestionIndex]}
            onSelect={(playerName, answer) => onAnswer(playerName, currentQuestionIndex, answer)}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="text-center sm:text-left order-2 sm:order-1">
          {!allPlayersAnswered && (
            <p className="text-purple-200 text-xs sm:text-sm flex items-center justify-center sm:justify-start gap-2">
              <span className="pulse-animation">⏳</span>
              <span>Waiting for {players.length - answeredCount} more answer{players.length - answeredCount !== 1 ? 's' : ''}...</span>
            </p>
          )}
        </div>

        <div className="order-1 sm:order-2">
          {isLastQuestion ? (
            <button
              onClick={onFinish}
              disabled={!allPlayersAnswered}
              className={`w-full sm:w-auto btn-success px-6 sm:px-8 py-3 text-sm sm:text-lg flex items-center justify-center gap-2 ${
                !allPlayersAnswered ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span>🏁</span>
              <span>{allPlayersAnswered ? 'Finish Quiz!' : 'All must answer'}</span>
            </button>
          ) : (
            <button
              onClick={onNext}
              disabled={!allPlayersAnswered}
              className={`w-full sm:w-auto btn-primary px-6 sm:px-8 py-3 text-sm sm:text-lg flex items-center justify-center gap-2 ${
                !allPlayersAnswered ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span>Next Question</span>
              <span>→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
