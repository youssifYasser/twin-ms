import { StatisticsType } from '@/types'
import { BUILDING_DATA } from './buildingData'

// Enhanced statistics interface with location data
export interface LocationStatisticsType extends StatisticsType {
  floorId: string
  unitId?: string // Optional - some data might be floor-level only
  location: string // Human-readable location
}

// Occupancy data interface
export interface OccupancyData {
  floorId: string
  unitId: string
  location: string
  currentOccupancy: number
  maxCapacity: number
}

// Consumption chart data interfaces
export interface ConsumptionChartData {
  floorId: string
  unitId?: string
  location: string
  energy: {
    splineData: { x: string; y: number }[]
    heatMapData: { name: string; data: number[] }[]
  }
  water: {
    splineData: { x: string; y: number }[]
    heatMapData: { name: string; data: number[] }[]
  }
}

// Base statistics template
const createStatisticsEntry = (
  title: string,
  value: number,
  percentageChange: number,
  measurementUnit: string,
  floorId: string,
  unitId?: string
): LocationStatisticsType => {
  const floor = BUILDING_DATA.find((f) => f.id === floorId)
  const unit = unitId && floor ? floor.units.find((u) => u.id === unitId) : null

  return {
    title,
    value: value.toString(),
    percentageChange,
    trendGraph: '/images/shapes/trend-up-1.png',
    measurementUnit,
    floorId,
    unitId,
    location: unit ? unit.displayName : floor?.displayName || 'Unknown',
  }
}

// Generate realistic data for each floor and unit
export const STATISTICS_DATA: LocationStatisticsType[] = []

// Generate occupancy data for all units (6 person capacity each)
export const OCCUPANCY_DATA: OccupancyData[] = []

// Initialize occupancy data
BUILDING_DATA.forEach((floor) => {
  if (floor.id !== 'basement' && floor.id !== 'roof') {
    // Regular floors - individual unit occupancy
    floor.units.forEach((unit) => {
      if (!unit.id.includes('_all')) {
        const isUnit501 = floor.id === 'floor_5' && unit.id === 'floor_5_unit_1'

        OCCUPANCY_DATA.push({
          floorId: floor.id,
          unitId: unit.id,
          location: unit.displayName,
          currentOccupancy: isUnit501 ? 0 : Math.floor(Math.random() * 6), // Unit 501 starts at 0, others random
          maxCapacity: 6,
        })
      }
    })
  }
})

// Generate data for each floor and their units
BUILDING_DATA.forEach((floor) => {
  if (floor.id === 'basement' || floor.id === 'roof') {
    // Special floors - only floor-level data
    STATISTICS_DATA.push(
      createStatisticsEntry(
        'water',
        Math.floor(Math.random() * 50 + 20),
        1.3,
        'm³',
        floor.id
      ),
      createStatisticsEntry(
        'power factor',
        parseFloat((Math.random() * 0.2 + 0.8).toFixed(2)),
        3.4,
        '',
        floor.id
      ),
      createStatisticsEntry(
        'demand',
        parseFloat((Math.random() * 30 + 20).toFixed(1)),
        2.0,
        'kW',
        floor.id
      ),
      createStatisticsEntry(
        'water price',
        parseFloat((Math.random() * 10 + 20).toFixed(1)),
        2.5,
        'SAR',
        floor.id
      )
    )
  } else {
    // Regular floors - both floor and unit level data
    floor.units.forEach((unit) => {
      if (unit.id.includes('_all')) {
        // Floor-level aggregated data
        STATISTICS_DATA.push(
          createStatisticsEntry(
            'water',
            Math.floor(Math.random() * 200 + 100),
            1.3,
            'm³',
            floor.id,
            unit.id
          ),
          createStatisticsEntry(
            'power factor',
            parseFloat((Math.random() * 0.2 + 0.8).toFixed(2)),
            3.4,
            '',
            floor.id,
            unit.id
          ),
          createStatisticsEntry(
            'demand',
            parseFloat((Math.random() * 100 + 80).toFixed(1)),
            2.0,
            'kW',
            floor.id,
            unit.id
          ),
          createStatisticsEntry(
            'water price',
            parseFloat((Math.random() * 20 + 40).toFixed(1)),
            2.5,
            'SAR',
            floor.id,
            unit.id
          )
        )
      } else {
        // Individual unit data
        STATISTICS_DATA.push(
          createStatisticsEntry(
            'water',
            Math.floor(Math.random() * 40 + 15),
            1.3,
            'm³',
            floor.id,
            unit.id
          ),
          createStatisticsEntry(
            'power factor',
            parseFloat((Math.random() * 0.2 + 0.8).toFixed(2)),
            3.4,
            '',
            floor.id,
            unit.id
          ),
          createStatisticsEntry(
            'demand',
            parseFloat((Math.random() * 20 + 10).toFixed(1)),
            2.0,
            'kW',
            floor.id,
            unit.id
          ),
          createStatisticsEntry(
            'water price',
            parseFloat((Math.random() * 8 + 6).toFixed(1)),
            2.5,
            'SAR',
            floor.id,
            unit.id
          )
        )
      }
    })
  }
})

