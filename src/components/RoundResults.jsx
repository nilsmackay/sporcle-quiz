import React from 'react'

export default function RoundResults({
  players,
  answers,
  currentQuestionIndex,
  currentTheme,
  onContinue
}) {
  const getScoreBadgeClass = (percentage) => {
    if (percentage <= 20) return 'score-badge-good'
    if (percentage <= 60) return 'score-badge-ok'
    return 'score-badge-bad'
  }

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

  const getMedalEmoji = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return ''
  }

  const getThemeIcon = (themeName) => {
    const name = themeName?.toLowerCase() || ''
    if (name.includes('africa')) return '🌍'
    if (name.includes('asia')) return '🌏'
    if (name.includes('europe') || name.includes('capital')) return '🏛️'
    if (name.includes('states') || name.includes('america')) return '🗽'
    return '📚'
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 slide-up">
      {/* Round Complete Header */}
      <div className="game-card p-6 mb-6 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#008080] to-[#006666] rounded-full mb-4 shadow-xl border-4 border-[#20B2AA]">
          <span className="text-4xl">{getThemeIcon(currentTheme.name)}</span>
        </div>
        <h2 className="text-2xl font-display text-[#2C1810] mb-2">
          Round Complete!
        </h2>
        <p className="text-[#008080] font-semibold text-lg">
          {currentTheme.name}
        </p>
      </div>

      {/* Player Results */}
      <div className="game-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-2xl">🎯</span>
          <h3 className="text-xl font-display text-[#2C1810]">Player Picks</h3>
        </div>

        <div className="space-y-3 stagger-in">
          {playerResults.map((result, index) => (
            <div
              key={result.player}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                index === 0
                  ? 'bg-gradient-to-r from-[#F4C430]/20 to-[#DAA520]/10 border-[#D4A017]'
                  : 'bg-[#FDF6E3] border-[#E8DDB5]'
              }`}
            >
              {/* Medal and name */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-2xl">{getMedalEmoji(index)}</span>
                {index >= 3 && (
                  <span className="w-7 h-7 bg-[#E8DDB5] rounded-full flex items-center justify-center text-sm font-bold text-[#5D4037]">
                    {index + 1}
                  </span>
                )}
                <span className={`font-bold truncate ${index === 0 ? 'text-[#B8860B]' : 'text-[#2C1810]'}`}>
                  {result.player}
                </span>
              </div>

              {/* Answer and score */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <span className="text-sm text-[#5D4037] block truncate max-w-[120px]">
                    {result.option}
                  </span>
                  {result.rank && (
                    <span className="text-xs text-[#008080]">
                      {result.rank}{getRankSuffix(result.rank)} most obscure
                    </span>
                  )}
                </div>
                <span className={getScoreBadgeClass(result.percentage)}>
                  {result.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best & Worst Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Best 3 */}
        <div className="game-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🌟</span>
            <h4 className="font-display text-[#2C1810]">Most Obscure</h4>
          </div>
          <div className="space-y-2">
            {best3.map((opt, index) => (
              <div key={opt.name} className="flex items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[#228B22] font-bold w-5">{index + 1}.</span>
                  <span className="text-[#2C1810] truncate">{opt.name}</span>
                </div>
                <span className="score-badge-good">{opt.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Worst 3 */}
        <div className="game-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📊</span>
            <h4 className="font-display text-[#2C1810]">Most Common</h4>
          </div>
          <div className="space-y-2">
            {worst3.map((opt, index) => (
              <div key={opt.name} className="flex items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[#CD5C5C] font-bold w-5">{sortedOptions.length - 2 + index}.</span>
                  <span className="text-[#2C1810] truncate">{opt.name}</span>
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
        className="w-full btn-teal py-5 text-xl flex items-center justify-center gap-3"
      >
        <span>📊</span>
        <span>View Standings</span>
      </button>
    </div>
  )
}
