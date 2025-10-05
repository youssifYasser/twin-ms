import { useState } from 'react'
import { Settings, Snowflake, Play, Flame } from 'lucide-react'
import { DeviceControlItemType } from '@/types'

interface HVACCardProps {
  deviceData: DeviceControlItemType
  onProgressChange: (progress: number) => void
  onToggle: (isOn: boolean) => void
}

const HVACCard = ({
  deviceData,
  onProgressChange,
  onToggle,
}: HVACCardProps) => {
  const { name, floor, progress, isOn, hasMalfunction } = deviceData
  const [activeMode, setActiveMode] = useState<'cool' | 'auto' | 'heat'>('auto')

  // Quick preset temperatures
  const COOL_TEMP = 18
  const HEAT_TEMP = 28

  // Get card styling based on malfunction status
  const getCardStyling = () => {
    if (hasMalfunction) {
      return {
        backgroundColor: 'rgba(255, 69, 69, 0.1)', // #FF4545 with 10% opacity
        borderColor: '#FF4545',
      }
    }
    return {
      backgroundColor: '#1F293766',
      borderColor: '#37415180',
    }
  }

  const cardStyle = getCardStyling()

  const getBulletColor = () => {
    // If device has malfunction, show critical red
    if (hasMalfunction) {
      return '#FF4545'
    }
    return isOn ? '#4ADE80' : '#6B7280'
  }

  const getTargetDisplayColor = () => {
    if (!isOn) return '#6B7280'

    if (progress <= 20) return '#3B82F6' // Cool - blue
    if (progress >= 26) return '#F97316' // Heat - orange
    return '#4ADE80' // Auto/comfortable - teal
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Disable control if device has malfunction
    if (hasMalfunction) return

    const newTemp = parseInt(e.target.value)
    onProgressChange(newTemp)

    // Auto-determine mode based on temperature
    if (newTemp <= 20) setActiveMode('cool')
    else if (newTemp >= 26) setActiveMode('heat')
    else setActiveMode('auto')
  }

  const handleQuickPreset = (mode: 'cool' | 'heat') => {
    // Disable control if device has malfunction
    if (hasMalfunction) return

    const temp = mode === 'cool' ? COOL_TEMP : HEAT_TEMP
    onProgressChange(temp)
    setActiveMode(mode)

    // Turn on the device if it's off
    if (!isOn) {
      onToggle(true)
    }
  }

  const handleModeSelect = (mode: 'cool' | 'auto' | 'heat') => {
    // Disable control if device has malfunction
    if (hasMalfunction) return

    setActiveMode(mode)

    // Apply mode-specific temperature
    if (mode === 'cool') {
      onProgressChange(COOL_TEMP)
    } else if (mode === 'heat') {
      onProgressChange(HEAT_TEMP)
    }

    // Turn on if selecting a specific mode
    if (!isOn && mode !== 'auto') {
      onToggle(true)
    }
  }

  const handleToggle = () => {
    // Disable control if device has malfunction
    if (hasMalfunction) return

    onToggle(!isOn)
  }

  const getCurrentFanSpeed = () => {
    if (!isOn) return 'Off'
    if (progress <= 18) return 'High'
    if (progress <= 22) return 'Medium'
    if (progress <= 26) return 'Low'
    return 'High'
  }

  const getCurrentHumidity = () => {
    // Simulate humidity based on temperature and mode
    if (!isOn) return '0%'
    const baseHumidity = Math.max(35, Math.min(60, 50 - (progress - 22) * 2))
    return `${Math.round(baseHumidity)}%`
  }

  const getPowerConsumption = () => {
    if (!isOn) return '0.0kW'
    // Calculate power based on temperature difference from comfort zone (22°C)
    const tempDiff = Math.abs(progress - 22)
    const basePower = 1.2
    const consumption = basePower + tempDiff * 0.15
    return `${consumption.toFixed(1)}kW`
  }

  return (
    <div
      className='p-4 rounded-lg border transition-all duration-300 hover:border-slate-600'
      style={{
        backgroundColor: cardStyle.backgroundColor,
        borderColor: cardStyle.borderColor,
      }}
    >
      {/* Header */}
      <div className='flex items-start justify-between mb-3'>
        <div className='flex items-center gap-2'>
          <div
            className='w-3 h-3 rounded-full transition-colors duration-300'
            style={{ backgroundColor: getBulletColor() }}
          />
          <div className='flex flex-col'>
            <h4 className='font-semibold text-sm text-white'>{name}</h4>
            <p className='text-[#9CA3AF] text-xs font-normal'>{floor}</p>
            {hasMalfunction && (
              <p className='text-[#FF4545] text-xs font-medium'>MALFUNCTION</p>
            )}
          </div>
        </div>
        <button
          onClick={handleToggle}
          className={`w-6 h-6 flex items-center justify-center text-slate-400 transition-colors ${
            hasMalfunction
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:text-white cursor-pointer'
          }`}
        >
          <Settings className='w-4 h-4' />
        </button>
      </div>

      {/* Zone Info */}
      <div className='text-xs text-slate-400 mb-3'>{floor}</div>

      <div className='space-y-4'>
        {/* Temperature Control Header */}
        <div className='flex justify-between items-center text-sm mb-3'>
          <span className='text-slate-300'>Temperature Control</span>
          <span
            className='font-semibold'
            style={{ color: getTargetDisplayColor() }}
          >
            {progress}°C
          </span>
        </div>

        {/* Temperature Controls */}
        <div className='space-y-3'>
          {/* Temperature Slider */}
          <div className='relative'>
            <input
              type='range'
              min='15'
              max='30'
              value={progress}
              onChange={handleProgressChange}
              disabled={!isOn || hasMalfunction}
              className={`w-full h-2 bg-slate-600 rounded-lg appearance-none slider ${
                hasMalfunction ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
              style={{
                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                  ((progress - 15) / 15) * 100
                }%, #475569 ${((progress - 15) / 15) * 100}%, #475569 100%)`,
                opacity: isOn && !hasMalfunction ? 1 : 0.5,
              }}
            />
            <div className='flex justify-between text-xs text-slate-400 mt-1'>
              <span>15°C</span>
              <span>30°C</span>
            </div>
          </div>

          {/* Target Temperature Display */}
          <div className='bg-slate-600 rounded-lg p-3 text-center'>
            <div
              className='text-2xl font-bold mb-1 transition-colors duration-300'
              style={{ color: getTargetDisplayColor() }}
            >
              {isOn ? `${progress}°C` : '--'}
            </div>
            <div className='text-xs text-slate-400'>Target Temperature</div>
          </div>

          {/* Mode Selection Buttons */}
          <div className='grid grid-cols-3 gap-2'>
            <button
              onClick={() => handleQuickPreset('cool')}
              disabled={!isOn || hasMalfunction}
              className={`py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-1 ${
                activeMode === 'cool' && isOn && !hasMalfunction
                  ? 'bg-blue-500/30 text-blue-400 border border-blue-500/50'
                  : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-transparent'
              } ${
                !isOn || hasMalfunction
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
            >
              <Snowflake className='w-3 h-3' />
              Cool
            </button>
            <button
              onClick={() => handleModeSelect('auto')}
              disabled={!isOn || hasMalfunction}
              className={`py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-1 ${
                activeMode === 'auto' && isOn && !hasMalfunction
                  ? 'bg-teal-500/30 text-teal-400 border border-teal-500/50'
                  : 'bg-slate-600 hover:bg-slate-500 text-slate-300 border border-transparent'
              } ${
                !isOn || hasMalfunction
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
            >
              <Play className='w-3 h-3' />
              Auto
            </button>
            <button
              onClick={() => handleQuickPreset('heat')}
              disabled={!isOn || hasMalfunction}
              className={`py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-1 ${
                activeMode === 'heat' && isOn && !hasMalfunction
                  ? 'bg-orange-500/30 text-orange-400 border border-orange-500/50'
                  : 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-transparent'
              } ${
                !isOn || hasMalfunction
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
            >
              <Flame className='w-3 h-3' />
              Heat
            </button>
          </div>
        </div>

        {/* Power Consumption */}
        <div className='flex justify-between text-sm pt-2 border-t border-slate-600'>
          <span className='text-slate-300'>Power Consumption</span>
          <span className='text-orange-400'>{getPowerConsumption()}</span>
        </div>

        {/* Status Grid */}
        <div className='grid grid-cols-2 gap-2 text-xs'>
          <div className='bg-slate-600 rounded p-2 text-center'>
            <div className='text-teal-400 font-semibold'>Fan Speed</div>
            <div className='text-slate-300'>{getCurrentFanSpeed()}</div>
          </div>
          <div className='bg-slate-600 rounded p-2 text-center'>
            <div className='text-teal-400 font-semibold'>Humidity</div>
            <div className='text-slate-300'>{getCurrentHumidity()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HVACCard
