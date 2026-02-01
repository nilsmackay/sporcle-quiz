import React, { useState } from 'react'
import Header from './components/Header'
import Setup from './components/Setup'
import QuizQuestion from './components/QuizQuestion'
import QuestionPicker from './components/QuestionPicker'
import Leaderboard from './components/Leaderboard'
import themes from './data/themes.json'

export default function App() {
  const [phase, setPhase] = useState('setup')
  const [players, setPlayers] = useState([])
  const [selectedThemes, setSelectedThemes] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  // Dynamic mode state
  const [isDynamicMode, setIsDynamicMode] = useState(false)
  const [dynamicQuestionCount, setDynamicQuestionCount] = useState(3)
  const [currentPicker, setCurrentPicker] = useState('')
  const [playedThemes, setPlayedThemes] = useState([])

  // In dynamic mode, use playedThemes; otherwise use selectedThemes
  const activeThemes = isDynamicMode ? playedThemes : selectedThemes
  const currentTheme = activeThemes[currentQuestionIndex]
    ? themes.find(t => t.id === activeThemes[currentQuestionIndex])
    : null

  // Calculate total score for a player
  const calculatePlayerScore = (player) => {
    let total = 0
    activeThemes.forEach((_, index) => {
      const answer = answers[player]?.[index]
      if (answer) {
        total += answer.percentage
      }
    })
    return total
  }

  // Get the player with the highest/worst score (for dynamic mode)
  // In this game, lower scores are better, so the player doing worst picks next
  const getHighestScorer = () => {
    if (players.length === 0) return ''
    let highestPlayer = players[0]
    let highestScore = calculatePlayerScore(players[0])
    players.forEach(player => {
      const score = calculatePlayerScore(player)
      if (score > highestScore) {
        highestScore = score
        highestPlayer = player
      }
    })
    return highestPlayer
  }

  const handleStart = () => {
    if (isDynamicMode) {
      // In dynamic mode, go to picking phase first
      setPhase('picking')
      setCurrentQuestionIndex(0)
      setAnswers({})
      setPlayedThemes([])
    } else {
      setPhase('playing')
      setCurrentQuestionIndex(0)
      setAnswers({})
    }
  }

  // Handle selecting a question in dynamic mode
  const handleSelectQuestion = (themeId) => {
    setPlayedThemes([...playedThemes, themeId])
    setPhase('playing')
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
    if (isDynamicMode) {
      // In dynamic mode, go to picking phase for next question
      if (playedThemes.length < dynamicQuestionCount) {
        setCurrentPicker(getHighestScorer())
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setPhase('picking')
      }
    } else {
      if (currentQuestionIndex < selectedThemes.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      }
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
    // Reset dynamic mode state
    setIsDynamicMode(false)
    setDynamicQuestionCount(3)
    setCurrentPicker('')
    setPlayedThemes([])
  }

  // Determine total questions based on mode
  const totalQuestions = isDynamicMode ? dynamicQuestionCount : selectedThemes.length
  const isLastQuestion = isDynamicMode
    ? playedThemes.length >= dynamicQuestionCount
    : currentQuestionIndex === selectedThemes.length - 1

  return (
    <div className="min-h-screen relative">
      <Header
        phase={phase}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
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
            isDynamicMode={isDynamicMode}
            setIsDynamicMode={setIsDynamicMode}
            dynamicQuestionCount={dynamicQuestionCount}
            setDynamicQuestionCount={setDynamicQuestionCount}
            currentPicker={currentPicker}
            setCurrentPicker={setCurrentPicker}
          />
        )}

        {phase === 'picking' && (
          <QuestionPicker
            themes={themes}
            playedThemes={playedThemes}
            currentPicker={currentPicker}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={dynamicQuestionCount}
            onSelectQuestion={handleSelectQuestion}
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
            isLastQuestion={isLastQuestion}
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
          selectedThemes={activeThemes}
          themes={themes}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </div>
  )
}
