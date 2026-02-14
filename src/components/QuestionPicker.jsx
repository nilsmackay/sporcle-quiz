import React, { useState, useCallback } from 'react'
import CATEGORIES from '../data/categories'
import { getThemeById } from '../utils/themes'

export default function QuestionPicker({
  themes,
  playedThemes,
  availableThemes,
  currentPicker,
  currentQuestionIndex,
  totalQuestions,
  onSelectQuestion
}) {
  const [flippedCategory, setFlippedCategory] = useState(null)
  const [selectedThemeId, setSelectedThemeId] = useState(null)

  // For each category, get the themes that haven't been played yet
  const getAvailableThemes = useCallback((category) => {
    return category.themes.filter(themeId =>
      availableThemes.includes(themeId) && !playedThemes.includes(themeId)
    )
  }, [availableThemes, playedThemes])

  const handleCategoryClick = (category) => {
    if (flippedCategory) return // already picked
    const available = getAvailableThemes(category)
    if (available.length === 0) return

    // Pick a random theme from this category
    const randomIndex = Math.floor(Math.random() * available.length)
    const themeId = available[randomIndex]
    setSelectedThemeId(themeId)
    setFlippedCategory(category.id)
  }

  const handleContinue = () => {
    if (selectedThemeId) {
      onSelectQuestion(selectedThemeId)
    }
  }

  const getThemeName = (themeId) => {
    const theme = getThemeById(themeId)
    return theme ? theme.name : themeId
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

      {/* Category Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {CATEGORIES.map(category => {
          const available = getAvailableThemes(category)
          const isExhausted = available.length === 0
          const isFlipped = flippedCategory === category.id
          const isOtherFlipped = flippedCategory && flippedCategory !== category.id

          return (
            <div key={category.id} className="category-flip-container">
              <button
                onClick={() => handleCategoryClick(category)}
                disabled={isExhausted || !!flippedCategory}
                className={`category-flip-card ${isFlipped ? 'flipped' : ''} ${
                  isExhausted ? 'exhausted' : ''
                } ${isOtherFlipped ? 'dimmed' : ''}`}
              >
                {/* Front face */}
                <div className="category-flip-face category-flip-front">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="category-card-image"
                    draggable="false"
                  />
                  <div className="category-card-overlay">
                    <span className="font-display text-xl text-white block mb-1">{category.name}</span>
                    <span className="text-sm text-white/80">
                      {isExhausted ? 'No themes left' : `${available.length} theme${available.length !== 1 ? 's' : ''} left`}
                    </span>
                  </div>
                </div>

                {/* Back face - revealed theme */}
                <div className="category-flip-face category-flip-back">
                  <span className="text-sm text-[#6B6560] uppercase tracking-wider font-bold block mb-2">{category.name}</span>
                  <span className="font-display text-lg text-[#C23B22] block">
                    {selectedThemeId ? getThemeName(selectedThemeId) : ''}
                  </span>
                </div>
              </button>
            </div>
          )
        })}
      </div>

      {/* Continue button - shown after flip */}
      {flippedCategory && (
        <div className="bounce-in">
          <button
            onClick={handleContinue}
            className="w-full btn-gold py-4 text-lg font-bold"
          >
            Play: {selectedThemeId ? getThemeName(selectedThemeId) : ''}
          </button>
        </div>
      )}

      {/* Info footer */}
      <div className="mt-6 text-center border-t border-[#D4CFC7] pt-4">
        <p className="text-[#6B6560] text-sm italic">
          The player with the highest score picks next.
        </p>
      </div>
    </div>
  )
}
