import React, { useState, useEffect } from 'react'
import { extractVideoId, formatViews, parseViewsInput } from '../utils/youtube'

export default function YouTubeQuestion({
  players,
  video,
  videoIndex,
  totalVideos,
  metadata,
  onSubmitGuesses,
  isLastVideo
}) {
  const [guesses, setGuesses] = useState({})

  // Reset guesses when video changes
  useEffect(() => {
    setGuesses({})
  }, [videoIndex])

  const handleGuessChange = (player, rawValue) => {
    const digits = rawValue.replace(/[^0-9]/g, '')
    if (digits === '') {
      setGuesses(prev => ({ ...prev, [player]: '' }))
    } else {
      const num = parseInt(digits, 10)
      setGuesses(prev => ({ ...prev, [player]: formatViews(num) }))
    }
  }

  const handleSubmit = () => {
    const parsed = {}
    for (const player of players) {
      parsed[player] = parseViewsInput(guesses[player] || '')
      if (isNaN(parsed[player])) parsed[player] = 0
    }
    onSubmitGuesses(videoIndex, parsed)
  }

  const answeredCount = players.filter(p => {
    const val = guesses[p]
    return val && val !== '' && parseViewsInput(val) > 0
  }).length
  const allPlayersAnswered = answeredCount === players.length

  const videoId = extractVideoId(video.url)

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 slide-up">
      {/* Video Header Card */}
      <div className="game-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#F7F3ED] border border-[#D4CFC7] flex items-center justify-center">
              <span className="text-3xl">📺</span>
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-display text-[#1A1A1A] truncate">
                {metadata?.title || 'Loading video...'}
              </h2>
              {metadata?.author_name && (
                <p className="text-[#6B6560] font-medium truncate">
                  {metadata.author_name}
                </p>
              )}
            </div>
          </div>

          <div className="sm:ml-auto">
            <div className="inline-flex items-center gap-3 bg-[#F7F3ED] border border-[#D4CFC7] px-4 py-2">
              <span className="text-[#6B6560]">Video:</span>
              <span className="score-display">
                {videoIndex + 1}/{totalVideos}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* YouTube Embed */}
      {videoId && (
        <div className="youtube-embed-container mb-6">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={metadata?.title || 'YouTube video'}
          />
        </div>
      )}

      {/* Guessing Card */}
      <div className="game-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-display text-[#1A1A1A]">How many views?</h3>
        </div>
        <p className="text-[#6B6560] text-sm italic mb-5">
          Enter your best guess for the total view count.
        </p>

        {/* Player Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-in">
          {players.map((player, index) => (
            <div key={player} className="player-podium p-4">
              <div className="flex items-center gap-2 mb-4 pt-2">
                <div className="editorial-stamp w-8 h-8 text-sm text-[#C23B22]">
                  {index + 1}
                </div>
                <h3 className="font-display text-[#1A1A1A] text-lg truncate">{player}</h3>
              </div>
              <input
                type="text"
                inputMode="numeric"
                value={guesses[player] || ''}
                onChange={(e) => handleGuessChange(player, e.target.value)}
                placeholder="Enter your guess..."
                className="game-input w-full text-center text-lg font-display"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="text-center sm:text-left order-2 sm:order-1">
          {!allPlayersAnswered && (
            <p className="text-[#6B6560] text-sm flex items-center justify-center sm:justify-start gap-2">
              <span>Waiting for {players.length - answeredCount} more guess{players.length - answeredCount !== 1 ? 'es' : ''}...</span>
            </p>
          )}
        </div>

        <div className="order-1 sm:order-2">
          {isLastVideo ? (
            <button
              onClick={handleSubmit}
              disabled={!allPlayersAnswered}
              className="w-full sm:w-auto btn-gold px-8 py-4 text-lg"
            >
              {allPlayersAnswered ? 'Final Video' : 'All Must Guess'}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allPlayersAnswered}
              className="w-full sm:w-auto btn-teal px-8 py-4 text-lg flex items-center justify-center gap-2"
            >
              <span>Next Video</span>
              <span>&rarr;</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