// Generate consumption chart data for each floor and unit
export const CONSUMPTION_CHART_DATA: ConsumptionChartData[] = []

const generateConsumptionData = (
  baseEnergy: number,
  baseWater: number,
  floorId: string,
  unitId?: string
) => {
  const floor = BUILDING_DATA.find((f) => f.id === floorId)
  const unit = unitId && floor ? floor.units.find((u) => u.id === unitId) : null

  // Generate realistic seasonal energy data
  const energySplineData = [
    { x: 'Jan', y: Math.floor(baseEnergy * (0.9 + Math.random() * 0.2)) },
    { x: 'Feb', y: Math.floor(baseEnergy * (0.85 + Math.random() * 0.2)) },
    { x: 'Mar', y: Math.floor(baseEnergy * (0.95 + Math.random() * 0.2)) },
    { x: 'Apr', y: Math.floor(baseEnergy * (0.9 + Math.random() * 0.2)) },
    { x: 'May', y: Math.floor(baseEnergy * (1.05 + Math.random() * 0.2)) },
    { x: 'Jun', y: Math.floor(baseEnergy * (1.15 + Math.random() * 0.2)) },
    { x: 'Jul', y: Math.floor(baseEnergy * (1.25 + Math.random() * 0.15)) },
    { x: 'Aug', y: Math.floor(baseEnergy * (1.2 + Math.random() * 0.15)) },
    { x: 'Sep', y: Math.floor(baseEnergy * (1.0 + Math.random() * 0.2)) },
    { x: 'Oct', y: Math.floor(baseEnergy * (0.95 + Math.random() * 0.2)) },
    { x: 'Nov', y: Math.floor(baseEnergy * (0.85 + Math.random() * 0.2)) },
    { x: 'Dec', y: Math.floor(baseEnergy * (0.9 + Math.random() * 0.2)) },
  ]

  // Generate water consumption data
  const waterSplineData = [
    { x: 'Jan', y: Math.floor(baseWater * (0.95 + Math.random() * 0.1)) },
    { x: 'Feb', y: Math.floor(baseWater * (0.9 + Math.random() * 0.1)) },
    { x: 'Mar', y: Math.floor(baseWater * (1.0 + Math.random() * 0.1)) },
    { x: 'Apr', y: Math.floor(baseWater * (1.05 + Math.random() * 0.1)) },
    { x: 'May', y: Math.floor(baseWater * (1.1 + Math.random() * 0.1)) },
    { x: 'Jun', y: Math.floor(baseWater * (1.15 + Math.random() * 0.1)) },
    { x: 'Jul', y: Math.floor(baseWater * (1.2 + Math.random() * 0.1)) },
    { x: 'Aug', y: Math.floor(baseWater * (1.15 + Math.random() * 0.1)) },
    { x: 'Sep', y: Math.floor(baseWater * (1.05 + Math.random() * 0.1)) },
    { x: 'Oct', y: Math.floor(baseWater * (1.0 + Math.random() * 0.1)) },
    { x: 'Nov', y: Math.floor(baseWater * (0.95 + Math.random() * 0.1)) },
    { x: 'Dec', y: Math.floor(baseWater * (0.9 + Math.random() * 0.1)) },
  ]

  // Generate heat map data (hourly consumption patterns)
  const energyHeatMapData = [
    {
      name: 'Mon',
      data: Array.from({ length: 12 }, () =>
        Math.floor(Math.random() * 50 + 20)
      ),
    },
    {
      name: 'Tue',
      data: Array.from({ length: 12 }, () =>
        Math.floor(Math.random() * 60 + 25)
      ),
    },
    {
      name: 'Wed',
      data: Array.from({ length: 12 }, () =>
        Math.floor(Math.random() * 55 + 22)
      ),
    },
    {
      name: 'Thu',
      data: Array.from({ length: 12 }, () =>
        Math.floor(Math.random() * 58 + 24)
      ),
    },
    {
      name: 'Fri',
      data: Array.from({ length: 12 }, () =>
        Math.floor(Math.random() * 62 + 28)
      ),
    },
    {
      name: 'Sat',
      data: Array.from({ length: 12 }, () =>
        Math.floor(Math.random() * 45 + 15)
      ),
    },
    {
      name: 'Sun',
      data: Array.from({ length: 12 }, () =>
        Math.floor(Math.random() * 40 + 12)
      ),
    },
  ]

  const waterHeatMapData = [
    {
      name: 'Mon',
      data: Array.from({ length: 12 }, () =>
        Math.floor(Math.random() * 20 + 5)
      ),
    },
    {
      name: 'Tue',
      data: Array.from({ length: 12 }, () =>
        Math.floor(Math.random() * 25 + 8)
      ),
    },
    {
      name: 'Wed',
      data: Array.from({ length: 12 }, () =>
        Math.floor(Math.random() * 22 + 6)
      ),
    },
    {
      name: 'Thu',
      data: Array.from({ length: 12 }, () =>
        Math.floor(Math.random() * 24 + 7)
      ),
    },
    {
      name: 'Fri',
      data: Array.from({ length: 12 }, () =>
        Math.floor(Math.random() * 26 + 9)
      ),
    },
    {
      name: 'Sat',
      data: Array.from({ length: 12 }, () =>
        Math.floor(Math.random() * 18 + 4)
      ),
    },
    {
      name: 'Sun',
      data: Array.from({ length: 12 }, () =>
        Math.floor(Math.random() * 15 + 3)
      ),
    },
  ]

  return {
    floorId,
    unitId,
    location: unit ? unit.displayName : floor?.displayName || 'Unknown',
    energy: {
      splineData: energySplineData,
      heatMapData: energyHeatMapData,
    },
    water: {
      splineData: waterSplineData,
      heatMapData: waterHeatMapData,
    },
  }
}

