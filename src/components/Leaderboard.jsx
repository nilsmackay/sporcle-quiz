import React from 'react'

export default function Leaderboard({ players, answers, selectedThemes, themes, onClose, isOverlay = true }) {
  const getPercentageColor = (percentage) => {
    if (percentage <= 20) return 'bg-green-100 text-green-800'
    if (percentage <= 40) return 'bg-green-50 text-green-700'
    if (percentage <= 60) return 'bg-yellow-50 text-yellow-700'
    if (percentage <= 80) return 'bg-orange-50 text-orange-700'
    return 'bg-red-100 text-red-800'
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

  const content = (
    <div className={`bg-white ${isOverlay ? 'rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-auto' : ''}`}>
      {isOverlay && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-800">Leaderboard</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 font-bold transition-colors"
          >
            ×
          </button>
        </div>
      )}

      <div className="p-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-2 font-semibold text-gray-700 sticky left-0 bg-white">
                Player
              </th>
              {selectedThemes.map((themeId, index) => {
                const theme = themes.find(t => t.id === themeId)
                return (
                  <th key={themeId} className="text-center py-3 px-2 font-semibold text-gray-700 min-w-[120px]">
                    Q{index + 1}
                    <div className="text-xs font-normal text-gray-500 truncate max-w-[100px]">
                      {theme?.name}
                    </div>
                  </th>
                )
              })}
              <th className="text-center py-3 px-4 font-semibold text-gray-700 bg-gray-50">
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
                  className={`border-b border-gray-100 ${isLeader ? 'bg-yellow-50' : ''}`}
                >
                  <td className={`py-3 px-2 font-medium sticky left-0 ${isLeader ? 'bg-yellow-50' : 'bg-white'}`}>
                    <div className="flex items-center gap-2">
                      {isLeader && <span className="text-yellow-500">🏆</span>}
                      <span className={isLeader ? 'text-yellow-800 font-bold' : 'text-gray-800'}>
                        {player}
                      </span>
                    </div>
                  </td>
                  {selectedThemes.map((_, index) => {
                    const answer = answers[player]?.[index]
                    return (
                      <td key={index} className="py-3 px-2 text-center">
                        {answer ? (
                          <div className="flex flex-col items-center">
                            <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${getPercentageColor(answer.percentage)}`}>
                              {answer.percentage}%
                            </span>
                            <span className="text-xs text-gray-500 mt-1 truncate max-w-[100px]">
                              {answer.option}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    )
                  })}
                  <td className={`py-3 px-4 text-center font-bold text-lg ${isLeader ? 'text-yellow-700' : 'text-gray-800'} bg-gray-50`}>
                    {totalScore}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-600 text-center">
          Lower scores are better! Invalid answers count as 100%.
        </p>
      </div>
    </div>
  )

  if (isOverlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        {content}
      </div>
    )
  }

  return content
}
