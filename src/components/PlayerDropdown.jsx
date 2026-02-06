import React from 'react'
import Select, { components } from 'react-select'

const playerIcons = ['🎤', '🎬', '⭐', '🎪', '🎭', '🎨', '🎵', '🎲']

export default function PlayerDropdown({ player, playerIndex = 0, options, selectedAnswer, onSelect }) {
  const getScoreBadgeClass = (percentage) => {
    if (percentage <= 20) return 'score-badge-good'
    if (percentage <= 60) return 'score-badge-ok'
    return 'score-badge-bad'
  }

  const getPercentageColor = (percentage) => {
    if (percentage <= 20) return { bg: '#228B22', text: 'white' }
    if (percentage <= 40) return { bg: '#20B2AA', text: 'white' }
    if (percentage <= 60) return { bg: '#DAA520', text: '#2C1810' }
    if (percentage <= 80) return { bg: '#CD853F', text: 'white' }
    return { bg: '#CD5C5C', text: 'white' }
  }

  const selectOptions = [
    { value: 'invalid', label: 'Invalid Answer', percentage: 100 },
    ...options
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(opt => ({
        value: opt.name,
        label: opt.name,
        percentage: opt.percentage
      }))
  ]

  const currentValue = selectedAnswer
    ? selectOptions.find(opt => opt.value === selectedAnswer.option) || null
    : null

  const handleChange = (selected) => {
    if (selected) {
      onSelect(player, {
        option: selected.value,
        percentage: selected.percentage
      })
    }
  }

  const handleMenuClose = () => {
    if (document.activeElement) {
      document.activeElement.blur()
    }
  }

  // Custom Option with score badge
  const CustomOption = (props) => {
    const { data } = props
    const colors = getPercentageColor(data.percentage)
    return (
      <components.Option {...props}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <span>{data.label}</span>
          <span style={{
            backgroundColor: colors.bg,
            color: colors.text,
            padding: '3px 10px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            marginLeft: '8px',
            flexShrink: 0
          }}>
            {data.percentage}%
          </span>
        </div>
      </components.Option>
    )
  }

  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: 'white',
      borderColor: state.isFocused ? '#008080' : '#E8DDB5',
      borderWidth: '3px',
      borderRadius: '8px',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(0, 128, 128, 0.2)' : '0 2px 8px rgba(139, 69, 19, 0.1)',
      padding: '4px',
      '&:hover': {
        borderColor: '#008080'
      }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? '#008080'
        : state.isFocused
        ? '#F5EBCE'
        : 'white',
      color: state.isSelected ? 'white' : '#2C1810',
      cursor: 'pointer',
      padding: '12px 14px',
      fontSize: '0.9rem',
      fontWeight: state.isSelected ? '600' : '400'
    }),
    menu: (base) => ({
      ...base,
      zIndex: 50,
      borderRadius: '8px',
      boxShadow: '0 8px 32px rgba(139, 69, 19, 0.25)',
      border: '3px solid #8B4513',
      backgroundColor: 'white',
      overflow: 'hidden'
    }),
    menuList: (base) => ({
      ...base,
      padding: '4px'
    }),
    placeholder: (base) => ({
      ...base,
      color: '#8B7355',
      fontSize: '0.9rem'
    }),
    singleValue: (base) => ({
      ...base,
      color: '#2C1810',
      fontSize: '0.9rem',
      fontWeight: '500'
    }),
    input: (base) => ({
      ...base,
      fontSize: '0.9rem',
      color: '#2C1810'
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999
    })
  }

  return (
    <div className="player-podium p-4">
      {/* Player header */}
      <div className="flex items-center justify-between mb-4 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#008080] to-[#006666] rounded-lg flex items-center justify-center text-lg shadow-sm">
            {playerIcons[playerIndex % playerIcons.length]}
          </div>
          <h3 className="font-display text-[#2C1810] text-lg">{player}</h3>
        </div>
        {selectedAnswer && (
          <span className={getScoreBadgeClass(selectedAnswer.percentage)}>
            {selectedAnswer.percentage}%
          </span>
        )}
      </div>

      {/* Select dropdown */}
      <Select
        inputId={`player-answer-${player.replace(/\s+/g, '-').toLowerCase()}`}
        name={`answer-${player}`}
        options={selectOptions}
        value={currentValue}
        onChange={handleChange}
        onMenuClose={handleMenuClose}
        placeholder="🔍 Search answers..."
        isSearchable
        styles={customStyles}
        components={{ Option: CustomOption }}
        classNamePrefix="react-select"
        menuPlacement="auto"
        maxMenuHeight={180}
        menuPortalTarget={document.body}
        blurInputOnSelect={true}
        aria-label={`Select answer for ${player}`}
      />

      {/* Selected answer display */}
      {selectedAnswer && (
        <div className="mt-3 pt-3 border-t-2 border-[#E8DDB5]">
          <p className="text-sm text-[#5D4037] flex items-center gap-2">
            <span className="text-[#228B22]">✓</span>
            <span className="font-semibold text-[#008080] truncate">{selectedAnswer.option}</span>
          </p>
        </div>
      )}
    </div>
  )
}
