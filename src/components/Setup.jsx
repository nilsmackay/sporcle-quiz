import React, { useState } from 'react'

export default function Setup({ themes, players, setPlayers, selectedThemes, setSelectedThemes, onStart }) {
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

  const canStart = players.length > 0 && selectedThemes.length > 0

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Players</h2>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newPlayer}
            onChange={(e) => setNewPlayer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter player name"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={addPlayer}
            disabled={!newPlayer.trim()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>

        {players.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600">Players ({players.length})</h3>
            <div className="flex flex-wrap gap-2">
              {players.map(player => (
                <div
                  key={player}
                  className="flex items-center gap-2 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full"
                >
                  <span>{player}</span>
                  <button
                    onClick={() => removePlayer(player)}
                    className="w-5 h-5 flex items-center justify-center bg-indigo-200 hover:bg-indigo-300 rounded-full text-indigo-600 font-bold text-sm transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Themes</h2>

        <div className="space-y-3">
          {themes.map(theme => (
            <label
              key={theme.id}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedThemes.includes(theme.id)}
                onChange={() => toggleTheme(theme.id)}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <div>
                <span className="font-medium text-gray-800">{theme.name}</span>
                <span className="ml-2 text-sm text-gray-500">({theme.options.length} options)</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={onStart}
        disabled={!canStart}
        className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg"
      >
        {canStart ? 'Start Quiz' : 'Add players and select themes to start'}
      </button>
    </div>
  )
}
