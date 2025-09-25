import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import {
  getFloorDropdownOptions,
  getUnitDropdownOptions,
  getFloorIdFromDisplayName,
  getUnitIdFromDisplayName,
} from '@/data/buildingData'
import { useWebSocket } from './WebSocketContext'

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
  const { sendFilterUpdate, sendConfirmation, lastMessage } = useWebSocket()

  const [filterState, setFilterState] = useState<FilterState>({
    selectedFloor: 'All Floors',
    selectedUnit: 'All Units',
    selectedFloorId: 'all',
    selectedUnitId: 'all',
  })

  // Send filter updates via WebSocket
  useEffect(() => {
    let floorValue = 'all'
    let unitValue = 'all'

    // Handle floor ID conversion for WebSocket
    if (filterState.selectedFloorId !== 'all') {
      if (filterState.selectedFloorId === 'basement') {
        floorValue = 'basement'
      } else if (filterState.selectedFloorId === 'roof') {
        floorValue = 'roof'
      } else if (filterState.selectedFloorId?.startsWith('floor_')) {
        // Extract number from floor_X format
        floorValue = filterState.selectedFloorId.replace('floor_', '')
      }
    }

    // Handle unit ID conversion for WebSocket
    if (filterState.selectedUnitId !== 'all') {
      if (
        filterState.selectedFloorId === 'basement' ||
        filterState.selectedFloorId === 'roof'
      ) {
        unitValue = 'all' // basement and roof only have "all" units
      } else {
        // Extract unit number from regular floors
        unitValue = filterState.selectedUnit.replace('Unit ', '') || 'all'
      }
    }

    console.log(
      `Sending WebSocket update: floor=${floorValue}, unit=${unitValue}`
    )
    sendFilterUpdate(floorValue, unitValue)
  }, [
    filterState.selectedFloorId,
    filterState.selectedUnitId,
    filterState.selectedUnit,
    sendFilterUpdate,
  ])

  useEffect(() => {
    console.log('[FilterContext] Processing server message:', lastMessage)
    if (lastMessage && lastMessage.origin === 'server') {
      const { floor, unit } = lastMessage

      console.log(
        `[FilterContext] Server requested: floor=${floor}, unit=${unit}`
      )

      // Send confirmation back to server instead of triggering filter update
      const floorDisplay =
        floor === 'all'
          ? 'All Floors'
          : floor === 'basement'
          ? 'Basement'
          : floor === 'roof'
          ? 'Roof'
          : floor

      const unitDisplay = unit === 'all' ? 'All Units' : unit

      sendConfirmation(floorDisplay, unitDisplay)

      // Convert incoming values to proper display format for UI update
      let floorDisplayName = 'All Floors'
      if (floor !== 'all') {
        if (floor === 'basement') {
          floorDisplayName = 'Basement'
        } else if (floor === 'roof') {
          floorDisplayName = 'Roof'
        } else {
          floorDisplayName = `Floor ${floor}`
        }
      }

      let unitDisplayName = 'All Units'
      if (unit !== 'all' && floor !== 'all') {
        if (floor === 'basement' || floor === 'roof') {
          unitDisplayName = 'All Units'
        } else {
          unitDisplayName = `Unit ${unit}`
        }
      }

      console.log(
        `[FilterContext] Updating UI: ${floorDisplayName} / ${unitDisplayName}`
      )

      // Update UI directly without triggering filter send
      setFloor(floorDisplayName)
      setUnit(unitDisplayName)
    }
  }, [lastMessage, sendConfirmation])

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
