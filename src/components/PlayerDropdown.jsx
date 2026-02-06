import React from 'react'
import Select, { components } from 'react-select'

export default function PlayerDropdown({ player, playerIndex = 0, options, selectedAnswer, onSelect }) {
  // Calculate min and max percentages from available options (excluding invalid)
  const percentages = options.map(opt => opt.percentage)
  const minPercent = Math.min(...percentages)
  const maxPercent = Math.max(...percentages)

  // Interpolate between two colors
  const interpolateColor = (color1, color2, factor) => {
    const c1 = parseInt(color1.slice(1), 16)
    const c2 = parseInt(color2.slice(1), 16)
    const r1 = (c1 >> 16) & 0xff, g1 = (c1 >> 8) & 0xff, b1 = c1 & 0xff
    const r2 = (c2 >> 16) & 0xff, g2 = (c2 >> 8) & 0xff, b2 = c2 & 0xff
    const r = Math.round(r1 + factor * (r2 - r1))
    const g = Math.round(g1 + factor * (g2 - g1))
    const b = Math.round(b1 + factor * (b2 - b1))
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  }

  const getScoreBadgeClass = (percentage) => {
    // Map percentage to position in range
    const normalizedPosition = maxPercent === minPercent ? 0 : (percentage - minPercent) / (maxPercent - minPercent)
    if (normalizedPosition <= 0.33) return 'score-badge-good'
    if (normalizedPosition <= 0.66) return 'score-badge-ok'
    return 'score-badge-bad'
  }

  const getPercentageColor = (percentage) => {
    // Handle invalid answer
    if (percentage === 100) return { bg: '#C23B22', text: 'white' }

    // Map percentage to position in actual range (0 = best, 1 = worst)
    const normalizedPosition = maxPercent === minPercent ? 0 : (percentage - minPercent) / (maxPercent - minPercent)

    // Color gradient: green (best) -> gold (middle) -> red (worst)
    const green = '#2D6A4F'
    const gold = '#B8924A'
    const red = '#C23B22'

    let bgColor
    if (normalizedPosition <= 0.5) {
      // Interpolate from green to gold
      bgColor = interpolateColor(green, gold, normalizedPosition * 2)
    } else {
      // Interpolate from gold to red
      bgColor = interpolateColor(gold, red, (normalizedPosition - 0.5) * 2)
    }

    return { bg: bgColor, text: 'white' }
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
            borderRadius: '0',
            fontSize: '12px',
            fontFamily: "'Fraunces', serif",
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
      borderColor: state.isFocused ? '#C23B22' : '#D4CFC7',
      borderWidth: '1px',
      borderRadius: '2px',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(194, 59, 34, 0.15)' : 'none',
      padding: '4px',
      '&:hover': {
        borderColor: '#1A1A1A'
      }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? '#1A1A1A'
        : state.isFocused
        ? '#F7F3ED'
        : 'white',
      color: state.isSelected ? 'white' : '#1A1A1A',
      cursor: 'pointer',
      padding: '12px 14px',
      fontSize: '0.9rem',
      fontWeight: state.isSelected ? '600' : '400'
    }),
    menu: (base) => ({
      ...base,
      zIndex: 50,
      borderRadius: '2px',
      boxShadow: '0 4px 20px rgba(26, 26, 26, 0.15)',
      border: '1px solid #D4CFC7',
      backgroundColor: 'white',
      overflow: 'hidden'
    }),
    menuList: (base) => ({
      ...base,
      padding: '4px'
    }),
    placeholder: (base) => ({
      ...base,
      color: '#6B6560',
      fontSize: '0.9rem'
    }),
    singleValue: (base) => ({
      ...base,
      color: '#1A1A1A',
      fontSize: '0.9rem',
      fontWeight: '500'
    }),
    input: (base) => ({
      ...base,
      fontSize: '0.9rem',
      color: '#1A1A1A'
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
          <div className="editorial-stamp w-8 h-8 text-sm text-[#C23B22]">
            {playerIndex + 1}
          </div>
          <h3 className="font-display text-[#1A1A1A] text-lg">{player}</h3>
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
        placeholder="Search answers..."
        isSearchable
        styles={customStyles}
        components={{ Option: CustomOption }}
        classNamePrefix="react-select"
        menuPlacement="auto"
        maxMenuHeight={300}
        menuPortalTarget={document.body}
        blurInputOnSelect={true}
        aria-label={`Select answer for ${player}`}
      />

      {/* Selected answer display */}
      {selectedAnswer && (
        <div className="mt-3 pt-3 border-t border-[#D4CFC7]">
          <p className="text-sm text-[#6B6560] flex items-center gap-2">
            <span className="text-[#2D6A4F]">✓</span>
            <span className="font-semibold text-[#1A1A1A] truncate">{selectedAnswer.option}</span>
          </p>
        </div>
      )}
    </div>
  )
}
