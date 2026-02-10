import React from 'react'
import { useLanguage } from '../i18n.jsx'

export default function Header({
  phase,
  currentQuestionIndex,
  totalQuestions,
  themeName,
  showLeaderboard,
  setShowLeaderboard,
  onNewGame,
  youtubeVideoIndex,
  totalYouTubeVideos
}) {
  const { language, setLanguage, t } = useLanguage()

  const showScoresButton = (
    phase === 'playing' || phase === 'picking' || phase === 'round-results' ||
    phase === 'standings' || phase === 'finished' ||
    phase === 'youtube-playing' || phase === 'youtube-results' || phase === 'youtube-standings'
  )

  return (
    <header className="show-header">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Main header row */}
        <div className="flex items-center justify-between">
          {/* Logo - editorial stamp */}
          <div className="flex items-center gap-3">
            <div className="editorial-stamp w-12 h-12 text-[#C23B22] text-2xl">
              T
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display text-[#1A1A1A] tracking-wide">
                {t('header.title')}
              </h1>
              {phase === 'setup' && (
                <p className="text-[#6B6560] text-xs sm:text-sm">{t('header.subtitle')}</p>
              )}
            </div>
          </div>

          {/* Action buttons + Language toggle */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'nl' : 'en')}
              className="flex items-center border border-[#D4CFC7] text-sm font-bold overflow-hidden h-[38px]"
              aria-label="Toggle language"
            >
              <span className={`px-2 py-1.5 transition-colors ${language === 'en' ? 'bg-[#1A1A1A] text-white' : 'bg-white text-[#6B6560]'}`}>
                EN
              </span>
              <span className={`px-2 py-1.5 transition-colors ${language === 'nl' ? 'bg-[#1A1A1A] text-white' : 'bg-white text-[#6B6560]'}`}>
                NL
              </span>
            </button>

            {showScoresButton && (
              <button
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="flex items-center gap-2 border-2 border-[#1A1A1A] text-[#1A1A1A] px-3 sm:px-4 py-2 font-semibold text-sm hover:bg-[#1A1A1A] hover:text-white transition-all"
              >
                <span className="hidden sm:inline">{showLeaderboard ? t('header.hide') : t('header.scores')}</span>
                <span className="sm:hidden">{t('header.scores')}</span>
              </button>
            )}
            {phase === 'finished' && (
              <button
                onClick={onNewGame}
                className="flex items-center gap-2 bg-[#C23B22] text-white px-3 sm:px-4 py-2 font-semibold text-sm hover:bg-[#A33020] transition-all"
              >
                <span className="hidden sm:inline">{t('header.newGame')}</span>
                <span className="sm:hidden">{t('header.newGameShort')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress bar - YouTube round */}
        {phase === 'youtube-playing' && (
          <div className="mt-4 flex items-center gap-4">
            <div className="score-display text-lg">
              V{youtubeVideoIndex + 1}/{totalYouTubeVideos}
            </div>

            <div className="flex-1 h-[2px] bg-[#D4CFC7] overflow-hidden">
              <div
                className="h-full bg-[#C23B22] transition-all duration-500"
                style={{ width: `${((youtubeVideoIndex + 1) / totalYouTubeVideos) * 100}%` }}
              />
            </div>

            <div className="hidden md:flex items-center gap-3 border-l border-[#D4CFC7] pl-4">
              <span className="text-[#1A1A1A] font-display">{t('header.round1')}</span>
            </div>
          </div>
        )}

        {/* Progress bar - Sporcle round */}
        {phase === 'playing' && (
          <div className="mt-4 flex items-center gap-4">
            <div className="score-display text-lg">
              Q{currentQuestionIndex + 1}/{totalQuestions}
            </div>

            <div className="flex-1 h-[2px] bg-[#D4CFC7] overflow-hidden">
              <div
                className="h-full bg-[#C23B22] transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>

            {themeName && (
              <div className="hidden md:flex items-center gap-3 border-l border-[#D4CFC7] pl-4">
                <span className="text-[#1A1A1A] font-display truncate max-w-[200px]">
                  {t('header.round2Named', { name: themeName })}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Mobile round label */}
        {(phase === 'youtube-playing' || phase === 'playing') && (
          <div className="mt-2 md:hidden">
            <span className="text-xs text-[#6B6560] uppercase tracking-wider font-bold">
              {phase === 'youtube-playing' ? t('header.round1') : t('header.round2')}
            </span>
          </div>
        )}
      </div>
    </header>
  )
}
