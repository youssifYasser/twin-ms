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
  currentFloor?: string
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
  }
}

// Generate lighting devices (per unit)
BUILDING_DATA.forEach((floor) => {
  if (floor.id === 'basement') {
    DEVICES_DATA.push(
      createDevice(
        `lighting_${floor.id}_parking`,
        'Parking Garage Lights',
        'Lighting',
        floor.id,
        undefined,
        30,
        true,
        '80W'
      )
    )
  } else if (floor.id === 'roof') {
    DEVICES_DATA.push(
      createDevice(
        `lighting_${floor.id}_main`,
        'Roof Access Lights',
        'Lighting',
        floor.id,
        undefined,
        60,
        true,
        '40W'
      )
    )
  } else {
    // Regular floors - lighting per unit
    floor.units.forEach((unit) => {
      if (!unit.id.includes('_all')) {
        const unitNumber = unit.number
        DEVICES_DATA.push(
          createDevice(
            `lighting_${unit.id}`,
            `Unit ${unitNumber} Lights`,
            'Lighting',
            floor.id,
            unit.id,
            Math.floor(Math.random() * 100),
            Math.random() > 0.3,
            '24W'
          )
        )
      }
    })
  }
})

// Generate HVAC devices (per floor - serves all units on that floor)
BUILDING_DATA.forEach((floor) => {
  if (floor.id !== 'roof') {
    // No HVAC on roof
    DEVICES_DATA.push(
      createDevice(
        `hvac_${floor.id}`,
        `${floor.displayName} HVAC System`,
        'HVAC',
        floor.id,
        `${floor.id}_all`,
        Math.floor(Math.random() * 16 + 15), // Generate temperature between 15-30°C
        Math.random() > 0.2,
        floor.id === 'basement' ? '1500W' : '2400W'
      )
    )
  }
})

// Generate security devices (per unit)
BUILDING_DATA.forEach((floor) => {
  if (floor.id === 'basement') {
    DEVICES_DATA.push(
      createDevice(
        `security_${floor.id}_main`,
        'Parking Security System',
        'Security',
        floor.id,
        undefined,
        100,
        true
      )
    )
  } else if (floor.id === 'roof') {
    DEVICES_DATA.push(
      createDevice(
        `security_${floor.id}_access`,
        'Roof Access Control',
        'Security',
        floor.id,
        undefined,
        100,
        true
      )
    )
  } else {
    // Regular floors - security per unit
    floor.units.forEach((unit) => {
      if (!unit.id.includes('_all')) {
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
  }
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
  },
  2: {
    // Lunch Break - Reduced activity
    Lighting: {},
    HVAC: {},
    Security: {},
    Elevators: {},
  },
  3: {
    // Evening Mode - Security focus
    Lighting: {},
    HVAC: {},
    Security: {},
    Elevators: {},
  },
  4: {
    // Weekend Mode - Minimal operation
    Lighting: {},
    HVAC: {},
    Security: {},
    Elevators: {},
  },
}

// Populate preset configurations based on device data
DEVICES_DATA.forEach((device) => {
  // Morning Setup
  PRESET_CONFIGURATIONS[1][device.deviceType][device.id] = {
    progress:
      device.deviceType === 'Lighting'
        ? Math.floor(Math.random() * 30 + 70)
        : device.deviceType === 'HVAC'
        ? Math.floor(Math.random() * 6 + 20) // Temperature between 20-25°C
        : device.deviceType === 'Security'
        ? Math.random() > 0.7
          ? 100
          : 0
        : 100, // Elevators
    isOn: device.deviceType !== 'Security' ? true : Math.random() > 0.7,
  }

  // Lunch Break
  PRESET_CONFIGURATIONS[2][device.deviceType][device.id] = {
    progress:
      device.deviceType === 'Lighting'
        ? Math.floor(Math.random() * 20 + 50)
        : device.deviceType === 'HVAC'
        ? Math.floor(Math.random() * 4 + 19) // Temperature between 19-22°C
        : device.deviceType === 'Security'
        ? Math.random() > 0.7
          ? 100
          : 0
        : 100, // Elevators
    isOn: device.deviceType !== 'Security' ? true : Math.random() > 0.7,
  }

  // Evening Mode
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
        : 0, // All elevators off
    isOn:
      device.deviceType === 'Lighting'
        ? device.floorId === 'basement'
        : device.deviceType === 'HVAC'
        ? device.floorId === 'basement'
        : device.deviceType === 'Security'
        ? true
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
  ]
}

export default DEVICES_DATA
