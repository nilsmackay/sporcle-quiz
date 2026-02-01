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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {currentTheme.name}
        </h2>
        <p className="text-gray-600">
          Select each player's answer from the dropdown. Type to search quickly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {players.map(player => (
          <PlayerDropdown
            key={player}
            player={player}
            options={currentTheme.options}
            selectedAnswer={answers[player]?.[currentQuestionIndex]}
            onSelect={(playerName, answer) => onAnswer(playerName, currentQuestionIndex, answer)}
          />
        ))}
      </div>

      <div className="flex justify-end">
        {isLastQuestion ? (
          <button
            onClick={onFinish}
            disabled={!allPlayersAnswered}
            className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg"
          >
            {allPlayersAnswered ? 'Finish Quiz' : 'All players must answer'}
          </button>
        ) : (
          <button
            onClick={onNext}
            disabled={!allPlayersAnswered}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-bold text-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg"
          >
            {allPlayersAnswered ? 'Next Question' : 'All players must answer'}
          </button>
        )}
      </div>
    </div>
  )
}
