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
      <div className="bg-white border-b-2 border-[#1A1A1A] p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="editorial-stamp w-12 h-12 text-[#C23B22] text-xl">
              L
            </div>
            <div>
              <h2 className="text-2xl font-display text-[#1A1A1A]">Leaderboard</h2>
              <p className="text-[#6B6560] text-sm">Final Standings</p>
            </div>
          </div>
          {isOverlay && (
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center border-2 border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] font-bold text-xl transition-colors"
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
            <tr className="border-b-2 border-[#1A1A1A]">
              <th className="text-left py-3 px-3 font-display text-[#1A1A1A] text-sm sticky left-0 bg-white z-10">
                Rank
              </th>
              <th className="text-left py-3 px-3 font-display text-[#1A1A1A] text-sm">
                Contestant
              </th>
              {selectedThemes.map((themeId) => {
                const theme = themes.find(t => t.id === themeId)
                return (
                  <th key={themeId} className="text-center py-3 px-2 min-w-[80px]">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">{getThemeIcon(theme?.name)}</span>
                      <span className="text-xs text-[#6B6560] truncate max-w-[70px]">
                        {theme?.name}
                      </span>
                    </div>
                  </th>
                )
              })}
              <th className="text-center py-3 px-4 font-display text-[#C23B22] text-sm border-l border-[#D4CFC7]">
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
                  className={`border-b border-[#D4CFC7] transition-colors ${
                    isLeader ? 'bg-[#F7F3ED]' : 'hover:bg-[#F7F3ED]'
                  }`}
                >
                  {/* Rank */}
                  <td className={`py-3 px-3 sticky left-0 z-10 ${isLeader ? 'bg-[#F7F3ED]' : 'bg-white'}`}>
                    <div className="editorial-stamp w-7 h-7 text-xs">
                      {playerIndex + 1}
                    </div>
                  </td>

                  {/* Player name */}
                  <td className="py-3 px-3">
                    <span className={`font-bold ${isLeader ? 'text-[#C23B22]' : 'text-[#1A1A1A]'}`}>
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
                            <span className="text-xs text-[#6B6560] truncate max-w-[70px]">
                              {answer.option}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#D4CFC7]">—</span>
                        )}
                      </td>
                    )
                  })}

                  {/* Total */}
                  <td className="py-3 px-4 text-center border-l border-[#D4CFC7]">
                    <span className={`text-xl font-display ${isLeader ? 'text-[#C23B22]' : 'text-[#1A1A1A]'}`}>
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
      <div className="p-4 border-t border-[#D4CFC7]">
        <p className="text-sm text-[#6B6560] text-center italic">
          Lower scores win. Invalid answers count as 100%.
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
