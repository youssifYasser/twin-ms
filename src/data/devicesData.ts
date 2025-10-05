import {
  DeviceControlItemType,
  DeviceType,
  PresetDataType,
  PresetType,
} from '@/types'
import { BUILDING_DATA } from './buildingData'

// Enhanced device interface with location data
export interface LocationDeviceType extends DeviceControlItemType {
  floorId: string
  unitId?: string // Some devices serve entire floors (like HVAC), others specific units
  currentFloor?: string // For elevators - which floor they're currently on
}

// Generate devices for each floor and unit
export const DEVICES_DATA: LocationDeviceType[] = []

// Helper to create device entry
const createDevice = (
  id: string,
  name: string,
  deviceType: DeviceType,
  floorId: string,
  unitId?: string,
  progress: number = 0,
  isOn: boolean = false,
  maxPower?: string,
  currentFloor?: string,
  hasMalfunction?: boolean
): LocationDeviceType => {
  const floor = BUILDING_DATA.find((f) => f.id === floorId)
  const unit = unitId && floor ? floor.units.find((u) => u.id === unitId) : null

  return {
    id,
    name,
    floor: unit ? unit.displayName : floor?.displayName || 'Unknown',
    progress,
    maxPower:
      maxPower ||
      (deviceType === 'Lighting'
        ? '24W'
        : deviceType === 'HVAC'
        ? '1200W'
        : ''),
    isOn,
    deviceType,
    floorId,
    unitId,
    currentFloor,
    hasMalfunction,
  }
}

// Generate lighting devices (per unit)
BUILDING_DATA.forEach((floor) => {
  // Regular floors - lighting per unit
  floor.units.forEach((unit) => {
    if (!unit.id.includes('_all') && !unit.id.includes('_pumps_room')) {
      const unitNumber = unit.number

      // Special case for Unit 501 on Floor 5 - start at 100%
      const isUnit501Floor5 =
        floor.id === 'floor_5' && unit.id === 'floor_5_unit_1'

      DEVICES_DATA.push(
        createDevice(
          `lighting_${unit.id}`,
          `Unit ${unitNumber} Lights`,
          'Lighting',
          floor.id,
          unit.id,
          isUnit501Floor5 ? 100 : Math.floor(Math.random() * 100), // Unit 501 Floor 5 at 100%
          isUnit501Floor5 ? true : Math.random() > 0.3, // Unit 501 Floor 5 is on
          '24W'
        )
      )
    }
  })
})

// Generate HVAC devices (per floor - serves all units on that floor)
BUILDING_DATA.forEach((floor) => {
  DEVICES_DATA.push(
    createDevice(
      `hvac_${floor.id}`,
      `${floor.displayName} HVAC System`,
      'HVAC',
      floor.id,
      `${floor.id}_all`,
      Math.floor(Math.random() * 16 + 15), // Generate temperature between 15-30°C
      Math.random() > 0.2,
      '2400W'
    )
  )
})

// Generate security devices (per unit)
BUILDING_DATA.forEach((floor) => {
  // Regular floors - security per unit
  floor.units.forEach((unit) => {
    if (!unit.id.includes('_all') && !unit.id.includes('_pumps_room')) {
      const unitNumber = unit.number
      DEVICES_DATA.push(
        createDevice(
          `security_${unit.id}`,
          `Unit ${unitNumber} Door Lock`,
          'Security',
          floor.id,
          unit.id,
          Math.random() > 0.3 ? 100 : 0,
          Math.random() > 0.3
        )
      )
    }
  })
})

// Generate elevators (serve all floors but have current position)
const elevators = [
  { id: 'elevator_main', name: 'Main Elevator', currentFloor: 'floor_3' },
  { id: 'elevator_service', name: 'Service Elevator', currentFloor: 'floor_1' },
  {
    id: 'elevator_emergency',
    name: 'Emergency Elevator',
    currentFloor: 'basement',
  },
]

elevators.forEach((elevator) => {
  const currentFloorData = BUILDING_DATA.find(
    (f) => f.id === elevator.currentFloor
  )
  DEVICES_DATA.push(
    createDevice(
      elevator.id,
      `${elevator.name} (Currently: ${currentFloorData?.displayName})`,
      'Elevators',
      'all', // Serves all floors
      undefined,
      elevator.id === 'elevator_emergency' ? 0 : 100,
      elevator.id !== 'elevator_emergency',
      '',
      elevator.currentFloor
    )
  )
})

