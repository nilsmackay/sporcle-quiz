import React from 'react'

export default function SetupRounds({ enabledRounds, setEnabledRounds, youtubeVideoCount, pictureRoundCount, sampleHitsterSongCount }) {
  return (
    <div className="game-card p-5 mb-6">
      <h2 className="text-lg font-display text-[#1A1A1A] mb-3">Rounds</h2>
      <p className="text-sm text-[#6B6560] mb-4">Select which rounds to play</p>
      <div className="space-y-2">
        <label
          htmlFor="round-youtube"
          className={`choice-card flex items-center gap-4 p-4 cursor-pointer ${enabledRounds.youtube ? 'selected' : ''}`}
        >
          <div className={`w-6 h-6 border flex items-center justify-center transition-all ${
            enabledRounds.youtube
              ? 'bg-[#C23B22] border-[#C23B22]'
              : 'border-[#D4CFC7] bg-white'
          }`}>
            {enabledRounds.youtube && (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <input
            type="checkbox"
            id="round-youtube"
            name="round-youtube"
            checked={enabledRounds.youtube}
            onChange={(e) => setEnabledRounds({ ...enabledRounds, youtube: e.target.checked })}
            className="sr-only"
          />
          <div className="flex items-center gap-3 flex-1">
            <span className="editorial-stamp w-7 h-7 text-xs flex-shrink-0">1</span>
            <div>
              <span className="font-bold text-[#1A1A1A] block">YouTube Views</span>
              <span className="text-sm text-[#6B6560]">Guess the view count ({youtubeVideoCount} videos)</span>
            </div>
          </div>
        </label>

        <label
          htmlFor="round-picture"
          className={`choice-card flex items-center gap-4 p-4 cursor-pointer ${enabledRounds.pictureRound ? 'selected' : ''}`}
        >
          <div className={`w-6 h-6 border flex items-center justify-center transition-all ${
            enabledRounds.pictureRound
              ? 'bg-[#C23B22] border-[#C23B22]'
              : 'border-[#D4CFC7] bg-white'
          }`}>
            {enabledRounds.pictureRound && (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <input
            type="checkbox"
            id="round-picture"
            name="round-picture"
            checked={enabledRounds.pictureRound}
            onChange={(e) => setEnabledRounds({ ...enabledRounds, pictureRound: e.target.checked })}
            className="sr-only"
          />
          <div className="flex items-center gap-3 flex-1">
            <span className="editorial-stamp w-7 h-7 text-xs flex-shrink-0">2</span>
            <div>
              <span className="font-bold text-[#1A1A1A] block">Picture Round</span>
              <span className="text-sm text-[#6B6560]">Guess the missing number ({pictureRoundCount} picture{pictureRoundCount !== 1 ? 's' : ''})</span>
            </div>
          </div>
        </label>

        <label
          htmlFor="round-sample-hitster"
          className={`choice-card flex items-center gap-4 p-4 cursor-pointer ${enabledRounds.sampleHitster ? 'selected' : ''}`}
        >
          <div className={`w-6 h-6 border flex items-center justify-center transition-all ${
            enabledRounds.sampleHitster
              ? 'bg-[#C23B22] border-[#C23B22]'
              : 'border-[#D4CFC7] bg-white'
          }`}>
            {enabledRounds.sampleHitster && (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <input
            type="checkbox"
            id="round-sample-hitster"
            name="round-sample-hitster"
            checked={enabledRounds.sampleHitster}
            onChange={(e) => setEnabledRounds({ ...enabledRounds, sampleHitster: e.target.checked })}
            className="sr-only"
          />
          <div className="flex items-center gap-3 flex-1">
            <span className="editorial-stamp w-7 h-7 text-xs flex-shrink-0">3</span>
            <div>
              <span className="font-bold text-[#1A1A1A] block">Sample Hitster</span>
              <span className="text-sm text-[#6B6560]">Guess the sample year ({sampleHitsterSongCount} song{sampleHitsterSongCount !== 1 ? 's' : ''})</span>
            </div>
          </div>
        </label>

        <label
          htmlFor="round-sporcle"
          className={`choice-card flex items-center gap-4 p-4 cursor-pointer ${enabledRounds.sporcle ? 'selected' : ''}`}
        >
          <div className={`w-6 h-6 border flex items-center justify-center transition-all ${
            enabledRounds.sporcle
              ? 'bg-[#C23B22] border-[#C23B22]'
              : 'border-[#D4CFC7] bg-white'
          }`}>
            {enabledRounds.sporcle && (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <input
            type="checkbox"
            id="round-sporcle"
            name="round-sporcle"
            checked={enabledRounds.sporcle}
            onChange={(e) => setEnabledRounds({ ...enabledRounds, sporcle: e.target.checked })}
            className="sr-only"
          />
          <div className="flex items-center gap-3 flex-1">
            <span className="editorial-stamp w-7 h-7 text-xs flex-shrink-0">4</span>
            <div>
              <span className="font-bold text-[#1A1A1A] block">The Sporcle Round</span>
              <span className="text-sm text-[#6B6560]">Pick the most obscure answer</span>
            </div>
          </div>
        </label>
      </div>
    </div>
  )
}
