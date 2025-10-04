// Asset Data Service for 3D Model Integration
// Provides real device data for Unit 501 - Floor 5 assets

import {
  AssetData,
  AssetType,
  AssetClickMessage,
} from '@/context/AssetPopupContext'
import { getFilteredDevices } from '@/utils/dataFilters'
import { BUILDING_DATA } from '@/data/buildingData'

// Get device data for Unit 501 - Floor 5
const getUnit501DeviceData = () => {
  return getFilteredDevices({
    selectedFloorId: 'floor_5',
    selectedUnitId: 'floor_5_unit_501',
  })
}

// Get pump data for Floor 5 (pumps are floor-level)
const getFloor5PumpData = () => {
  return getFilteredDevices({
    selectedFloorId: 'floor_5',
    selectedUnitId: 'all',
  }).filter((device: any) => device.deviceType === 'Pumps')
}

// Convert device data to asset format
const createAssetDataFromDevice = (
  device: any,
  assetType: AssetType,
  clickMessage: AssetClickMessage
): AssetData => {
  const floor = BUILDING_DATA.find((f) => f.id === 'floor_5')
  const unit = floor?.units.find((u) => u.id === 'floor_5_unit_501')

  const location =
    assetType === 'pump'
      ? `${floor?.displayName || 'Floor 5'}`
      : `${floor?.displayName || 'Floor 5'} - ${
          unit?.displayName || 'Unit 501'
        }`

  // Base asset data
  const baseAsset: AssetData = {
    id: device.id || `${assetType}_${clickMessage.floor}_${clickMessage.unit}`,
    name: getAssetName(assetType, device),
    type: assetType,
    status: device.isOn ? 'operational' : 'offline',
    location,
    specifications: getAssetSpecifications(assetType, device),
    metrics: getAssetMetrics(assetType, device),
  }

  // Add dimmer level for lights
  if (assetType === 'light' && device.value !== undefined) {
    baseAsset.dimmerLevel = device.value
  }

  return baseAsset
}

// Generate asset name based on type
const getAssetName = (assetType: AssetType, device: any): string => {
  switch (assetType) {
    case 'light':
      return device.name || 'Office Zone LED Array'
    case 'hvac':
      return device.name || 'Climate Control System'
    case 'pump':
      return device.name || 'Water Circulation Pump'
    default:
      return device.name || 'Smart Device'
  }
}

// Generate asset specifications
const getAssetSpecifications = (
  assetType: AssetType,
  _device: any
): { [key: string]: string | number } => {
  const baseSpecs = {
    Model: getAssetModel(assetType),
    'Installation Date': '2024-01-15',
    Warranty: '3 Years',
    Manufacturer: getAssetManufacturer(assetType),
  }

  switch (assetType) {
    case 'light':
      return {
        ...baseSpecs,
        'LED Type': 'Full Spectrum',
        Lumens: '4500 lm',
        'Color Temperature': '3000K-6500K',
        'Dimming Range': '1-100%',
      }
    case 'hvac':
      return {
        ...baseSpecs,
        'Cooling Capacity': '12,000 BTU',
        'Heating Capacity': '10,000 BTU',
        'Energy Rating': 'A+++',
        Refrigerant: 'R-410A',
      }
    case 'pump':
      return {
        ...baseSpecs,
        'Flow Rate': '150 GPM',
        'Head Pressure': '120 ft',
        'Motor Power': '5 HP',
        Efficiency: '85%',
      }
    default:
      return baseSpecs
  }
}

