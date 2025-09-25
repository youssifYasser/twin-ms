import { StatisticsCard } from '@/components'
import { PresetCard } from '@/components/system'
import DeviceControlCard from '@/components/system/DeviceControlCard'
import { LightControlIcon, WindIcon, SecurityIcon, ElevatorIcon } from '@/icons'
import { DeviceType } from '@/types'
import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { useFilter } from '@/context/FilterContext'
import { useWebSocket } from '@/context/WebSocketContext'
import {
  getFilteredSystemControlStats,
  getFilteredDevices,
  getFilteredDeviceCounts,
} from '@/utils/dataFilters'
import {
  PRESET_CONFIGURATIONS,
  PRESET_SCENARIOS,
  LocationDeviceType,
} from '@/data/devicesData'

const SystemControl = () => {
  const [activePreset, setActivePreset] = useState<number | null>(1)
  const [selectedDeviceControl, setSelectedDeviceControl] =
    useState<DeviceType>('Lighting')

  const { filterState } = useFilter()
  const { sendDeviceControl } = useWebSocket()

  // Debounce timers for value changes
  const debounceTimers = useRef<{ [key: string]: NodeJS.Timeout }>({})

  // Get current floor and unit for WebSocket messages
  const getCurrentLocation = useCallback(() => {
    let floor = 'all'
    let unit = 'all'

    if (filterState.selectedFloorId !== 'all') {
      if (filterState.selectedFloorId === 'basement') {
        floor = 'basement'
      } else if (filterState.selectedFloorId === 'roof') {
        floor = 'roof'
      } else if (filterState.selectedFloorId?.startsWith('floor_')) {
        floor = filterState.selectedFloorId.replace('floor_', '')
      }
    }

    if (filterState.selectedUnitId !== 'all') {
      if (
        filterState.selectedFloorId === 'basement' ||
        filterState.selectedFloorId === 'roof'
      ) {
        unit = 'all'
      } else {
        unit = filterState.selectedUnit.replace('Unit ', '') || 'all'
      }
    }

    return { floor, unit }
  }, [
    filterState.selectedFloorId,
    filterState.selectedUnitId,
    filterState.selectedUnit,
  ])

  // Send device control message to server
  const sendDeviceUpdate = useCallback(
    (deviceType: DeviceType, status: string, value?: string) => {
      let asset = ''

      switch (deviceType) {
        case 'Lighting':
          asset = 'light'
          break
        case 'HVAC':
          asset = 'hvac'
          break
        case 'Security':
          asset = 'security'
          break
        case 'Elevators':
          asset = 'elevators'
          break
      }

      sendDeviceControl(asset, status, value)
    },
    [getCurrentLocation, sendDeviceControl]
  )

  // Get filtered data based on current floor/unit selection
  const statisticsData = useMemo(() => {
    return getFilteredSystemControlStats({
      selectedFloorId: filterState.selectedFloorId,
      selectedUnitId: filterState.selectedUnitId,
    })
  }, [filterState.selectedFloorId, filterState.selectedUnitId])

  const allDevices = useMemo(() => {
    return getFilteredDevices({
      selectedFloorId: filterState.selectedFloorId,
      selectedUnitId: filterState.selectedUnitId,
    })
  }, [filterState.selectedFloorId, filterState.selectedUnitId])

  const deviceCounts = useMemo(() => {
    return getFilteredDeviceCounts({
      selectedFloorId: filterState.selectedFloorId,
      selectedUnitId: filterState.selectedUnitId,
    })
  }, [filterState.selectedFloorId, filterState.selectedUnitId])

  // Device state management
  const [deviceData, setDeviceData] = useState<LocationDeviceType[]>(allDevices)

  // Cleanup debounce timers on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach((timer) =>
        clearTimeout(timer)
      )
      debounceTimers.current = {}
    }
  }, [])

  // Update device data when filters change
  useMemo(() => {
    setDeviceData(allDevices)
  }, [allDevices])

  // Apply preset configuration
  const applyPreset = (presetId: number) => {
    setActivePreset(presetId)
    const presetConfig = PRESET_CONFIGURATIONS[presetId]
    if (presetConfig) {
      setDeviceData((prevData) =>
        prevData.map((device) => {
          const deviceConfig = presetConfig[device.deviceType]?.[device.id]
          if (deviceConfig) {
            return {
              ...device,
              progress: deviceConfig.progress,
              isOn: deviceConfig.isOn,
            }
          }
          return device
        })
      )
    }
  }

  // Update individual device with WebSocket integration
  const updateDevice = (
    deviceId: string,
    updates: Partial<LocationDeviceType>
  ) => {
    setDeviceData((prevData) =>
      prevData.map((device) => {
        if (device.id === deviceId) {
          const updatedDevice = { ...device, ...updates }

          // Send WebSocket message for device control changes
          const deviceType = updatedDevice.deviceType
          const isOn = updatedDevice.isOn
          const progress = updatedDevice.progress

          if ('isOn' in updates) {
            // Status change (on/off)
            const status = isOn ? '1' : '0'

            if (deviceType === 'Lighting' || deviceType === 'HVAC') {
              // For lighting and HVAC, include value
              const value = isOn ? progress.toString() : '0'
              sendDeviceUpdate(deviceType, status, value)
            } else {
              // For security and elevators, status only
              sendDeviceUpdate(deviceType, status)
            }
          } else if ('progress' in updates && isOn) {
            // Value change with debouncing (only when device is on)
            const deviceKey = `${deviceId}-progress`

            // Clear existing timer
            if (debounceTimers.current[deviceKey]) {
              clearTimeout(debounceTimers.current[deviceKey])
            }

            // Set new timer for debounced value update
            debounceTimers.current[deviceKey] = setTimeout(() => {
              if (deviceType === 'Lighting' || deviceType === 'HVAC') {
                sendDeviceUpdate(deviceType, '1', progress.toString())
              }
              delete debounceTimers.current[deviceKey]
            }, 500) // 500ms debounce delay
          }

          return updatedDevice
        }
        return device
      })
    )
  }

  // Get devices for current tab
  const getCurrentDevices = () => {
    return deviceData.filter(
      (device) => device.deviceType === selectedDeviceControl
    )
  }

  // Get power type label based on device type
  const getPowerTypeLabel = (deviceType: DeviceType) => {
    switch (deviceType) {
      case 'Lighting':
        return 'Brightness'
      case 'HVAC':
        return 'Temperature'
      case 'Security':
        return 'Lock Status'
      case 'Elevators':
        return 'Status'
      default:
        return 'Power'
    }
  }

  // Get device icon based on type
  const getDeviceIcon = (deviceType: DeviceType) => {
    switch (deviceType) {
      case 'Lighting':
        return LightControlIcon
      case 'HVAC':
        return WindIcon
      case 'Security':
        return SecurityIcon
      case 'Elevators':
        return ElevatorIcon
      default:
        return LightControlIcon
    }
  }

  // Create device controls array with filtered counts
  const deviceControls = deviceCounts.map((control) => ({
    ...control,
    icon: getDeviceIcon(control.name),
  }))
  return (
    <div className='space-y-6'>
      {/* Display current filter information */}
      {filterState.selectedFloor !== 'All Floors' && (
        <div className='bg-bg-card backdrop-blur-24 p-4 rounded-lg border border-primary-border'>
          <p className='text-white text-center text-lg'>
            Showing devices for:{' '}
            <span className='font-bold text-active-page'>
              {filterState.selectedFloor}
              {filterState.selectedUnit !== 'All Units' &&
                ` - ${filterState.selectedUnit}`}
            </span>
          </p>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {statisticsData.map((stat, index) => (
          <StatisticsCard key={index} statisticsItem={stat} />
        ))}
      </div>

      <div className='w-full bg-bg-card backdrop-blur-24 p-6 flex flex-col items-start gap-4'>
        <h3 className='font-roboto text-white text-lg font-bold'>
          Preset Scenarios
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
          {PRESET_SCENARIOS.map((preset) => (
            <PresetCard
              key={preset.id}
              presetData={preset}
              onClick={() => applyPreset(preset.id)}
              isActive={activePreset === preset.id}
            />
          ))}
        </div>
      </div>

      <div className='w-full bg-bg-card backdrop-blur-24 p-6 flex flex-col items-start gap-6'>
        <h3 className='font-roboto text-white text-lg font-bold'>
          Device Control
        </h3>
        <div className='w-full bg-[#1F293799] p-1 flex items-center gap-1'>
          {deviceControls.map((device, index) => {
            const isActive = selectedDeviceControl === device.name
            const textColor = isActive ? 'text-white' : 'text-[#9CA3AF]'
            return (
              <div
                onClick={() =>
                  setSelectedDeviceControl(device.name as DeviceType)
                }
                key={index}
                className={`flex items-center gap-2 py-2 px-4 transition-all duration-300 rounded-lg  ${
                  selectedDeviceControl === device.name
                    ? 'bg-bg-card pointer-events-none'
                    : 'bg-transparent cursor-pointer'
                }  `}
              >
                <device.icon
                  fill={
                    selectedDeviceControl === device.name
                      ? '#FFFFFF'
                      : '#9CA3AF'
                  }
                />
                <p className={`font-roboto ${textColor} text-base font-normal`}>
                  {device.name}
                </p>
                <p className={`font-roboto ${textColor} text-xs font-normal`}>
                  ({device.count})
                </p>
              </div>
            )
          })}
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-4 max-h-96 overflow-y-auto pr-2'>
          {getCurrentDevices().length > 0 ? (
            getCurrentDevices().map((device) => (
              <DeviceControlCard
                key={device.id}
                deviceData={device}
                onProgressChange={(progress) =>
                  updateDevice(device.id, { progress })
                }
                onToggle={(isOn) => updateDevice(device.id, { isOn })}
                powerTypeLabel={getPowerTypeLabel(device.deviceType)}
                icon={getDeviceIcon(device.deviceType)}
              />
            ))
          ) : (
            <div className='col-span-full flex items-center justify-center py-8 text-[#9CA3AF]'>
              <p>
                No {selectedDeviceControl.toLowerCase()} devices found for the
                selected location.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SystemControl