// Generate pumps (2 per floor, located in Pumps Room)
BUILDING_DATA.forEach((floor) => {
  const pumpsRoomUnit = floor.units.find((unit) =>
    unit.id.includes('_pumps_room')
  )
  if (pumpsRoomUnit) {
    // Add 2 pumps per floor
    for (let i = 1; i <= 2; i++) {
      const isPump2OnFloor5 = floor.id === 'floor_5' && i === 2
      DEVICES_DATA.push(
        createDevice(
          `pump_${floor.id}_${i}`,
          `${floor.displayName} Pump ${i}`,
          'Pumps',
          floor.id,
          pumpsRoomUnit.id,
          isPump2OnFloor5 ? 0 : 100, // Pump 2 Floor 5 is down
          isPump2OnFloor5 ? false : Math.random() > 0.3, // Pump 2 Floor 5 is off
          '800W', // Typical pump power consumption
          undefined,
          isPump2OnFloor5 // Pump 2 Floor 5 has malfunction
        )
      )
    }

    // Add lighting for pumps room
    DEVICES_DATA.push(
      createDevice(
        `lighting_${pumpsRoomUnit.id}`,
        `${floor.displayName} Pumps Room Lights`,
        'Lighting',
        floor.id,
        pumpsRoomUnit.id,
        Math.floor(Math.random() * 100),
        Math.random() > 0.2,
        '36W' // Higher wattage for industrial lighting
      )
    )

    // Add security door for pumps room
    DEVICES_DATA.push(
      createDevice(
        `security_${pumpsRoomUnit.id}`,
        `${floor.displayName} Pumps Room Security Door`,
        'Security',
        floor.id,
        pumpsRoomUnit.id,
        Math.random() > 0.1 ? 100 : 0, // Most doors are locked
        Math.random() > 0.1, // Most doors are secured
        '' // Security devices don't have power rating
      )
    )
  }
})

// Filter devices based on floor/unit selection
export const getDevicesForFilter = (
  selectedFloorId: string | null,
  selectedUnitId: string | null,
  deviceType?: DeviceType
): LocationDeviceType[] => {
  let filteredDevices = DEVICES_DATA

  // Filter by device type if specified
  if (deviceType) {
    filteredDevices = filteredDevices.filter(
      (device) => device.deviceType === deviceType
    )
  }

  // All floors - return all devices
  if (selectedFloorId === 'all') {
    return filteredDevices
  }

  // Specific floor
  if (selectedFloorId && selectedUnitId === 'all') {
    return filteredDevices.filter(
      (device) => device.floorId === selectedFloorId || device.floorId === 'all' // Include elevators
    )
  }

  // Specific unit
  if (selectedFloorId && selectedUnitId && selectedUnitId !== 'all') {
    return filteredDevices.filter(
      (device) =>
        (device.floorId === selectedFloorId &&
          device.unitId === selectedUnitId) ||
        (device.floorId === selectedFloorId &&
          device.unitId?.includes('_all')) || // Include floor-level devices like HVAC
        device.floorId === 'all' // Include elevators
    )
  }

  return filteredDevices
}

// Enhanced preset configurations with floor/unit awareness
export const PRESET_CONFIGURATIONS: { [presetId: number]: PresetDataType } = {
  1: {
    // Morning Setup - All devices active
    Lighting: {},
    HVAC: {},
    Security: {},
    Elevators: {},
    Pumps: {},
  },
  2: {
    // Lunch Break - Reduced activity
    Lighting: {},
    HVAC: {},
    Security: {},
    Elevators: {},
    Pumps: {},
  },
  3: {
    // Evening Mode - Security focus
    Lighting: {},
    HVAC: {},
    Security: {},
    Elevators: {},
    Pumps: {},
  },
  4: {
    // Weekend Mode - Minimal operation
    Lighting: {},
    HVAC: {},
    Security: {},
    Elevators: {},
    Pumps: {},
  },
}

