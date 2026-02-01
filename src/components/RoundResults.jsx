import React from 'react'

export default function RoundResults({
  players,
  answers,
  currentQuestionIndex,
  currentTheme,
  onContinue
}) {
  const getPercentageColor = (percentage) => {
    if (percentage <= 20) return 'bg-emerald-100 text-emerald-700 border border-emerald-200'
    if (percentage <= 40) return 'bg-green-100 text-green-700 border border-green-200'
    if (percentage <= 60) return 'bg-amber-100 text-amber-700 border border-amber-200'
    if (percentage <= 80) return 'bg-orange-100 text-orange-700 border border-orange-200'
    return 'bg-red-100 text-red-700 border border-red-200'
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
    return '📚'
  }

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
      {/* Header */}
      <div className="quiz-card p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
            <span className="text-3xl sm:text-4xl">{getThemeIcon(currentTheme.name)}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            Round Results
          </h2>
          <p className="text-purple-600 text-sm sm:text-base">
            {currentTheme.name}
          </p>
        </div>
      </div>

      {/* Player Results */}
      <div className="quiz-card p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl sm:text-2xl">🎯</span>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">Player Picks</h3>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {playerResults.map((result, index) => (
            <div
              key={result.player}
              className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl transition-all ${
                index === 0
                  ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200'
                  : 'bg-purple-50 border border-purple-100'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-lg sm:text-xl">{getMedalEmoji(index)}</span>
                <span className={`font-semibold truncate text-sm sm:text-base ${
                  index === 0 ? 'text-amber-800' : 'text-gray-800'
                }`}>
                  {result.player}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="text-right">
                  <span className="text-xs sm:text-sm text-gray-600 block truncate max-w-[100px] sm:max-w-[150px]">
                    {result.option}
                  </span>
                  {result.rank && (
                    <span className="text-xs text-purple-500">
                      {result.rank}{getRankSuffix(result.rank)} best
                    </span>
                  )}
                </div>
                <span className={`inline-block px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-bold ${getPercentageColor(result.percentage)}`}>
                  {result.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best & Worst Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 sm:mb-6">
        {/* Best 3 */}
        <div className="quiz-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🌟</span>
            <h4 className="font-bold text-gray-800 text-sm sm:text-base">Best Answers</h4>
          </div>
          <div className="space-y-2">
            {best3.map((opt, index) => (
              <div key={opt.name} className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-emerald-500 font-bold w-4">{index + 1}.</span>
                  <span className="text-gray-700 truncate">{opt.name}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPercentageColor(opt.percentage)}`}>
                  {opt.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Worst 3 */}
        <div className="quiz-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📊</span>
            <h4 className="font-bold text-gray-800 text-sm sm:text-base">Most Common</h4>
          </div>
          <div className="space-y-2">
            {worst3.map((opt, index) => (
              <div key={opt.name} className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-red-400 font-bold w-4">{sortedOptions.length - 2 + index}.</span>
                  <span className="text-gray-700 truncate">{opt.name}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPercentageColor(opt.percentage)}`}>
                  {opt.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={onContinue}
        className="w-full btn-primary py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg shadow-xl flex items-center justify-center gap-2"
      >
        <span>📊</span>
        <span>View Standings</span>
      </button>
    </div>
  )
}
