import React from 'react'

export default function QuestionPicker({
  themes,
  playedThemes,
  currentPicker,
  currentQuestionIndex,
  totalQuestions,
  onSelectQuestion
}) {
  // Get themes that haven't been played yet
  const availableThemes = themes.filter(theme => !playedThemes.includes(theme.id))

  const getThemeIcon = (themeName) => {
    const name = themeName.toLowerCase()
    if (name.includes('africa')) return '🌍'
    if (name.includes('asia')) return '🌏'
    if (name.includes('europe') || name.includes('capital')) return '🏛️'
    if (name.includes('states') || name.includes('america')) return '🗽'
    return '📚'
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 slide-up">
      {/* Header */}
      <div className="game-card p-6 mb-6 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#F4C430] to-[#B8860B] rounded-full mb-4 shadow-xl border-4 border-[#F4C430]/50 spotlight">
          <span className="text-4xl">🎯</span>
        </div>
        <h2 className="text-2xl font-display text-[#2C1810] mb-2">
          Pick a Category!
        </h2>
        <p className="text-[#008080] font-medium mb-4">
          Round {currentQuestionIndex + 1} of {totalQuestions}
        </p>

        {/* Current picker highlight */}
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#F4C430]/30 to-[#DAA520]/20 border-2 border-[#D4A017] px-5 py-3 rounded-full">
          <span className="text-2xl">👑</span>
          <span className="font-display text-[#B8860B] text-lg">{currentPicker}'s turn!</span>
        </div>
      </div>

      {/* Available Categories */}
      <div className="game-card p-6">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📖</span>
            <h3 className="text-xl font-display text-[#2C1810]">Available Categories</h3>
          </div>
          <span className="bg-[#008080] text-white text-sm font-bold px-3 py-1 rounded-full">
            {availableThemes.length} left
          </span>
        </div>

        <div className="space-y-3 stagger-in">
          {availableThemes.map(theme => (
            <button
              key={theme.id}
              onClick={() => onSelectQuestion(theme.id)}
              className="choice-card w-full flex items-center gap-4 p-4 text-left group"
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-[#008080] to-[#006666] rounded-xl flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform border-2 border-[#20B2AA]">
                <span className="emoji">{getThemeIcon(theme.name)}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <span className="font-bold text-[#2C1810] block line-clamp-2 text-lg">{theme.name}</span>
                <span className="text-sm text-[#008080]">{theme.options.length} possible answers</span>
              </div>

              {/* Arrow */}
              <div className="text-[#008080] group-hover:translate-x-1 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Info footer */}
      <div className="mt-6 text-center">
        <p className="text-[#8B7355] text-sm flex items-center justify-center gap-2">
          <span>💡</span>
          <span>The player with the highest score picks next!</span>
        </p>
      </div>
    </div>
  )
}