// Generate consumption data for each floor and unit
BUILDING_DATA.forEach((floor) => {
  if (floor.id === 'basement' || floor.id === 'roof') {
    // Special floors - lower consumption
    CONSUMPTION_CHART_DATA.push(generateConsumptionData(150, 50, floor.id))
  } else {
    // Regular floors
    floor.units.forEach((unit) => {
      if (unit.id.includes('_all')) {
        // Floor-level aggregated data
        CONSUMPTION_CHART_DATA.push(
          generateConsumptionData(800, 200, floor.id, unit.id)
        )
      } else {
        // Individual unit data
        CONSUMPTION_CHART_DATA.push(
          generateConsumptionData(160, 40, floor.id, unit.id)
        )
      }
    })
  }
})

// Helper functions for filtering statistics data
export const getStatisticsForFilter = (
  selectedFloorId: string | null,
  selectedUnitId: string | null
): StatisticsType[] => {
  // All floors - aggregate all data
  if (selectedFloorId === 'all') {
    return aggregateStatistics(STATISTICS_DATA)
  }

  // All units in a specific floor
  if (selectedFloorId && selectedUnitId === 'all') {
    const floorData = STATISTICS_DATA.filter(
      (stat) =>
        stat.floorId === selectedFloorId && stat.unitId?.includes('_all')
    )
    return floorData.map((stat) => ({
      title: stat.title,
      value: stat.value,
      percentageChange: stat.percentageChange,
      trendGraph: stat.trendGraph,
      measurementUnit: stat.measurementUnit,
    }))
  }

  // Specific unit
  if (selectedFloorId && selectedUnitId && selectedUnitId !== 'all') {
    const unitData = STATISTICS_DATA.filter(
      (stat) =>
        stat.floorId === selectedFloorId && stat.unitId === selectedUnitId
    )
    return unitData.map((stat) => ({
      title: stat.title,
      value: stat.value,
      percentageChange: stat.percentageChange,
      trendGraph: stat.trendGraph,
      measurementUnit: stat.measurementUnit,
    }))
  }

  return []
}

