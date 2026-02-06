import React from 'react'

export default function Leaderboard({ players, answers, selectedThemes, themes, onClose, isOverlay = true }) {
  const getScoreBadgeClass = (percentage) => {
    if (percentage <= 20) return 'score-badge-good'
    if (percentage <= 60) return 'score-badge-ok'
    return 'score-badge-bad'
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

  const content = (
    <div className={`leaderboard-panel ${isOverlay ? 'w-full' : ''}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] p-5 border-b-4 border-[#D4A017]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-4xl trophy-wobble">🏆</span>
            <div>
              <h2 className="text-2xl font-display text-[#F4C430]">Leaderboard</h2>
              <p className="text-[#F5EBCE]/80 text-sm">Final Standings</p>
            </div>
          </div>
          {isOverlay && (
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center bg-[#5D2E0C] hover:bg-[#722F37] rounded-lg text-[#F4C430] font-bold text-xl transition-colors border-2 border-[#D4A017]"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="p-4 overflow-x-auto">
        <table className="w-full min-w-[320px]">
          <thead>
            <tr className="border-b-3 border-[#8B4513]">
              <th className="text-left py-3 px-3 font-display text-[#5D2E0C] text-sm sticky left-0 bg-[#FDF6E3] z-10">
                Rank
              </th>
              <th className="text-left py-3 px-3 font-display text-[#5D2E0C] text-sm">
                Contestant
              </th>
              {selectedThemes.map((themeId, index) => {
                const theme = themes.find(t => t.id === themeId)
                return (
                  <th key={themeId} className="text-center py-3 px-2 min-w-[80px]">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">{getThemeIcon(theme?.name)}</span>
                      <span className="text-xs text-[#8B7355] truncate max-w-[70px]">
                        {theme?.name}
                      </span>
                    </div>
                  </th>
                )
              })}
              <th className="text-center py-3 px-4 font-display text-[#D4A017] text-sm bg-[#5D2E0C] rounded-t-lg">
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
                  className={`border-b-2 border-[#E8DDB5] transition-colors ${
                    isLeader ? 'bg-gradient-to-r from-[#F4C430]/20 to-[#DAA520]/10' : 'hover:bg-[#F5EBCE]'
                  }`}
                >
                  {/* Rank */}
                  <td className={`py-3 px-3 sticky left-0 z-10 ${isLeader ? 'bg-gradient-to-r from-[#F4C430]/20 to-transparent' : 'bg-[#FDF6E3]'}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getMedalEmoji(playerIndex)}</span>
                      {playerIndex >= 3 && (
                        <span className="w-6 h-6 bg-[#E8DDB5] rounded-full flex items-center justify-center text-xs font-bold text-[#5D4037]">
                          {playerIndex + 1}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Player name */}
                  <td className="py-3 px-3">
                    <span className={`font-bold ${isLeader ? 'text-[#B8860B]' : 'text-[#2C1810]'}`}>
                      {player}
                    </span>
                  </td>

                  {/* Round scores */}
                  {selectedThemes.map((_, index) => {
                    const answer = answers[player]?.[index]
                    return (
                      <td key={index} className="py-3 px-2 text-center">
                        {answer ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className={getScoreBadgeClass(answer.percentage)}>
                              {answer.percentage}%
                            </span>
                            <span className="text-xs text-[#8B7355] truncate max-w-[70px]">
                              {answer.option}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#E8DDB5]">—</span>
                        )}
                      </td>
                    )
                  })}

                  {/* Total */}
                  <td className="py-3 px-4 text-center bg-[#5D2E0C]">
                    <span className={`text-xl font-display ${isLeader ? 'text-[#F4C430] shine-text' : 'text-[#F5EBCE]'}`}>
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
      <div className="p-4 border-t-2 border-[#E8DDB5] bg-[#F5EBCE]">
        <p className="text-sm text-[#8B7355] text-center flex items-center justify-center gap-2">
          <span>💡</span>
          <span>Lower scores win! Invalid answers count as 100%</span>
        </p>
      </div>
    </div>
  )

  if (isOverlay) {
    return (
      <div className="modal-overlay bounce-in" onClick={onClose}>
        <div onClick={e => e.stopPropagation()}>
          {content}
        </div>
      </div>
    )
  }

  return content
}
