import { useState, useEffect, useRef } from 'react'
import { useFilter } from '@/context/FilterContext'
import { ChevronDownIcon } from 'lucide-react'

interface FloorUnitFilterProps {
  className?: string
}

const FloorUnitFilter = ({ className = '' }: FloorUnitFilterProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const {
    filterState,
    setFloor,
    setUnit,
    getFloorOptions,
    getUnitOptions,
    resetFilters,
  } = useFilter()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleFloorSelect = (floor: string) => {
    setFloor(floor)
  }

  const handleUnitSelect = (unit: string) => {
    setUnit(unit)
    setIsOpen(false)
  }

  const getDisplayTitle = () => {
    if (filterState.selectedUnit !== 'All Units') {
      return filterState.selectedUnit
    }
    if (filterState.selectedFloor !== 'All Floors') {
      return 'Select Unit'
    }
    return 'All Locations'
  }

  const getDisplayFloor = () => {
    if (filterState.selectedFloor !== 'All Floors') {
      const floorNumber = filterState.selectedFloor.match(/(\d+)/)?.[1]
      if (floorNumber) {
        return `Floor ${floorNumber}`
      }
      // For non-numeric floors like "basement", truncate if too long
      const floorName =
        filterState.selectedFloor.length > 12
          ? filterState.selectedFloor.substring(0, 12) + '...'
          : filterState.selectedFloor
      return floorName
    }
    return 'All Floors'
  }

  const getStatus = () => {
    if (filterState.selectedUnit !== 'All Units') {
      return 'Selected'
    }
    if (filterState.selectedFloor !== 'All Floors') {
      return 'Floor Selected'
    }
    return 'All'
  }

  const floorOptions = getFloorOptions().filter(
    (floor) => floor !== 'All Floors'
  )
  const unitOptions = getUnitOptions().filter((unit) => unit !== 'All Units')

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Main Button */}
      <button
        className='flex items-center gap-3 bg-slate-700/50 rounded-lg px-4 py-3 hover:bg-slate-600/50 transition-colors cursor-pointer w-full min-w-[280px]'
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Icon Container */}
        <div className='w-8 h-8 flex items-center justify-center bg-slate-600 rounded-lg'>
          <svg
            className='w-4 h-4 text-teal-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
            />
          </svg>
        </div>

        {/* Content */}
        <div className='flex-1 text-left'>
          <div className='flex items-center gap-2'>
            <span className='text-white font-medium text-sm'>
              {getDisplayTitle()}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                filterState.selectedUnit !== 'All Units'
                  ? 'text-teal-400 bg-teal-500/20'
                  : filterState.selectedFloor !== 'All Floors'
                  ? 'text-blue-400 bg-blue-500/20'
                  : 'text-slate-400 bg-slate-500/20'
              }`}
            >
              {getStatus()}
            </span>
          </div>
          <div className='flex items-center gap-1 text-slate-400 text-xs mt-1'>
            <svg
              className='w-3 h-3'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
              />
            </svg>
            <span>{getDisplayFloor()}</span>
          </div>
        </div>

        {/* Arrow */}
        <ChevronDownIcon
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className='absolute top-full left-0 mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50 w-96'>
          <div className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-white'>
                Select Floor & Unit
              </h3>
              {(filterState.selectedFloor !== 'All Floors' ||
                filterState.selectedUnit !== 'All Units') && (
                <button
                  onClick={() => {
                    resetFilters()
                    setIsOpen(false)
                  }}
                  className='text-xs text-slate-400 hover:text-white transition-colors'
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Floor Selection */}
            <div className='mb-6'>
              <label className='block text-sm font-medium text-slate-400 mb-3'>
                Floor
              </label>
              <div className='grid grid-cols-5 gap-2 max-h-32 overflow-y-auto'>
                <button
                  onClick={() => handleFloorSelect('All Floors')}
                  className={`px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors font-medium ${
                    filterState.selectedFloor === 'All Floors'
                      ? 'bg-active-page text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  All
                </button>
                {floorOptions.map((floor) => {
                  const floorNumber = floor.match(/(\d+)/)?.[1] || floor
                  // Truncate long floor names to prevent overflow
                  const displayText =
                    floorNumber.length > 6
                      ? floorNumber.substring(0, 6) + '...'
                      : floorNumber
                  return (
                    <button
                      key={floor}
                      onClick={() => handleFloorSelect(floor)}
                      className={`px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors font-medium truncate ${
                        filterState.selectedFloor === floor
                          ? 'bg-active-page text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                      title={floor} // Show full name on hover
                    >
                      {displayText}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Unit Selection - Only show if a specific floor is selected */}
            {filterState.selectedFloor !== 'All Floors' &&
              unitOptions.length > 0 && (
                <div className='mb-4'>
                  <label className='block text-sm font-medium text-slate-400 mb-3'>
                    Units on {filterState.selectedFloor}
                  </label>
                  <div className='space-y-2 max-h-40 overflow-y-auto'>
                    <button
                      onClick={() => handleUnitSelect('All Units')}
                      className={`w-full text-left px-4 py-2.5 text-sm rounded-lg cursor-pointer transition-colors font-medium ${
                        filterState.selectedUnit === 'All Units'
                          ? 'bg-active-page text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      All Units
                    </button>
                    {unitOptions.map((unit) => (
                      <button
                        key={unit}
                        onClick={() => handleUnitSelect(unit)}
                        className={`w-full text-left px-4 py-2.5 text-sm rounded-lg cursor-pointer transition-colors font-medium ${
                          filterState.selectedUnit === unit
                            ? 'bg-active-page text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            {/* Close Button */}
            <div className='mt-6 pt-4 border-t border-slate-700'>
              <button
                onClick={() => setIsOpen(false)}
                className='w-full bg-slate-600 hover:bg-slate-500 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors text-white'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FloorUnitFilter
