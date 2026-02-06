import React, { useState, useRef } from 'react'
import Select, { components } from 'react-select'
import { getPercentageColor } from '../utils/colors'

export default function PlayerDropdown({ player, playerIndex = 0, options, selectedAnswer, onSelect }) {
  const [inputValue, setInputValue] = useState('')
  const selectRef = useRef(null)

  // Calculate min and max percentages from available options
  const percentages = options.map(opt => opt.percentage)
  const minPercent = Math.min(...percentages)
  const maxPercent = Math.max(...percentages)

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
    setInputValue('')
  }

  const handleMenuClose = () => {
    if (document.activeElement) {
      document.activeElement.blur()
    }
  }

  const handleInputChange = (value, { action }) => {
    // Only update input value if user is typing
    if (action === 'input-change') {
      setInputValue(value)
    } else if (action === 'menu-close') {
      setInputValue('')
    }
    return value
  }

  // Custom Input component that handles Enter key before react-select
  const CustomInput = (props) => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && inputValue) {
        event.preventDefault()
        event.stopPropagation()

        // Find the first option that matches the current input
        const filteredOptions = selectOptions.filter(opt =>
          opt.label.toLowerCase().includes(inputValue.toLowerCase())
        )

        if (filteredOptions.length > 0) {
          // Small delay to ensure the event is fully stopped
          setTimeout(() => {
            handleChange(filteredOptions[0])
            if (selectRef.current) {
              selectRef.current.blur()
            }
          }, 0)
        }
      }
    }

    return (
      <components.Input {...props} onKeyDown={handleKeyDown} />
    )
  }

  // Custom Option with score badge
  const CustomOption = (props) => {
    const { data } = props
    const colors = getPercentageColor(data.percentage, minPercent, maxPercent)
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
        {selectedAnswer && (() => {
          const colors = getPercentageColor(selectedAnswer.percentage, minPercent, maxPercent)
          return (
            <span style={{
              backgroundColor: colors.bg,
              color: colors.text,
              padding: '3px 10px',
              fontSize: '12px',
              fontFamily: "'Fraunces', serif",
              fontWeight: 'bold'
            }}>
              {selectedAnswer.percentage}%
            </span>
          )
        })()}
      </div>

      {/* Select dropdown */}
      <Select
        ref={selectRef}
        inputId={`player-answer-${player.replace(/\s+/g, '-').toLowerCase()}`}
        name={`answer-${player}`}
        options={selectOptions}
        value={currentValue}
        onChange={handleChange}
        onMenuClose={handleMenuClose}
        onInputChange={handleInputChange}
        inputValue={inputValue}
        placeholder="Search answers..."
        isSearchable
        styles={customStyles}
        components={{ Option: CustomOption, Input: CustomInput }}
        classNamePrefix="react-select"
        menuPlacement="auto"
        maxMenuHeight={300}
        blurInputOnSelect={true}
        aria-label={`Select answer for ${player}`}
        menuPortalTarget={document.body}
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
