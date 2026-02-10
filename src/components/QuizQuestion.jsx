import React, { useState, useEffect } from 'react'
import PlayerDropdown from './PlayerDropdown'
import { useLanguage } from '../i18n.jsx'

export default function QuizQuestion({
  players,
  currentTheme,
  currentQuestionIndex,
  onBatchAnswers,
  onNext,
  isLastQuestion,
  onFinish,
  isEditing,
  onSaveAndReturn,
  onCancelEdit,
  committedAnswers
}) {
  const [pendingAnswers, setPendingAnswers] = useState({})
  const { t, themeName: translateThemeName } = useLanguage()

  // Reset pending answers when question changes, pre-fill in edit mode
  useEffect(() => {
    if (isEditing && committedAnswers) {
      const existing = {}
      players.forEach(player => {
        const committed = committedAnswers[player]?.[currentQuestionIndex]
        if (committed) existing[player] = committed
      })
      setPendingAnswers(existing)
    } else {
      setPendingAnswers({})
    }
  }, [currentQuestionIndex])

  const handleLocalAnswer = (player, answer) => {
    setPendingAnswers(prev => ({ ...prev, [player]: answer }))
  }

  const handleSubmit = () => {
    onBatchAnswers(currentQuestionIndex, pendingAnswers)
    if (isEditing) {
      onSaveAndReturn()
    } else if (isLastQuestion) {
      onFinish()
    } else {
      onNext()
    }
  }

  const allPlayersAnswered = players.every(player => pendingAnswers[player])
  const answeredCount = players.filter(player => pendingAnswers[player]).length

  const getThemeIcon = (themeName) => {
    const name = themeName.toLowerCase()
    if (name.includes('africa') || name.includes('afrika')) return '🌍'
    if (name.includes('asia') || name.includes('azië')) return '🌏'
    if (name.includes('europe') || name.includes('capital') || name.includes('europese') || name.includes('hoofdsted')) return '🏛️'
    if (name.includes('states') || name.includes('america') || name.includes('staten') || name.includes('amerika')) return '🗽'
    return '📚'
  }

  const translatedName = translateThemeName(currentTheme.id)

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 slide-up">
      {/* Question Header Card */}
      <div className="game-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Category icon and name */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#F7F3ED] border border-[#D4CFC7] flex items-center justify-center">
              <span className="text-3xl emoji">{getThemeIcon(translatedName)}</span>
            </div>
            <div>
              <h2 className="text-2xl font-display text-[#1A1A1A]">
                {translatedName}
              </h2>
              <p className="text-[#6B6560] font-medium">
                {t('quiz.possibleAnswers', { count: currentTheme.options.length })}
              </p>
            </div>
          </div>

          {/* Answer counter */}
          <div className="sm:ml-auto">
            <div className="inline-flex items-center gap-3 bg-[#F7F3ED] border border-[#D4CFC7] px-4 py-2">
              <span className="text-[#6B6560]">{t('quiz.responses')}</span>
              <span className="score-display">
                {answeredCount}/{players.length}
              </span>
            </div>
          </div>
        </div>

        {/* Tip */}
        <div className="mt-5 pt-4 border-t border-[#D4CFC7]">
          <p className="text-[#6B6560] text-sm italic">
            {t('quiz.tip')}
          </p>
        </div>
      </div>

      {/* Player Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 stagger-in">
        {players.map((player, index) => (
          <PlayerDropdown
            key={player}
            player={player}
            playerIndex={index}
            options={currentTheme.options}
            selectedAnswer={pendingAnswers[player]}
            onSelect={handleLocalAnswer}
          />
        ))}
      </div>

      {/* Navigation */}
      {isEditing ? (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="order-2 sm:order-1">
            <button
              onClick={onCancelEdit}
              className="w-full sm:w-auto btn-teal px-8 py-4 text-lg"
            >
              {t('quiz.cancel')}
            </button>
          </div>
          <div className="order-1 sm:order-2">
            <button
              onClick={handleSubmit}
              disabled={!allPlayersAnswered}
              className="w-full sm:w-auto btn-gold px-8 py-4 text-lg"
            >
              {allPlayersAnswered ? t('quiz.saveReturn') : t('quiz.allMustAnswer')}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Waiting message */}
          <div className="text-center sm:text-left order-2 sm:order-1">
            {!allPlayersAnswered && (
              <p className="text-[#6B6560] text-sm flex items-center justify-center sm:justify-start gap-2">
                <span>{t('quiz.waiting', { count: players.length - answeredCount, s: players.length - answeredCount !== 1 ? 's' : '', en: players.length - answeredCount !== 1 ? 'en' : '' })}</span>
              </p>
            )}
          </div>

          {/* Action button */}
          <div className="order-1 sm:order-2">
            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={!allPlayersAnswered}
                className="w-full sm:w-auto btn-gold px-8 py-4 text-lg"
              >
                {allPlayersAnswered ? t('quiz.finalRound') : t('quiz.allMustAnswer')}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!allPlayersAnswered}
                className="w-full sm:w-auto btn-teal px-8 py-4 text-lg flex items-center justify-center gap-2"
              >
                <span>{t('quiz.nextRound')}</span>
                <span>→</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
