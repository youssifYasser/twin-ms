// Utility functions for data filtering and aggregation across the application

import { StatisticsType } from '@/types'
import {
  getStatisticsForFilter,
  getSystemControlStatistics,
  getConsumptionDataForFilter,
  getOccupancyForFilter,
  LocationStatisticsType,
  ConsumptionChartData,
} from '@/data/statisticsData'
import {
  getDevicesForFilter,
  getDeviceControlCounts,
  LocationDeviceType,
} from '@/data/devicesData'
import {
  getAlertsForFilter,
  getMaintenanceTasksForFilter,
  getAlertStatsForFilter,
  LocationAlertType,
  LocationMaintenanceTaskType,
} from '@/data/alertsData'
import {
  getCamerasForFilter,
  getCameraStatsForFilter,
  LocationCameraType,
} from '@/data/camerasData'

// Filter state interface for consistent typing
export interface FilterParams {
  selectedFloorId: string | null
  selectedUnitId: string | null
}

// Statistics filtering functions
export const getFilteredStatistics = (
  filterParams: FilterParams
): StatisticsType[] => {
  return getStatisticsForFilter(
    filterParams.selectedFloorId,
    filterParams.selectedUnitId
  )
}

export const getFilteredOccupancy = (
  filterParams: FilterParams
): StatisticsType => {
  return getOccupancyForFilter(
    filterParams.selectedFloorId,
    filterParams.selectedUnitId
  )
}

export const getFilteredSystemControlStats = (
  filterParams: FilterParams
): StatisticsType[] => {
  return getSystemControlStatistics(
    filterParams.selectedFloorId,
    filterParams.selectedUnitId
  )
}

// Consumption chart filtering function
export const getFilteredConsumptionData = (
  filterParams: FilterParams
): ConsumptionChartData | null => {
  return getConsumptionDataForFilter(
    filterParams.selectedFloorId,
    filterParams.selectedUnitId
  )
}

// Device filtering functions
export const getFilteredDevices = (
  filterParams: FilterParams,
  deviceType?: string
): LocationDeviceType[] => {
  return getDevicesForFilter(
    filterParams.selectedFloorId,
    filterParams.selectedUnitId,
    deviceType as any
  )
}

export const getFilteredDeviceCounts = (filterParams: FilterParams) => {
  return getDeviceControlCounts(
    filterParams.selectedFloorId,
    filterParams.selectedUnitId
  )
}

// Alert filtering functions
export const getFilteredAlerts = (
  filterParams: FilterParams,
  severityFilter?: string
): LocationAlertType[] => {
  return getAlertsForFilter(
    filterParams.selectedFloorId,
    filterParams.selectedUnitId,
    severityFilter
  )
}

export const getFilteredMaintenanceTasks = (
  filterParams: FilterParams
): LocationMaintenanceTaskType[] => {
  return getMaintenanceTasksForFilter(
    filterParams.selectedFloorId,
    filterParams.selectedUnitId
  )
}

export const getFilteredAlertStats = (filterParams: FilterParams) => {
  return getAlertStatsForFilter(
    filterParams.selectedFloorId,
    filterParams.selectedUnitId
  )
}

// Camera filtering functions
export const getFilteredCameras = (
  filterParams: FilterParams
): LocationCameraType[] => {
  return getCamerasForFilter(
    filterParams.selectedFloorId,
    filterParams.selectedUnitId
  )
}

export const getFilteredCameraStats = (filterParams: FilterParams) => {
  return getCameraStatsForFilter(
    filterParams.selectedFloorId,
    filterParams.selectedUnitId
  )
}

// Aggregation helper functions
export const aggregateNumericValues = (
  data: LocationStatisticsType[],
  field: keyof LocationStatisticsType
): number => {
  return data.reduce((sum, item) => {
    const value = parseFloat(item[field] as string) || 0
    return sum + value
  }, 0)
}

export const calculateAverageValue = (
  data: LocationStatisticsType[],
  field: keyof LocationStatisticsType
): number => {
  if (data.length === 0) return 0
  const total = aggregateNumericValues(data, field)
  return total / data.length
}

// Data validation functions
export const isValidFilterParams = (filterParams: FilterParams): boolean => {
  return (
    filterParams.selectedFloorId !== null &&
    filterParams.selectedUnitId !== null
  )
}

export const getFilterDescription = (filterParams: FilterParams): string => {
  if (filterParams.selectedFloorId === 'all') {
    return 'All Floors'
  }

  if (filterParams.selectedUnitId === 'all') {
    return `${filterParams.selectedFloorId} - All Units`
  }

  return `${filterParams.selectedFloorId} - ${filterParams.selectedUnitId}`
}

// Count helper functions
export const countActiveDevices = (devices: LocationDeviceType[]): number => {
  return devices.filter((device) => device.isOn).length
}

export const countDevicesByType = (
  devices: LocationDeviceType[],
  deviceType: string
): number => {
  return devices.filter((device) => device.deviceType === deviceType).length
}

export const countAlertsBySeverity = (
  alerts: LocationAlertType[],
  severity: string
): number => {
  return alerts.filter((alert) => alert.severity === severity).length
}

// Data transformation functions
export const convertToStatisticsType = (
  locationStats: LocationStatisticsType[]
): StatisticsType[] => {
  return locationStats.map((stat) => ({
    title: stat.title,
    value: stat.value,
    percentageChange: stat.percentageChange,
    trendGraph: stat.trendGraph,
    measurementUnit: stat.measurementUnit,
  }))
}

// Performance optimization functions
export const memoizeFilterResults = <T>(
  filterFn: (params: FilterParams) => T,
  cacheKey: string
) => {
  const cache = new Map<string, T>()

  return (filterParams: FilterParams): T => {
    const key = `${cacheKey}_${filterParams.selectedFloorId}_${filterParams.selectedUnitId}`

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = filterFn(filterParams)
    cache.set(key, result)

    return result
  }
}

// Export commonly used filter combinations
export const getAllFilteredData = (filterParams: FilterParams) => {
  return {
    statistics: getFilteredStatistics(filterParams),
    occupancy: getFilteredOccupancy(filterParams),
    systemControlStats: getFilteredSystemControlStats(filterParams),
    devices: getFilteredDevices(filterParams),
    deviceCounts: getFilteredDeviceCounts(filterParams),
    alerts: getFilteredAlerts(filterParams),
    maintenanceTasks: getFilteredMaintenanceTasks(filterParams),
    alertStats: getFilteredAlertStats(filterParams),
  }
}

export default {
  getFilteredStatistics,
  getFilteredOccupancy,
  getFilteredSystemControlStats,
  getFilteredDevices,
  getFilteredDeviceCounts,
  getFilteredAlerts,
  getFilteredMaintenanceTasks,
  getFilteredAlertStats,
  getAllFilteredData,
}
