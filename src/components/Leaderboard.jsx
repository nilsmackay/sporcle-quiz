import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { getPercentageColor, interpolateColor, badgeStyle } from '../utils/colors'
import { calculateYouTubeScore, getYouTubeScoreColor, abbreviateViews } from '../utils/youtube'
import { getThemeIcon, getThemeById } from '../utils/themes'
import { calculateSporcleTotal as calcSporcle, calculateYouTubeTotal as calcYouTube, calculateGrandTotal as calcGrand } from '../utils/scoring'

// Tooltip for truncated text: hover on desktop, tap on mobile.
// Renders via portal to avoid clipping by overflow-x-auto on the table.
function TruncatedText({ text, className = '', maxWidth = '70px' }) {
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
      className={`truncate block cursor-pointer ${className}`}
      style={{ maxWidth }}
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
    const theme = getThemeById(themeId)
    if (!theme) return { minPercent: 0, maxPercent: 100 }
    const percentages = theme.options.map(opt => opt.percentage)
    return { minPercent: Math.min(...percentages), maxPercent: Math.max(...percentages) }
  }

  const calculateSporcleTotal = (player) => calcSporcle(player, answers, selectedThemes)
  const calculateYouTubeTotal = (player) => calcYouTube(player, youtubeGuesses, youtubeVideos)
  const calculateGrandTotal = (player) => calcGrand(player, answers, selectedThemes, youtubeGuesses, youtubeVideos)

  const sortedPlayers = [...players].sort((a, b) => {
    return calculateGrandTotal(a) - calculateGrandTotal(b)
  })

  const lowestScore = sortedPlayers.length > 0 ? calculateGrandTotal(sortedPlayers[0]) : null

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

  // Only show rows for questions that have actually been played
  const playedVideoIndices = hasYouTube
    ? youtubeVideos.map((_, i) => i).filter(i =>
        players.some(p => youtubeGuesses[p]?.[i] !== undefined)
      )
    : []

  const playedThemeIndices = hasSporcle
    ? selectedThemes.map((_, i) => i).filter(i =>
        players.some(p => answers[p]?.[i] !== undefined)
      )
    : []

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

      {/* Transposed Table: questions as rows, contestants as columns */}
      <div className="p-4 overflow-x-auto">
        <table className="w-full min-w-[320px]">
          <thead>
            <tr className="border-b-2 border-[#1A1A1A]">
              <th className="text-left py-3 px-3 font-display text-[#1A1A1A] text-sm min-w-[120px]">
              </th>
              {sortedPlayers.map((player, idx) => {
                const isLeader = calculateGrandTotal(player) === lowestScore
                return (
                  <th key={player} className="text-center py-3 px-2 min-w-[72px]">
                    <div className="flex flex-col items-center gap-1">
                      <div className="editorial-stamp w-7 h-7 text-xs">
                        {idx + 1}
                      </div>
                      <span className={`font-bold text-sm ${isLeader ? 'text-[#C23B22]' : 'text-[#1A1A1A]'}`}>
                        {player}
                      </span>
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {/* Grand Total row — immediately below player names */}
            <tr className="border-b-2 border-[#1A1A1A]">
              <td className="py-3 px-3 font-display text-[#C23B22] text-sm">
                {hasYouTube && hasSporcle ? 'Grand Total' : 'Total'}
              </td>
              {sortedPlayers.map(player => {
                const grandTotal = calculateGrandTotal(player)
                const isLeader = grandTotal === lowestScore
                return (
                  <td key={player} className="py-3 px-2 text-center">
                    <span className={`text-xl font-display ${isLeader ? 'text-[#C23B22]' : 'text-[#1A1A1A]'}`}>
                      {grandTotal}
                    </span>
                  </td>
                )
              })}
            </tr>

            {/* Sporcle round (Round 2 — most recent, shown first) */}
            {hasSporcle && (
              <tr
                className="border-b border-[#D4CFC7] cursor-pointer hover:bg-[#F7F3ED] transition-colors select-none"
                onClick={() => toggleRound('sporcle')}
              >
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{sporcleExpanded ? '▾' : '▸'} 📚</span>
                    <span className="font-display text-sm text-[#1A1A1A]">Sporcle</span>
                  </div>
                </td>
                {sortedPlayers.map(player => {
                  const sporcleTotal = calculateSporcleTotal(player)
                  const colors = getSporcleRelativeColor(sporcleTotal)
                  return (
                    <td key={player} className="py-3 px-2 text-center">
                      <span style={badgeStyle(colors)}>{sporcleTotal}</span>
                    </td>
                  )
                })}
              </tr>
            )}

            {/* Sporcle expanded: per-theme rows (latest question first) */}
            {hasSporcle && sporcleExpanded && [...playedThemeIndices].reverse().map(index => {
              const themeId = selectedThemes[index]
              const theme = getThemeById(themeId)
              const { minPercent, maxPercent } = getThemeRange(themeId)
              return (
                <tr
                  key={`sp-${index}`}
                  className={`border-b border-[#D4CFC7] ${onEditQuestion ? 'cursor-pointer hover:bg-[#F7F3ED]' : ''} transition-colors`}
                  onClick={() => onEditQuestion?.('sporcle', index)}
                >
                  <td className="py-3 pl-9 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{getThemeIcon(theme?.name)}</span>
                      <span className="text-sm text-[#6B6560] truncate">{theme?.name}</span>
                      {onEditQuestion && <span className="text-[10px] text-[#B8924A] shrink-0">edit</span>}
                    </div>
                  </td>
                  {sortedPlayers.map(player => {
                    const answer = answers[player]?.[index]
                    return (
                      <td key={player} className="py-3 px-2 text-center">
                        {answer ? (
                          <div className="flex flex-col items-center gap-1">
                            {(() => {
                              const colors = getPercentageColor(answer.percentage, minPercent, maxPercent)
                              return <span style={badgeStyle(colors)}>{answer.percentage}%</span>
                            })()}
                            <TruncatedText text={answer.option} className="text-xs text-[#6B6560]" maxWidth="70px" />
                          </div>
                        ) : (
                          <span className="text-[#D4CFC7]">&mdash;</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}

            {/* YouTube round (Round 1 — earlier, shown second) */}
            {hasYouTube && (
              <tr
                className="border-b border-[#D4CFC7] cursor-pointer hover:bg-[#F7F3ED] transition-colors select-none"
                onClick={() => toggleRound('youtube')}
              >
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{youtubeExpanded ? '▾' : '▸'} 📺</span>
                    <span className="font-display text-sm text-[#1A1A1A]">YouTube</span>
                  </div>
                </td>
                {sortedPlayers.map(player => {
                  const ytTotal = calculateYouTubeTotal(player)
                  const avgScore = getYouTubeAvgScore(player)
                  const colors = getYouTubeScoreColor(avgScore)
                  return (
                    <td key={player} className="py-3 px-2 text-center">
                      <span style={badgeStyle(colors)}>{ytTotal}</span>
                    </td>
                  )
                })}
              </tr>
            )}

            {/* YouTube expanded: per-video rows (latest video first) */}
            {hasYouTube && youtubeExpanded && [...playedVideoIndices].reverse().map(vidIdx => {
              const video = youtubeVideos[vidIdx]
              return (
                <tr
                  key={`yt-${vidIdx}`}
                  className={`border-b border-[#D4CFC7] ${onEditQuestion ? 'cursor-pointer hover:bg-[#F7F3ED]' : ''} transition-colors`}
                  onClick={() => onEditQuestion?.('youtube', vidIdx)}
                >
                  <td className="py-3 pl-9 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">📺</span>
                      <span className="text-sm text-[#6B6560] truncate">
                        {videoMetadata?.[vidIdx]?.title || `Video ${vidIdx + 1}`}
                      </span>
                      {onEditQuestion && <span className="text-[10px] text-[#B8924A] shrink-0">edit</span>}
                    </div>
                  </td>
                  {sortedPlayers.map(player => {
                    const guess = youtubeGuesses[player]?.[vidIdx]
                    return (
                      <td key={player} className="py-3 px-2 text-center">
                        {guess !== undefined ? (
                          <div className="flex flex-col items-center gap-1">
                            {(() => {
                              const score = calculateYouTubeScore(guess, video.views)
                              const colors = getYouTubeScoreColor(score)
                              return <span style={badgeStyle(colors)}>{score}</span>
                            })()}
                            <span className="text-xs text-[#6B6560]">{abbreviateViews(guess)}</span>
                          </div>
                        ) : (
                          <span className="text-[#D4CFC7]">&mdash;</span>
                        )}
                      </td>
                    )
                  })}
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
