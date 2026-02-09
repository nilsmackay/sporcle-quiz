import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { getPercentageColor, interpolateColor } from '../utils/colors'
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

// Inline badge style helper
const badgeStyle = (colors) => ({
  backgroundColor: colors.bg,
  color: colors.text,
  padding: '3px 10px',
  fontSize: '12px',
  fontFamily: "'Fraunces', serif",
  fontWeight: 'bold',
})

export default function Leaderboard({
  players,
  answers,
  selectedThemes,
  themes,
  onClose,
  isOverlay = true,
  youtubeGuesses,
  youtubeVideos,
  videoMetadata,
  onEditQuestion,
  defaultExpandedRound = null
}) {
  const [expandedRound, setExpandedRound] = useState(defaultExpandedRound)

  useEffect(() => {
    setExpandedRound(defaultExpandedRound)
  }, [defaultExpandedRound])

  const toggleRound = (round) => setExpandedRound(prev => prev === round ? null : round)

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

  // Compute YouTube average score for color grading
  const getYouTubeAvgScore = (player) => {
    if (!hasYouTube) return 0
    const total = calculateYouTubeTotal(player)
    const count = youtubeVideos.filter((_, i) => youtubeGuesses[player]?.[i] !== undefined).length
    return count > 0 ? total / count : 0
  }

  // Compute Sporcle total color based on player-relative range
  const getSporcleRelativeColor = (playerTotal) => {
    if (!hasSporcle || sortedPlayers.length <= 1) return { bg: '#B8924A', text: 'white' }
    const totals = sortedPlayers.map(p => calculateSporcleTotal(p))
    const min = Math.min(...totals)
    const max = Math.max(...totals)
    if (min === max) return { bg: '#2D6A4F', text: 'white' }
    const factor = (playerTotal - min) / (max - min)
    const green = '#2D6A4F'
    const gold = '#B8924A'
    const red = '#C23B22'
    let bg
    if (factor <= 0.5) {
      bg = interpolateColor(green, gold, factor * 2)
    } else {
      bg = interpolateColor(gold, red, (factor - 0.5) * 2)
    }
    return { bg, text: 'white' }
  }

  const youtubeExpanded = expandedRound === 'youtube'
  const sporcleExpanded = expandedRound === 'sporcle'

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

              {/* YouTube columns */}
              {hasYouTube && !youtubeExpanded && (
                <th
                  className="text-center py-3 px-2 min-w-[80px] cursor-pointer hover:bg-[#F7F3ED] transition-colors select-none"
                  onClick={() => toggleRound('youtube')}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg">▸ 📺</span>
                    <span className="text-xs text-[#6B6560]">YouTube</span>
                  </div>
                </th>
              )}
              {hasYouTube && youtubeExpanded && youtubeVideos.map((_, vidIdx) => (
                <th
                  key={`yt-${vidIdx}`}
                  className={`text-center py-3 px-2 min-w-[80px] ${onEditQuestion ? 'cursor-pointer hover:bg-[#F7F3ED]' : ''} transition-colors select-none`}
                  onClick={() => onEditQuestion?.('youtube', vidIdx)}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg">
                      {vidIdx === 0 && (
                        <span
                          className="cursor-pointer"
                          onClick={(e) => { e.stopPropagation(); toggleRound('youtube') }}
                        >▾ </span>
                      )}
                      📺
                    </span>
                    <span className="text-xs text-[#6B6560]">
                      {videoMetadata?.[vidIdx]?.title
                        ? <TruncatedText text={videoMetadata[vidIdx].title} className="text-xs text-[#6B6560]" />
                        : `Video ${vidIdx + 1}`
                      }
                    </span>
                    {onEditQuestion && <span className="text-[10px] text-[#B8924A]">edit</span>}
                  </div>
                </th>
              ))}

              {/* Sporcle columns */}
              {hasSporcle && !sporcleExpanded && (
                <th
                  className="text-center py-3 px-2 min-w-[80px] cursor-pointer hover:bg-[#F7F3ED] transition-colors select-none"
                  onClick={() => toggleRound('sporcle')}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg">▸ 📚</span>
                    <span className="text-xs text-[#6B6560]">Sporcle</span>
                  </div>
                </th>
              )}
              {hasSporcle && sporcleExpanded && selectedThemes.map((themeId, index) => {
                const theme = themes.find(t => t.id === themeId)
                return (
                  <th
                    key={themeId}
                    className={`text-center py-3 px-2 min-w-[80px] ${onEditQuestion ? 'cursor-pointer hover:bg-[#F7F3ED]' : ''} transition-colors select-none`}
                    onClick={() => onEditQuestion?.('sporcle', index)}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">
                        {index === 0 && (
                          <span
                            className="cursor-pointer"
                            onClick={(e) => { e.stopPropagation(); toggleRound('sporcle') }}
                          >▾ </span>
                        )}
                        {getThemeIcon(theme?.name)}
                      </span>
                      <TruncatedText text={theme?.name} className="text-xs text-[#6B6560]" />
                      {onEditQuestion && <span className="text-[10px] text-[#B8924A]">edit</span>}
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

                  {/* YouTube: collapsed = single total cell */}
                  {hasYouTube && !youtubeExpanded && (
                    <td className="py-3 px-2 text-center">
                      {(() => {
                        const ytTotal = calculateYouTubeTotal(player)
                        const avgScore = getYouTubeAvgScore(player)
                        const colors = getYouTubeScoreColor(avgScore)
                        return <span style={badgeStyle(colors)}>{ytTotal}</span>
                      })()}
                    </td>
                  )}

                  {/* YouTube: expanded = per-video cells */}
                  {hasYouTube && youtubeExpanded && youtubeVideos.map((video, vidIdx) => {
                    const guess = youtubeGuesses[player]?.[vidIdx]
                    return (
                      <td key={`yt-${vidIdx}`} className="py-3 px-2 text-center">
                        {guess !== undefined ? (
                          (() => {
                            const score = calculateYouTubeScore(guess, video.views)
                            const colors = getYouTubeScoreColor(score)
                            return <span style={badgeStyle(colors)}>{score}</span>
                          })()
                        ) : (
                          <span className="text-[#D4CFC7]">&mdash;</span>
                        )}
                      </td>
                    )
                  })}

                  {/* Sporcle: collapsed = single total cell */}
                  {hasSporcle && !sporcleExpanded && (
                    <td className="py-3 px-2 text-center">
                      {(() => {
                        const sporcleTotal = calculateSporcleTotal(player)
                        const colors = getSporcleRelativeColor(sporcleTotal)
                        return <span style={badgeStyle(colors)}>{sporcleTotal}%</span>
                      })()}
                    </td>
                  )}

                  {/* Sporcle: expanded = per-theme cells */}
                  {hasSporcle && sporcleExpanded && selectedThemes.map((themeId, index) => {
                    const answer = answers[player]?.[index]
                    const { minPercent, maxPercent } = getThemeRange(themeId)
                    return (
                      <td key={index} className="py-3 px-2 text-center">
                        {answer ? (
                          <div className="flex flex-col items-center gap-1">
                            {(() => {
                              const colors = getPercentageColor(answer.percentage, minPercent, maxPercent)
                              return <span style={badgeStyle(colors)}>{answer.percentage}%</span>
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
                      {grandTotal}
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
            ? 'Lower scores win. YouTube points + Sporcle percentages combined.'
            : hasYouTube
            ? 'Lower scores win. 0 = perfect guess.'
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
