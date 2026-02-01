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
    <div className="min-h-screen bg-gray-100">
      <Header
        phase={phase}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={selectedThemes.length}
        themeName={currentTheme?.name}
        showLeaderboard={showLeaderboard}
        setShowLeaderboard={setShowLeaderboard}
        onNewGame={handleNewGame}
      />

      <main className="py-6">
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
          <div className="max-w-2xl mx-auto p-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Complete!</h2>
            <p className="text-gray-600 mb-6">
              Click "View Leaderboard" to see the final scores.
            </p>
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
