import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react'
import { StatisticsType } from '@/types'

// Configuration constants for realistic data simulation
const SIMULATION_CONFIG = {
  updateInterval: 3500, // 3.5 seconds
  temperatureRange: { min: -2.5, max: 3.0 }, // ±2-3°C
  energyRange: { min: 0.95, max: 1.1 }, // ±5-10%
  alertCountRange: { min: -2, max: 2 }, // ±1-2 items
  occupancyRange: { min: 0.85, max: 1.15 }, // ±10-15%
  businessHours: { start: 8, end: 18 }, // 8 AM to 6 PM
}

// Data variation algorithms for realistic behavior
const DataVariationAlgorithms = {
  // Gradual temperature changes with minor fluctuations
  temperature: (currentValue: number, baseValue: number): number => {
    const variation =
      (Math.random() - 0.5) *
      (SIMULATION_CONFIG.temperatureRange.max -
        SIMULATION_CONFIG.temperatureRange.min)
    const newValue = currentValue + variation

    // Keep within reasonable bounds (±5°C from base)
    const minBound = baseValue - 5
    const maxBound = baseValue + 5
    return Math.max(minBound, Math.min(maxBound, newValue))
  },

  // Energy with business hours pattern
  energy: (currentValue: number, baseValue: number): number => {
    const currentHour = new Date().getHours()
    const isBusinessHours =
      currentHour >= SIMULATION_CONFIG.businessHours.start &&
      currentHour <= SIMULATION_CONFIG.businessHours.end

    // Higher energy consumption during business hours, with gradual changes
    const businessMultiplier = isBusinessHours ? 1.2 : 0.8
    const randomVariation =
      Math.random() *
        (SIMULATION_CONFIG.energyRange.max -
          SIMULATION_CONFIG.energyRange.min) +
      SIMULATION_CONFIG.energyRange.min

    // Blend current value with target to create smooth transitions
    const targetValue = baseValue * businessMultiplier * randomVariation
    const blendedValue = currentValue * 0.7 + targetValue * 0.3

    return Math.round(blendedValue * 100) / 100
  },

  // Alert counts with occasional spikes
  alertCount: (currentValue: number, baseValue: number): number => {
    // 80% chance of staying stable, 20% chance of minor change
    if (Math.random() < 0.8) {
      return currentValue
    }

    const variation =
      Math.floor(
        Math.random() *
          (SIMULATION_CONFIG.alertCountRange.max -
            SIMULATION_CONFIG.alertCountRange.min +
            1)
      ) + SIMULATION_CONFIG.alertCountRange.min

    const newValue = Math.max(0, currentValue + variation)

    // Keep within reasonable bounds
    return Math.min(newValue, baseValue + 10)
  },

  // Occupancy with business hours pattern
  occupancy: (currentValue: number, baseValue: number): number => {
    const currentHour = new Date().getHours()
    const isBusinessHours =
      currentHour >= SIMULATION_CONFIG.businessHours.start &&
      currentHour <= SIMULATION_CONFIG.businessHours.end

    // Higher occupancy during business hours, with smooth transitions
    const businessMultiplier = isBusinessHours ? 1.1 : 0.7
    const randomVariation =
      Math.random() *
        (SIMULATION_CONFIG.occupancyRange.max -
          SIMULATION_CONFIG.occupancyRange.min) +
      SIMULATION_CONFIG.occupancyRange.min

    // Blend current value with target for smooth changes
    const targetValue = baseValue * businessMultiplier * randomVariation
    const blendedValue = currentValue * 0.8 + targetValue * 0.2

    return Math.round(blendedValue * 100) / 100
  },

  // Percentage values (generic)
  percentage: (currentValue: number, baseValue: number): number => {
    const variation = (Math.random() - 0.5) * 20 // ±10%
    const newValue = currentValue + variation

    // Keep within reasonable bounds relative to base value
    const minBound = Math.max(0, baseValue * 0.5)
    const maxBound = Math.min(100, baseValue * 1.5)

    return Math.max(minBound, Math.min(maxBound, newValue))
  },
}

