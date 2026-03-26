import React from 'react'
import { badgeStyle } from '../utils/colors'
import { calculatePictureRoundScore, getPictureRoundScoreColor } from '../utils/pictureRound'

export default function PictureRoundResults({
  players,
  picture,
  guesses,
  pictureIndex,
  onContinue
}) {
  // Compute player results sorted by score (lowest first)
  const playerResults = players.map(player => {
    const guess = guesses[player] ?? 0
    const score = calculatePictureRoundScore(guess, picture.correctNumber)
    return { player, guess, score }
  }).sort((a, b) => a.score - b.score)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 slide-up">
      {/* Round Complete Header */}
      <div className="game-card p-6 mb-6 text-center">
        <div className="editorial-stamp w-20 h-20 text-3xl mb-4 mx-auto">
          <span>🖼️</span>
        </div>
        <h2 className="text-2xl font-display text-[#1A1A1A] mb-2">
          Round Complete
        </h2>
        <p className="text-[#C23B22] font-display text-lg">
          {picture.title}
        </p>
      </div>

      {/* The Answer */}
      <div className="game-card p-6 mb-6 text-center">
        <p className="text-[#6B6560] text-sm uppercase tracking-wider font-bold mb-3">
          The Missing Number
        </p>
        <div className="bounce-in">
          <span className="text-3xl sm:text-4xl font-display text-[#C23B22]">
            {picture.correctNumber}
          </span>
        </div>
      </div>

      {/* Player Guesses - Ranked */}
      <div className="game-card p-6 mb-6">
        <h3 className="text-xl font-display text-[#1A1A1A] mb-5">Player Guesses</h3>

        <div className="stagger-in">
          {playerResults.map((result, index) => {
            const colors = getPictureRoundScoreColor(result.score)
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
                      guessed {result.guess} &mdash; {result.score === 0 ? 'exact!' : `${result.score} off`}
                    </span>
                  </div>
                </div>

                {/* Score badge */}
                <div className="flex-shrink-0">
                  <span style={{ ...badgeStyle(colors), whiteSpace: 'nowrap' }}>
                    {result.score} pts
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={onContinue}
        className="w-full btn-teal py-5 text-xl"
      >
        View Standings
      </button>
    </div>
  )
}