// Generate asset metrics with realistic values
const getAssetMetrics = (
  assetType: AssetType,
  device: any
): AssetData['metrics'] => {
  const isOn = device.isOn || false

  switch (assetType) {
    case 'light':
      return {
        'Active Power': {
          value: isOn
            ? device.value
              ? Math.round(device.value * 0.6)
              : 48
            : 0,
          unit: 'W',
          icon: '⚡',
          color: '#F59E0B',
        },
        Voltage: {
          value: isOn ? 220 : 0,
          unit: 'V',
          icon: '🔋',
          color: '#3B82F6',
        },
        'Current Draw': {
          value: isOn
            ? device.value
              ? ((device.value * 0.6) / 220).toFixed(2)
              : '0.22'
            : '0.00',
          unit: 'A',
          icon: '📊',
          color: '#EAB308',
        },
        'Power Factor': {
          value: isOn ? '0.95' : '0.00',
          icon: '⚙️',
          color: '#14B8A6',
        },
      }

    case 'hvac':
      const targetTemp = device.value || 22
      return {
        'Supply Air Temp': {
          value: isOn ? `${targetTemp}` : '0',
          unit: '°C',
          icon: '🌡️',
          color: '#3B82F6',
        },
        'Return Air Temp': {
          value: isOn ? `${targetTemp + 2}` : '0',
          unit: '°C',
          icon: '🔄',
          color: '#10B981',
        },
        'Power Consumption': {
          value: isOn ? '3.2' : '0.0',
          unit: 'kW',
          icon: '⚡',
          color: '#F59E0B',
        },
        'Fan Speed': {
          value: isOn ? '750' : '0',
          unit: 'RPM',
          icon: '💨',
          color: '#8B5CF6',
        },
      }

    case 'pump':
      return {
        'Flow Rate': {
          value: isOn ? '142' : '0',
          unit: 'GPM',
          icon: '🌊',
          color: '#06B6D4',
        },
        Pressure: {
          value: isOn ? '118' : '0',
          unit: 'PSI',
          icon: '📏',
          color: '#3B82F6',
        },
        'Motor Power': {
          value: isOn ? '4.8' : '0.0',
          unit: 'kW',
          icon: '⚡',
          color: '#F59E0B',
        },
        Efficiency: {
          value: isOn ? '87' : '0',
          unit: '%',
          icon: '⚙️',
          color: '#10B981',
        },
      }

    default:
      return {}
  }
}

// Get asset model based on type
const getAssetModel = (assetType: AssetType): string => {
  switch (assetType) {
    case 'light':
      return 'SmartLED Pro X1'
    case 'hvac':
      return 'ClimateMax 3000'
    case 'pump':
      return 'AquaFlow Elite 150'
    default:
      return 'Unknown'
  }
}

// Get asset manufacturer
const getAssetManufacturer = (assetType: AssetType): string => {
  switch (assetType) {
    case 'light':
      return 'Philips Lighting'
    case 'hvac':
      return 'Carrier Corporation'
    case 'pump':
      return 'Grundfos'
    default:
      return 'Generic'
  }
}

// Main function to get asset data from click message
export const getAssetDataFromClick = (
  clickMessage: AssetClickMessage
): AssetData | null => {
  try {
    let targetDevice

    if (clickMessage.click === 'pump') {
      // Get pump data for Floor 5
      const pumpDevices = getFloor5PumpData()
      targetDevice =
        pumpDevices.find(
          (device: any) =>
            device.floorId === 'floor_5' && device.deviceType === 'Pumps'
        ) || pumpDevices[0] // Fallback to first pump
    } else {
      // Get device data for Unit 501
      const unit501Devices = getUnit501DeviceData()

      // Find specific device based on click type
      const deviceTypeMap = {
        light: 'Lighting',
        hvac: 'HVAC',
      }

      const targetDeviceType =
        deviceTypeMap[clickMessage.click as 'light' | 'hvac']
      targetDevice = unit501Devices.find(
        (device: any) =>
          device.deviceType === targetDeviceType &&
          device.unitId === 'floor_5_unit_501'
      )
    }

    if (!targetDevice) {
      console.warn(
        `No ${clickMessage.click} device found for ${clickMessage.floor}/${clickMessage.unit}`
      )

      // Create mock device data as fallback
      targetDevice = {
        id: `mock_${clickMessage.click}_${clickMessage.floor}_${clickMessage.unit}`,
        name: `${
          clickMessage.click.charAt(0).toUpperCase() +
          clickMessage.click.slice(1)
        } Device`,
        deviceType: clickMessage.click,
        isOn: true,
        value:
          clickMessage.click === 'light'
            ? 75
            : clickMessage.click === 'hvac'
            ? 22
            : undefined,
        floorId: clickMessage.floor,
        unitId: clickMessage.unit,
      }
    }

    return createAssetDataFromDevice(
      targetDevice,
      clickMessage.click,
      clickMessage
    )
  } catch (error) {
    console.error('Failed to get asset data:', error)
    return null
  }
}

export default {
  getAssetDataFromClick,
}
