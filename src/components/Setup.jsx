import React, { useState } from 'react'

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

  // In dynamic mode: need players, first picker, and valid question count
  // In regular mode: need players and selected themes
  const canStart = isDynamicMode
    ? players.length > 0 && currentPicker && dynamicQuestionCount > 0 && dynamicQuestionCount <= themes.length
    : players.length > 0 && selectedThemes.length > 0

  const getThemeIcon = (themeName) => {
    const name = themeName.toLowerCase()
    if (name.includes('africa')) return '🌍'
    if (name.includes('asia')) return '🌏'
    if (name.includes('europe') || name.includes('capital')) return '🏛️'
    return '📚'
  }

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
      {/* Welcome Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-full mb-4 float-animation">
          <span className="text-4xl sm:text-5xl">🎯</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Welcome to Quiz Master!</h1>
        <p className="text-purple-200 text-sm sm:text-base">Challenge your friends and test your knowledge</p>
      </div>

      {/* Add Players Card */}
      <div className="quiz-card p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl sm:text-2xl">👥</span>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Add Players</h2>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newPlayer}
            onChange={(e) => setNewPlayer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter player name"
            className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-cyan-900/50 rounded-xl focus:outline-none focus:border-cyan-500 bg-slate-900/50 text-slate-100 placeholder-slate-500 text-sm sm:text-base transition-colors"
          />
          <button
            onClick={addPlayer}
            disabled={!newPlayer.trim()}
            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-900 rounded-xl font-semibold hover:from-cyan-400 hover:to-cyan-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-all text-sm sm:text-base shadow-md shadow-cyan-500/20"
          >
            Add
          </button>
        </div>

        {players.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 flex items-center gap-1">
              <span>✓</span> Players ready ({players.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {players.map((player, index) => (
                <div
                  key={player}
                  className="player-chip"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="text-xs sm:text-sm">{['🎮', '🎲', '🎪', '🎨', '🎭'][index % 5]}</span>
                  <span className="text-sm">{player}</span>
                  <button
                    onClick={() => removePlayer(player)}
                    className="w-5 h-5 flex items-center justify-center bg-cyan-900/50 hover:bg-red-500 rounded-full text-cyan-400 hover:text-white font-bold text-xs transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-4 sm:py-6 border-2 border-dashed border-cyan-900/50 rounded-xl bg-slate-900/30">
            <span className="text-3xl sm:text-4xl mb-2 block">🎭</span>
            <p className="text-slate-500 text-xs sm:text-sm">Add at least one player to start</p>
          </div>
        )}
      </div>

      {/* Quiz Mode Card */}
      <div className="quiz-card p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl sm:text-2xl">⚡</span>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Quiz Mode</h2>
        </div>

        {/* Dynamic Mode Toggle */}
        <label className="flex items-center justify-between p-3 sm:p-4 bg-slate-900/50 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-colors mb-4 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <span className="text-xl sm:text-2xl">🎲</span>
            <div>
              <span className="font-semibold text-slate-100 block text-sm sm:text-base">Dynamic Mode</span>
              <span className="text-xs sm:text-sm text-cyan-400">Players pick questions during the quiz</span>
            </div>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              checked={isDynamicMode}
              onChange={(e) => setIsDynamicMode(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-12 h-6 rounded-full transition-colors ${isDynamicMode ? 'bg-gradient-to-r from-cyan-500 to-orange-500 shadow-lg shadow-cyan-500/30' : 'bg-slate-700'}`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform mt-0.5 ${isDynamicMode ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
            </div>
          </div>
        </label>

        {/* Dynamic Mode Options */}
        {isDynamicMode && (
          <div className="space-y-4 border-t border-slate-700/50 pt-4">
            {/* Number of Questions */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Number of Questions
              </label>
              <input
                type="number"
                min={1}
                max={themes.length}
                value={dynamicQuestionCount}
                onChange={(e) => setDynamicQuestionCount(Math.min(themes.length, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-cyan-900/50 rounded-xl focus:outline-none focus:border-cyan-500 bg-slate-900/50 text-slate-100 text-sm sm:text-base transition-colors"
              />
              <p className="text-xs text-cyan-500 mt-1">Max: {themes.length} topics available</p>
            </div>

            {/* First Picker Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Who picks the first question?
              </label>
              {players.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {players.map((player, index) => (
                    <button
                      key={player}
                      onClick={() => setCurrentPicker(player)}
                      className={`p-2 sm:p-3 rounded-xl text-sm font-medium transition-all ${
                        currentPicker === player
                          ? 'bg-gradient-to-br from-cyan-500 to-orange-500 text-slate-900 shadow-lg shadow-cyan-500/30'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                      }`}
                    >
                      <span className="mr-1">{['🎮', '🎲', '🎪', '🎨', '🎭'][index % 5]}</span>
                      {player}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">Add players first to select who picks</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Select Themes Card - Only show in non-dynamic mode */}
      {!isDynamicMode && (
        <div className="quiz-card p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl sm:text-2xl">📖</span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Select Quiz Topics</h2>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {themes.map(theme => {
              const isSelected = selectedThemes.includes(theme.id)
              return (
                <label
                  key={theme.id}
                  className={`theme-card flex items-center gap-3 p-3 sm:p-4 cursor-pointer ${isSelected ? 'selected' : ''}`}
                >
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br from-cyan-500 to-orange-500 border-transparent shadow-lg shadow-cyan-500/30'
                      : 'border-slate-600 bg-slate-800'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleTheme(theme.id)}
                    className="sr-only"
                  />
                  <span className="text-xl sm:text-2xl">{getThemeIcon(theme.name)}</span>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-gray-800 block truncate text-sm sm:text-base">{theme.name}</span>
                    <span className="text-xs sm:text-sm text-purple-600">{theme.options.length} answers available</span>
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
        className={`w-full py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg transition-all shadow-xl ${
          canStart
            ? 'btn-success'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {canStart ? (
          <span className="flex items-center justify-center gap-2">
            <span>🚀</span>
            <span>Start Quiz!</span>
          </span>
        ) : (
          <span className="text-sm sm:text-base">
            {isDynamicMode ? (
              players.length === 0
                ? 'Add at least one player'
                : !currentPicker
                ? 'Select who picks first'
                : 'Configure questions to start'
            ) : (
              players.length === 0 && selectedThemes.length === 0
                ? 'Add players & select topics to start'
                : players.length === 0
                ? 'Add at least one player'
                : 'Select at least one topic'
            )}
          </span>
        )}
      </button>

      {/* Fun tip */}
      <div className="mt-4 sm:mt-6 text-center">
        <p className="text-purple-200/70 text-xs sm:text-sm flex items-center justify-center gap-2">
          <span>💡</span>
          <span>Tip: Lower percentage answers score better!</span>
        </p>
      </div>
    </div>
  )
}
