import React from 'react'
import Select, { components } from 'react-select'

export default function PlayerDropdown({ player, playerIndex = 0, options, selectedAnswer, onSelect }) {
  const getPercentageColor = (percentage) => {
    if (percentage <= 20) return { bg: '#10b981', text: 'white' }
    if (percentage <= 40) return { bg: '#4ade80', text: 'white' }
    if (percentage <= 60) return { bg: '#fbbf24', text: '#1f2937' }
    if (percentage <= 80) return { bg: '#f97316', text: 'white' }
    return { bg: '#ef4444', text: 'white' }
  }

  const getPercentageColorClass = (percentage) => {
    if (percentage <= 20) return { bg: 'bg-emerald-500', text: 'text-white' }
    if (percentage <= 40) return { bg: 'bg-green-400', text: 'text-white' }
    if (percentage <= 60) return { bg: 'bg-amber-400', text: 'text-gray-800' }
    if (percentage <= 80) return { bg: 'bg-orange-500', text: 'text-white' }
    return { bg: 'bg-red-500', text: 'text-white' }
  }

  const selectOptions = [
    { value: 'invalid', label: 'Invalid', percentage: 100 },
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
    // Blur active element to close mobile keyboard
    if (document.activeElement) {
      document.activeElement.blur()
    }
  }

  const playerIcons = ['🎮', '🎲', '🎪', '🎨', '🎭', '🎯', '🎸', '🎺']

  // Custom Option component with colored percentage badge
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
            padding: '2px 8px',
            borderRadius: '6px',
            fontSize: '11px',
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
      borderColor: state.isFocused ? '#a855f7' : '#e9d5ff',
      borderWidth: '2px',
      borderRadius: '0.75rem',
      boxShadow: 'none',
      backgroundColor: '#faf5ff',
      padding: '2px',
      '&:hover': {
        borderColor: '#a855f7'
      }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? '#7c3aed'
        : state.isFocused
        ? '#f3e8ff'
        : 'white',
      color: state.isSelected ? 'white' : '#374151',
      cursor: 'pointer',
      padding: '10px 12px',
      fontSize: '0.875rem'
    }),
    menu: (base) => ({
      ...base,
      zIndex: 50,
      borderRadius: '0.75rem',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      border: '2px solid #e9d5ff',
      overflow: 'hidden'
    }),
    menuList: (base) => ({
      ...base,
      padding: '4px'
    }),
    placeholder: (base) => ({
      ...base,
      color: '#9ca3af',
      fontSize: '0.875rem'
    }),
    singleValue: (base) => ({
      ...base,
      color: '#374151',
      fontSize: '0.875rem'
    }),
    input: (base) => ({
      ...base,
      fontSize: '0.875rem',
      color: '#374151',
      '& input': {
        boxShadow: 'none !important',
        outline: 'none !important',
        border: 'none !important'
      }
    }),
    inputContainer: (base) => ({
      ...base,
      margin: 0,
      padding: 0
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '2px 8px'
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999
    })
  }

  const colors = getPercentageColorClass(selectedAnswer?.percentage || 100)

  return (
    <div className="player-card relative p-3 sm:p-4 rounded-xl overflow-hidden">
      {/* Gradient top bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>

      <div className="flex items-center justify-between mb-3 pt-1">
        <div className="flex items-center gap-2">
          <span className="text-lg sm:text-xl">{playerIcons[playerIndex % playerIcons.length]}</span>
          <h3 className="font-bold text-gray-800 text-sm sm:text-base">{player}</h3>
        </div>
        {selectedAnswer && (
          <span className={`score-badge ${colors.bg} ${colors.text} text-xs sm:text-sm`}>
            {selectedAnswer.percentage}%
          </span>
        )}
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        <Select
          options={selectOptions}
          value={currentValue}
          onChange={handleChange}
          onMenuClose={handleMenuClose}
          placeholder="🔍 Type to search..."
          isSearchable
          styles={customStyles}
          components={{ Option: CustomOption }}
          classNamePrefix="react-select"
          menuPlacement="auto"
          maxMenuHeight={180}
          menuPortalTarget={document.body}
          blurInputOnSelect={true}
        />
      </div>

      {selectedAnswer && (
        <div className="mt-3 pt-3 border-t border-purple-100">
          <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1.5">
            <span className="text-green-500">✓</span>
            <span className="font-medium text-purple-700 truncate">{selectedAnswer.option}</span>
          </p>
        </div>
      )}
    </div>
  )
}
