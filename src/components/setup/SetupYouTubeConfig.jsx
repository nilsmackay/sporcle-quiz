import React from 'react'

export default function SetupYouTubeConfig({ allYoutubeVideos, selectedYoutubeIndices, setSelectedYoutubeIndices }) {
  const selected = selectedYoutubeIndices ?? allYoutubeVideos.map((_, i) => i)

  const toggle = (idx, checked) => {
    // Rebuild from the master list so selection always stays in original order and deduped
    const next = allYoutubeVideos
      .map((_, i) => i)
      .filter(i => (i === idx ? checked : selected.includes(i)))
    setSelectedYoutubeIndices(next)
  }

  const allSelected = selected.length === allYoutubeVideos.length
  const toggleAll = () => {
    setSelectedYoutubeIndices(allSelected ? [] : allYoutubeVideos.map((_, i) => i))
  }

  return (
    <div className="game-card p-5 mb-6">
      <div className="flex items-center justify-between mb-1 gap-3">
        <h2 className="text-lg font-display text-[#1A1A1A]">YouTube Videos</h2>
        <button
          type="button"
          onClick={toggleAll}
          className="text-sm text-[#C23B22] font-bold hover:underline flex-shrink-0"
        >
          {allSelected ? 'Clear all' : 'Select all'}
        </button>
      </div>
      <p className="text-sm text-[#6B6560] mb-4">
        Choose which videos to include ({selected.length}/{allYoutubeVideos.length} selected)
      </p>
      <div className="space-y-2">
        {allYoutubeVideos.map((video, idx) => {
          const isSelected = selected.includes(idx)
          return (
            <label
              key={video.url}
              htmlFor={`youtube-video-${idx}`}
              className={`choice-card flex items-center gap-4 p-3 cursor-pointer ${isSelected ? 'selected' : ''}`}
            >
              <div className={`w-6 h-6 border flex items-center justify-center transition-all flex-shrink-0 ${
                isSelected
                  ? 'bg-[#C23B22] border-[#C23B22]'
                  : 'border-[#D4CFC7] bg-white'
              }`}>
                {isSelected && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                id={`youtube-video-${idx}`}
                checked={isSelected}
                onChange={(e) => toggle(idx, e.target.checked)}
                className="sr-only"
              />
              <span className="font-bold text-[#1A1A1A] min-w-0 truncate">{video.title}</span>
            </label>
          )
        })}
      </div>
      {selected.length === 0 && (
        <p className="text-sm text-[#C23B22] mt-3">Select at least one video to play this round.</p>
      )}
    </div>
  )
}
