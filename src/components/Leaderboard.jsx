import React from 'react'

export default function Leaderboard({ players, answers, selectedThemes, themes, onClose, isOverlay = true }) {
  const getPercentageColor = (percentage) => {
    if (percentage <= 20) return 'bg-emerald-100 text-emerald-700 border border-emerald-200'
    if (percentage <= 40) return 'bg-green-100 text-green-700 border border-green-200'
    if (percentage <= 60) return 'bg-amber-100 text-amber-700 border border-amber-200'
    if (percentage <= 80) return 'bg-orange-100 text-orange-700 border border-orange-200'
    return 'bg-red-100 text-red-700 border border-red-200'
  }

  const calculateTotalScore = (player) => {
    let total = 0
    selectedThemes.forEach((_, index) => {
      const answer = answers[player]?.[index]
      if (answer) {
        total += answer.percentage
      }
    })
    return total
  }

  const sortedPlayers = [...players].sort((a, b) => {
    return calculateTotalScore(a) - calculateTotalScore(b)
  })

  const lowestScore = sortedPlayers.length > 0 ? calculateTotalScore(sortedPlayers[0]) : null

  const getMedalEmoji = (index, isLeader) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return ''
  }

  const getThemeIcon = (themeName) => {
    if (themeName?.toLowerCase().includes('countr') || themeName?.toLowerCase().includes('africa')) return '🌍'
    if (themeName?.toLowerCase().includes('capital') || themeName?.toLowerCase().includes('europe')) return '🏛️'
    if (themeName?.toLowerCase().includes('state') || themeName?.toLowerCase().includes('us')) return '🇺🇸'
    return '📚'
  }

  const content = (
    <div className={`leaderboard-card ${isOverlay ? 'w-full' : ''}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl trophy-animation">🏆</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Leaderboard</h2>
              <p className="text-purple-200 text-xs sm:text-sm">Final Results</p>
            </div>
          </div>
          {isOverlay && (
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white font-bold transition-all text-lg"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="p-3 sm:p-4 overflow-x-auto">
        <table className="w-full min-w-[320px]">
          <thead>
            <tr className="border-b-2 border-purple-200">
              <th className="text-left py-2 sm:py-3 px-2 font-bold text-gray-700 text-xs sm:text-sm sticky left-0 bg-white z-10">
                Player
              </th>
              {selectedThemes.map((themeId, index) => {
                const theme = themes.find(t => t.id === themeId)
                return (
                  <th key={themeId} className="text-center py-2 sm:py-3 px-1 sm:px-2 font-semibold text-gray-700 min-w-[70px] sm:min-w-[100px]">
                    <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                      <span className="text-base sm:text-lg">{getThemeIcon(theme?.name)}</span>
                      <span className="text-[10px] sm:text-xs text-gray-500 truncate max-w-[60px] sm:max-w-[90px]">
                        {theme?.name}
                      </span>
                    </div>
                  </th>
                )
              })}
              <th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-bold text-gray-700 bg-purple-50 rounded-t-lg text-xs sm:text-sm">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, playerIndex) => {
              const totalScore = calculateTotalScore(player)
              const isLeader = totalScore === lowestScore

              return (
                <tr
                  key={player}
                  className={`border-b border-gray-100 transition-colors ${
                    isLeader ? 'bg-gradient-to-r from-amber-50 to-yellow-50' : 'hover:bg-purple-50/50'
                  }`}
                >
                  <td className={`py-2 sm:py-3 px-2 font-medium sticky left-0 z-10 ${
                    isLeader ? 'bg-gradient-to-r from-amber-50 to-yellow-50' : 'bg-white'
                  }`}>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="text-base sm:text-lg">{getMedalEmoji(playerIndex)}</span>
                      <span className={`text-xs sm:text-sm ${isLeader ? 'text-amber-800 font-bold' : 'text-gray-800'}`}>
                        {player}
                      </span>
                    </div>
                  </td>
                  {selectedThemes.map((_, index) => {
                    const answer = answers[player]?.[index]
                    return (
                      <td key={index} className="py-2 sm:py-3 px-1 sm:px-2 text-center">
                        {answer ? (
                          <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                            <span className={`inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold ${getPercentageColor(answer.percentage)}`}>
                              {answer.percentage}%
                            </span>
                            <span className="text-[9px] sm:text-xs text-gray-400 truncate max-w-[50px] sm:max-w-[80px]">
                              {answer.option}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-300 text-xs">-</span>
                        )}
                      </td>
                    )
                  })}
                  <td className={`py-2 sm:py-3 px-2 sm:px-4 text-center bg-purple-50 ${
                    isLeader ? 'bg-gradient-to-r from-amber-100 to-yellow-100' : ''
                  }`}>
                    <span className={`text-base sm:text-xl font-bold ${isLeader ? 'text-amber-600' : 'text-purple-700'}`}>
                      {totalScore}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-3 sm:p-4 border-t border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
        <p className="text-xs sm:text-sm text-purple-600 text-center flex items-center justify-center gap-2">
          <span>💡</span>
          <span>Lower scores win! Invalid answers = 100%</span>
        </p>
      </div>
    </div>
  )

  if (isOverlay) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div onClick={e => e.stopPropagation()}>
          {content}
        </div>
      </div>
    )
  }

  return content
}
