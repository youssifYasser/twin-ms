import { DeviceControlItemType, IconComponent } from '@/types'

interface DeviceControlCardProps {
  deviceData: DeviceControlItemType
  onProgressChange: (progress: number) => void
  onToggle: (isOn: boolean) => void
  powerTypeLabel: string
  icon: IconComponent
}

const DeviceControlCard = ({
  deviceData,
  onProgressChange,
  onToggle,
  powerTypeLabel,
  icon: Icon,
}: DeviceControlCardProps) => {
  const { name, floor, progress, maxPower, isOn, deviceType } = deviceData

  // Calculate color opacity based on progress and on/off state
  const getProgressColor = () => {
    return '#3B82F6' // Consistent blue color for all progress bars
  }

  const getBulletColor = () => {
    // For HVAC, bullet color is only based on on/off state, not temperature
    if (deviceType === 'HVAC') {
      return isOn ? '#4ADE80' : '#6B7280'
    }

    // For other devices, consider both on/off state and progress
    if (!isOn || progress === 0) return '#6B7280'
    return '#4ADE80'
  }

  const getIconButtonColor = () => {
    if (!isOn) return '#374151'

    // For HVAC, toggler opacity is only based on on/off state, not temperature
    if (deviceType === 'HVAC') {
      return '#37988A' // Full opacity when on, regardless of temperature
    }

    // For other devices (Lighting), calculate opacity based on progress
    const maxProgress = getProgressMax()
    const opacity = Math.max(progress / maxProgress, 0.3)

    return `rgba(55, 152, 138, ${opacity})`
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseInt(e.target.value)
    onProgressChange(newProgress)

    // For HVAC, temperature slider doesn't affect on/off state
    if (deviceType === 'HVAC') {
      return // Temperature change only, no on/off state change
    }

    // For other devices, automatically update isOn state based on progress
    if (newProgress === 0 || newProgress === getProgressMin()) {
      onToggle(false)
    } else if (!isOn && newProgress > 0) {
      onToggle(true)
    }
  }

  const handleToggle = () => {
    // For HVAC, only toggle on/off state without changing temperature
    if (deviceType === 'HVAC') {
      onToggle(!isOn)
      return
    }

    // For other devices, toggle between min/max values
    if (isOn) {
      // Turn OFF: set to minimum value and isOn to false
      const minValue = getProgressMin()
      onProgressChange(minValue)
      onToggle(false)
    } else {
      // Turn ON: set to maximum value and isOn to true
      const maxValue = getProgressMax()
      onProgressChange(maxValue)
      onToggle(true)
    }
  }

  const getDisplayValue = () => {
    switch (deviceType) {
      case 'Lighting':
        return `${progress}%`
      case 'HVAC':
        return `${progress}°C`
      case 'Security':
      case 'Elevators':
        return isOn ? 'ON' : 'OFF'
      default:
        return `${progress}%`
    }
  }

  const getProgressMax = () => {
    switch (deviceType) {
      case 'HVAC':
        return 30 // Temperature range 15-30°C
      default:
        return 100
    }
  }

  const getProgressMin = () => {
    switch (deviceType) {
      case 'HVAC':
        return 15 // Minimum temperature 15°C
      default:
        return 0
    }
  }

  return (
    <div className='flex flex-col items-start border border-[#37415180] bg-[#1F293766] p-4 gap-3 font-roboto'>
      <div className='flex items-center justify-between w-full'>
        <div className='flex items-center gap-3'>
          <div
            className='w-3 h-3 rounded-full transition-colors duration-300'
            style={{ backgroundColor: getBulletColor() }}
          />
          <div className='flex items-start flex-col'>
            <h4 className='text-white font-medium text-base'>{name}</h4>
            <p className='text-[#9CA3AF] text-sm font-normal'>{floor}</p>
          </div>
        </div>
        <div
          className='p-2 rounded-lg cursor-pointer border border-transparent hover:opacity-80 flex items-center justify-center transition-all duration-300'
          style={{ backgroundColor: getIconButtonColor() }}
          onClick={handleToggle}
        >
          <Icon fill={isOn ? '#FFFFFF' : '#9CA3AF'} />
        </div>
      </div>

      <div className='flex flex-col items-start gap-2 w-full'>
        <div className='flex items-center justify-between w-full'>
          <p className='text-[#9CA3AF] text-sm font-normal'>{powerTypeLabel}</p>
          <p className='text-white text-sm font-normal'>{getDisplayValue()}</p>
        </div>

        {/* Progress Bar for adjustable controls */}
        {(deviceType === 'Lighting' || deviceType === 'HVAC') && (
          <div className='flex items-center w-full'>
            <input
              type='range'
              min={getProgressMin()}
              max={getProgressMax()}
              value={progress}
              onChange={handleProgressChange}
              className='w-full h-2 rounded-full appearance-none cursor-pointer range-slider transition-all duration-300'
              style={{
                background: `linear-gradient(to right, ${getProgressColor()} 0%, ${getProgressColor()} ${
                  ((progress - getProgressMin()) /
                    (getProgressMax() - getProgressMin())) *
                  100
                }%, #374151 ${
                  ((progress - getProgressMin()) /
                    (getProgressMax() - getProgressMin())) *
                  100
                }%, #374151 100%)`,
              }}
            />
          </div>
        )}

        {/* Simple status for on/off controls */}
        {(deviceType === 'Security' || deviceType === 'Elevators') && (
          <div className='flex items-center w-full'>
            <div
              className='h-2 rounded-full w-full'
              style={{ backgroundColor: '#374151' }}
            >
              <div
                className='h-full rounded-full transition-all duration-300 ease-in-out'
                style={{
                  width: isOn ? '100%' : '0%',
                  backgroundColor: getProgressColor(),
                }}
              />
            </div>
          </div>
        )}

        {maxPower && (
          <div className='flex items-center justify-between w-full'>
            <p className='text-[rgb(156,163,175)] text-sm font-normal'>Power</p>
            <p className='text-white text-sm font-normal'>{maxPower}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DeviceControlCard
