import { StatisticsCard } from '@/components'
import { PresetCard, HVACCard, AutomationRuleCard } from '@/components/system'
import DeviceControlCard from '@/components/system/DeviceControlCard'
import {
  LightControlIcon,
  WindIcon,
  SecurityIcon,
  ElevatorIcon,
  PumpIcon,
} from '@/icons'
import { Settings, Zap, Clock, Users, Leaf } from 'lucide-react'
import { DeviceType } from '@/types'
import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { useFilter } from '@/context/FilterContext'
import { useWebSocket } from '@/context/WebSocketContext'
import { useRealtimeData } from '@/context/RealtimeDataContext'
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
import {
  getAutomationRulesByCategory,
  getAutomationRuleCounts,
} from '@/data/automationData'

const SystemControl = () => {
  const [activePreset, setActivePreset] = useState<number | null>(1)
  const [selectedDeviceControl, setSelectedDeviceControl] =
    useState<DeviceType>('Lighting')
  const [activeMainTab, setActiveMainTab] = useState<
    'device-control' | 'automation'
  >('device-control')
  const [selectedAutomationType, setSelectedAutomationType] = useState<
    'time-based' | 'occupancy-based' | 'environmental'
  >('time-based')

  const { filterState } = useFilter()
  const { sendDeviceControl } = useWebSocket()
  const { getModifiedStatistics } = useRealtimeData()

  // Debounce timers for value changes
  const debounceTimers = useRef<{ [key: string]: NodeJS.Timeout }>({})

  // Send device control message to server
  const sendDeviceUpdate = useCallback(
    (
      deviceType: DeviceType,
      status: string,
      value?: string,
      deviceId?: string
    ) => {
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
        case 'Pumps':
          // For pumps, include the specific pump number
          if (deviceId) {
            // Extract pump number from deviceId (e.g., pump_floor_3_1 -> pump1)
            const match = deviceId.match(/pump_.*_(\d+)$/)
            if (match) {
              asset = `pump${match[1]}`
            } else {
              asset = 'pump1' // fallback
            }
          } else {
            asset = 'pump1' // fallback if no deviceId provided
          }
          break
      }

      sendDeviceControl(asset, status, value)
    },
    [sendDeviceControl]
  )

  // Get filtered data based on current floor/unit selection
  const statisticsData = useMemo(() => {
    const baseStats = getFilteredSystemControlStats({
      selectedFloorId: filterState.selectedFloorId,
      selectedUnitId: filterState.selectedUnitId,
    })
    return getModifiedStatistics(baseStats)
  }, [
    filterState.selectedFloorId,
    filterState.selectedUnitId,
    getModifiedStatistics,
  ])

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
          // Don't apply preset to devices with malfunction
          if (device.hasMalfunction) {
            return device
          }

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
          // Don't allow updates to devices with malfunction
          if (device.hasMalfunction) {
            return device
          }

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
              sendDeviceUpdate(deviceType, status, value, deviceId)
            } else {
              // For security, elevators, and pumps, status only (pass deviceId for pumps)
              sendDeviceUpdate(deviceType, status, undefined, deviceId)
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
                sendDeviceUpdate(deviceType, '1', progress.toString(), deviceId)
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
      case 'Pumps':
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
      case 'Pumps':
        return PumpIcon
      default:
        return LightControlIcon
    }
  }

  // Create device controls array with filtered counts
  const deviceControls = deviceCounts.map((control) => ({
    ...control,
    icon: getDeviceIcon(control.name),
  }))

  // Get automation rules data
  const automationCounts = useMemo(() => getAutomationRuleCounts(), [])
  const totalDeviceCount = useMemo(() => {
    return deviceCounts.reduce((total, device) => total + device.count, 0)
  }, [deviceCounts])

  // Handle automation rule actions
  const handleEditRule = (ruleId: string) => {
    console.log('Edit rule:', ruleId)
    // Implement edit functionality
  }

  const handleMoreOptions = (ruleId: string) => {
    console.log('More options for rule:', ruleId)
    // Implement more options functionality
  }

  // Get current automation rules for selected type
  const getCurrentAutomationRules = () => {
    return getAutomationRulesByCategory(selectedAutomationType)
  }

  // Get automation type counts
  const getAutomationTypeCounts = () => {
    return [
      {
        name: 'time-based',
        displayName: 'Time-based',
        count: automationCounts['time-based'],
        icon: Clock,
      },
      {
        name: 'occupancy-based',
        displayName: 'Occupancy-based',
        count: automationCounts['occupancy-based'],
        icon: Users,
      },
      {
        name: 'environmental',
        displayName: 'Environmental',
        count: automationCounts['environmental'],
        icon: Leaf,
      },
    ]
  }
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
        {/* Main Control Tabs */}
        <div className='flex gap-1 mb-6'>
          <button
            onClick={() => setActiveMainTab('device-control')}
            className={`px-6 py-3 rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap flex items-center gap-2 transition-all ${
              activeMainTab === 'device-control'
                ? 'bg-active-page text-white shadow-lg'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Settings className='w-4 h-4' />
            Device Control
            <span className='bg-slate-600 text-slate-300 px-2 py-1 rounded-full text-xs'>
              {totalDeviceCount}
            </span>
          </button>
          <button
            onClick={() => setActiveMainTab('automation')}
            className={`px-6 py-3 rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap flex items-center gap-2 transition-all ${
              activeMainTab === 'automation'
                ? 'bg-active-page text-white shadow-lg'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Zap className='w-4 h-4' />
            Automation Rules
            <span className='bg-slate-600 text-slate-300 px-2 py-1 rounded-full text-xs'>
              {automationCounts.total}
            </span>
          </button>
        </div>

        {/* Device Control Tab Content */}
        {activeMainTab === 'device-control' && (
          <>
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
                    <p
                      className={`font-roboto ${textColor} text-base font-normal`}
                    >
                      {device.name}
                    </p>
                    <p
                      className={`font-roboto ${textColor} text-xs font-normal`}
                    >
                      ({device.count})
                    </p>
                  </div>
                )
              })}
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-4 max-h-[30rem] overflow-y-auto pr-2'>
              {getCurrentDevices().length > 0 ? (
                getCurrentDevices().map((device) =>
                  device.deviceType === 'HVAC' ? (
                    <HVACCard
                      key={device.id}
                      deviceData={device}
                      onProgressChange={(progress) =>
                        updateDevice(device.id, { progress })
                      }
                      onToggle={(isOn) => updateDevice(device.id, { isOn })}
                    />
                  ) : (
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
                  )
                )
              ) : (
                <div className='col-span-full flex items-center justify-center py-8 text-[#9CA3AF]'>
                  <p>
                    No {selectedDeviceControl.toLowerCase()} devices found for
                    the selected location.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Automation Rules Tab Content */}
        {activeMainTab === 'automation' && (
          <>
            <h3 className='font-roboto text-white text-lg font-bold'>
              Automation Rules
            </h3>
            <div className='w-full bg-[#1F293799] p-1 flex items-center gap-1'>
              {getAutomationTypeCounts().map((type, index) => {
                const isActive = selectedAutomationType === type.name
                const textColor = isActive ? 'text-white' : 'text-[#9CA3AF]'
                const IconComponent = type.icon
                return (
                  <div
                    onClick={() =>
                      setSelectedAutomationType(
                        type.name as
                          | 'time-based'
                          | 'occupancy-based'
                          | 'environmental'
                      )
                    }
                    key={index}
                    className={`flex items-center gap-2 py-2 px-4 transition-all duration-300 rounded-lg cursor-pointer ${
                      selectedAutomationType === type.name
                        ? 'bg-bg-card pointer-events-none'
                        : 'bg-transparent'
                    }`}
                  >
                    <IconComponent
                      className={`w-4 h-4 ${
                        selectedAutomationType === type.name
                          ? 'text-white'
                          : 'text-[#9CA3AF]'
                      }`}
                    />
                    <p
                      className={`font-roboto ${textColor} text-base font-normal`}
                    >
                      {type.displayName}
                    </p>
                    <p
                      className={`font-roboto ${textColor} text-xs font-normal`}
                    >
                      ({type.count})
                    </p>
                  </div>
                )
              })}
            </div>
            <div className='w-full max-h-[30rem] overflow-y-auto pr-2'>
              <div className='grid grid-cols-1 gap-4'>
                {getCurrentAutomationRules().length > 0 ? (
                  getCurrentAutomationRules().map((rule) => (
                    <AutomationRuleCard
                      key={rule.id}
                      rule={{
                        id: rule.id,
                        name: rule.name,
                        status: rule.status,
                        condition: rule.condition,
                        action: rule.action,
                        metric: rule.metric,
                        statusColor: '',
                        bulletColor: '',
                      }}
                      onEdit={handleEditRule}
                      onMore={handleMoreOptions}
                    />
                  ))
                ) : (
                  <div className='flex items-center justify-center py-8 text-[#9CA3AF]'>
                    <p>
                      No {selectedAutomationType.replace('-', ' ')} automation
                      rules found.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SystemControl
