import { ActiveAlertType, MaintenanceTaskType, AlertStatusType } from '@/types'
import { BUILDING_DATA } from './buildingData'
import {
  FireIcon,
  WaterIcon,
  MaintenanceIcon,
  CogIcon,
  SecurityIcon,
} from '@/icons'

// Enhanced alert interfaces with location data
export interface LocationAlertType extends ActiveAlertType {
  floorId: string
  unitId?: string
}

export interface LocationMaintenanceTaskType extends MaintenanceTaskType {
  floorId: string
  unitId?: string
}

// Helper to create alert entry
const createAlert = (
  title: string,
  description: string,
  floorId: string,
  unitId: string | undefined,
  time: string,
  severity: AlertStatusType,
  responsibleBy: string,
  currentStatus: string,
  color: string,
  icon: any
): LocationAlertType => {
  const floor = BUILDING_DATA.find((f) => f.id === floorId)
  const unit = unitId && floor ? floor.units.find((u) => u.id === unitId) : null

  return {
    title,
    description,
    location: unit
      ? `${floor?.displayName} - ${unit.displayName}`
      : floor?.displayName || 'Unknown',
    time,
    severity,
    responsibleBy,
    currentStatus,
    color,
    icon,
    floorId,
    unitId,
  }
}

// Helper to create maintenance task entry
const createMaintenanceTask = (
  title: string,
  description: string,
  floorId: string,
  unitId: string | undefined,
  createdAt: string,
  assignedTo: string,
  timeEstimate: string,
  color: string,
  currentStatus: string,
  severity: AlertStatusType
): LocationMaintenanceTaskType => {
  return {
    title,
    description,
    createdAt,
    assignedTo,
    timeEstimate,
    color,
    currentStatus,
    severity,
    floorId,
    unitId,
  }
}

// Generate alerts for different floors and units
export const ALERTS_DATA: LocationAlertType[] = [
  // Critical alerts
  createAlert(
    'Fire Detection System Alert',
    'Smoke detected in server room - automatic suppression activated',
    'basement',
    undefined,
    '2 min ago',
    'critical',
    'Fire Safety Team',
    'active',
    '#EF4444',
    FireIcon
  ),

  createAlert(
    'Water Leak Detection',
    'Water leak detected in restroom area - automatic shutoff triggered',
    'floor_2',
    'floor_2_unit_3',
    '594 days ago',
    'high',
    'Maintenance Team',
    'acknowledged',
    '#F97316',
    WaterIcon
  ),

  createAlert(
    'HVAC System Malfunction',
    'Air conditioning unit failure - temperature rising above threshold',
    'floor_3',
    'floor_3_all',
    '200 days ago',
    'medium',
    'HVAC Technician',
    'in progress',
    '#F97316',
    MaintenanceIcon
  ),

  createAlert(
    'Elevator Scheduled Maintenance',
    'Monthly maintenance check due for elevator system',
    'all',
    undefined,
    '50 days ago',
    'low',
    'Elevator Maintenance Co.',
    'scheduled',
    '#3B82F6',
    CogIcon
  ),

  createAlert(
    'Unauthorized Access Attempt',
    'Multiple failed access attempts detected at main entrance',
    'floor_1',
    'floor_1_unit_1',
    '2 days ago',
    'medium',
    'Security Team',
    'investigating',
    '#F97316',
    SecurityIcon
  ),

  // Additional floor-specific alerts
  createAlert(
    'Emergency Lighting Failure',
    'Emergency lighting system not responding to test',
    'floor_5',
    'floor_5_unit_2',
    '1 hour ago',
    'high',
    'Electrical Team',
    'active',
    '#F97316',
    MaintenanceIcon
  ),

  createAlert(
    'Door Lock Malfunction',
    'Electronic door lock not responding to access cards',
    'floor_7',
    'floor_7_unit_4',
    '30 min ago',
    'medium',
    'Security Team',
    'active',
    '#F97316',
    SecurityIcon
  ),

  createAlert(
    'Temperature Sensor Alert',
    'Room temperature exceeding safe operating limits',
    'floor_4',
    'floor_4_unit_1',
    '15 min ago',
    'high',
    'HVAC Team',
    'active',
    '#F97316',
    MaintenanceIcon
  ),

  createAlert(
    'Network Connectivity Issue',
    'Intermittent network connectivity affecting building systems',
    'floor_6',
    'floor_6_all',
    '3 hours ago',
    'medium',
    'IT Support',
    'in progress',
    '#F97316',
    CogIcon
  ),

  createAlert(
    'Roof Access Door Ajar',
    'Roof access door has been left open - security concern',
    'roof',
    undefined,
    '45 min ago',
    'low',
    'Security Team',
    'acknowledged',
    '#3B82F6',
    SecurityIcon
  ),
]