// Get occupancy statistics for current filter
export const getOccupancyForFilter = (
  selectedFloorId: string | null,
  selectedUnitId: string | null
): StatisticsType => {
  let totalOccupancy = 0
  let totalCapacity = 0

  // All floors - aggregate all occupancy data
  if (selectedFloorId === 'all') {
    OCCUPANCY_DATA.forEach((occupancy) => {
      totalOccupancy += occupancy.currentOccupancy
      totalCapacity += occupancy.maxCapacity
    })
  }
  // All units in a specific floor
  else if (selectedFloorId && selectedUnitId === 'all') {
    const floorOccupancy = OCCUPANCY_DATA.filter(
      (occupancy) => occupancy.floorId === selectedFloorId
    )
    floorOccupancy.forEach((occupancy) => {
      totalOccupancy += occupancy.currentOccupancy
      totalCapacity += occupancy.maxCapacity
    })
  }
  // Specific unit
  else if (selectedFloorId && selectedUnitId && selectedUnitId !== 'all') {
    const unitOccupancy = OCCUPANCY_DATA.find(
      (occupancy) =>
        occupancy.floorId === selectedFloorId &&
        occupancy.unitId === selectedUnitId
    )
    if (unitOccupancy) {
      totalOccupancy = unitOccupancy.currentOccupancy
      totalCapacity = unitOccupancy.maxCapacity
    }
  }

  return {
    title: 'Occupancy Monitoring',
    value: `${totalOccupancy}/${totalCapacity}`,
    percentageChange: 2.5,
    trendGraph: '/images/shapes/trend-up-2.png',
    measurementUnit: '',
  }
}

// Update occupancy for Unit 501 (WebSocket integration)
export const updateUnit501Occupancy = (): number => {
  const unit501 = OCCUPANCY_DATA.find(
    (occupancy) =>
      occupancy.floorId === 'floor_5' && occupancy.unitId === 'floor_5_unit_1'
  )

  if (unit501) {
    // Toggle between adding and removing 1 person
    unit501.currentOccupancy = unit501.currentOccupancy === 0 ? 1 : 0
    return unit501.currentOccupancy
  }

  return 0
}

// Aggregate statistics across all floors/units
const aggregateStatistics = (
  data: LocationStatisticsType[]
): StatisticsType[] => {
  const grouped = data.reduce(
    (acc, stat) => {
      if (!acc[stat.title]) {
        acc[stat.title] = {
          values: [],
          percentageChanges: [],
          measurementUnit: stat.measurementUnit,
          trendGraph: stat.trendGraph,
        }
      }
      acc[stat.title].values.push(parseFloat(stat.value))
      acc[stat.title].percentageChanges.push(stat.percentageChange)
      return acc
    },
    {} as Record<
      string,
      {
        values: number[]
        percentageChanges: number[]
        measurementUnit?: string
        trendGraph?: string
      }
    >
  )

  return Object.entries(grouped).map(([title, data]) => ({
    title,
    value: data.values
      .reduce((sum, val) => sum + val, 0)
      .toFixed(title === 'power factor' ? 2 : 1),
    percentageChange: parseFloat(
      (
        data.percentageChanges.reduce((sum, val) => sum + val, 0) /
        data.percentageChanges.length
      ).toFixed(1)
    ),
    measurementUnit: data.measurementUnit || '',
    trendGraph: data.trendGraph || '/images/shapes/trend-up-1.png',
  }))
}

