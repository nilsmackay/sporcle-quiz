import React from 'react'
import { getPercentageColor } from '../utils/colors'
import { getThemeIcon } from '../utils/themes'

export default function RoundResults({
  players,
  answers,
  currentQuestionIndex,
  currentTheme,
  onContinue
}) {
  // Compute min/max from theme options for consistent color grading
  const percentages = currentTheme.options.map(opt => opt.percentage)
  const minPercent = Math.min(...percentages)
  const maxPercent = Math.max(...percentages)

  // Get all options sorted by percentage (lowest/best first)
  const sortedOptions = [...currentTheme.options].sort((a, b) => a.percentage - b.percentage)

  // Create a map of option name to rank
  const optionRanks = {}
  sortedOptions.forEach((opt, index) => {
    optionRanks[opt.name] = index + 1
  })

  // Get player results for this round, sorted by percentage (best first)
  const playerResults = players.map(player => {
    const answer = answers[player]?.[currentQuestionIndex]
    return {
      player,
      option: answer?.option || 'No answer',
      percentage: answer?.percentage ?? 100,
      rank: answer?.option === 'invalid' ? null : optionRanks[answer?.option] || null
    }
  }).sort((a, b) => a.percentage - b.percentage)

  // Best 3 and worst 3 options
  const best3 = sortedOptions.slice(0, 3)
  const worst3 = sortedOptions.slice(-3)

  const getRankSuffix = (rank) => {
    if (!rank) return ''
    if (rank % 100 >= 11 && rank % 100 <= 13) return 'th'
    switch (rank % 10) {
      case 1: return 'st'
      case 2: return 'nd'
      case 3: return 'rd'
      default: return 'th'
    }
  }


  return (
    <div className="max-w-2xl mx-auto px-4 py-6 slide-up">
      {/* Round Complete Header */}
      <div className="game-card p-6 mb-6 text-center">
        <div className="editorial-stamp w-20 h-20 text-3xl mb-4 mx-auto">
          <span className="emoji">{getThemeIcon(currentTheme.name)}</span>
        </div>
        <h2 className="text-2xl font-display text-[#1A1A1A] mb-2">
          Round Complete
        </h2>
        <p className="text-[#C23B22] font-display text-lg">
          {currentTheme.name}
        </p>
      </div>

      {/* Player Results */}
      <div className="game-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <h3 className="text-xl font-display text-[#1A1A1A]">Player Picks</h3>
        </div>

        <div className="stagger-in">
          {playerResults.map((result, index) => (
            <div
              key={result.player}
              className={`flex items-center gap-4 py-4 ${
                index < playerResults.length - 1 ? 'border-b border-[#D4CFC7]' : ''
              }`}
            >
              {/* Rank stamp */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="editorial-stamp w-7 h-7 text-xs flex-shrink-0">
                  {index + 1}
                </div>
                <span className={`font-bold truncate ${index === 0 ? 'text-[#C23B22]' : 'text-[#1A1A1A]'}`}>
                  {result.player}
                </span>
              </div>

              {/* Answer and score */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <span className="text-sm text-[#6B6560] block truncate max-w-[120px]">
                    {result.option}
                  </span>
                  {result.rank && (
                    <span className="text-xs text-[#6B6560] hidden sm:block">
                      {result.rank}{getRankSuffix(result.rank)} most obscure
                    </span>
                  )}
                </div>
                {(() => {
                  const colors = getPercentageColor(result.percentage, minPercent, maxPercent)
                  return (
                    <span style={{
                      backgroundColor: colors.bg,
                      color: colors.text,
                      padding: '3px 10px',
                      fontSize: '12px',
                      fontFamily: "'Fraunces', serif",
                      fontWeight: 'bold'
                    }}>
                      {result.percentage}%
                    </span>
                  )
                })()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best & Worst Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Best 3 */}
        <div className="game-card p-5">
          <h4 className="font-display text-[#1A1A1A] mb-4">Most Obscure</h4>
          <div className="space-y-2">
            {best3.map((opt, index) => (
              <div key={opt.name} className="flex items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[#2D6A4F] font-bold w-5">{index + 1}.</span>
                  <span className="text-[#1A1A1A] truncate">{opt.name}</span>
                </div>
                <span className="score-badge-good">{opt.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Worst 3 */}
        <div className="game-card p-5">
          <h4 className="font-display text-[#1A1A1A] mb-4">Most Common</h4>
          <div className="space-y-2">
            {worst3.map((opt, index) => (
              <div key={opt.name} className="flex items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[#C23B22] font-bold w-5">{sortedOptions.length - 2 + index}.</span>
                  <span className="text-[#1A1A1A] truncate">{opt.name}</span>
                </div>
                <span className="score-badge-bad">{opt.percentage}%</span>
              </div>
            ))}
          </div>
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
