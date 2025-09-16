import React, { createContext, useContext, useState, ReactNode } from 'react'
import {
  getFloorDropdownOptions,
  getUnitDropdownOptions,
  getFloorIdFromDisplayName,
  getUnitIdFromDisplayName,
} from '@/data/buildingData'

export interface FilterState {
  selectedFloor: string // Display name (e.g., "Floor 3", "All Floors")
  selectedUnit: string // Display name (e.g., "Unit 301", "All Units")
  selectedFloorId: string | null // Internal ID (e.g., "floor_3", "all")
  selectedUnitId: string | null // Internal ID (e.g., "floor_3_unit_1", "all")
}

interface FilterContextType {
  filterState: FilterState
  setFloor: (floor: string) => void
  setUnit: (unit: string) => void
  getFloorOptions: () => string[]
  getUnitOptions: () => string[]
  resetFilters: () => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

interface FilterProviderProps {
  children: ReactNode
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [filterState, setFilterState] = useState<FilterState>({
    selectedFloor: 'All Floors',
    selectedUnit: 'All Units',
    selectedFloorId: 'all',
    selectedUnitId: 'all',
  })

  const setFloor = (floor: string) => {
    const floorId = getFloorIdFromDisplayName(floor)

    setFilterState({
      selectedFloor: floor,
      selectedUnit: 'All Units', // Reset unit when floor changes
      selectedFloorId: floorId,
      selectedUnitId: 'all', // Reset unit ID when floor changes
    })
  }

  const setUnit = (unit: string) => {
    if (filterState.selectedFloorId && filterState.selectedFloorId !== 'all') {
      const unitId = getUnitIdFromDisplayName(filterState.selectedFloorId, unit)

      setFilterState((prev) => ({
        ...prev,
        selectedUnit: unit,
        selectedUnitId: unitId,
      }))
    }
  }

  const getFloorOptions = (): string[] => {
    return getFloorDropdownOptions()
  }

  const getUnitOptions = (): string[] => {
    return getUnitDropdownOptions(filterState.selectedFloor)
  }

  const resetFilters = () => {
    setFilterState({
      selectedFloor: 'All Floors',
      selectedUnit: 'All Units',
      selectedFloorId: 'all',
      selectedUnitId: 'all',
    })
  }

  const contextValue: FilterContextType = {
    filterState,
    setFloor,
    setUnit,
    getFloorOptions,
    getUnitOptions,
    resetFilters,
  }

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  )
}

// Custom hook to use the filter context
export const useFilter = (): FilterContextType => {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider')
  }
  return context
}

export default FilterContext
