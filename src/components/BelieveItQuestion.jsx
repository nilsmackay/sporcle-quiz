import React, { useState, useEffect } from 'react'

export default function BelieveItQuestion({
  players,
  statement,
  statementIndex,
  totalStatements,
  onSubmitGuesses,
  isLastStatement,
  isEditing,
  onSaveAndReturn,
  onCancelEdit,
  committedGuesses
}) {
  const [guesses, setGuesses] = useState({})
  const isExample = !!statement.isExample
  // Real question number (excluding the example at index 0)
  const realNumber = statementIndex
  const realTotal = totalStatements - 1

  // Reset guesses when statement changes, pre-fill in edit mode
  useEffect(() => {
    if (isEditing && committedGuesses) {
      const existing = {}
      players.forEach(player => {
        const committed = committedGuesses[player]?.[statementIndex]
        if (committed !== undefined) existing[player] = committed
      })
      setGuesses(existing)
    } else {
      setGuesses({})
    }
  }, [statementIndex])

  const handleSelect = (player, value) => {
    setGuesses(prev => ({ ...prev, [player]: value }))
  }

  const handleSubmit = () => {
    const parsed = {}
    for (const player of players) {
      parsed[player] = guesses[player] ?? 0
    }
    onSubmitGuesses(statementIndex, parsed)
    if (isEditing) {
      onSaveAndReturn()
    }
  }

  const allPlayersAnswered = players.every(p => guesses[p] !== undefined)
  const answeredCount = players.filter(p => guesses[p] !== undefined).length

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 slide-up">
      {/* Statement Header Card */}
      <div className="game-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#F7F3ED] border border-[#D4CFC7] flex items-center justify-center">
              <span className="text-3xl">🤔</span>
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-display text-[#1A1A1A]">
                Can You Believe It?
              </h2>
              <p className="text-sm text-[#6B6560] italic">
                How likely is this to be true?
              </p>
            </div>
          </div>

          <div className="sm:ml-auto">
            <div className="inline-flex items-center gap-3 bg-[#F7F3ED] border border-[#D4CFC7] px-4 py-2">
              <span className="text-[#6B6560]">Statement:</span>
              <span className="score-display">
                {isExample ? 'Practice' : `${realNumber}/${realTotal}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Practice Round Banner */}
      {isExample && (
        <div className="game-card p-4 mb-6 border-2 border-[#B8924A] bg-[#F7F3ED] text-center">
          <p className="font-display text-[#B8924A] text-lg">Practice Round</p>
          <p className="text-sm text-[#6B6560]">This question doesn't count for points — just to show how the round works!</p>
        </div>
      )}

      {/* Statement Display */}
      <div className="game-card p-6 sm:p-8 mb-6 text-center">
        <p className="text-xl sm:text-2xl font-display text-[#1A1A1A] leading-relaxed">
          "{statement.statement}"
        </p>
      </div>

      {/* Guessing Card */}
      <div className="game-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-display text-[#1A1A1A]">Rate your confidence</h3>
        </div>
        <div className="flex justify-between text-sm text-[#6B6560] mb-5">
          <span className="italic">0 = Definitely False</span>
          <span className="italic">10 = Definitely True</span>
        </div>

        {/* Player Grid */}
        <div className="space-y-5 stagger-in">
          {players.map((player, index) => (
            <div key={player} className="player-podium p-4">
              <div className="flex items-center gap-2 mb-3 pt-1">
                <div className="editorial-stamp w-8 h-8 text-sm text-[#C23B22]">
                  {index + 1}
                </div>
                <h3 className="font-display text-[#1A1A1A] text-lg truncate">{player}</h3>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {Array.from({ length: 11 }, (_, i) => {
                  const isSelected = guesses[player] === i
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(player, i)}
                      className={`w-10 h-10 sm:w-11 sm:h-11 font-display text-base transition-all border-2 ${
                        isSelected
                          ? 'bg-[#C23B22] border-[#C23B22] text-white'
                          : 'bg-white border-[#D4CFC7] text-[#1A1A1A] hover:border-[#1A1A1A]'
                      }`}
                    >
                      {i}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      {isEditing ? (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="order-2 sm:order-1">
            <button
              onClick={onCancelEdit}
              className="btn-teal px-6 py-4 text-lg"
            >
              Cancel
            </button>
          </div>
          <div className="order-1 sm:order-2">
            <button
              onClick={handleSubmit}
              disabled={!allPlayersAnswered}
              className="w-full sm:w-auto btn-gold px-8 py-4 text-lg"
            >
              {allPlayersAnswered ? 'Save & Return' : 'All Must Answer'}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="text-center sm:text-left order-2 sm:order-1">
            {!allPlayersAnswered && (
              <p className="text-[#6B6560] text-sm flex items-center justify-center sm:justify-start gap-2">
                <span>Waiting for {players.length - answeredCount} more answer{players.length - answeredCount !== 1 ? 's' : ''}...</span>
              </p>
            )}
          </div>

          <div className="order-1 sm:order-2">
            {isExample ? (
              <button
                onClick={handleSubmit}
                disabled={!allPlayersAnswered}
                className="w-full sm:w-auto btn-gold px-8 py-4 text-lg"
              >
                {allPlayersAnswered ? 'Lock It In!' : 'All Must Answer'}
              </button>
            ) : isLastStatement ? (
              <button
                onClick={handleSubmit}
                disabled={!allPlayersAnswered}
                className="w-full sm:w-auto btn-gold px-8 py-4 text-lg"
              >
                {allPlayersAnswered ? 'Final Statement' : 'All Must Answer'}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!allPlayersAnswered}
                className="w-full sm:w-auto btn-teal px-8 py-4 text-lg flex items-center justify-center gap-2"
              >
                <span>Next Statement</span>
                <span>&rarr;</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