// Get system control statistics (devices online, HVAC, lights, doors)
export const getSystemControlStatistics = (
  selectedFloorId: string | null,
  selectedUnitId: string | null
): StatisticsType[] => {
  // This would be calculated based on device data
  // For now, returning sample data that responds to filters

  const baseStats = [
    { title: 'Devices Online', base: 210, total: 231, unit: '' },
    { title: 'HVAC Systems', base: 22, total: 25, unit: '°C' },
    { title: 'Lights Active', base: 156, total: 200, unit: '' },
    { title: 'Doors Secured', base: 42, total: 50, unit: '' },
  ]

  if (selectedFloorId === 'all') {
    // All floors - show full building stats
    return baseStats.map((stat, index) => ({
      title: stat.title,
      value:
        stat.title === 'HVAC Systems'
          ? `${stat.base}${stat.unit}`
          : `${stat.base}/${stat.total}`,
      percentageChange: [1.3, 3.4, 2.0, 3.0][index],
      trendGraph: `/images/shapes/trend-up-${(index % 3) + 1}.png`,
    }))
  }

  // Floor or unit specific - show proportional values
  const factor = selectedUnitId && selectedUnitId !== 'all' ? 0.2 : 0.8 // Unit vs floor factor

  return baseStats.map((stat, index) => {
    const adjustedBase = Math.floor(stat.base * factor)
    const adjustedTotal = Math.floor(stat.total * factor)

    return {
      title: stat.title,
      value:
        stat.title === 'HVAC Systems'
          ? `${adjustedBase}${stat.unit}`
          : `${adjustedBase}/${adjustedTotal}`,
      percentageChange: [1.3, 3.4, 2.0, 3.0][index],
      trendGraph: `/images/shapes/trend-up-${(index % 3) + 1}.png`,
    }
  })
}

// Get filtered consumption chart data
export const getConsumptionDataForFilter = (
  selectedFloorId: string | null,
  selectedUnitId: string | null
): ConsumptionChartData | null => {
  // All floors - aggregate all consumption data
  if (selectedFloorId === 'all') {
    return aggregateConsumptionData(CONSUMPTION_CHART_DATA)
  }

  // All units in a specific floor
  if (selectedFloorId && selectedUnitId === 'all') {
    const floorData = CONSUMPTION_CHART_DATA.find(
      (data) =>
        data.floorId === selectedFloorId && data.unitId?.includes('_all')
    )
    return floorData || null
  }

  // Specific unit
  if (selectedFloorId && selectedUnitId && selectedUnitId !== 'all') {
    const unitData = CONSUMPTION_CHART_DATA.find(
      (data) =>
        data.floorId === selectedFloorId && data.unitId === selectedUnitId
    )
    return unitData || null
  }

  return null
}

// Aggregate consumption data across all floors/units
const aggregateConsumptionData = (
  data: ConsumptionChartData[]
): ConsumptionChartData => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  // Aggregate spline data by month
  const energySplineData = months.map((month) => {
    const monthData = data.map(
      (d) => d.energy.splineData.find((s) => s.x === month)?.y || 0
    )
    return { x: month, y: monthData.reduce((sum, val) => sum + val, 0) }
  })

  const waterSplineData = months.map((month) => {
    const monthData = data.map(
      (d) => d.water.splineData.find((s) => s.x === month)?.y || 0
    )
    return { x: month, y: monthData.reduce((sum, val) => sum + val, 0) }
  })

  // Aggregate heat map data by day and hour
  const energyHeatMapData = days.map((day) => {
    const dayIndex = days.indexOf(day)
    const hourlyData = Array.from({ length: 12 }, (_, hourIndex) => {
      const hourData = data.map(
        (d) => d.energy.heatMapData[dayIndex]?.data[hourIndex] || 0
      )
      return hourData.reduce((sum, val) => sum + val, 0)
    })
    return { name: day, data: hourlyData }
  })

  const waterHeatMapData = days.map((day) => {
    const dayIndex = days.indexOf(day)
    const hourlyData = Array.from({ length: 12 }, (_, hourIndex) => {
      const hourData = data.map(
        (d) => d.water.heatMapData[dayIndex]?.data[hourIndex] || 0
      )
      return hourData.reduce((sum, val) => sum + val, 0)
    })
    return { name: day, data: hourlyData }
  })

  return {
    floorId: 'all',
    location: 'All Floors',
    energy: {
      splineData: energySplineData,
      heatMapData: energyHeatMapData,
    },
    water: {
      splineData: waterSplineData,
      heatMapData: waterHeatMapData,
    },
  }
}

export default STATISTICS_DATA
