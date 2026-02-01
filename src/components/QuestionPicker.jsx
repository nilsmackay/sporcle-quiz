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
    return '📚'
  }

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
      {/* Header */}
      <div className="quiz-card p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
            <span className="text-3xl sm:text-4xl">🎯</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            Pick a Question!
          </h2>
          <p className="text-purple-600 text-sm sm:text-base mb-4">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </p>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-100 px-4 py-2 rounded-full">
            <span className="text-xl">👑</span>
            <span className="font-semibold text-amber-800">{currentPicker}'s turn to pick!</span>
          </div>
        </div>
      </div>

      {/* Available Themes */}
      <div className="quiz-card p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl sm:text-2xl">📖</span>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">Available Topics</h3>
          <span className="ml-auto text-sm text-purple-600">{availableThemes.length} remaining</span>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {availableThemes.map(theme => (
            <button
              key={theme.id}
              onClick={() => onSelectQuestion(theme.id)}
              className="w-full theme-card flex items-center gap-3 p-3 sm:p-4 cursor-pointer hover:shadow-lg transition-all group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <span className="text-xl sm:text-2xl">{getThemeIcon(theme.name)}</span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <span className="font-semibold text-gray-800 block truncate text-sm sm:text-base">{theme.name}</span>
                <span className="text-xs sm:text-sm text-purple-600">{theme.options.length} answers available</span>
              </div>
              <div className="text-purple-500 group-hover:translate-x-1 transition-transform">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 sm:mt-6 text-center">
        <p className="text-purple-200/70 text-xs sm:text-sm flex items-center justify-center gap-2">
          <span>💡</span>
          <span>The player with the lowest score picks the next question!</span>
        </p>
      </div>
    </div>
  )
}
