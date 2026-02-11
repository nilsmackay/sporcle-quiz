import React from 'react'
import Switch from 'react-switch'
import CATEGORIES from '../../data/categories'
import { getThemeIcon, getThemeById } from '../../utils/themes'

export default function SetupSporcleConfig({
  themes,
  isDynamicMode,
  setIsDynamicMode,
  dynamicQuestionCount,
  setDynamicQuestionCount,
  dynamicAvailableThemes,
  setDynamicAvailableThemes,
  selectedThemes,
  setSelectedThemes
}) {
  const toggleTheme = (themeId) => {
    if (selectedThemes.includes(themeId)) {
      setSelectedThemes(selectedThemes.filter(id => id !== themeId))
    } else {
      setSelectedThemes([...selectedThemes, themeId])
    }
  }

  const toggleDynamicTheme = (themeId) => {
    if (dynamicAvailableThemes.includes(themeId)) {
      setDynamicAvailableThemes(dynamicAvailableThemes.filter(id => id !== themeId))
    } else {
      setDynamicAvailableThemes([...dynamicAvailableThemes, themeId])
    }
  }

  const toggleCategory = (category) => {
    const categoryThemeIds = category.themes
    const allSelected = categoryThemeIds.every(id => dynamicAvailableThemes.includes(id))
    if (allSelected) {
      setDynamicAvailableThemes(dynamicAvailableThemes.filter(id => !categoryThemeIds.includes(id)))
    } else {
      const newThemes = new Set([...dynamicAvailableThemes, ...categoryThemeIds])
      setDynamicAvailableThemes([...newThemes])
    }
  }

  return (
    <>
      {/* Game Mode Card */}
      <div className="game-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-xl font-display text-[#1A1A1A]">Game Mode</h2>
        </div>

        {/* Dynamic mode toggle */}
        <div className="flex items-center justify-between p-4 bg-[#F7F3ED] hover:bg-[#EDE8DF] transition-colors border border-[#D4CFC7] mb-4">
          <div>
            <span className="font-bold text-[#1A1A1A] block">Dynamic Mode</span>
            <span className="text-sm text-[#6B6560]">Players choose categories during play</span>
          </div>
          <Switch
            checked={isDynamicMode}
            onChange={setIsDynamicMode}
            onColor="#C23B22"
            offColor="#D4CFC7"
            onHandleColor="#ffffff"
            offHandleColor="#ffffff"
            handleDiameter={24}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0 2px 4px rgba(0,0,0,0.15)"
            activeBoxShadow="0 0 2px 3px rgba(194,59,34,0.2)"
            height={28}
            width={56}
            id="dynamic-mode-toggle"
            aria-label="Enable dynamic mode"
          />
        </div>

        {/* Dynamic mode options */}
        {isDynamicMode && (
          <div className="space-y-4 border-t border-[#D4CFC7] pt-4">
            <div>
              <label htmlFor="round-count" className="block text-sm font-bold text-[#1A1A1A] mb-2">
                Number of Rounds
              </label>
              <input
                type="number"
                id="round-count"
                name="roundCount"
                min={1}
                max={dynamicAvailableThemes.length || 1}
                value={dynamicQuestionCount}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === '') {
                    setDynamicQuestionCount('')
                  } else {
                    const max = dynamicAvailableThemes.length || 1
                    setDynamicQuestionCount(Math.min(max, Math.max(1, parseInt(value) || 1)))
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value === '') {
                    setDynamicQuestionCount(1)
                  }
                }}
                aria-label="Number of rounds"
                className="game-input w-full"
              />
              <p className="text-xs text-[#6B6560] mt-1">Up to {dynamicAvailableThemes.length} theme{dynamicAvailableThemes.length !== 1 ? 's' : ''} selected</p>
            </div>
          </div>
        )}
      </div>

      {/* Theme Pool Card - Dynamic mode */}
      {isDynamicMode && (
        <div className="game-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-xl font-display text-[#1A1A1A]">Theme Pool</h2>
            <span className="ml-auto border-2 border-[#1A1A1A] text-[#1A1A1A] text-sm font-bold px-3 py-1">
              {dynamicAvailableThemes.length} selected
            </span>
          </div>

          <div className="space-y-4 stagger-in">
            {CATEGORIES.map(category => {
              const categoryThemeIds = category.themes
              const allSelected = categoryThemeIds.every(id => dynamicAvailableThemes.includes(id))
              const someSelected = categoryThemeIds.some(id => dynamicAvailableThemes.includes(id))

              return (
                <div key={category.id}>
                  <button
                    onClick={() => toggleCategory(category)}
                    className="flex items-center gap-3 w-full text-left mb-2 group"
                  >
                    <div className={`w-5 h-5 border flex items-center justify-center transition-all ${
                      allSelected
                        ? 'bg-[#C23B22] border-[#C23B22]'
                        : someSelected
                        ? 'bg-[#C23B22]/40 border-[#C23B22]'
                        : 'border-[#D4CFC7] bg-white group-hover:border-[#1A1A1A]'
                    }`}>
                      {(allSelected || someSelected) && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={allSelected ? "M5 13l4 4L19 7" : "M5 12h14"} />
                        </svg>
                      )}
                    </div>
                    <span className="emoji text-lg">{category.icon}</span>
                    <span className="font-display text-[#1A1A1A]">{category.name}</span>
                    <span className="text-xs text-[#6B6560] ml-auto">
                      {categoryThemeIds.filter(id => dynamicAvailableThemes.includes(id)).length}/{categoryThemeIds.length}
                    </span>
                  </button>
                  <div className="ml-8 space-y-1">
                    {categoryThemeIds.map(themeId => {
                      const theme = getThemeById(themeId)
                      if (!theme) return null
                      const isSelected = dynamicAvailableThemes.includes(themeId)
                      return (
                        <label
                          key={themeId}
                          htmlFor={`dyn-theme-${themeId}`}
                          className={`flex items-center gap-3 p-2 cursor-pointer transition-colors hover:bg-[#F7F3ED] ${
                            isSelected ? '' : 'opacity-50'
                          }`}
                        >
                          <div className={`w-4 h-4 border flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-[#C23B22] border-[#C23B22]'
                              : 'border-[#D4CFC7] bg-white'
                          }`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <input
                            type="checkbox"
                            id={`dyn-theme-${themeId}`}
                            name={`dyn-theme-${themeId}`}
                            checked={isSelected}
                            onChange={() => toggleDynamicTheme(themeId)}
                            className="sr-only"
                          />
                          <span className="text-sm text-[#1A1A1A]">{theme.name}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Categories Card - Static mode */}
      {!isDynamicMode && (
        <div className="game-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-xl font-display text-[#1A1A1A]">Categories</h2>
            {selectedThemes.length > 0 && (
              <span className="ml-auto border-2 border-[#1A1A1A] text-[#1A1A1A] text-sm font-bold px-3 py-1">
                {selectedThemes.length} selected
              </span>
            )}
          </div>

          <div className="space-y-2 stagger-in">
            {themes.map(theme => {
              const isSelected = selectedThemes.includes(theme.id)
              return (
                <label
                  key={theme.id}
                  htmlFor={`theme-${theme.id}`}
                  className={`choice-card flex items-center gap-4 p-4 cursor-pointer ${isSelected ? 'selected' : ''}`}
                >
                  <div className={`w-6 h-6 border flex items-center justify-center transition-all ${
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
                    id={`theme-${theme.id}`}
                    name={`theme-${theme.id}`}
                    checked={isSelected}
                    onChange={() => toggleTheme(theme.id)}
                    aria-label={`Select category ${theme.name}`}
                    className="sr-only"
                  />
                  <div className="w-10 h-10 bg-[#F7F3ED] border border-[#D4CFC7] flex items-center justify-center text-xl">
                    <span className="emoji">{getThemeIcon(theme.name)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-[#1A1A1A] block line-clamp-2">{theme.name}</span>
                    <span className="text-sm text-[#6B6560]">{theme.options.length} answers</span>
                  </div>
                </label>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
