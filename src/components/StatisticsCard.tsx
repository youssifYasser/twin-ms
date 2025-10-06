import { TrendUpIcon, TrendDownIcon, TrendStableIcon } from '@/icons'
import { StatisticsType } from '@/types'
import { useRealtimeData } from '@/context/RealtimeDataContext'
import { useEffect, useState } from 'react'

interface StatisticsCardProps {
  statisticsItem: StatisticsType & { trendDirection?: string }
}

const StatisticsCard = ({
  statisticsItem: {
    title,
    value,
    measurementUnit,
    trendGraph,
    percentageChange,
    trendDirection,
  },
}: StatisticsCardProps) => {
  const { isRealtimeEnabled, isDataUpdating } = useRealtimeData()
  const [isAnimating, setIsAnimating] = useState(false)

  // Trigger animation when data updates
  useEffect(() => {
    if (isDataUpdating && isRealtimeEnabled) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 600)
      return () => clearTimeout(timer)
    }
  }, [isDataUpdating, isRealtimeEnabled])

  // Determine which trend icon to show
  const getTrendIcon = () => {
    if (!isRealtimeEnabled) {
      // Default to trend up icon when not in real-time mode
      return <TrendUpIcon fill='#53B8BE' width={16} height={16} />
    }

    switch (trendDirection) {
      case 'up':
        return <TrendUpIcon fill='#10B981' width={16} height={16} />
      case 'down':
        return <TrendDownIcon fill='#EF4444' width={16} height={16} />
      case 'stable':
        return <TrendStableIcon fill='#6B7280' width={16} height={16} />
      default:
        return <TrendStableIcon fill='#6B7280' width={16} height={16} />
    }
  }

  // Determine percentage change color based on trend
  const getPercentageChangeColor = () => {
    if (!isRealtimeEnabled) {
      return '#37988a' // Default color
    }

    switch (trendDirection) {
      case 'up':
        return '#10B981' // Green
      case 'down':
        return '#EF4444' // Red
      case 'stable':
        return '#6B7280' // Gray
      default:
        return '#6B7280'
    }
  }

  return (
    <div
      className={`bg-bg-card p-3 md:p-4 backdrop-blur-24 flex flex-col items-start justify-between gap-2 rounded-none w-full transition-all duration-300 ${
        isAnimating ? 'ring-2 ring-blue-400 ring-opacity-50 scale-[1.02]' : ''
      }`}
    >
      <div className='flex items-center gap-2 w-full'>
        <h3 className='text-sm md:text-base font-bold text-[#aeb0b3] uppercase flex-1 min-w-0'>
          {title}
        </h3>
        {measurementUnit && (
          <span className='text-xs md:text-sm font-normal text-[#6b757c] flex-shrink-0'>
            {measurementUnit}
          </span>
        )}
        {/* Real-time indicator */}
        {isRealtimeEnabled && (
          <div className='flex items-center ml-auto flex-shrink-0'>
            <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
          </div>
        )}
      </div>
      <div className='flex items-baseline gap-2 w-full'>
        <span
          className={`text-2xl md:text-3xl lg:text-4xl font-bold text-[#e3e5e7] transition-all duration-300 ${
            isAnimating ? 'scale-110' : ''
          }`}
        >
          {value}
        </span>
        {measurementUnit && (
          <span className='text-lg md:text-xl font-normal text-[#519a96]'>
            {measurementUnit}
          </span>
        )}
      </div>
      <div className='flex items-center gap-1 w-full overflow-hidden'>
        {getTrendIcon()}

        <span
          className='font-normal text-lg md:text-xl transition-colors duration-300'
          style={{ color: getPercentageChangeColor() }}
        >
          {percentageChange}%
        </span>
        {/* Show trend graph only when real-time is disabled */}
        {!isRealtimeEnabled && trendGraph && (
          <img
            src={trendGraph}
            alt='Trend graph'
            className='mb-3 md:mb-5 ml-4 md:ml-8 flex-shrink-0'
            width={80}
            height={16}
            style={{ width: 'auto', height: '16px', maxWidth: '109px' }}
          />
        )}
        {/* Show live data indicator when real-time is enabled */}
        {isRealtimeEnabled && (
          <div className='ml-4 md:ml-8 flex items-center gap-2 flex-shrink-0'>
            <span className='text-xs text-gray-400 font-medium'>LIVE</span>
            <div className='flex gap-1'>
              <div className='w-1 h-3 bg-blue-400 rounded-full animate-pulse'></div>
              <div
                className='w-1 h-3 bg-blue-400 rounded-full animate-pulse'
                style={{ animationDelay: '0.2s' }}
              ></div>
              <div
                className='w-1 h-3 bg-blue-400 rounded-full animate-pulse'
                style={{ animationDelay: '0.4s' }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StatisticsCard
