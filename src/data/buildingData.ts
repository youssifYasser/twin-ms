// Central building structure definition
// This file defines all floors and units in the building
// Changing floor names here will affect the entire application

export interface FloorData {
  id: string
  name: string
  displayName: string
  units: UnitData[]
}

export interface UnitData {
  id: string
  number: string
  floorId: string
  displayName: string
}

// Floor definitions - modify floor names here to affect entire application
export const FLOOR_DEFINITIONS = [
  { id: 'basement', name: 'Basement', displayName: 'Basement' },
  { id: 'floor_1', name: 'Floor 1', displayName: 'Floor 1' },
  { id: 'floor_2', name: 'Floor 2', displayName: 'Floor 2' },
  { id: 'floor_3', name: 'Floor 3', displayName: 'Floor 3' },
  { id: 'floor_4', name: 'Floor 4', displayName: 'Floor 4' },
  { id: 'floor_5', name: 'Floor 5', displayName: 'Floor 5' },
  { id: 'floor_6', name: 'Floor 6', displayName: 'Floor 6' },
  { id: 'floor_7', name: 'Floor 7', displayName: 'Floor 7' },
  { id: 'floor_8', name: 'Floor 8', displayName: 'Floor 8' },
  { id: 'floor_9', name: 'Floor 9', displayName: 'Floor 9' },
  { id: 'floor_10', name: 'Floor 10', displayName: 'Floor 10' },
  { id: 'floor_11', name: 'Floor 11', displayName: 'Floor 11' },
  { id: 'floor_12', name: 'Floor 12', displayName: 'Floor 12' },
  { id: 'roof', name: 'Roof', displayName: 'Roof' },
]

// Generate units for each floor (5 units per floor)
const generateUnitsForFloor = (
  floorId: string,
  floorNumber?: number
): UnitData[] => {
  // Special cases for floors without numbered units
  if (floorId === 'basement' || floorId === 'roof') {
    return [
      {
        id: `${floorId}_all`,
        number: 'All Units',
        floorId,
        displayName: 'All Units',
      },
    ]
  }

  // Generate numbered units for regular floors
  if (floorNumber) {
    const units: UnitData[] = [
      {
        id: `${floorId}_all`,
        number: 'All Units',
        floorId,
        displayName: 'All Units',
      },
    ]

    // Generate 5 units per floor (e.g., Floor 3: 301, 302, 303, 304, 305)
    for (let i = 1; i <= 5; i++) {
      const unitNumber = `${floorNumber}0${i}`
      units.push({
        id: `${floorId}_unit_${i}`,
        number: unitNumber,
        floorId,
        displayName: `Unit ${unitNumber}`,
      })
    }

    return units
  }

  return [
    {
      id: `${floorId}_all`,
      number: 'All Units',
      floorId,
      displayName: 'All Units',
    },
  ]
}

// Build complete building structure
export const BUILDING_DATA: FloorData[] = FLOOR_DEFINITIONS.map((floor) => {
  const floorNumber = floor.id.includes('floor_')
    ? parseInt(floor.id.replace('floor_', ''))
    : undefined

  return {
    id: floor.id,
    name: floor.name,
    displayName: floor.displayName,
    units: generateUnitsForFloor(floor.id, floorNumber),
  }
})

// Helper functions for getting floor/unit data
export const getAllFloors = (): FloorData[] => BUILDING_DATA

export const getFloorById = (floorId: string): FloorData | undefined =>
  BUILDING_DATA.find((floor) => floor.id === floorId)

export const getFloorByName = (floorName: string): FloorData | undefined =>
  BUILDING_DATA.find(
    (floor) => floor.name === floorName || floor.displayName === floorName
  )

export const getUnitsForFloor = (floorId: string): UnitData[] => {
  const floor = getFloorById(floorId)
  return floor ? floor.units : []
}

export const getUnitById = (unitId: string): UnitData | undefined => {
  for (const floor of BUILDING_DATA) {
    const unit = floor.units.find((unit) => unit.id === unitId)
    if (unit) return unit
  }
  return undefined
}

// Get dropdown options for AppBar
export const getFloorDropdownOptions = (): string[] => [
  'All Floors',
  ...BUILDING_DATA.map((floor) => floor.displayName),
]

export const getUnitDropdownOptions = (selectedFloor: string): string[] => {
  if (selectedFloor === 'All Floors') return ['All Units']

  const floor = getFloorByName(selectedFloor)
  if (!floor) return ['All Units']

  return floor.units.map((unit) => unit.displayName)
}

// Convert display names back to IDs for data lookup
export const getFloorIdFromDisplayName = (
  displayName: string
): string | null => {
  if (displayName === 'All Floors') return 'all'
  const floor = getFloorByName(displayName)
  return floor ? floor.id : null
}

export const getUnitIdFromDisplayName = (
  floorId: string,
  displayName: string
): string | null => {
  console.log(
    `Getting unit ID for floorId=${floorId}, displayName=${displayName}`
  )
  if (displayName === 'All Units') return 'all'
  const floor = getFloorById(floorId)
  if (!floor) return null

  const unit = floor.units.find((unit) => unit.displayName === displayName)
  return unit ? unit.id : null
}

// Convert IDs back to display names for UI updates
export const getFloorDisplayNameFromId = (floorId: string): string => {
  if (floorId === 'all') return 'All Floors'

  const floor = getFloorById(floorId)
  return floor ? floor.displayName : 'All Floors'
}

export const getUnitDisplayNameFromId = (unitId: string): string => {
  if (unitId === 'all') return 'All Units'

  const unit = getUnitById(unitId)
  return unit ? unit.displayName : 'All Units'
}

export default BUILDING_DATA
