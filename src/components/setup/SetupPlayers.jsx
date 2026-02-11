import React, { useState } from 'react'

export default function SetupPlayers({ players, setPlayers }) {
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addPlayer()
    }
  }

  return (
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
      <div className="flex gap-3 mb-5 overflow-hidden">
        <input
          type="text"
          id="player-name-input"
          name="playerName"
          value={newPlayer}
          onChange={(e) => setNewPlayer(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter contestant name..."
          aria-label="Contestant name"
          className="game-input flex-1 min-w-0"
        />
        <button
          onClick={addPlayer}
          disabled={!newPlayer.trim()}
          className="btn-teal px-3 text-sm flex-shrink-0"
        >
          Add
        </button>
      </div>

      {/* Player list */}
      {players.length > 0 ? (
        <div className="flex flex-wrap gap-2 stagger-in">
          {players.map((player) => (
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
  )
}
