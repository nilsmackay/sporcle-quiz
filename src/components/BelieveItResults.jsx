import React from 'react'
import { badgeStyle } from '../utils/colors'
import { calculateBelieveItScore, getBelieveItScoreColor } from '../utils/believeIt'

export default function BelieveItResults({
  players,
  statement,
  guesses,
  statementIndex,
  isExample,
  onContinue,
  onSkipExample
}) {
  const realNumber = statementIndex

  // Compute player results sorted by score (lowest first)
  const playerResults = players.map(player => {
    const guess = guesses[player] ?? 0
    const score = calculateBelieveItScore(guess, statement.isTrue)
    return { player, guess, score }
  }).sort((a, b) => a.score - b.score)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 slide-up">
      {/* Round Complete Header */}
      <div className="game-card p-6 mb-6 text-center">
        <div className="editorial-stamp w-20 h-20 text-3xl mb-4 mx-auto">
          <span>🤔</span>
        </div>
        <h2 className="text-2xl font-display text-[#1A1A1A] mb-2">
          {isExample ? 'Practice Round' : `Statement ${realNumber}`}
        </h2>

        {/* Statement */}
        <p className="text-[#6B6560] text-sm italic mb-4 max-w-md mx-auto">
          "{statement.statement}"
        </p>

        <div className="bounce-in">
          <p className="text-[#6B6560] text-sm uppercase tracking-wider font-bold mb-3">
            The Answer
          </p>
          <span className={`text-3xl sm:text-4xl font-display ${statement.isTrue ? 'text-[#2D6A4F]' : 'text-[#C23B22]'}`}>
            {statement.isTrue ? 'TRUE' : 'FALSE'}
          </span>
        </div>

        {statement.background && (
          <p className="mt-4 text-sm text-[#6B6560] max-w-md mx-auto leading-relaxed">
            {statement.background}
          </p>
        )}
      </div>

      {/* Practice Round Banner */}
      {isExample && (
        <div className="game-card p-4 mb-6 border-2 border-[#B8924A] bg-[#F7F3ED] text-center">
          <p className="font-display text-[#B8924A]">Practice Round — No Points Awarded!</p>
        </div>
      )}

      {/* Player Guesses - Ranked */}
      <div className="game-card p-6 mb-6">
        <h3 className="text-xl font-display text-[#1A1A1A] mb-5">Player Guesses</h3>

        <div className="stagger-in">
          {playerResults.map((result, index) => {
            const colors = getBelieveItScoreColor(result.score)
            return (
              <div
                key={result.player}
                className={`flex items-center gap-3 py-4 ${
                  index < playerResults.length - 1 ? 'border-b border-[#D4CFC7]' : ''
                }`}
              >
                {/* Rank + name */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="editorial-stamp w-7 h-7 text-xs flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <span className={`font-bold truncate block ${index === 0 ? 'text-[#C23B22]' : 'text-[#1A1A1A]'}`}>
                      {result.player}
                    </span>
                    <span className="text-xs text-[#6B6560]">
                      confidence: {result.guess}/10 {result.score === 0 ? '— perfect!' : ''}
                    </span>
                  </div>
                </div>

                {/* Score badge */}
                <div className="flex-shrink-0">
                  <span style={{ ...badgeStyle(colors), whiteSpace: 'nowrap' }}>
                    {isExample ? `(${result.score} pts)` : `${result.score} pts`}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Continue Button */}
      {isExample ? (
        <button
          onClick={onSkipExample}
          className="w-full btn-gold py-5 text-xl"
        >
          Start the Real Questions!
        </button>
      ) : (
        <button
          onClick={onContinue}
          className="w-full btn-teal py-5 text-xl"
        >
          View Standings
        </button>
      )}
    </div>
  )
}
