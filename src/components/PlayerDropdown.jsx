import React from 'react'
import Select from 'react-select'

export default function PlayerDropdown({ player, options, selectedAnswer, onSelect }) {
  const selectOptions = [
    { value: 'invalid', label: 'Invalid (100%)', percentage: 100 },
    ...options
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(opt => ({
        value: opt.name,
        label: `${opt.name} (${opt.percentage}%)`,
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

  const getPercentageColor = (percentage) => {
    if (percentage <= 20) return 'bg-green-500'
    if (percentage <= 40) return 'bg-green-400'
    if (percentage <= 60) return 'bg-yellow-400'
    if (percentage <= 80) return 'bg-orange-400'
    return 'bg-red-500'
  }

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? '#4f46e5' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(79, 70, 229, 0.2)' : 'none',
      '&:hover': {
        borderColor: '#4f46e5'
      }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? '#4f46e5'
        : state.isFocused
        ? '#e0e7ff'
        : 'white',
      color: state.isSelected ? 'white' : '#1f2937',
      cursor: 'pointer'
    }),
    menu: (base) => ({
      ...base,
      zIndex: 50
    })
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">{player}</h3>
        {selectedAnswer && (
          <span className={`${getPercentageColor(selectedAnswer.percentage)} text-white px-2 py-1 rounded text-sm font-medium`}>
            {selectedAnswer.percentage}%
          </span>
        )}
      </div>
      <Select
        options={selectOptions}
        value={currentValue}
        onChange={handleChange}
        placeholder="Type to search..."
        isSearchable
        styles={customStyles}
        classNamePrefix="react-select"
        menuPlacement="auto"
        maxMenuHeight={200}
      />
      {selectedAnswer && (
        <p className="mt-2 text-sm text-gray-600">
          Selected: <span className="font-medium">{selectedAnswer.option}</span>
        </p>
      )}
    </div>
  )
}
