import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { getPercentageColor } from '../utils/colors'
import { calculateYouTubeScore, getYouTubeScoreColor } from '../utils/youtube'

// Tooltip for truncated text: hover on desktop, tap on mobile.
// Renders via portal to avoid clipping by overflow-x-auto on the table.
function TruncatedText({ text, className = '' }) {
  const [show, setShow] = useState(false)
  const ref = useRef(null)
  const [style, setStyle] = useState({})

  const updatePos = useCallback(() => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const above = rect.top > 40
    setStyle({
      position: 'fixed',
      left: rect.left + rect.width / 2,
      ...(above
        ? { top: rect.top - 6, transform: 'translate(-50%, -100%)' }
        : { top: rect.bottom + 6, transform: 'translate(-50%, 0)' }),
      zIndex: 9999,
    })
  }, [])

  // Close on outside tap (mobile)
  useEffect(() => {
    if (!show) return
    const close = () => setShow(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [show])

  return (
    <span
      ref={ref}
      className={`truncate block max-w-[70px] cursor-pointer ${className}`}
      onMouseEnter={() => { updatePos(); setShow(true) }}
      onMouseLeave={() => setShow(false)}
      onClick={(e) => { e.stopPropagation(); updatePos(); setShow(true) }}
    >
      {text}
      {show && createPortal(
        <div
          style={style}
          className="bg-[#1A1A1A] text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none"
        >
          {text}
        </div>,
        document.body
      )}
    </span>
  )
}

export default function Leaderboard({
  players,
  answers,
  selectedThemes,
  themes,
  onClose,
  isOverlay = true,
  youtubeGuesses,
  youtubeVideos,
  videoMetadata
}) {
  const hasYouTube = youtubeVideos && youtubeVideos.length > 0 && youtubeGuesses && Object.keys(youtubeGuesses).length > 0
  const hasSporcle = selectedThemes && selectedThemes.length > 0

  // Helper to get min/max percentages for a theme
  const getThemeRange = (themeId) => {
    const theme = themes.find(t => t.id === themeId)
    if (!theme) return { minPercent: 0, maxPercent: 100 }
    const percentages = theme.options.map(opt => opt.percentage)
    return { minPercent: Math.min(...percentages), maxPercent: Math.max(...percentages) }
  }

  const calculateSporcleTotal = (player) => {
    let total = 0
    if (!selectedThemes) return total
    selectedThemes.forEach((_, index) => {
      const answer = answers[player]?.[index]
      if (answer) {
        total += answer.percentage
      }
    })
    return total
  }

  const calculateYouTubeTotal = (player) => {
    if (!hasYouTube) return 0
    let total = 0
    youtubeVideos.forEach((video, index) => {
      const guess = youtubeGuesses[player]?.[index]
      if (guess !== undefined) {
        total += calculateYouTubeScore(guess, video.views)
      }
    })
    return total
  }

  const calculateGrandTotal = (player) => {
    return calculateYouTubeTotal(player) + calculateSporcleTotal(player)
  }

  const sortedPlayers = [...players].sort((a, b) => {
    return calculateGrandTotal(a) - calculateGrandTotal(b)
  })

  const lowestScore = sortedPlayers.length > 0 ? calculateGrandTotal(sortedPlayers[0]) : null

  const getThemeIcon = (themeName) => {
    const name = themeName?.toLowerCase() || ''
    if (name.includes('africa')) return '🌍'
    if (name.includes('asia')) return '🌏'
    if (name.includes('europe') || name.includes('capital')) return '🏛️'
    if (name.includes('states') || name.includes('america')) return '🗽'
    return '📚'
  }

  // Compute YouTube average ratio for color grading
  const getYouTubeAvgRatio = (player) => {
    if (!hasYouTube) return 1
    const total = calculateYouTubeTotal(player)
    const count = youtubeVideos.filter((_, i) => youtubeGuesses[player]?.[i] !== undefined).length
    return count > 0 ? total / count : 1
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
              <p className="text-[#6B6560] text-sm">
                {hasYouTube && hasSporcle ? 'Combined Standings' : hasYouTube ? 'YouTube Round' : 'Final Standings'}
              </p>
            </div>
          </div>
          {isOverlay && (
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center border-2 border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] font-bold text-xl transition-colors"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="p-4 overflow-x-auto">
        <table className="w-full min-w-[320px]">
          <thead>
            <tr className="border-b-2 border-[#1A1A1A]">
              <th className="text-left py-3 px-3 font-display text-[#1A1A1A] text-sm">
                Rank
              </th>
              <th className="text-left py-3 px-3 font-display text-[#1A1A1A] text-sm">
                Contestant
              </th>
              {/* YouTube summary column */}
              {hasYouTube && (
                <th className="text-center py-3 px-2 min-w-[80px]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg">📺</span>
                    <span className="text-xs text-[#6B6560]">YouTube</span>
                  </div>
                </th>
              )}
              {/* Sporcle theme columns */}
              {hasSporcle && selectedThemes.map((themeId) => {
                const theme = themes.find(t => t.id === themeId)
                return (
                  <th key={themeId} className="text-center py-3 px-2 min-w-[80px]">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">{getThemeIcon(theme?.name)}</span>
                      <TruncatedText text={theme?.name} className="text-xs text-[#6B6560]" />
                    </div>
                  </th>
                )
              })}
              <th className="text-center py-3 px-4 font-display text-[#C23B22] text-sm border-l border-[#D4CFC7]">
                {hasYouTube && hasSporcle ? 'Grand Total' : 'Total'}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, playerIndex) => {
              const grandTotal = calculateGrandTotal(player)
              const isLeader = grandTotal === lowestScore

              return (
                <tr
                  key={player}
                  className={`border-b border-[#D4CFC7] transition-colors ${
                    isLeader ? 'bg-[#F7F3ED]' : 'hover:bg-[#F7F3ED]'
                  }`}
                >
                  {/* Rank */}
                  <td className="py-3 px-3">
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

                  {/* YouTube score cell */}
                  {hasYouTube && (
                    <td className="py-3 px-2 text-center">
                      {(() => {
                        const ytTotal = calculateYouTubeTotal(player)
                        const avgRatio = getYouTubeAvgRatio(player)
                        const colors = getYouTubeScoreColor(avgRatio)
                        return (
                          <span style={{
                            backgroundColor: colors.bg,
                            color: colors.text,
                            padding: '3px 10px',
                            fontSize: '12px',
                            fontFamily: "'Fraunces', serif",
                            fontWeight: 'bold',
                          }}>
                            {ytTotal.toFixed(1)}
                          </span>
                        )
                      })()}
                    </td>
                  )}

                  {/* Sporcle round scores */}
                  {hasSporcle && selectedThemes.map((themeId, index) => {
                    const answer = answers[player]?.[index]
                    const { minPercent, maxPercent } = getThemeRange(themeId)
                    return (
                      <td key={index} className="py-3 px-2 text-center">
                        {answer ? (
                          <div className="flex flex-col items-center gap-1">
                            {(() => {
                              const colors = getPercentageColor(answer.percentage, minPercent, maxPercent)
                              return (
                                <span style={{
                                  backgroundColor: colors.bg,
                                  color: colors.text,
                                  padding: '3px 10px',
                                  fontSize: '12px',
                                  fontFamily: "'Fraunces', serif",
                                  fontWeight: 'bold'
                                }}>
                                  {answer.percentage}%
                                </span>
                              )
                            })()}
                            <TruncatedText text={answer.option} className="text-xs text-[#6B6560]" />
                          </div>
                        ) : (
                          <span className="text-[#D4CFC7]">&mdash;</span>
                        )}
                      </td>
                    )
                  })}

                  {/* Grand Total */}
                  <td className="py-3 px-4 text-center border-l border-[#D4CFC7]">
                    <span className={`text-xl font-display ${isLeader ? 'text-[#C23B22]' : 'text-[#1A1A1A]'}`}>
                      {grandTotal.toFixed(1)}
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
          {hasYouTube && hasSporcle
            ? 'Lower scores win. YouTube ratios + Sporcle percentages combined.'
            : hasYouTube
            ? 'Lower scores win. Closer to 1.0x = better guess.'
            : 'Lower scores win. Invalid answers count as 100%.'}
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
