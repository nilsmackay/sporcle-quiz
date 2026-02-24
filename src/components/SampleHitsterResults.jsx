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
  // Compute player results with bonuses applied, sorted by adjusted score (lowest first)
  const playerResults = players.map(player => {
    const guess = guesses[player] ?? 0
    const rawScore = Math.abs(guess - song.sampleYear)
    const bonus = bonuses?.[player]?.[songIndex] ?? { artist: false, song: false }
    const adjustedScore = rawScore - (bonus.artist ? 3 : 0) - (bonus.song ? 3 : 0)
    return { player, guess, rawScore, adjustedScore, bonus }
  }).sort((a, b) => a.adjustedScore - b.adjustedScore)

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
        <div className="flex items-center justify-between gap-3 mb-5">
          <h3 className="text-xl font-display text-[#1A1A1A]">Player Guesses</h3>
          <div className="flex gap-4 text-xs text-[#6B6560] uppercase tracking-wider font-bold">
            <span className="w-14 text-center">Artist</span>
            <span className="w-14 text-center">Song</span>
            <span className="w-16 text-right">Score</span>
          </div>
        </div>

        <div className="stagger-in">
          {playerResults.map((result, index) => {
            const colors = getSampleHitsterScoreColor(result.adjustedScore)
            return (
              <div
                key={result.player}
                className={`flex items-center gap-3 py-4 ${
                  index < playerResults.length - 1 ? 'border-b border-[#D4CFC7]' : ''
                }`}
              >
                {/* Rank + name */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="editorial-stamp w-7 h-7 text-xs flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <span className={`font-bold truncate block ${index === 0 ? 'text-[#C23B22]' : 'text-[#1A1A1A]'}`}>
                      {result.player}
                    </span>
                    <span className="text-xs text-[#6B6560]">
                      {result.guess} &mdash; {result.rawScore === 0 ? 'exact!' : `${result.rawScore} yr${result.rawScore !== 1 ? 's' : ''} off`}
                    </span>
                  </div>
                </div>

                {/* Bonus checkboxes */}
                <div className="flex gap-4 flex-shrink-0">
                  <label className="w-14 flex flex-col items-center gap-1 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={result.bonus.artist}
                      onChange={e => onToggleBonus(result.player, songIndex, 'artist', e.target.checked)}
                      className="w-4 h-4 accent-[#2D6A4F] cursor-pointer"
                    />
                    <span className="text-[10px] text-[#6B6560]">−3</span>
                  </label>
                  <label className="w-14 flex flex-col items-center gap-1 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={result.bonus.song}
                      onChange={e => onToggleBonus(result.player, songIndex, 'song', e.target.checked)}
                      className="w-4 h-4 accent-[#2D6A4F] cursor-pointer"
                    />
                    <span className="text-[10px] text-[#6B6560]">−3</span>
                  </label>
                </div>

                {/* Score badge */}
                <div className="flex-shrink-0 w-16 flex justify-end">
                  <span style={{ ...badgeStyle(colors), whiteSpace: 'nowrap' }}>
                    {result.adjustedScore} pts
                  </span>
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
