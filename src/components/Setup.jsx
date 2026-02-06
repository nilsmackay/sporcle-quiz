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

  const playerIcons = ['🎤', '🎬', '⭐', '🎪', '🎭', '🎨', '🎵', '🎲']

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 slide-up">
      {/* Welcome Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#F4C430] to-[#B8860B] rounded-full mb-4 shadow-xl border-4 border-[#F4C430]/50 spotlight">
          <span className="text-4xl">🏆</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display text-[#5D2E0C] mb-2">
          Welcome, Contestants!
        </h1>
        <p className="text-[#8B7355] text-lg">The ultimate trivia challenge awaits</p>
      </div>

      {/* Contestants Card */}
      <div className="game-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-3xl">👥</span>
          <h2 className="text-xl font-display text-[#5D2E0C]">Contestants</h2>
          {players.length > 0 && (
            <span className="ml-auto bg-[#008080] text-white text-sm font-bold px-3 py-1 rounded-full">
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
            className="btn-teal px-6 text-sm"
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
                <span>{playerIcons[index % playerIcons.length]}</span>
                <span>{player}</span>
                <button
                  onClick={() => removePlayer(player)}
                  className="w-5 h-5 flex items-center justify-center bg-white/20 hover:bg-red-500 rounded-full text-white text-xs font-bold transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-[#E8DDB5] rounded-xl bg-[#FDF6E3]/50">
            <span className="text-4xl mb-2 block">🎭</span>
            <p className="text-[#8B7355]">Add contestants to begin the show!</p>
          </div>
        )}
      </div>

      {/* Game Mode Card */}
      <div className="game-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-3xl">⚡</span>
          <h2 className="text-xl font-display text-[#5D2E0C]">Game Mode</h2>
        </div>

        {/* Dynamic mode toggle */}
        <div className="flex items-center justify-between p-4 bg-[#FDF6E3] rounded-xl hover:bg-[#F5EBCE] transition-colors border-2 border-[#E8DDB5] mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎲</span>
            <div>
              <span className="font-bold text-[#5D2E0C] block">Dynamic Mode</span>
              <span className="text-sm text-[#008080]">Players choose categories during play</span>
            </div>
          </div>
          <Switch
            checked={isDynamicMode}
            onChange={setIsDynamicMode}
            onColor="#008080"
            offColor="#E8DDB5"
            onHandleColor="#ffffff"
            offHandleColor="#ffffff"
            handleDiameter={24}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0 2px 4px rgba(0,0,0,0.2)"
            activeBoxShadow="0 0 2px 3px rgba(0,128,128,0.2)"
            height={28}
            width={56}
            id="dynamic-mode-toggle"
            aria-label="Enable dynamic mode"
          />
        </div>

        {/* Dynamic mode options */}
        {isDynamicMode && (
          <div className="space-y-4 border-t-2 border-[#E8DDB5] pt-4">
            <div>
              <label htmlFor="round-count" className="block text-sm font-bold text-[#5D4037] mb-2">
                Number of Rounds
              </label>
              <input
                type="number"
                id="round-count"
                name="roundCount"
                min={1}
                max={themes.length}
                value={dynamicQuestionCount}
                onChange={(e) => setDynamicQuestionCount(Math.min(themes.length, Math.max(1, parseInt(e.target.value) || 1)))}
                aria-label="Number of rounds"
                className="game-input w-full"
              />
              <p className="text-xs text-[#008080] mt-1">Up to {themes.length} categories available</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#5D4037] mb-2">
                Who picks first?
              </label>
              {players.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {players.map((player, index) => (
                    <button
                      key={player}
                      onClick={() => setCurrentPicker(player)}
                      className={`p-3 rounded-lg text-sm font-bold transition-all border-2 ${
                        currentPicker === player
                          ? 'bg-gradient-to-br from-[#F4C430] to-[#B8860B] text-[#5D2E0C] border-[#F4C430] shadow-lg'
                          : 'bg-[#FDF6E3] text-[#5D4037] border-[#E8DDB5] hover:border-[#008080]'
                      }`}
                    >
                      <span className="mr-1">{playerIcons[index % playerIcons.length]}</span>
                      {player}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#8B7355] italic">Add contestants first</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Categories Card - Only in standard mode */}
      {!isDynamicMode && (
        <div className="game-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl">📖</span>
            <h2 className="text-xl font-display text-[#5D2E0C]">Categories</h2>
            {selectedThemes.length > 0 && (
              <span className="ml-auto bg-[#D4A017] text-[#5D2E0C] text-sm font-bold px-3 py-1 rounded-full">
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
                  <div className={`w-6 h-6 rounded-lg border-3 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#F4C430] to-[#B8860B] border-[#F4C430]'
                      : 'border-[#E8DDB5] bg-white'
                  }`}>
                    {isSelected && (
                      <svg className="w-4 h-4 text-[#5D2E0C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
                  <div className="w-10 h-10 bg-gradient-to-br from-[#008080] to-[#006666] rounded-lg flex items-center justify-center text-xl shadow-md">
                    <span className="emoji">{getThemeIcon(theme.name)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-[#2C1810] block line-clamp-2">{theme.name}</span>
                    <span className="text-sm text-[#008080]">{theme.options.length} answers</span>
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
          <span className="flex items-center justify-center gap-3">
            <span>🎬</span>
            <span>Start the Show!</span>
          </span>
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
      <div className="mt-6 text-center">
        <p className="text-[#8B7355] text-sm flex items-center justify-center gap-2">
          <span>💡</span>
          <span>Pro tip: Pick obscure answers for lower scores!</span>
        </p>
      </div>
    </div>
  )
}
