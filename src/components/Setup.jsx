import React from 'react'
import SetupRounds from './setup/SetupRounds'
import SetupPlayers from './setup/SetupPlayers'
import SetupSporcleConfig from './setup/SetupSporcleConfig'

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
  pictureRoundCount,
  sampleHitsterSongCount,
  enabledRounds,
  setEnabledRounds
}) {
  const hasEnabledRound = enabledRounds.youtube || enabledRounds.pictureRound || enabledRounds.sampleHitster || enabledRounds.sporcle

  const canStart = hasEnabledRound && (
    isDynamicMode
      ? players.length > 0 && (!enabledRounds.sporcle || (dynamicQuestionCount > 0 && dynamicQuestionCount <= dynamicAvailableThemes.length && dynamicAvailableThemes.length > 0))
      : players.length > 0 && (!enabledRounds.sporcle || selectedThemes.length > 0)
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 slide-up">
      {/* Welcome Banner */}
      <div className="text-center mb-8">
        <div className="editorial-stamp w-20 h-20 text-[#C23B22] text-3xl mb-4 mx-auto">
          HL
        </div>
        <h1 className="text-3xl sm:text-4xl font-display text-[#1A1A1A] mb-2">
          Welcome, Contestants!
        </h1>
        <p className="text-[#6B6560] text-lg">The ultimate trivia challenge awaits</p>
      </div>

      <SetupRounds
        enabledRounds={enabledRounds}
        setEnabledRounds={setEnabledRounds}
        youtubeVideoCount={youtubeVideoCount}
        pictureRoundCount={pictureRoundCount}
        sampleHitsterSongCount={sampleHitsterSongCount}
      />

      <SetupPlayers
        players={players}
        setPlayers={setPlayers}
      />

      {enabledRounds.sporcle && (
        <SetupSporcleConfig
          themes={themes}
          isDynamicMode={isDynamicMode}
          setIsDynamicMode={setIsDynamicMode}
          dynamicQuestionCount={dynamicQuestionCount}
          setDynamicQuestionCount={setDynamicQuestionCount}
          dynamicAvailableThemes={dynamicAvailableThemes}
          setDynamicAvailableThemes={setDynamicAvailableThemes}
          selectedThemes={selectedThemes}
          setSelectedThemes={setSelectedThemes}
        />
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
            {!hasEnabledRound
              ? 'Select at least one round'
              : players.length === 0
              ? 'Add at least one contestant'
              : enabledRounds.sporcle && isDynamicMode
              ? 'Configure rounds & theme pool'
              : enabledRounds.sporcle && !isDynamicMode
              ? 'Select at least one category'
              : 'Configure game settings'
            }
          </span>
        )}
      </button>

      {/* Tip */}
      {enabledRounds.sporcle && (
        <div className="mt-6 text-center border-t border-[#D4CFC7] pt-4">
          <p className="text-[#6B6560] text-sm italic">
            Pick obscure answers for lower scores!
          </p>
        </div>
      )}
    </div>
  )
}