// Generate maintenance tasks for different floors and units
export const MAINTENANCE_TASKS_DATA: LocationMaintenanceTaskType[] = [
  createMaintenanceTask(
    'Monthly HVAC Filter Replacement',
    'Replace air filters in all HVAC units',
    'floor_3',
    'floor_3_all',
    '2024-01-20',
    'Maintenance Team',
    '4 hours',
    '#9CA3AF',
    'pending',
    'medium'
  ),

  createMaintenanceTask(
    'Fire Safety System Test',
    'Quarterly test of fire detection and suppression systems',
    'basement',
    undefined,
    '2024-01-18',
    'Fire Safety Inspector',
    '2 hours',
    '#F87171',
    'overdue',
    'high'
  ),

  createMaintenanceTask(
    'Generator Load Test',
    'Monthly backup generator performance test',
    'basement',
    undefined,
    '2024-01-22',
    'Maintenance Team',
    '1 hour',
    '#60A5FA',
    'scheduled',
    'high'
  ),

  createMaintenanceTask(
    'Elevator Inspection',
    'Annual safety inspection of elevator systems',
    'all',
    undefined,
    '2024-01-15',
    'Elevator Inspector',
    '3 hours',
    '#F87171',
    'overdue',
    'critical'
  ),

  createMaintenanceTask(
    'Window Cleaning - East Wing',
    'Quarterly cleaning of exterior windows',
    'floor_8',
    'floor_8_all',
    '2024-01-25',
    'Cleaning Crew',
    '6 hours',
    '#9CA3AF',
    'scheduled',
    'low'
  ),

  createMaintenanceTask(
    'Security Camera Maintenance',
    'Check and clean all security cameras',
    'floor_1',
    'floor_1_all',
    '2024-01-19',
    'Security Technician',
    '2 hours',
    '#9CA3AF',
    'pending',
    'medium'
  ),

  createMaintenanceTask(
    'Lighting Fixture Replacement',
    'Replace burnt out LED fixtures in common areas',
    'floor_5',
    'floor_5_all',
    '2024-01-21',
    'Electrical Team',
    '3 hours',
    '#9CA3AF',
    'pending',
    'low'
  ),

  createMaintenanceTask(
    'Roof Drainage Inspection',
    'Inspect and clean roof drainage systems',
    'roof',
    undefined,
    '2024-01-17',
    'Maintenance Team',
    '4 hours',
    '#F87171',
    'overdue',
    'medium'
  ),
]

// Filter alerts based on floor/unit selection
export const getAlertsForFilter = (
  selectedFloorId: string | null,
  selectedUnitId: string | null,
  severityFilter?: string
): LocationAlertType[] => {
  let filteredAlerts = ALERTS_DATA

  // Filter by severity first if specified
  if (severityFilter && severityFilter !== 'All') {
    filteredAlerts = filteredAlerts.filter(
      (alert) => alert.severity.toLowerCase() === severityFilter.toLowerCase()
    )
  }

  // All floors - return all alerts
  if (selectedFloorId === 'all') {
    return filteredAlerts
  }

  // Specific floor
  if (selectedFloorId && selectedUnitId === 'all') {
    return filteredAlerts.filter(
      (alert) => alert.floorId === selectedFloorId || alert.floorId === 'all' // Include building-wide alerts
    )
  }

  // Specific unit
  if (selectedFloorId && selectedUnitId && selectedUnitId !== 'all') {
    return filteredAlerts.filter(
      (alert) =>
        (alert.floorId === selectedFloorId &&
          alert.unitId === selectedUnitId) ||
        (alert.floorId === selectedFloorId && alert.unitId?.includes('_all')) || // Include floor-level alerts
        alert.floorId === 'all' // Include building-wide alerts
    )
  }

  return filteredAlerts
}

// Filter maintenance tasks based on floor/unit selection
export const getMaintenanceTasksForFilter = (
  selectedFloorId: string | null,
  selectedUnitId: string | null
): LocationMaintenanceTaskType[] => {
  // All floors - return all tasks
  if (selectedFloorId === 'all') {
    return MAINTENANCE_TASKS_DATA
  }

  // Specific floor
  if (selectedFloorId && selectedUnitId === 'all') {
    return MAINTENANCE_TASKS_DATA.filter(
      (task) => task.floorId === selectedFloorId || task.floorId === 'all' // Include building-wide tasks
    )
  }

  // Specific unit
  if (selectedFloorId && selectedUnitId && selectedUnitId !== 'all') {
    return MAINTENANCE_TASKS_DATA.filter(
      (task) =>
        (task.floorId === selectedFloorId && task.unitId === selectedUnitId) ||
        (task.floorId === selectedFloorId && task.unitId?.includes('_all')) || // Include floor-level tasks
        task.floorId === 'all' // Include building-wide tasks
    )
  }

  return MAINTENANCE_TASKS_DATA
}

// Get alert statistics based on current filter
export const getAlertStatsForFilter = (
  selectedFloorId: string | null,
  selectedUnitId: string | null
) => {
  const filteredAlerts = getAlertsForFilter(selectedFloorId, selectedUnitId)
  const filteredTasks = getMaintenanceTasksForFilter(
    selectedFloorId,
    selectedUnitId
  )

  const activeAlerts = filteredAlerts.filter(
    (alert) => alert.currentStatus === 'active'
  ).length
  const criticalAlerts = filteredAlerts.filter(
    (alert) => alert.severity === 'critical'
  ).length
  const totalAlerts = filteredAlerts.length

  // Calculate average resolution time (mock calculation)
  const avgResolutionTime =
    filteredAlerts.length > 0 ? Math.floor(Math.random() * 3 + 2) : 0

  return [
    {
      title: 'Active Alerts',
      value: activeAlerts.toString(),
      percentageChange: -1.3,
      color: '#EF444433',
    },
    {
      title: 'Critical Alerts',
      value: `${criticalAlerts}/${totalAlerts}`,
      percentageChange: -3.4,
      color: '#EF444433',
    },
    {
      title: 'Avg Resolution Time',
      value: `${avgResolutionTime}.${Math.floor(Math.random() * 9)} Hours`,
      percentageChange: -2.0,
      color: '#FBBF2433',
    },
    {
      title: 'Maintenance Tasks',
      value: filteredTasks.length.toString(),
      percentageChange: 2.5,
      color: '#37988A33',
    },
  ]
}
