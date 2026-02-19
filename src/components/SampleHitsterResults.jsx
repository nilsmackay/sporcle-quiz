import React from 'react'
import { extractVideoId } from '../utils/youtube'
import { badgeStyle } from '../utils/colors'
import { getSampleHitsterScoreColor } from '../utils/sampleHitster'

export default function SampleHitsterResults({
  players,
  song,
  guesses,
  songIndex,
  bonuses,
  onToggleBonus,
  onContinue
}) {
  // Compute player results sorted by score (best/lowest first)
  const playerResults = players.map(player => {
    const guess = guesses[player] ?? 0
    let score = Math.abs(guess - song.sampleYear)
    const playerBonuses = bonuses?.[player]?.[songIndex]
    if (playerBonuses?.artist) score -= 2
    if (playerBonuses?.title) score -= 2
    return { player, guess, score }
  }).sort((a, b) => a.score - b.score)

  const sampleVideoId = extractVideoId(song.sampleUrl)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 slide-up">
      {/* Round Complete Header */}
      <div className="game-card p-6 mb-6 text-center">
        <div className="editorial-stamp w-20 h-20 text-3xl mb-4 mx-auto">
          <span>🎵</span>
        </div>
        <h2 className="text-2xl font-display text-[#1A1A1A] mb-2">
          Round Complete
        </h2>
        <p className="text-[#C23B22] font-display text-lg">
          {song.songTitle}
        </p>
      </div>

      {/* The Answer */}
      <div className="game-card p-6 mb-6 text-center">
        <p className="text-[#6B6560] text-sm uppercase tracking-wider font-bold mb-3">
          The Original Sample
        </p>
        <p className="text-lg font-display text-[#1A1A1A] mb-2">
          {song.sampleTitle}
        </p>
        <div className="bounce-in">
          <span className="text-3xl sm:text-4xl font-display text-[#C23B22]">
            {song.sampleYear}
          </span>
        </div>
      </div>

      {/* Sample YouTube Embed */}
      {sampleVideoId && (
        <div className="youtube-embed-container mb-6">
          <iframe
            src={`https://www.youtube.com/embed/${sampleVideoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={song.sampleTitle}
          />
        </div>
      )}

      {/* Player Guesses - Ranked */}
      <div className="game-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <h3 className="text-xl font-display text-[#1A1A1A]">Player Guesses</h3>
        </div>

        <div className="stagger-in">
          {playerResults.map((result, index) => {
            const playerBonuses = bonuses?.[result.player]?.[songIndex]
            const colors = getSampleHitsterScoreColor(result.score)
            return (
              <div
                key={result.player}
                className={`py-4 ${
                  index < playerResults.length - 1 ? 'border-b border-[#D4CFC7]' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank + name */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="editorial-stamp w-7 h-7 text-xs flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className={`font-bold truncate ${index === 0 ? 'text-[#C23B22]' : 'text-[#1A1A1A]'}`}>
                      {result.player}
                    </span>
                  </div>

                  {/* Guess + score */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <span className="text-sm text-[#6B6560] block">
                        {result.guess}
                      </span>
                      <span className="text-xs text-[#6B6560]">
                        ({Math.abs(result.guess - song.sampleYear) === 0 ? 'exact!' : `${Math.abs(result.guess - song.sampleYear)} year${Math.abs(result.guess - song.sampleYear) !== 1 ? 's' : ''} off`})
                      </span>
                    </div>
                    <span style={{ ...badgeStyle(colors), whiteSpace: 'nowrap' }}>
                      {result.score} pts
                    </span>
                  </div>
                </div>

                {/* Bonus checkboxes */}
                <div className="flex gap-4 mt-2 ml-10">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <div className={`w-5 h-5 border flex items-center justify-center transition-all ${
                      playerBonuses?.artist
                        ? 'bg-[#2D6A4F] border-[#2D6A4F]'
                        : 'border-[#D4CFC7] bg-white'
                    }`}>
                      {playerBonuses?.artist && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={!!playerBonuses?.artist}
                      onChange={(e) => onToggleBonus(result.player, songIndex, 'artist', e.target.checked)}
                      className="sr-only"
                    />
                    <span className="text-xs text-[#6B6560]">Artist correct <span className="text-[#2D6A4F] font-bold">(-2)</span></span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <div className={`w-5 h-5 border flex items-center justify-center transition-all ${
                      playerBonuses?.title
                        ? 'bg-[#2D6A4F] border-[#2D6A4F]'
                        : 'border-[#D4CFC7] bg-white'
                    }`}>
                      {playerBonuses?.title && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={!!playerBonuses?.title}
                      onChange={(e) => onToggleBonus(result.player, songIndex, 'title', e.target.checked)}
                      className="sr-only"
                    />
                    <span className="text-xs text-[#6B6560]">Title correct <span className="text-[#2D6A4F] font-bold">(-2)</span></span>
                  </label>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={onContinue}
        className="w-full btn-teal py-5 text-xl"
      >
        View Standings
      </button>
    </div>
  )
}
