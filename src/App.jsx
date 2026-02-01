import React, { useState } from 'react'
import Header from './components/Header'
import Setup from './components/Setup'
import QuizQuestion from './components/QuizQuestion'
import Leaderboard from './components/Leaderboard'
import themes from './data/themes.json'

export default function App() {
  const [phase, setPhase] = useState('setup')
  const [players, setPlayers] = useState([])
  const [selectedThemes, setSelectedThemes] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  const currentTheme = selectedThemes[currentQuestionIndex]
    ? themes.find(t => t.id === selectedThemes[currentQuestionIndex])
    : null

  const handleStart = () => {
    setPhase('playing')
    setCurrentQuestionIndex(0)
    setAnswers({})
  }

  const handleAnswer = (player, questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [player]: {
        ...prev[player],
        [questionIndex]: answer
      }
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < selectedThemes.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleFinish = () => {
    setPhase('finished')
    setShowLeaderboard(true)
  }

  const handleNewGame = () => {
    setPhase('setup')
    setPlayers([])
    setSelectedThemes([])
    setCurrentQuestionIndex(0)
    setAnswers({})
    setShowLeaderboard(false)
  }

  return (
    <div className="min-h-screen relative">
      <Header
        phase={phase}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={selectedThemes.length}
        themeName={currentTheme?.name}
        showLeaderboard={showLeaderboard}
        setShowLeaderboard={setShowLeaderboard}
        onNewGame={handleNewGame}
      />

      <main className="main-content py-4 sm:py-6">
        {phase === 'setup' && (
          <Setup
            themes={themes}
            players={players}
            setPlayers={setPlayers}
            selectedThemes={selectedThemes}
            setSelectedThemes={setSelectedThemes}
            onStart={handleStart}
          />
        )}

        {phase === 'playing' && currentTheme && (
          <QuizQuestion
            players={players}
            currentTheme={currentTheme}
            currentQuestionIndex={currentQuestionIndex}
            answers={answers}
            onAnswer={handleAnswer}
            onNext={handleNext}
            isLastQuestion={currentQuestionIndex === selectedThemes.length - 1}
            onFinish={handleFinish}
          />
        )}

        {phase === 'finished' && !showLeaderboard && (
          <div className="max-w-2xl mx-auto px-4 py-8 text-center">
            <div className="quiz-card p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl trophy-animation">🎉</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Quiz Complete!</h2>
              <p className="text-gray-600 mb-6">
                Great job, everyone! Click the button below to see who won.
              </p>
              <button
                onClick={() => setShowLeaderboard(true)}
                className="btn-primary px-8 py-3 text-lg inline-flex items-center gap-2"
              >
                <span>🏆</span>
                <span>View Results</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {showLeaderboard && (
        <Leaderboard
          players={players}
          answers={answers}
          selectedThemes={selectedThemes}
          themes={themes}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </div>
  )
}
