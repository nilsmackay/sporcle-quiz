import React, { useState } from 'react'

// Salt used during hashing — not secret, just prevents rainbow table lookups
const SALT = 'sporcle'

// SHA-256 hash of (SALT + password). To update the password:
//   1. Open browser console on the app
//   2. Run: crypto.subtle.digest('SHA-256', new TextEncoder().encode('sporcle' + 'YOUR_NEW_PASSWORD')).then(b => console.log([...new Uint8Array(b)].map(x => x.toString(16).padStart(2,'0')).join('')))
//   3. Replace the hash below with the output
const PASSWORD_HASH = 'fec1625e68a345a87f934ae8353a15fb06e1bdabd994b7e55719ed4d7628a156'

const SESSION_KEY = 'sporcle-quiz-auth'

async function hashPassword(password) {
  const data = new TextEncoder().encode(SALT + password)
  const buffer = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(buffer)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export default function PasswordGate({ children }) {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === 'true'
  )
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const hash = await hashPassword(input)
    if (hash === PASSWORD_HASH) {
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
