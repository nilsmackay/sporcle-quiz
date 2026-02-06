import React, { useState } from 'react'
import Switch from 'react-switch'

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
  setCurrentPicker
}) {
  const [newPlayer, setNewPlayer] = useState('')

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

  const canStart = isDynamicMode
    ? players.length > 0 && currentPicker && dynamicQuestionCount > 0 && dynamicQuestionCount <= themes.length
    : players.length > 0 && selectedThemes.length > 0

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
      {/* Welcome Banner */}
      <div className="text-center mb-8">
        <div className="editorial-stamp w-20 h-20 text-[#C23B22] text-3xl mb-4 mx-auto">
          TS
        </div>
        <h1 className="text-3xl sm:text-4xl font-display text-[#1A1A1A] mb-2">
          Welcome, Contestants!
        </h1>
        <p className="text-[#6B6560] text-lg">The ultimate trivia challenge awaits</p>
      </div>

      {/* Contestants Card */}
      <div className="game-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-xl font-display text-[#1A1A1A]">Contestants</h2>
          {players.length > 0 && (
            <span className="ml-auto border-2 border-[#1A1A1A] text-[#1A1A1A] text-sm font-bold px-3 py-1">
              {players.length} ready
            </span>
          )}
        </div>

        {/* Add player input */}
        <div className="flex gap-3 mb-5">
          <input
            type="text"
            id="player-name-input"
            name="playerName"
            value={newPlayer}
            onChange={(e) => setNewPlayer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter contestant name..."
            aria-label="Contestant name"
            className="game-input flex-1"
          />
          <button
            onClick={addPlayer}
            disabled={!newPlayer.trim()}
            className="btn-teal px-4 text-sm flex-shrink-0"
          >
            Add
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
            <p className="text-[#6B6560] font-display italic">Add contestants to begin</p>
          </div>
        )}
      </div>

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
                max={themes.length}
                value={dynamicQuestionCount}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === '') {
                    setDynamicQuestionCount('')
                  } else {
                    setDynamicQuestionCount(Math.min(themes.length, Math.max(1, parseInt(value) || 1)))
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
              <p className="text-xs text-[#6B6560] mt-1">Up to {themes.length} categories available</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A1A1A] mb-2">
                Who picks first?
              </label>
              {players.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {players.map((player) => (
                    <button
                      key={player}
                      onClick={() => setCurrentPicker(player)}
                      className={`p-3 text-sm font-bold transition-all border ${
                        currentPicker === player
                          ? 'bg-[#C23B22] text-white border-[#C23B22]'
                          : 'bg-white text-[#1A1A1A] border-[#D4CFC7] hover:border-[#1A1A1A]'
                      }`}
                    >
                      {player}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#6B6560] italic">Add contestants first</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Categories Card - Only in standard mode */}
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

      {/* Start Button */}
      <button
        onClick={onStart}
        disabled={!canStart}
        className="w-full btn-gold py-5 text-xl"
      >
        {canStart ? (
          <span>Begin the Quiz</span>
        ) : (
          <span>
            {isDynamicMode ? (
              players.length === 0
                ? 'Add contestants to begin'
                : !currentPicker
                ? 'Select who picks first'
                : 'Configure rounds to start'
            ) : (
              players.length === 0 && selectedThemes.length === 0
                ? 'Add contestants & select categories'
                : players.length === 0
                ? 'Add at least one contestant'
                : 'Select at least one category'
            )}
          </span>
        )}
      </button>

      {/* Tip */}
      <div className="mt-6 text-center border-t border-[#D4CFC7] pt-4">
        <p className="text-[#6B6560] text-sm italic">
          Pick obscure answers for lower scores!
        </p>
      </div>
    </div>
  )
}