// Populate preset configurations based on device data
DEVICES_DATA.forEach((device) => {
  // Morning Setup
  const morningPumpSecurityState = Math.random() > 0.7
  PRESET_CONFIGURATIONS[1][device.deviceType][device.id] = {
    progress:
      device.deviceType === 'Lighting'
        ? Math.floor(Math.random() * 30 + 70)
        : device.deviceType === 'HVAC'
        ? Math.floor(Math.random() * 6 + 20) // Temperature between 20-25°C
        : device.deviceType === 'Security' || device.deviceType === 'Pumps'
        ? morningPumpSecurityState
          ? 100
          : 0
        : 100, // Elevators
    isOn:
      device.deviceType !== 'Security' && device.deviceType !== 'Pumps'
        ? true
        : morningPumpSecurityState,
  }

  // Lunch Break
  const lunchPumpSecurityState = Math.random() > 0.7
  PRESET_CONFIGURATIONS[2][device.deviceType][device.id] = {
    progress:
      device.deviceType === 'Lighting'
        ? Math.floor(Math.random() * 20 + 50)
        : device.deviceType === 'HVAC'
        ? Math.floor(Math.random() * 4 + 19) // Temperature between 19-22°C
        : device.deviceType === 'Security' || device.deviceType === 'Pumps'
        ? lunchPumpSecurityState
          ? 100
          : 0
        : 100, // Elevators
    isOn:
      device.deviceType !== 'Security' && device.deviceType !== 'Pumps'
        ? true
        : lunchPumpSecurityState,
  }

  // Evening Mode
  const eveningPumpState = Math.random() > 0.5
  PRESET_CONFIGURATIONS[3][device.deviceType][device.id] = {
    progress:
      device.deviceType === 'Lighting'
        ? device.floorId === 'basement' || device.name.includes('Security')
          ? Math.floor(Math.random() * 20 + 40)
          : 0
        : device.deviceType === 'HVAC'
        ? Math.floor(Math.random() * 4 + 16) // Temperature between 16-19°C
        : device.deviceType === 'Security'
        ? 100
        : device.deviceType === 'Pumps'
        ? eveningPumpState
          ? 100
          : 0
        : device.id === 'elevator_emergency'
        ? 100
        : 0, // Only emergency elevator
    isOn:
      device.deviceType === 'Lighting'
        ? device.floorId === 'basement' || device.name.includes('Security')
        : device.deviceType === 'HVAC'
        ? true
        : device.deviceType === 'Security'
        ? true
        : device.deviceType === 'Pumps'
        ? eveningPumpState
        : device.id === 'elevator_emergency', // Only emergency elevator
  }

  // Weekend Mode
  PRESET_CONFIGURATIONS[4][device.deviceType][device.id] = {
    progress:
      device.deviceType === 'Lighting'
        ? device.floorId === 'basement'
          ? Math.floor(Math.random() * 20 + 20)
          : 0
        : device.deviceType === 'HVAC'
        ? device.floorId === 'basement'
          ? Math.floor(Math.random() * 4 + 15) // Temperature between 15-18°C
          : 0
        : device.deviceType === 'Security'
        ? 100
        : device.deviceType === 'Pumps'
        ? 0 // Pumps off on weekends
        : 0, // All elevators off
    isOn:
      device.deviceType === 'Lighting'
        ? device.floorId === 'basement'
        : device.deviceType === 'HVAC'
        ? device.floorId === 'basement'
        : device.deviceType === 'Security'
        ? true
        : device.deviceType === 'Pumps'
        ? false // Pumps off on weekends
        : false, // All elevators off
  }
})

// Preset scenarios
export const PRESET_SCENARIOS: PresetType[] = [
  {
    id: 1,
    name: 'Morning Setup',
    description: 'Lights on, HVAC auto, doors unlocked',
  },
  {
    id: 2,
    name: 'Lunch Break',
    description: 'Reduce lighting, maintain temp',
  },
  {
    id: 3,
    name: 'Evening Mode',
    description: 'Security lights only, lock all doors',
  },
  {
    id: 4,
    name: 'Weekend Mode',
    description: 'Minimal systems, security active',
  },
]

// Get device control statistics based on current filter
export const getDeviceControlCounts = (
  selectedFloorId: string | null,
  selectedUnitId: string | null
) => {
  const devices = getDevicesForFilter(selectedFloorId, selectedUnitId)

  return [
    {
      name: 'Lighting' as DeviceType,
      count: devices.filter((d) => d.deviceType === 'Lighting').length,
    },
    {
      name: 'HVAC' as DeviceType,
      count: devices.filter((d) => d.deviceType === 'HVAC').length,
    },
    {
      name: 'Security' as DeviceType,
      count: devices.filter((d) => d.deviceType === 'Security').length,
    },
    {
      name: 'Elevators' as DeviceType,
      count: devices.filter((d) => d.deviceType === 'Elevators').length,
    },
    {
      name: 'Pumps' as DeviceType,
      count: devices.filter((d) => d.deviceType === 'Pumps').length,
    },
  ]
}

export default DEVICES_DATA
