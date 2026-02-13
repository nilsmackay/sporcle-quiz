import React, { useState } from 'react'

// Change this to set the app password
const PASSWORD = 'sporcle'

const SESSION_KEY = 'sporcle-quiz-auth'

export default function PasswordGate({ children }) {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === 'true'
  )
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true')
      setAuthenticated(true)
    } else {
      setError(true)
      setInput('')
    }
  }

  if (authenticated) {
    return children
  }

  return (
    <div className="password-gate">
      <div className="password-card game-card">
        <div className="text-center mb-6">
          <div className="editorial-stamp w-16 h-16 text-[#C23B22] text-2xl mx-auto mb-4">
            TS
          </div>
          <h1 className="text-2xl sm:text-3xl font-display text-[#1A1A1A] mb-1">
            Trivia Showdown
          </h1>
          <p className="text-sm text-[#6B6560]">Enter the password to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false) }}
            placeholder="Password"
            className="game-input w-full mb-3"
            autoFocus
          />
          {error && (
            <p className="text-sm text-[#C23B22] mb-3">Incorrect password</p>
          )}
          <button type="submit" className="btn-gold w-full">
            Enter
          </button>
        </form>
      </div>
    </div>
  )
}
