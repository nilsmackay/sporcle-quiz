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
        <div className="editorial-stamp w-20 h-20 text-[#C23B22] text-3xl mb-4 mx-auto">
          ?
        </div>
        <h2 className="text-2xl font-display text-[#1A1A1A] mb-2">
          Pick a Category
        </h2>
        <p className="text-[#6B6560] font-medium mb-4">
          Round {currentQuestionIndex + 1} of {totalQuestions}
        </p>

        {/* Current picker highlight */}
        <div className="inline-flex items-center gap-3 border-2 border-[#C23B22] px-5 py-3">
          <span className="font-display text-[#C23B22] text-lg">{currentPicker}'s turn</span>
        </div>
      </div>

      {/* Available Categories */}
      <div className="game-card p-6">
        <div className="flex items-center justify-between gap-3 mb-5">
          <h3 className="text-xl font-display text-[#1A1A1A]">Available Categories</h3>
          <span className="border-2 border-[#1A1A1A] text-[#1A1A1A] text-sm font-bold px-3 py-1">
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
              <div className="w-12 h-12 bg-[#F7F3ED] border border-[#D4CFC7] flex items-center justify-center text-2xl group-hover:border-[#1A1A1A] transition-colors">
                <span className="emoji">{getThemeIcon(theme.name)}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <span className="font-bold text-[#1A1A1A] block line-clamp-2 text-lg">{theme.name}</span>
                <span className="text-sm text-[#6B6560]">{theme.options.length} possible answers</span>
              </div>

              {/* Arrow */}
              <div className="text-[#6B6560] group-hover:text-[#1A1A1A] group-hover:translate-x-1 transition-all">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Info footer */}
      <div className="mt-6 text-center border-t border-[#D4CFC7] pt-4">
        <p className="text-[#6B6560] text-sm italic">
          The player with the highest score picks next.
        </p>
      </div>
    </div>
  )
}
