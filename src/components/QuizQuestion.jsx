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
    const name = themeName.toLowerCase()
    if (name.includes('africa')) return '🌍'
    if (name.includes('asia')) return '🌏'
    if (name.includes('europe') || name.includes('capital')) return '🏛️'
    if (name.includes('states') || name.includes('america')) return '🗽'
    return '📚'
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 slide-up">
      {/* Question Header Card */}
      <div className="game-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Category icon and name */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#008080] to-[#006666] rounded-xl flex items-center justify-center shadow-lg border-3 border-[#20B2AA]">
              <span className="text-3xl emoji">{getThemeIcon(currentTheme.name)}</span>
            </div>
            <div>
              <h2 className="text-2xl font-display text-[#2C1810]">
                {currentTheme.name}
              </h2>
              <p className="text-[#008080] font-medium">
                {currentTheme.options.length} possible answers
              </p>
            </div>
          </div>

          {/* Answer counter */}
          <div className="sm:ml-auto">
            <div className="inline-flex items-center gap-3 bg-[#FDF6E3] border-2 border-[#E8DDB5] px-4 py-2 rounded-lg">
              <span className="text-[#8B7355]">Responses:</span>
              <span className="score-display">
                {answeredCount}/{players.length}
              </span>
            </div>
          </div>
        </div>

        {/* Tip */}
        <div className="mt-5 pt-4 border-t-2 border-[#E8DDB5]">
          <p className="text-[#8B7355] text-sm flex items-center gap-2">
            <span>💡</span>
            <span>Pick the most obscure answer you think is correct! Type to search.</span>
          </p>
        </div>
      </div>

      {/* Player Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 stagger-in">
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Waiting message */}
        <div className="text-center sm:text-left order-2 sm:order-1">
          {!allPlayersAnswered && (
            <p className="text-[#8B7355] text-sm flex items-center justify-center sm:justify-start gap-2">
              <span className="spotlight">⏳</span>
              <span>Waiting for {players.length - answeredCount} more answer{players.length - answeredCount !== 1 ? 's' : ''}...</span>
            </p>
          )}
        </div>

        {/* Action button */}
        <div className="order-1 sm:order-2">
          {isLastQuestion ? (
            <button
              onClick={onFinish}
              disabled={!allPlayersAnswered}
              className="w-full sm:w-auto btn-gold px-8 py-4 text-lg flex items-center justify-center gap-2"
            >
              <span>🏁</span>
              <span>{allPlayersAnswered ? 'Final Round!' : 'All Must Answer'}</span>
            </button>
          ) : (
            <button
              onClick={onNext}
              disabled={!allPlayersAnswered}
              className="w-full sm:w-auto btn-teal px-8 py-4 text-lg flex items-center justify-center gap-2"
            >
              <span>Next Round</span>
              <span>→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
