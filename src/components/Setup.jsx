import React, { useState } from 'react'
import Switch from 'react-switch'
import CATEGORIES from '../data/categories'
import { useLanguage } from '../i18n.jsx'

export default function Setup({
  themes,
  players,
  setPlayers,
  selectedThemes,
  setSelectedThemes,
  onStart,
  isDynamicMode,
  setIsDynamicMode,
  dynamicQuestionCount,
  setDynamicQuestionCount,
  currentPicker,
  setCurrentPicker,
  dynamicAvailableThemes,
  setDynamicAvailableThemes,
  youtubeVideoCount,
  enabledRounds,
  setEnabledRounds
}) {
  const [newPlayer, setNewPlayer] = useState('')
  const { t, themeName: translateThemeName, categoryName } = useLanguage()

  const addPlayer = () => {
    const trimmed = newPlayer.trim()
    if (trimmed && !players.includes(trimmed)) {
      setPlayers([...players, trimmed])
      setNewPlayer('')
    }
  }

  const removePlayer = (player) => {
    setPlayers(players.filter(p => p !== player))
  }

  const toggleTheme = (themeId) => {
    if (selectedThemes.includes(themeId)) {
      setSelectedThemes(selectedThemes.filter(id => id !== themeId))
    } else {
      setSelectedThemes([...selectedThemes, themeId])
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addPlayer()
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

  const hasEnabledRound = enabledRounds.youtube || enabledRounds.sporcle

  const canStart = hasEnabledRound && (
    isDynamicMode
      ? players.length > 0 && (!enabledRounds.sporcle || (dynamicQuestionCount > 0 && dynamicQuestionCount <= dynamicAvailableThemes.length && dynamicAvailableThemes.length > 0))
      : players.length > 0 && (!enabledRounds.sporcle || selectedThemes.length > 0)
  )

  const getThemeIcon = (themeName) => {
    const name = themeName.toLowerCase()
    if (name.includes('africa') || name.includes('afrika')) return '🌍'
    if (name.includes('asia') || name.includes('azië')) return '🌏'
    if (name.includes('europe') || name.includes('capital') || name.includes('europese') || name.includes('hoofdsted')) return '🏛️'
    if (name.includes('states') || name.includes('america') || name.includes('staten') || name.includes('amerika')) return '🗽'
    return '📚'
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 slide-up">
      {/* Welcome Banner */}
      <div className="text-center mb-8">
        <div className="editorial-stamp w-20 h-20 text-[#C23B22] text-3xl mb-4 mx-auto">
          TS
        </div>
        <h1 className="text-3xl sm:text-4xl font-display text-[#1A1A1A] mb-2">
          {t('setup.welcome')}
        </h1>
        <p className="text-[#6B6560] text-lg">{t('setup.subtitle')}</p>
      </div>

      {/* Rounds Selection */}
      <div className="game-card p-5 mb-6">
        <h2 className="text-lg font-display text-[#1A1A1A] mb-3">{t('setup.rounds')}</h2>
        <p className="text-sm text-[#6B6560] mb-4">{t('setup.roundsDesc')}</p>
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
                <span className="font-bold text-[#1A1A1A] block">{t('setup.youtubeViews')}</span>
                <span className="text-sm text-[#6B6560]">{t('setup.youtubeDesc', { count: youtubeVideoCount })}</span>
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
              <span className="editorial-stamp w-7 h-7 text-xs flex-shrink-0">2</span>
              <div>
                <span className="font-bold text-[#1A1A1A] block">{t('setup.sporcleRound')}</span>
                <span className="text-sm text-[#6B6560]">{t('setup.sporcleDesc')}</span>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Contestants Card */}
      <div className="game-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-xl font-display text-[#1A1A1A]">{t('setup.contestants')}</h2>
          {players.length > 0 && (
            <span className="ml-auto border-2 border-[#1A1A1A] text-[#1A1A1A] text-sm font-bold px-3 py-1">
              {t('setup.ready', { count: players.length })}
            </span>
          )}
        </div>

        {/* Add player input */}
        <div className="flex gap-3 mb-5 overflow-hidden">
          <input
            type="text"
            id="player-name-input"
            name="playerName"
            value={newPlayer}
            onChange={(e) => setNewPlayer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('setup.placeholder')}
            aria-label="Contestant name"
            className="game-input flex-1 min-w-0"
          />
          <button
            onClick={addPlayer}
            disabled={!newPlayer.trim()}
            className="btn-teal px-3 text-sm flex-shrink-0"
          >
            {t('setup.add')}
          </button>
        </div>

        {/* Player list */}
        {players.length > 0 ? (
          <div className="flex flex-wrap gap-2 stagger-in">
            {players.map((player, index) => (
              <div
                key={player}
                className="contestant-badge group"
              >
                <span>{player}</span>
                <button
                  onClick={() => removePlayer(player)}
                  className="w-5 h-5 flex items-center justify-center border border-[#6B6560] hover:bg-[#C23B22] hover:border-[#C23B22] hover:text-white text-[#6B6560] text-xs font-bold transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-[#D4CFC7] bg-[#F7F3ED]/50">
            <p className="text-[#6B6560] font-display italic">{t('setup.emptyState')}</p>
          </div>
        )}
      </div>

      {/* Game Mode Card - Only show when Sporcle round is enabled */}
      {enabledRounds.sporcle && (
      <div className="game-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-xl font-display text-[#1A1A1A]">{t('setup.gameMode')}</h2>
        </div>

        {/* Dynamic mode toggle */}
        <div className="flex items-center justify-between p-4 bg-[#F7F3ED] hover:bg-[#EDE8DF] transition-colors border border-[#D4CFC7] mb-4">
          <div>
            <span className="font-bold text-[#1A1A1A] block">{t('setup.dynamicMode')}</span>
            <span className="text-sm text-[#6B6560]">{t('setup.dynamicDesc')}</span>
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
                {t('setup.numberOfRounds')}
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
              <p className="text-xs text-[#6B6560] mt-1">{t('setup.themesSelected', { count: dynamicAvailableThemes.length, s: dynamicAvailableThemes.length !== 1 ? 's' : '' })}</p>
            </div>
          </div>
        )}
      </div>
      )}

      {/* Theme Pool Card - Dynamic mode and when Sporcle round is enabled */}
      {isDynamicMode && enabledRounds.sporcle && (
        <div className="game-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-xl font-display text-[#1A1A1A]">{t('setup.themePool')}</h2>
            <span className="ml-auto border-2 border-[#1A1A1A] text-[#1A1A1A] text-sm font-bold px-3 py-1">
              {t('setup.selected', { count: dynamicAvailableThemes.length })}
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
                    <span className="font-display text-[#1A1A1A]">{categoryName(category.id)}</span>
                    <span className="text-xs text-[#6B6560] ml-auto">
                      {categoryThemeIds.filter(id => dynamicAvailableThemes.includes(id)).length}/{categoryThemeIds.length}
                    </span>
                  </button>
                  <div className="ml-8 space-y-1">
                    {categoryThemeIds.map(themeId => {
                      const theme = themes.find(t => t.id === themeId)
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
                          <span className="text-sm text-[#1A1A1A]">{translateThemeName(themeId)}</span>
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

      {/* Categories Card - Only in standard mode and when Sporcle round is enabled */}
      {!isDynamicMode && enabledRounds.sporcle && (
        <div className="game-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-xl font-display text-[#1A1A1A]">{t('setup.categories')}</h2>
            {selectedThemes.length > 0 && (
              <span className="ml-auto border-2 border-[#1A1A1A] text-[#1A1A1A] text-sm font-bold px-3 py-1">
                {t('setup.selected', { count: selectedThemes.length })}
              </span>
            )}
          </div>

          <div className="space-y-2 stagger-in">
            {themes.map(theme => {
              const isSelected = selectedThemes.includes(theme.id)
              const translatedName = translateThemeName(theme.id)
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
                    aria-label={`Select category ${translatedName}`}
                    className="sr-only"
                  />
                  <div className="w-10 h-10 bg-[#F7F3ED] border border-[#D4CFC7] flex items-center justify-center text-xl">
                    <span className="emoji">{getThemeIcon(translatedName)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-[#1A1A1A] block line-clamp-2">{translatedName}</span>
                    <span className="text-sm text-[#6B6560]">{t('setup.answers', { count: theme.options.length })}</span>
                  </div>
                </label>
              )
            })}
          </div>
        </div>
      )}

      {/* Start Button */}
      <button
        onClick={onStart}
        disabled={!canStart}
        className="w-full btn-gold py-5 text-xl"
      >
        {canStart ? (
          <span>{t('setup.beginQuiz')}</span>
        ) : (
          <span>
            {!hasEnabledRound
              ? t('setup.selectRound')
              : players.length === 0
              ? t('setup.addContestant')
              : enabledRounds.sporcle && isDynamicMode
              ? t('setup.configureRounds')
              : enabledRounds.sporcle && !isDynamicMode
              ? t('setup.selectCategory')
              : t('setup.configureSettings')
            }
          </span>
        )}
      </button>

      {/* Tip - Only show when Sporcle round is enabled */}
      {enabledRounds.sporcle && (
        <div className="mt-6 text-center border-t border-[#D4CFC7] pt-4">
          <p className="text-[#6B6560] text-sm italic">
            {t('setup.tip')}
          </p>
        </div>
      )}
    </div>
  )
}