// Types for real-time context
interface RealtimeDataContextType {
  isRealtimeEnabled: boolean
  toggleRealtime: () => void
  getModifiedStatistics: (originalStats: StatisticsType[]) => StatisticsType[]
  isDataUpdating: boolean
  lastUpdateTime: number
  timePeriod: string
  setTimePeriod: (period: string) => void
}

interface RealtimeDataProviderProps {
  children: ReactNode
}

interface SimulatedData {
  [key: string]: {
    currentValue: number
    baseValue: number
    lastTrend: 'up' | 'down' | 'stable'
  }
}

// Create context
const RealtimeDataContext = createContext<RealtimeDataContextType | undefined>(
  undefined
)

// Provider component
export const RealtimeDataProvider: React.FC<RealtimeDataProviderProps> = ({
  children,
}) => {
  const [isRealtimeEnabled, setIsRealtimeEnabled] = useState<boolean>(true)
  const [simulatedData, setSimulatedData] = useState<SimulatedData>({})
  const [isDataUpdating, setIsDataUpdating] = useState<boolean>(false)
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now())
  const [timePeriod, setTimePeriod] = useState<string>('1 Year')
  const [timePeriodVersion, setTimePeriodVersion] = useState<number>(0) // Force re-renders when time period changes

  // Initialize base values for statistics
  const initializeStatistic = useCallback(
    (title: string, value: string) => {
      const numericValue = parseFloat(value) || 0
      if (!simulatedData[title]) {
        setSimulatedData((prev) => ({
          ...prev,
          [title]: {
            currentValue: numericValue,
            baseValue: numericValue,
            lastTrend: 'stable' as const,
          },
        }))
      }
    },
    [simulatedData]
  )

  // Get appropriate variation algorithm based on statistic type
  const getVariationAlgorithm = (title: string) => {
    const titleLower = title.toLowerCase()

    if (titleLower.includes('temperature') || titleLower.includes('°c')) {
      return DataVariationAlgorithms.temperature
    } else if (
      titleLower.includes('energy') ||
      titleLower.includes('consumption') ||
      titleLower.includes('kwh')
    ) {
      return DataVariationAlgorithms.energy
    } else if (
      titleLower.includes('alert') ||
      titleLower.includes('maintenance') ||
      titleLower.includes('task')
    ) {
      return DataVariationAlgorithms.alertCount
    } else if (
      titleLower.includes('occupancy') ||
      titleLower.includes('occupied')
    ) {
      return DataVariationAlgorithms.occupancy
    } else if (title.includes('%')) {
      return DataVariationAlgorithms.percentage
    }

    return DataVariationAlgorithms.energy // Default algorithm
  }

  // Update simulation data
  const updateSimulationData = useCallback(() => {
    if (!isRealtimeEnabled) return

    setIsDataUpdating(true)

    setSimulatedData((prev) => {
      const updated: SimulatedData = {}

      Object.keys(prev).forEach((title) => {
        const current = prev[title]
        const algorithm = getVariationAlgorithm(title)
        const newValue = algorithm(current.currentValue, current.baseValue)

        // Determine trend
        let trend: 'up' | 'down' | 'stable' = 'stable'
        if (newValue > current.currentValue + 0.01) {
          trend = 'up'
        } else if (newValue < current.currentValue - 0.01) {
          trend = 'down'
        }

        updated[title] = {
          ...current,
          currentValue: newValue,
          lastTrend: trend,
        }
      })

      return updated
    })

    setLastUpdateTime(Date.now())

    // Reset updating indicator after animation
    setTimeout(() => setIsDataUpdating(false), 500)
  }, [isRealtimeEnabled, getVariationAlgorithm])

  // Set up interval for data updates
  useEffect(() => {
    if (!isRealtimeEnabled) return

    const interval = setInterval(
      updateSimulationData,
      SIMULATION_CONFIG.updateInterval
    )
    return () => clearInterval(interval)
  }, [isRealtimeEnabled, updateSimulationData])

  // Toggle realtime simulation
  const toggleRealtime = useCallback(() => {
    setIsRealtimeEnabled((prev) => {
      const newState = !prev

      // When disabling real-time, always reset to "1 Year"
      if (!newState) {
        setTimePeriod('1 Year')
        setTimePeriodVersion((prevVersion) => prevVersion + 1)
        localStorage.setItem('statisticsTimePeriod', '1 Year')
      }

      // Persist state to localStorage
      localStorage.setItem('realtimeSimulationEnabled', newState.toString())

      return newState
    })
  }, [])

  // Load persisted state on mount
  useEffect(() => {
    const persistedState = localStorage.getItem('realtimeSimulationEnabled')
    if (persistedState === 'true') {
      setIsRealtimeEnabled(true)
    }

    // Always start with "1 Year" as default, don't load persisted time period
    setTimePeriod('1 Year')
    localStorage.setItem('statisticsTimePeriod', '1 Year')
  }, [])

  // Time period scaling factors
  const getTimePeriodMultiplier = useCallback((period: string): number => {
    switch (period) {
      case '1 Week':
        return 1 / 3 // 1 Year / 3 for larger presentation values
      case '1 Month':
        return 1 / 2 // 1 Year / 2 for larger presentation values
      case '1 Year':
      default:
        return 1 // Baseline (no scaling)
    }
  }, [])

  // Update time period with persistence
  const updateTimePeriod = useCallback((period: string) => {
    setTimePeriod(period)
    setTimePeriodVersion((prev) => prev + 1) // Force re-renders
    localStorage.setItem('statisticsTimePeriod', period)
  }, [])

  // Get modified statistics with simulated data and time period scaling
  const getModifiedStatistics = useCallback(
    (originalStats: StatisticsType[]): StatisticsType[] => {
      return originalStats.map((stat) => {
        // Initialize if not exists
        initializeStatistic(stat.title, stat.value)

        let processedValue = stat.value
        let processedPercentageChange = stat.percentageChange

        // Apply time period scaling when real-time is disabled
        if (!isRealtimeEnabled) {
          const multiplier = getTimePeriodMultiplier(timePeriod)

          // Only scale cumulative/total values, not rates or percentages
          const shouldScale =
            stat.title.toLowerCase().includes('consumption') ||
            stat.title.toLowerCase().includes('cost') ||
            stat.title.toLowerCase().includes('kwh') ||
            stat.title.toLowerCase().includes('total') ||
            stat.title.toLowerCase().includes('energy') ||
            stat.title.toLowerCase().includes('usage') ||
            stat.title.toLowerCase().includes('spent') ||
            stat.title.toLowerCase().includes('bills') ||
            stat.title.toLowerCase().includes('water') ||
            stat.title.toLowerCase().includes('demand') ||
            stat.title.toLowerCase().includes('price') ||
            (stat.measurementUnit &&
              stat.measurementUnit.toLowerCase().includes('kwh')) ||
            (stat.measurementUnit &&
              stat.measurementUnit.toLowerCase().includes('m³')) ||
            (stat.measurementUnit &&
              stat.measurementUnit.toLowerCase().includes('sar')) ||
            (stat.measurementUnit &&
              stat.measurementUnit.toLowerCase().includes('$')) ||
            (stat.measurementUnit &&
              stat.measurementUnit.toLowerCase().includes('€')) ||
            (stat.title.toLowerCase().includes('maintenance') &&
              !stat.title.toLowerCase().includes('time')) ||
            (stat.title.toLowerCase().includes('alert') &&
              !stat.title.toLowerCase().includes('time') &&
              !stat.title.toLowerCase().includes('avg'))

          // Don't scale temperature, percentages, or rates
          const shouldNotScale =
            stat.title.toLowerCase().includes('temperature') ||
            stat.title.toLowerCase().includes('°c') ||
            stat.title.toLowerCase().includes('humidity') ||
            stat.title.toLowerCase().includes('occupancy') ||
            stat.value.includes('%') ||
            stat.title.toLowerCase().includes('avg') ||
            stat.title.toLowerCase().includes('average') ||
            stat.title.toLowerCase().includes('time')

          if (shouldScale && !shouldNotScale) {
            const numericValue =
              parseFloat(stat.value.replace(/[^0-9.-]/g, '')) || 0
            const scaledValue = numericValue * multiplier

            // Keep only the numeric value, don't include units in the value field
            // The measurementUnit field will handle the units separately
            if (
              stat.measurementUnit &&
              stat.measurementUnit.toLowerCase().includes('kwh')
            ) {
              processedValue = scaledValue.toFixed(2)
            } else if (
              stat.measurementUnit &&
              stat.measurementUnit.toLowerCase().includes('sar')
            ) {
              processedValue = scaledValue.toFixed(2)
            } else if (
              stat.measurementUnit &&
              stat.measurementUnit.toLowerCase().includes('m³')
            ) {
              processedValue = scaledValue.toFixed(1)
            } else if (
              stat.measurementUnit &&
              stat.measurementUnit.toLowerCase().includes('kw')
            ) {
              processedValue = scaledValue.toFixed(1)
            } else if (
              stat.measurementUnit &&
              stat.measurementUnit.toLowerCase().includes('$')
            ) {
              processedValue = scaledValue.toFixed(2)
            } else if (
              stat.measurementUnit &&
              stat.measurementUnit.toLowerCase().includes('€')
            ) {
              processedValue = scaledValue.toFixed(2)
            } else if (
              stat.measurementUnit &&
              stat.measurementUnit.trim() !== ''
            ) {
              // For other units, use appropriate decimal places
              processedValue = scaledValue.toFixed(2)
            } else {
              // No unit, round to integer
              processedValue = Math.round(scaledValue).toString()
            }

            console.log(
              `🔧 Scaling ${stat.title}: ${stat.value} ${
                stat.measurementUnit || ''
              } → ${processedValue} ${
                stat.measurementUnit || ''
              } (${multiplier}x)`
            )
          }

          return {
            ...stat,
            value: processedValue,
            percentageChange: processedPercentageChange,
          }
        }

        // Apply real-time simulation when enabled
        const simulatedStat = simulatedData[stat.title]
        if (!simulatedStat) {
          return stat
        }

        // Special handling for Unit 501 occupancy - preserve WebSocket control
        if (stat.title === 'Unit 501 Occupancy') {
          return stat
        }

        // Format value based on original format
        let formattedValue = stat.value
        if (stat.value.includes('°C')) {
          formattedValue = `${simulatedStat.currentValue.toFixed(1)}°C`
        } else if (stat.value.includes('%')) {
          formattedValue = `${simulatedStat.currentValue.toFixed(1)}%`
        } else if (stat.value.includes('kWh')) {
          formattedValue = `${simulatedStat.currentValue.toFixed(2)} kWh`
        } else if (!isNaN(parseFloat(stat.value))) {
          formattedValue = Math.round(simulatedStat.currentValue).toString()
        }

        // Update trend based on data change
        let trendGraph = stat.trendGraph
        if (simulatedStat.lastTrend === 'up') {
          trendGraph = '/images/shapes/trend-up-1.png'
        } else if (simulatedStat.lastTrend === 'down') {
          trendGraph = '/images/shapes/trend-up-2.png'
        }

        return {
          ...stat,
          value: formattedValue,
          trendGraph,
          trendDirection: simulatedStat.lastTrend,
        } as StatisticsType & { trendDirection: string }
      })
    },
    [
      simulatedData,
      isRealtimeEnabled,
      timePeriod,
      timePeriodVersion, // Include version to force re-renders
      initializeStatistic,
      getTimePeriodMultiplier,
    ]
  )

  const contextValue: RealtimeDataContextType = {
    isRealtimeEnabled,
    toggleRealtime,
    getModifiedStatistics,
    isDataUpdating,
    lastUpdateTime,
    timePeriod,
    setTimePeriod: updateTimePeriod,
  }

  return (
    <RealtimeDataContext.Provider value={contextValue}>
      {children}
    </RealtimeDataContext.Provider>
  )
}

// Custom hook to use the realtime data context
export const useRealtimeData = (): RealtimeDataContextType => {
  const context = useContext(RealtimeDataContext)
  if (context === undefined) {
    throw new Error(
      'useRealtimeData must be used within a RealtimeDataProvider'
    )
  }
  return context
}

export default RealtimeDataContext
