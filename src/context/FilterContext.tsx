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

  // Flag to prevent circular updates when server changes filters
  const [isServerUpdate, setIsServerUpdate] = useState(false)

  // Send filter updates via WebSocket (only for user-initiated changes)
  useEffect(() => {
    console.log('updaing the server with new filter state, ', isServerUpdate)
    // Skip sending update if this is a server-initiated change
    if (isServerUpdate) {
      setIsServerUpdate(false) // Reset the flag
      return
    }

    let floorValue = 'all'
    let unitValue = 'all'

    // Handle floor ID conversion for WebSocket
    if (filterState.selectedFloorId !== 'all') {
      if (filterState.selectedFloorId?.startsWith('floor_')) {
        // Extract number from floor_X format
        floorValue = filterState.selectedFloorId.replace('floor_', '')
      }
    }

    // Handle unit ID conversion for WebSocket
    if (filterState.selectedUnitId !== 'all') {
      // Check if it's a pumps room
      if (filterState.selectedUnitId?.includes('_pumps_room')) {
        unitValue = 'pumps_room'
      } else {
        // Extract unit number from regular floors
        unitValue = filterState.selectedUnit.replace('Unit ', '') || 'all'
      }
    }

    console.log(
      `[FilterContext] Sending WebSocket update: floor=${floorValue}, unit=${unitValue}`
    )
    sendFilterUpdate(floorValue, unitValue)
  }, [
    filterState.selectedFloorId,
    filterState.selectedUnitId,
    filterState.selectedUnit,
    sendFilterUpdate,
    // Remove isServerUpdate from dependencies to prevent re-running when flag changes
  ])

  useEffect(() => {
    console.log('[FilterContext] Processing server message:', lastMessage)
    if (lastMessage && lastMessage.floor && lastMessage.unit) {
      const { floor, unit } = lastMessage

      console.log(
        `[FilterContext] Server requested: floor=${floor}, unit=${unit}`
      )

      // Convert incoming values to proper display format for UI update
      let floorDisplayName = 'All Floors'
      let floorId = 'all'
      if (floor !== 'all') {
        floorDisplayName = `Floor ${floor}`
        floorId = `floor_${floor}`
      }

      let unitDisplayName = 'All Units'
      let unitId = 'all'
      if (unit !== 'all' && floor !== 'all') {
        // Handle special case for "pumps_room"
        if (unit === 'pumps_room') {
          console.log('[FilterContext] Detected Pumps Room unit')
          unitDisplayName = 'Pumps Room'
          unitId = `floor_${floor}_pumps_room`
        } else {
          unitDisplayName = `Unit ${unit}` // Use the actual unit number from the message
          // For regular units, need to map unit number to unit ID
          unitId = getUnitIdFromDisplayName(floorId, unitDisplayName) || 'all'
        }
      }

      console.log(
        `[FilterContext] Updating UI: ${floorDisplayName} / ${unitDisplayName}`
      )

      // Set flag to indicate this is a server update
      setIsServerUpdate(true)

      // Update filter state directly without calling setFloor/setUnit to avoid triggering effects
      setFilterState({
        selectedFloor: floorDisplayName,
        selectedUnit: unitDisplayName,
        selectedFloorId: floorId,
        selectedUnitId: unitId,
      })
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
