import React from 'react'

export default function Leaderboard({ players, answers, selectedThemes, themes, onClose, isOverlay = true }) {
  const getPercentageColor = (percentage) => {
    if (percentage <= 20) return 'bg-lime-500/20 text-lime-400 border border-lime-500/30'
    if (percentage <= 40) return 'bg-green-500/20 text-green-400 border border-green-500/30'
    if (percentage <= 60) return 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
    if (percentage <= 80) return 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
    return 'bg-red-500/20 text-red-400 border border-red-500/30'
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
    const name = themeName?.toLowerCase() || ''
    if (name.includes('africa')) return '🌍'
    if (name.includes('asia')) return '🌏'
    if (name.includes('europe') || name.includes('capital')) return '🏛️'
    return '📚'
  }

  const content = (
    <div className={`leaderboard-card ${isOverlay ? 'w-full' : ''}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 via-orange-500 to-cyan-600 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl trophy-animation">🏆</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Leaderboard</h2>
              <p className="text-slate-800/70 text-xs sm:text-sm">Final Results</p>
            </div>
          </div>
          {isOverlay && (
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-slate-900/20 hover:bg-slate-900/30 rounded-full text-slate-900 font-bold transition-all text-lg"
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
            <tr className="border-b-2 border-slate-700">
              <th className="text-left py-2 sm:py-3 px-2 font-bold text-slate-300 text-xs sm:text-sm sticky left-0 bg-slate-800 z-10">
                Player
              </th>
              {selectedThemes.map((themeId, index) => {
                const theme = themes.find(t => t.id === themeId)
                return (
                  <th key={themeId} className="text-center py-2 sm:py-3 px-1 sm:px-2 font-semibold text-slate-300 min-w-[70px] sm:min-w-[100px]">
                    <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                      <span className="text-base sm:text-lg">{getThemeIcon(theme?.name)}</span>
                      <span className="text-[10px] sm:text-xs text-slate-500 truncate max-w-[60px] sm:max-w-[90px]">
                        {theme?.name}
                      </span>
                    </div>
                  </th>
                )
              })}
              <th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-bold text-cyan-400 bg-cyan-500/10 rounded-t-lg text-xs sm:text-sm">
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
                  className={`border-b border-slate-700/50 transition-colors ${
                    isLeader ? 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10' : 'hover:bg-slate-700/30'
                  }`}
                >
                  <td className={`py-2 sm:py-3 px-2 font-medium sticky left-0 z-10 ${
                    isLeader ? 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10' : 'bg-slate-800'
                  }`}>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="text-base sm:text-lg">{getMedalEmoji(playerIndex)}</span>
                      <span className={`text-xs sm:text-sm ${isLeader ? 'text-amber-400 font-bold' : 'text-slate-200'}`}>
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
                            <span className="text-[9px] sm:text-xs text-slate-500 truncate max-w-[50px] sm:max-w-[80px]">
                              {answer.option}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-600 text-xs">-</span>
                        )}
                      </td>
                    )
                  })}
                  <td className={`py-2 sm:py-3 px-2 sm:px-4 text-center bg-cyan-500/10 ${
                    isLeader ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20' : ''
                  }`}>
                    <span className={`text-base sm:text-xl font-bold ${isLeader ? 'text-amber-400' : 'text-cyan-400'}`}>
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
      <div className="p-3 sm:p-4 border-t border-slate-700 bg-gradient-to-r from-cyan-500/5 to-orange-500/5">
        <p className="text-xs sm:text-sm text-cyan-400 text-center flex items-center justify-center gap-2">
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
